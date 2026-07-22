/* Plan de francés — 20 días. Una sola pantalla: el Plan.
   Ver CLAUDE.md y SPEC.md (paquete original) para el contrato de comportamiento. */
(function(){
'use strict';

/* =========================================================
   UTILIDADES BÁSICAS
   ========================================================= */
function $(sel, root){ return (root||document).querySelector(sel); }
function $all(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function toast(msg){
  const t = $('#toast'); if(!t) return;
  t.textContent = msg; t.classList.add('on');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('on'), 2200);
}
function todayIdx(){ return Math.floor(Date.now()/86400000); }
function todayISO(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function stripDiacritics(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,''); }
function normExact(s){ return String(s||'').toLowerCase().trim().replace(/[’‘]/g,"'").replace(/\s+/g,' '); }
function normNoAcc(s){ return stripDiacritics(normExact(s)); }
function normFR(s){ return stripDiacritics(String(s||'').toLowerCase()).replace(/[^a-z]/g,''); }

function levenshtein(a,b){
  const m=a.length, n=b.length;
  if(!m) return n; if(!n) return m;
  let prev = new Array(n+1);
  for(let j=0;j<=n;j++) prev[j]=j;
  for(let i=1;i<=m;i++){
    const cur=[i];
    for(let j=1;j<=n;j++){
      const cost = a[i-1]===b[j-1] ? 0 : 1;
      cur[j] = Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+cost);
    }
    prev = cur;
  }
  return prev[n];
}

// "¿se parecen de forma?" — para no juntar palabras parecidas en la misma tanda.
function isSimilarFR(fr1, fr2){
  const a = normFR(fr1), b = normFR(fr2);
  if(!a || !b) return false;
  if(a===b) return true;
  const L = Math.min(a.length, b.length, 5);
  if(L>=4 && a.slice(0,L)===b.slice(0,L)) return true;
  if((a.length>=4 || b.length>=4) && (a.startsWith(b) || b.startsWith(a))) return true;
  if(Math.max(a.length,b.length)<=3) return false;
  return levenshtein(a,b) <= 2;
}

/* =========================================================
   DATOS: índices sobre window.VOCAB / window.GRAMMAR
   ========================================================= */
const VOCAB = window.VOCAB || [];
const GRAMMAR = window.GRAMMAR || [];
const ORTO = window.ORTO || [];
const CAMINO = window.CAMINO || [];
const PRESENTACION = window.PRESENTACION || null;

const VOCAB_BY_ID = Object.fromEntries(VOCAB.map(v=>[v.id, v]));
const NIVEL_RANK = {GRATIS:0, PUENTE:1, DURA:2};

function idNum(id){ return parseInt(id.slice(1),10) || 0; }

function cardMeta(id){
  if(id[0]==='v'){
    const v = VOCAB_BY_ID[idNum(id)];
    if(!v) return null;
    const target = v.art ? (v.art.endsWith("'") ? v.art+v.fr : v.art+' '+v.fr) : v.fr;
    return { kind:'vocab', prompt:v.es, sub:v.en, target, fr:v.fr, ex:v.ex,
      suena:v.suena, puente:v.puente, truco:v.truco, ojo:v.ojo };
  } else {
    const g = GRAMMAR[idNum(id)];
    if(!g) return null;
    return { kind:'gram', prompt:g.en, sub:'Gramática', target:g.w, fr:g.w, ex:g.ex,
      suena:null, puente:null, truco:null, ojo:null };
  }
}
function targetFor(id){ const m=cardMeta(id); return m ? m.target : ''; }

/* =========================================================
   ESTADO + PERSISTENCIA
   ========================================================= */
const STORE_KEY = 'planFR20_v1';
let S = null;

function defaultState(){
  return {
    cards: {},
    planDay: 1,
    planDone: {},
    run: null,      // {day, step, wrong:[], result:{}, scoredIds:[], stepsDone:{}}
    session: null,  // {kind, ruleId, tandas:[[ids]], tanda:[ids], tandaTotal, tandaMastered:[], doneCount, totalCount, moreTandas:[[ids]], scoredIds:[]}
    pileHistory: [],
    examen: null,
    betOn: false, // desactivada por defecto: ir directo al resultado, sin el paso de "¿qué tan seguro estás?"
    stats: { errO:0, errL:0, betSW:0, betSR:0 },
    seeded: false
  };
}

function load(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed, {
      cards: parsed.cards || {},
      stats: Object.assign({errO:0,errL:0,betSW:0,betSR:0}, parsed.stats||{}),
      planDone: parsed.planDone || {}
    });
  }catch(e){ return defaultState(); }
}
function save(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(S)); }catch(e){} }

function seedIfNeeded(){
  if(S.seeded) return;
  VOCAB.forEach(v=>{
    const id = 'v'+v.id;
    const pile = v.triage==='S' ? 'S' : (v.triage==='P' ? 'G' : 'K'); // O y L -> DUDOSO
    S.cards[id] = { pile, streak:0, due:0, seen:0, ok:0, ko:0, koO:0, koL:0, hard:false, spellWeak:false, box:0 };
  });
  GRAMMAR.forEach((g,i)=>{
    const id = 'g'+i;
    S.cards[id] = { pile:'K', streak:0, due:0, seen:0, ok:0, ko:0, koO:0, koL:0, hard:false, spellWeak:false, box:0 };
  });
  S.seeded = true;
  save();
}

/* =========================================================
   VOZ (speechSynthesis, fr-FR)
   ========================================================= */
function pickVoice(){
  if(!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices() || [];
  return voices.find(v=>v.lang==='fr-FR') || voices.find(v=>v.lang && v.lang.startsWith('fr')) || null;
}
if('speechSynthesis' in window){
  try{ speechSynthesis.onvoiceschanged = function(){}; }catch(e){}
}
function speak(text){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR'; u.rate = 0.95;
    const v = pickVoice(); if(v) u.voice = v;
    speechSynthesis.speak(u);
  }catch(e){}
}

/* =========================================================
   CLASIFICACIÓN DE RESPUESTAS: [O] ortografía vs [L] lengua
   ========================================================= */
function classify(id, typedRaw){
  const target = targetFor(id);
  const a = normExact(typedRaw), b = normExact(target);
  if(a === b) return {verdict:'ok'};
  const a2 = stripDiacritics(a), b2 = stripDiacritics(b);
  if(a2 === b2) return {verdict:'O'};           // solo difieren en acentos
  if(levenshtein(a2,b2) <= 2) return {verdict:'O'}; // muy cerca: sabia la palabra, fallo de ortografia
  return {verdict:'L'};                          // no la sabia
}

// Compara letra a letra lo escrito contra la respuesta correcta, para poder
// señalar EXACTAMENTE en qué letras falló (no solo decir "incorrecto").
// Devuelve una lista de operaciones sobre TU texto: 'match' (letra bien),
// 'sub'/'del' (letra que escribiste mal o de más) e 'ins' (letra que falta
// y que no llegaste a escribir).
function diffChars(typedRaw, target){
  const a = String(typedRaw||''), b = String(target||'');
  const m = a.length, n = b.length;
  const dp = Array.from({length:m+1}, ()=>new Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      if(a[i-1].toLowerCase()===b[j-1].toLowerCase()) dp[i][j]=dp[i-1][j-1];
      else dp[i][j]=1+Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
    }
  }
  let i=m, j=n; const ops=[];
  while(i>0 || j>0){
    if(i>0 && j>0 && a[i-1].toLowerCase()===b[j-1].toLowerCase() && dp[i][j]===dp[i-1][j-1]){
      ops.unshift({type:'match', ch:a[i-1]}); i--; j--;
    } else if(i>0 && j>0 && dp[i][j]===dp[i-1][j-1]+1){
      ops.unshift({type:'sub', ch:a[i-1]}); i--; j--;
    } else if(i>0 && dp[i][j]===dp[i-1][j]+1){
      ops.unshift({type:'del', ch:a[i-1]}); i--;
    } else {
      ops.unshift({type:'ins', ch:b[j-1]}); j--;
    }
  }
  return ops;
}

/* =========================================================
   PILAS (SÓLIDO / DUDOSO / PERDIDO) + PROGRESO POR TARJETA
   ========================================================= */
function pileCounts(){
  let G=0,K=0,Sc=0;
  for(const id in S.cards){
    if(id[0]!=='v') continue;
    const p = S.cards[id].pile;
    if(p==='G') G++; else if(p==='K') K++; else Sc++;
  }
  return {G,K,S:Sc};
}
function updatePileHistorySnapshot(){
  const c = pileCounts(), d = todayISO();
  const arr = S.pileHistory;
  const last = arr[arr.length-1];
  if(last && last.d===d){ last.G=c.G; last.K=c.K; last.S=c.S; }
  else { arr.push({d,G:c.G,K:c.K,S:c.S}); if(arr.length>60) arr.shift(); }
}

// verdict: 'ok' | 'O' | 'L'. [O] NUNCA penaliza el vocabulario (regla Tier-0).
function applyAnswer(id, verdict){
  const c = S.cards[id]; if(!c) return;
  c.seen++;
  if(verdict==='L'){
    c.ko++; c.koL++; c.hard=true; c.spellWeak=false;
    S.stats.errL++;
    c.streak = 0;
    c.due = todayIdx(); // vuelve pronto
  } else {
    c.ok++;
    if(verdict==='O'){ c.ko++; c.koO++; c.spellWeak=true; S.stats.errO++; }
    else { c.spellWeak=false; }
    c.hard = false;
    c.streak++;
    const wasPile = c.pile;
    if(c.pile==='G' && c.streak>=3){ c.pile='K'; c.streak=0; }
    else if(c.pile==='K' && c.streak>=2){ c.pile='S'; }
    if(c.pile!==wasPile && c.pile==='S') toast('¡'+ (cardMeta(id)||{fr:''}).fr +' pasa a Sólido! Sale del tablero.');
    else if(c.pile!==wasPile && c.pile==='K') toast('Progreso: de Perdido a Dudoso.');
    if(c.pile==='G') c.due = todayIdx()+1;
    else if(c.pile==='K') c.due = todayIdx()+3;
    else c.due = todayIdx()+9999;
  }
  if(S.run){
    S.run.result[id] = verdict; // el ULTIMO intento de hoy manda (permite corregir en el repaso)
    const idx = S.run.wrong.indexOf(id);
    if(verdict==='L'){ if(idx===-1) S.run.wrong.push(id); }
    else if(idx!==-1) S.run.wrong.splice(idx,1);
  }
  updatePileHistorySnapshot();
}

/* =========================================================
   FORMACIÓN DE TANDAS: fácil→difícil + sin parecidas juntas
   ========================================================= */
function priorityRank(id){
  const c = S.cards[id]; if(!c) return 9;
  return c.pile==='G' ? 0 : (c.pile==='K' ? 1 : 2);
}
function difficultyRank(id){
  if(id[0]!=='v') return 1;
  const v = VOCAB_BY_ID[idNum(id)];
  return v ? (NIVEL_RANK[v.nivel] ?? 1) : 1;
}
function orderPool(ids){
  return ids.slice().sort((a,b)=>{
    const p = priorityRank(a)-priorityRank(b); if(p) return p;
    const d = difficultyRank(a)-difficultyRank(b); if(d) return d;
    return idNum(a)-idNum(b);
  });
}
function buildTandas(orderedIds){
  const remaining = orderedIds.slice();
  const tandas = [];
  while(remaining.length){
    const batch = [], deferred = [];
    for(const id of remaining){
      if(batch.length>=5){ deferred.push(id); continue; }
      const meta = cardMeta(id);
      const conflict = batch.some(bid=>isSimilarFR(cardMeta(bid).fr, meta.fr));
      if(conflict) deferred.push(id); else batch.push(id);
    }
    tandas.push(batch);
    remaining.length = 0;
    remaining.push(...deferred);
  }
  return tandas;
}

function dueVocabIds(){
  const t = todayIdx();
  return Object.keys(S.cards).filter(id=>id[0]==='v' && (S.cards[id].pile==='G'||S.cards[id].pile==='K') && S.cards[id].due<=t);
}
function vocabPoolForPhase(){
  const due = dueVocabIds();
  if(due.length>=5) return due;
  return Object.keys(S.cards).filter(id=>id[0]==='v' && S.cards[id].pile!=='S');
}
function ruleWords(ruleId){
  return VOCAB.filter(v=>v.triage==='O' && v.orto.includes(ruleId)).map(v=>'v'+v.id);
}
function allOWords(){
  return VOCAB.filter(v=>v.triage==='O').map(v=>'v'+v.id);
}
function grammarIds(){
  return GRAMMAR.map((g,i)=>'g'+i);
}

/* =========================================================
   SESIÓN DE ESTUDIO (tarjetas): vocab / ortografía / gramática
   ========================================================= */
let StudyUI = { phase:'prompt' }; // transitorio: prompt | bet | reveal | sessionEnd (no persiste literal)

function startSession(kind, ids, opts){
  opts = opts || {};
  const ordered = orderPool(ids);
  const allTandas = buildTandas(ordered);
  const cap = opts.cap || allTandas.length; // vocab/repaso limitan; orto/gram/repaso-final no
  const initial = allTandas.slice(0, cap);
  const rest = allTandas.slice(cap);
  S.session = {
    kind, ruleId: opts.ruleId || null,
    tandas: initial.slice(1),
    tanda: initial[0] || [],
    tandaTotal: (initial[0]||[]).length,
    tandaMastered: [],
    doneCount: 0,
    totalCount: initial.reduce((a,t)=>a+t.length,0),
    moreTandas: rest,
    scoredIds: []
  };
  StudyUI = {phase:'prompt'};
  save();
}
function pullNextTanda(){
  const sess = S.session; if(!sess) return;
  if(sess.tanda && sess.tanda.length) return;
  if(sess.tandas.length){
    sess.tanda = sess.tandas.shift();
    sess.tandaTotal = sess.tanda.length;
    sess.tandaMastered = [];
  } else {
    sess.tanda = [];
    sess.tandaTotal = 0;
  }
  save();
}
function extendWithMoreTanda(){
  const sess = S.session; if(!sess || !sess.moreTandas.length) return;
  const t = sess.moreTandas.shift();
  sess.totalCount += t.length;
  if(!sess.tanda.length){ sess.tanda = t; sess.tandaTotal = t.length; sess.tandaMastered=[]; }
  else sess.tandas.push(t);
  save();
}

function resolveAnswer(typedOrNull, betChoice, forcedNoSe){
  const sess = S.session; if(!sess || !sess.tanda.length) return;
  const id = sess.tanda[0];
  const firstAttempt = sess.scoredIds.indexOf(id) === -1;
  const verdict = forcedNoSe ? 'L' : classify(id, typedOrNull).verdict;
  if(firstAttempt){
    applyAnswer(id, verdict);
    sess.scoredIds.push(id);
    if(S.betOn && betChoice==='seguro'){
      if(verdict==='L') S.stats.betSW++; else S.stats.betSR++;
    }
  }
  const exact = verdict==='ok';
  sess.tanda.shift();
  if(exact){ sess.tandaMastered.push(id); sess.doneCount++; }
  else sess.tanda.push(id);
  StudyUI = {phase:'reveal', verdict, exact, id, betChoice: betChoice||null, target: targetFor(id), typed: forcedNoSe ? null : typedOrNull};
  save();
  render();
}

function handleComprobar(){
  const sess = S.session; if(!sess || !sess.tanda.length) return;
  const input = $('#answer-input');
  const typed = input ? input.value : '';
  if(!typed || !typed.trim()){ toast('Escribe tu respuesta, o pulsa "No lo sé".'); return; }
  const id = sess.tanda[0];
  const firstAttempt = sess.scoredIds.indexOf(id) === -1;
  if(S.betOn && firstAttempt){
    StudyUI = {phase:'bet', pendingTyped: typed};
    render();
  } else {
    resolveAnswer(typed, null, false);
  }
}
function handleNoSe(){
  resolveAnswer(null, null, true);
}
function handleBet(choice){
  resolveAnswer(StudyUI.pendingTyped, choice, false);
}
function handleSiguiente(){
  StudyUI = {phase:'prompt'};
  const sess = S.session;
  if(sess && !sess.tanda.length) pullNextTanda();
  save();
  render();
}
function handleOtraTanda(){
  extendWithMoreTanda();
  StudyUI = {phase:'prompt'};
  render();
}
function finishPhaseFromSession(){
  markStepDone();
  S.session = null;
  save();
  advanceAfterPhase();
}

/* =========================================================
   EL DÍA GUIADO (run): fases en orden + repaso final + candado 80%
   ========================================================= */
function RUN_ACTIVE(){ return !!S.run; }
function dayTasks(day){
  const d = CAMINO[day-1];
  return d ? d.tareas : [];
}
function totalSteps(day){ return dayTasks(day).length + 1; } // +1 = Repaso final
function isRepasoStep(day, step){ return step === dayTasks(day).length; }
function taskAt(day, step){ return isRepasoStep(day,step) ? null : dayTasks(day)[step]; }

function normLabel(t){ return stripDiacritics(String(t||'')).toLowerCase(); }
function phaseKind(tarea){
  const t = normLabel(tarea.t);
  if(t==='vocabulario' || t==='repaso') return 'vocab';
  if(t==='ortografia') return 'orto';
  if(t==='gramatica') return 'gram';
  return 'info';
}

function startDay(day, step){
  if(!S.run || S.run.day !== day){
    S.run = { day, step: step||0, wrong:[], result:{}, scoredIds:[], stepsDone:{} };
  } else {
    S.run.step = step||0;
  }
  S.session = null;
  save();
  enterCurrentStep();
}
function enterCurrentStep(){
  const day = S.run.day, step = S.run.step;
  if(isRepasoStep(day, step)){
    const ids = S.run.wrong.slice();
    if(ids.length===0){
      VIEW = {screen:'info', day, step};
    } else {
      startSession('vocab', ids, {});
      VIEW = {screen:'study'};
    }
    save(); render();
    return;
  }
  const tarea = taskAt(day, step);
  const kind = phaseKind(tarea);
  if(kind==='vocab'){
    startSession('vocab', vocabPoolForPhase(), {cap:2});
    VIEW = {screen:'study'};
  } else if(kind==='orto'){
    if(tarea.rule){
      startSession('orto', ruleWords(tarea.rule), {ruleId:tarea.rule});
      VIEW = {screen:'study'};
    } else {
      VIEW = {screen:'ortoMenu'};
    }
  } else if(kind==='gram'){
    startSession('gram', grammarIds(), {});
    VIEW = {screen:'study'};
  } else {
    VIEW = {screen:'info', day, step};
  }
  save(); render();
}
function markStepDone(){
  if(!S.run) return;
  S.run.stepsDone[S.run.step] = true;
  save();
}
function advanceAfterPhase(){
  if(!S.run) return;
  const day = S.run.day;
  const next = S.run.step + 1;
  if(next >= totalSteps(day)){
    VIEW = {screen:'dayend'};
  } else {
    S.run.step = next;
    enterCurrentStep();
    return;
  }
  save(); render();
}
function goToStep(step){
  if(!S.run) return;
  S.run.step = step;
  save();
  enterCurrentStep();
}

function dayStats(){
  if(!S.run) return {total:0, okCount:0, oCount:0, lCount:0, pct:0};
  const entries = Object.entries(S.run.result);
  const total = entries.length;
  const okCount = entries.filter(([,v])=>v==='ok'||v==='O').length;
  const oCount = entries.filter(([,v])=>v==='O').length;
  const lCount = entries.filter(([,v])=>v==='L').length;
  const pct = total ? Math.round(okCount/total*100) : 0;
  return {total, okCount, oCount, lCount, pct};
}
function canCloseDay(){ const s = dayStats(); return s.total>=3 && s.pct>=80; }

function closeDay(){
  if(!canCloseDay() || !S.run) return;
  const day = S.run.day;
  S.planDone[day] = true;
  if(day >= S.planDay) S.planDay = Math.min(21, day+1);
  S.run = null;
  S.session = null;
  updatePileHistorySnapshot();
  save();
  VIEW = {screen:'home'};
  render();
}
function repasarMas(){
  if(!S.run) return;
  const ids = S.run.wrong.slice();
  if(!ids.length){ toast('No te queda ningún fallo por repasar.'); return; }
  startSession('vocab', ids, {});
  VIEW = {screen:'study'};
  save(); render();
}

/* =========================================================
   NAVEGACIÓN / RENDER
   ========================================================= */
let VIEW = {screen:'home'};

function daysToExam(){
  if(!S.examen) return null;
  const target = new Date(S.examen+'T00:00:00');
  const now = new Date();
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - t0) / 86400000);
}

function renderHeader(){
  const host = $('#header');
  if(VIEW.screen === 'study'){ host.innerHTML=''; return; }
  const dte = daysToExam();
  const c = pileCounts();
  const hist = S.pileHistory.slice(-12);
  const maxG = Math.max(1, ...hist.map(h=>h.G));
  host.innerHTML = `
    <div class="countdown">
      ${dte==null
        ? `<span class="small">Sin fecha de examen — <a href="#" class="textlink" data-action="settings-open">ponla aquí</a></span>`
        : (dte>=0
            ? `<span class="num">${dte}</span><span class="small">día${dte===1?'':'s'} para el examen</span>`
            : `<span class="small">El examen ya pasó</span>`)
      }
      <button class="iconbtn" style="margin-left:auto" data-action="settings-open" aria-label="Ajustes">&#9881;</button>
    </div>
    <div class="board">
      <div class="tile gone"><span class="n">${c.G}</span><span class="lbl">Perdido</span></div>
      <div class="tile shaky"><span class="n">${c.K}</span><span class="lbl">Dudoso</span></div>
      <div class="tile solid"><span class="n">${c.S}</span><span class="lbl">Sólido</span></div>
    </div>
    ${hist.length>1 ? `<div class="histbar">${hist.map(h=>`<div class="bar ${h.G===0?'zero':''}" style="height:${Math.max(2, Math.round(h.G/maxG*40))}px" title="${h.d}: ${h.G} perdido"></div>`).join('')}</div>` : ''}
  `;
}

function render(){
  renderHeader();
  const main = $('#app');
  if(VIEW.screen==='home') renderHome(main);
  else if(VIEW.screen==='day') renderDayDetail(main);
  else if(VIEW.screen==='ortoMenu') renderOrtoMenu(main);
  else if(VIEW.screen==='study') renderStudy(main);
  else if(VIEW.screen==='dayend') renderDayEnd(main);
  else if(VIEW.screen==='info') renderInfo(main);
  else renderHome(main);
}

function renderHome(main){
  const currentDay = Math.min(20, S.planDay);
  const d = CAMINO[currentDay-1];
  const resuming = !!S.run;
  main.innerHTML = `
    ${resuming ? `
      <div class="card">
        <h2>Sigues a mitad</h2>
        <p class="small">Día ${S.run.day}: ${esc(CAMINO[S.run.day-1] ? CAMINO[S.run.day-1].titulo : '')}</p>
        <button class="btn btn-primary" data-action="continue">Continuar donde lo dejé</button>
      </div>
    ` : `
      <div class="card">
        <h2>Día ${currentDay} de 20</h2>
        <h3 class="muted">${esc(d ? d.titulo : '')}</h3>
        <p>${esc(d ? d.foco : '')}</p>
        <button class="btn btn-primary" data-action="start-current">Empezar el día</button>
      </div>
    `}
    <div class="section-t">Los 20 días</div>
    ${CAMINO.map(d=>renderDayRow(d)).join('')}
  `;
}

function renderDayRow(d){
  const done = !!S.planDone[d.dia];
  const isCurrent = d.dia === S.planDay && !done;
  return `
    <div class="day-row ${done?'done':''} ${isCurrent?'current':''}" data-action="open-day" data-day="${d.dia}">
      <div class="num">${done?'&#10003;':d.dia}</div>
      <div class="info">
        <div class="t">${esc(d.titulo)}</div>
        <div class="f">${esc(d.foco)}</div>
      </div>
      <div class="tag">${done?'Hecho':(isCurrent?'Actual':'')}</div>
    </div>
  `;
}

function renderDayDetail(main){
  const day = VIEW.day || (S.run ? S.run.day : S.planDay);
  const d = CAMINO[day-1];
  if(!d){ VIEW={screen:'home'}; return render(); }
  const tareas = d.tareas;
  const activeRun = S.run && S.run.day===day ? S.run : null;
  const stats = activeRun ? dayStats() : null;
  const rows = tareas.map((t,i)=>{
    const done = activeRun && activeRun.stepsDone[i];
    const isCur = activeRun && activeRun.step===i;
    return `
      <div class="fase ${done?'done':''}" data-action="go-step" data-step="${i}">
        <div class="fi">${done?'&#10003;':(i+1)}</div>
        <div style="flex:1">
          <div class="ft">${esc(t.t)}${isCur?' — en curso':''}</div>
          <div class="fx">${esc(t.txt)}</div>
        </div>
      </div>
    `;
  }).join('');
  const repasoDone = activeRun && activeRun.stepsDone[tareas.length];
  const repasoRow = `
    <div class="fase ${repasoDone?'done':''}" data-action="go-step" data-step="${tareas.length}">
      <div class="fi">${repasoDone?'&#10003;':'R'}</div>
      <div style="flex:1">
        <div class="ft">Repaso de hoy</div>
        <div class="fx">Repasa lo que hayas fallado en las fases de hoy.</div>
      </div>
    </div>
  `;
  main.innerHTML = `
    <button class="btn btn-outline btn-sm" data-action="back-home" style="margin-bottom:.9rem">&larr; El plan</button>
    <div class="card">
      <h1>Día ${d.dia}. ${esc(d.titulo)}</h1>
      <p class="small">${esc(d.foco)}</p>
      <p class="small"><b>${esc(d.meta||'')}</b></p>
    </div>
    <div class="day-detail">
      ${rows}
      ${repasoRow}
    </div>
    ${stats && stats.total>0 ? `
      <div class="card">
        <div class="small">Hoy: <b>${stats.pct}%</b> de acierto (${stats.okCount}/${stats.total})</div>
        <div class="small">[O] ortografía: ${stats.oCount} &middot; [L] lengua: ${stats.lCount}</div>
        ${canCloseDay()
          ? `<button class="btn btn-primary" data-action="go-dayend" style="margin-top:.7rem">Terminar el día</button>`
          : `<p class="small" style="margin-top:.5rem">Necesitas 80% y al menos 3 palabras estudiadas para cerrar el día.</p>`}
      </div>
    ` : ''}
    ${!activeRun ? `<button class="btn btn-outline" data-action="start-day-here" data-day="${day}" style="margin-top:.6rem">${S.planDone[day]?'Rehacer este día':'Empezar este día'}</button>` : ''}
  `;
}

// Fases sin ejercicio en la app (Oral, Conversación, Simulacro, Descanso) y el caso
// especial "Repaso final sin fallos hoy": solo instrucción + "Fase hecha, siguiente".
function renderInfo(main){
  const day = VIEW.day, step = VIEW.step;
  const isRepaso = isRepasoStep(day, step);
  const tarea = isRepaso ? null : taskAt(day, step);
  const titulo = isRepaso ? 'Repaso de hoy' : tarea.t;
  const txt = isRepaso ? 'No has fallado nada hoy todavía. Buen trabajo — no hay nada que repasar.' : tarea.txt;
  const showMaterial = !isRepaso && tarea.to === 'mas' && PRESENTACION;
  main.innerHTML = `
    <button class="btn btn-outline btn-sm" data-action="back-day" style="margin-bottom:.9rem">&larr; Volver al día</button>
    <div class="card">
      <h1>${esc(titulo)}</h1>
      <p>${esc(txt)}</p>
      ${showMaterial ? `
        <div class="section-t">Material de apoyo (para practicar en voz alta, fuera de la app)</div>
        ${PRESENTACION.moldes.map(m=>`<p class="small"><b>${m.n}.</b> ${esc(m.fr)} <span class="muted">— ${esc(m.es)}</span></p>`).join('')}
        ${PRESENTACION.bloques.map(bl=>`
          <h3 style="margin-top:1rem">${esc(bl.titulo)} <span class="small muted">(${bl.min} min)</span></h3>
          ${bl.frases.map(f=>`<p class="small">${esc(f.fr)}<br><span class="muted">${esc(f.es)}</span></p>`).join('')}
        `).join('')}
      ` : ''}
      <button class="btn btn-primary" data-action="fase-hecha" style="margin-top:1rem">Fase hecha, siguiente</button>
    </div>
  `;
}

function renderOrtoMenu(main){
  const rows = ORTO.map(r=>{
    const n = ruleWords(r.id).length;
    return `
      <div class="rule-row">
        <div class="rt">Regla ${r.id}. ${esc(r.titulo)}</div>
        <div class="re">${esc(r.regla)}</div>
        <button class="btn btn-ghost btn-sm" data-action="orto-rule" data-rule="${r.id}" ${n===0?'disabled':''}>Practicar (${n} palabras tuyas)</button>
      </div>
    `;
  }).join('');
  const totalO = allOWords().length;
  main.innerHTML = `
    <button class="btn btn-outline btn-sm" data-action="back-day" style="margin-bottom:.9rem">&larr; Volver al día</button>
    <div class="card">
      <h1>Ortografía por reglas</h1>
      <p class="small">Tu ortografía falla por patrones, no al azar. Domina la regla y caen muchas palabras juntas.</p>
      <button class="btn btn-ghost" data-action="orto-all" ${totalO===0?'disabled':''}>Practicar todas mezcladas (${totalO})</button>
    </div>
    ${rows}
  `;
}

function renderStudy(main){
  const sess = S.session;
  if(!sess){ VIEW={screen:'home'}; return render(); }
  // La pantalla de "reveal" del ÚLTIMO ítem de la tanda debe verse aunque el
  // array de la tanda ya haya quedado vacío (se usa el id guardado en StudyUI).
  const inReveal = StudyUI.phase === 'reveal';
  if(!inReveal && (!sess.tanda || !sess.tanda.length)){
    return renderSessionEnd(main, sess);
  }
  const id = inReveal ? StudyUI.id : sess.tanda[0];
  const meta = cardMeta(id);
  const dotsTotal = sess.tandaTotal || sess.tanda.length;
  const dotsDone = sess.tandaMastered.length;
  const dots = Array.from({length:dotsTotal}, (_,i)=>{
    if(i < dotsDone) return '<i class="done"></i>';
    if(i === dotsDone) return '<i class="cur"></i>';
    return '<i></i>';
  }).join('');
  const titleFor = {vocab:'Vocabulario', orto:'Ortografía', gram:'Gramática'}[sess.kind] || 'Estudiar';
  let ruleNote = '';
  if(sess.kind==='orto' && sess.ruleId){
    const r = ORTO.find(x=>x.id===sess.ruleId);
    if(r) ruleNote = `<p class="small"><b>Regla ${r.id}:</b> ${esc(r.regla)}</p>`;
  }

  let body = '';
  if(StudyUI.phase==='prompt'){
    body = `
      <div class="prompt-es">${esc(meta.prompt)}</div>
      ${meta.sub ? `<div class="prompt-en">${esc(meta.sub)}</div>` : ''}
      <input type="text" id="answer-input" class="answer" autocomplete="off" autocapitalize="off"
        autocorrect="off" spellcheck="false" placeholder="Escribe en francés..." />
      <div class="btn-row" style="margin-top:.9rem">
        <button class="btn btn-primary" data-action="comprobar">Comprobar</button>
      </div>
      <button class="btn btn-outline btn-sm" data-action="no-se" style="margin-top:.6rem">No lo sé</button>
    `;
  } else if(StudyUI.phase==='bet'){
    body = `
      <div class="prompt-es">${esc(meta.prompt)}</div>
      ${meta.sub ? `<div class="prompt-en">${esc(meta.sub)}</div>` : ''}
      <p class="small">Tu respuesta: <b>${esc(StudyUI.pendingTyped)}</b></p>
      <p style="font-weight:700;margin:1rem 0 .6rem">¿Qué tan seguro estás?</p>
      <div class="bet-row">
        <button class="btn btn-outline" data-action="bet" data-bet="seguro">Seguro</button>
        <button class="btn btn-outline" data-action="bet" data-bet="creo">Creo que sí</button>
        <button class="btn btn-outline" data-action="bet" data-bet="niidea">Ni idea</button>
      </div>
    `;
  } else if(StudyUI.phase==='reveal'){
    const v = StudyUI.verdict;
    const verdictLabel = v==='ok' ? '&#10003; Correcto' : (v==='O' ? '[O] Correcto, cuidado con la ortografía' : '[L] No te salió');
    const verdictClass = v==='ok' ? 'ok' : (v==='O' ? 'tagO' : 'tagL');
    const showBetWarn = StudyUI.betChoice==='seguro' && v==='L';
    let answerHtml = '';
    if(StudyUI.typed){
      const ops = diffChars(StudyUI.typed, meta.target);
      const spans = ops.map(o=>{
        if(o.type==='ins') return `<span class="diff-missing">_</span>`;
        if(o.type==='match') return `<span class="diff-ok">${esc(o.ch)}</span>`;
        return `<span class="diff-bad">${esc(o.ch)}</span>`;
      }).join('');
      answerHtml = `<div class="row"><b>Tu respuesta</b> <span class="diff-line">${spans}</span></div>`;
    }
    body = `
      <div class="prompt-es">${esc(meta.prompt)}</div>
      ${meta.sub ? `<div class="prompt-en">${esc(meta.sub)}</div>` : ''}
      <div class="reveal">
        <div class="verdict ${verdictClass}">${verdictLabel}</div>
        ${answerHtml}
        ${showBetWarn ? `<div class="row" style="color:var(--red);font-weight:700">Creías saberlo — esto es lo que te haría fallar.</div>` : ''}
        <div class="target">${esc(meta.target)} <button class="audio-btn" data-action="audio" data-text="${esc(meta.target)}">&#128266;</button></div>
        ${meta.suena ? `<div class="row"><b>Suena</b> ${esc(meta.suena)}</div>` : ''}
        ${meta.puente ? `<div class="row"><b>Puente</b> ${esc(meta.puente)}</div>` : ''}
        ${meta.truco ? `<div class="row"><b>Truco</b> ${esc(meta.truco)}</div>` : ''}
        ${meta.ojo ? `<div class="row"><b>Ojo</b> ${esc(meta.ojo)}</div>` : ''}
        ${meta.ex ? `<div class="row"><b>Ejemplo</b> ${esc(meta.ex)}</div>` : ''}
      </div>
      <button class="btn btn-primary" data-action="siguiente" style="margin-top:1rem">Siguiente &rarr;</button>
    `;
  }

  main.innerHTML = `
    <div class="study-top">
      <button class="iconbtn" data-action="back-day" aria-label="Salir">&times;</button>
      <div class="prog">${titleFor} &middot; ${sess.doneCount}/${sess.totalCount}</div>
      <div class="tanda-dots">${dots}</div>
    </div>
    ${ruleNote}
    <div class="card">${body}</div>
  `;
  const input = $('#answer-input');
  if(input){
    input.focus();
    input.addEventListener('keydown', e=>{
      if(e.key==='Enter'){ e.preventDefault(); handleComprobar(); }
    });
  }
}

function renderSessionEnd(main, sess){
  const canMore = sess.moreTandas && sess.moreTandas.length>0;
  main.innerHTML = `
    <div class="study-top">
      <button class="iconbtn" data-action="back-day" aria-label="Salir">&times;</button>
      <div class="prog">${sess.doneCount}/${sess.totalCount}</div>
      <div></div>
    </div>
    <div class="card">
      <h2>Tanda completada</h2>
      <p>${sess.doneCount} palabras trabajadas.</p>
      <div class="btn-row">
        ${canMore ? `<button class="btn btn-ghost" data-action="otra-tanda">Otra tanda</button>` : ''}
        <button class="btn btn-primary" data-action="fase-hecha">Fase hecha, siguiente</button>
      </div>
    </div>
  `;
}

function renderDayEnd(main){
  const stats = dayStats();
  const ok = canCloseDay();
  main.innerHTML = `
    <div class="card result-big">
      <div class="pct ${ok?'ok':'low'}">${stats.pct}%</div>
      <p class="small">${stats.okCount} de ${stats.total} bien hoy</p>
      <div class="split-row">
        <div class="item O"><span class="n">${stats.oCount}</span><span class="small">[O] ortografía</span></div>
        <div class="item L"><span class="n">${stats.lCount}</span><span class="small">[L] lengua</span></div>
      </div>
      ${ok
        ? `<button class="btn btn-primary" data-action="terminar-dia">Terminar el día</button>`
        : `<p class="small">Necesitas 80% y al menos 3 palabras para cerrar el día.</p>
           <button class="btn btn-primary" data-action="repasar-mas">Repasar los fallos</button>`
      }
    </div>
  `;
}

/* =========================================================
   AJUSTES (examen, apuesta, exportar/importar)
   ========================================================= */
function openSettings(){
  const ov = $('#overlay');
  $('#sheet').innerHTML = `
    <div class="sheet-handle"></div>
    <h2>Ajustes</h2>
    <div class="field">
      <label>Fecha del examen</label>
      <input type="date" id="set-examen" value="${S.examen||''}">
    </div>
    <div class="switch-row">
      <div>
        <div style="font-weight:700">Apuesta de confianza</div>
        <div class="small">Antes de ver si acertaste, di si estabas seguro. Ayuda, pero añade un paso.</div>
      </div>
      <label class="switch">
        <input type="checkbox" id="set-bet" ${S.betOn?'checked':''}>
        <span class="track"></span><span class="knob"></span>
      </label>
    </div>
    <div class="section-t">Progreso</div>
    <p class="small">[O] ortografía: ${S.stats.errO} &middot; [L] lengua: ${S.stats.errL}</p>
    <p class="small">Apuestas "seguro" que fallaron: ${S.stats.betSW} &middot; que acertaron: ${S.stats.betSR}</p>
    <div class="section-t">Exportar / importar progreso</div>
    <p class="small">Copia este texto para guardarlo, o pégalo aquí para restaurarlo.</p>
    <textarea class="progreso-io" id="export-box" readonly></textarea>
    <div class="btn-row" style="margin-top:.5rem">
      <button class="btn btn-outline btn-sm" data-action="copy-export">Copiar</button>
      <button class="btn btn-outline btn-sm" data-action="download-export">Descargar</button>
    </div>
    <div class="field" style="margin-top:.9rem">
      <label>Importar progreso</label>
      <textarea class="progreso-io" id="import-box" placeholder="Pega aquí el progreso exportado..."></textarea>
    </div>
    <button class="btn btn-primary" data-action="do-import">Importar</button>
    <button class="btn btn-outline" data-action="settings-close" style="margin-top:.9rem">Cerrar</button>
  `;
  $('#export-box').value = JSON.stringify(S);
  ov.classList.add('on');
}
function closeSettings(){ $('#overlay').classList.remove('on'); }

/* =========================================================
   DELEGACIÓN DE EVENTOS
   ========================================================= */
function onBodyClick(e){
  if(e.target.id === 'overlay'){ closeSettings(); return; }
  const el = e.target.closest('[data-action]');
  if(!el) return;
  const action = el.dataset.action;
  switch(action){
    case 'start-current':
      startDay(Math.min(20, S.planDay), 0);
      break;
    case 'continue':
      VIEW = S.session ? {screen:'study'} : {screen:'day', day:S.run.day};
      render();
      break;
    case 'open-day':
      VIEW = {screen:'day', day: +el.dataset.day};
      render();
      break;
    case 'start-day-here':
      startDay(+el.dataset.day, 0);
      break;
    case 'back-home':
      VIEW = {screen:'home'};
      render();
      break;
    case 'back-day':
      if(S.session){ S.session = null; save(); }
      VIEW = {screen:'day', day: S.run ? S.run.day : (VIEW.day||S.planDay)};
      render();
      break;
    case 'go-step':
      if(!S.run || S.run.day !== (VIEW.day||S.planDay)){
        startDay(VIEW.day||S.planDay, +el.dataset.step);
      } else {
        goToStep(+el.dataset.step);
      }
      break;
    case 'go-dayend':
      VIEW = {screen:'dayend'};
      render();
      break;
    case 'orto-rule':
      startSession('orto', ruleWords(+el.dataset.rule), {ruleId:+el.dataset.rule});
      VIEW = {screen:'study'};
      render();
      break;
    case 'orto-all':
      startSession('orto', allOWords(), {});
      VIEW = {screen:'study'};
      render();
      break;
    case 'comprobar': handleComprobar(); break;
    case 'no-se': handleNoSe(); break;
    case 'bet': handleBet(el.dataset.bet); break;
    case 'siguiente': handleSiguiente(); break;
    case 'otra-tanda': handleOtraTanda(); break;
    case 'fase-hecha': finishPhaseFromSession(); break;
    case 'terminar-dia': closeDay(); break;
    case 'repasar-mas': repasarMas(); break;
    case 'audio': speak(el.dataset.text); break;
    case 'settings-open': openSettings(); break;
    case 'settings-close': closeSettings(); break;
    case 'copy-export': {
      const box = $('#export-box');
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(box.value).then(()=>toast('Copiado')).catch(()=>toast('No se pudo copiar'));
      } else { box.select(); document.execCommand('copy'); toast('Copiado'); }
      break;
    }
    case 'download-export': {
      const blob = new Blob([JSON.stringify(S)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'progreso-frances.json'; a.click();
      setTimeout(()=>URL.revokeObjectURL(url), 2000);
      break;
    }
    case 'do-import': {
      const text = $('#import-box').value;
      try{
        const obj = JSON.parse(text);
        if(!obj || typeof obj!=='object') throw new Error('mal formato');
        S = Object.assign(defaultState(), obj, {stats: Object.assign({errO:0,errL:0,betSW:0,betSR:0}, obj.stats||{})});
        save();
        closeSettings();
        VIEW = {screen:'home'};
        render();
        toast('Progreso importado');
      }catch(err){ toast('No se pudo leer ese progreso.'); }
      break;
    }
  }
}
function onBodyChange(e){
  if(e.target.id==='set-examen'){ S.examen = e.target.value || null; save(); }
  if(e.target.id==='set-bet'){ S.betOn = !!e.target.checked; save(); }
}

/* =========================================================
   ARRANQUE
   ========================================================= */
function boot(){
  S = load();
  seedIfNeeded();
  updatePileHistorySnapshot();
  save();
  // Siempre arranca en el Plan (Home); si hay un día en curso, Home ofrece
  // "Continuar donde lo dejé" en vez de saltar directo a la tarjeta.
  VIEW = {screen:'home'};
  document.body.addEventListener('click', onBodyClick);
  document.body.addEventListener('change', onBodyChange);
  render();
  if('serviceWorker' in navigator){
    let swRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', ()=>{
      if(swRefreshing) return; swRefreshing = true; location.reload();
    });
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').then(reg=>{
        reg.update().catch(()=>{});
        document.addEventListener('visibilitychange', ()=>{
          if(document.visibilityState==='visible') reg.update().catch(()=>{});
        });
      }).catch(()=>{});
    });
  }
}

document.addEventListener('DOMContentLoaded', boot);
})();
