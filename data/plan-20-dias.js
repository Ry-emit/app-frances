// data/camino.js -- window.CAMINO
// Camino de 20 dias hacia el examen de agosto, calibrado al triaje del 21 jul.
// Principios: es recuperacion (solo L+P y las 7 reglas de las O); el ORAL (60%)
// se ensaya desde el dia 1; ortografia repartida; gramatica de modulo; conversacion;
// simulacros; y los ultimos 2 dias SOLO repaso. Sesion diaria ~30 min (de noche).
// Cada tarea: {t: etiqueta, txt: que hacer, to: pantalla ("estudiar"/"ortografia"/"mas"/null), rule?: nº regla}

window.CAMINO = [
  { dia: 1, titulo: "Arranque", foco: "Empieza por lo perdido y enciende el oido.",
    tareas: [
      { t: "Vocabulario", txt: "Estudia tus primeras tarjetas: salen las PERDIDAS primero. Dilas en voz alta.", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 1: el sonido sion se escribe -tion. Practicala.", to: "ortografia", rule: 1 },
      { t: "Oral", txt: "Aprende los moldes 1, 2 y 3 (presentarte y anunciar el plan).", to: "mas" }
    ], meta: "Meta: 10 palabras dichas en voz alta + saber presentarte." },

  { dia: 2, titulo: "Verbos perdidos", foco: "Prioridad 1: los verbos que mas se reusan.",
    tareas: [
      { t: "Vocabulario", txt: "Verbos perdidos: gerer, acheter, mettre en oeuvre, recruter. Producelos.", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 6: el acento e. Es la letra que mas olvidas.", to: "ortografia", rule: 6 },
      { t: "Oral", txt: "Moldes 4 y 5: tus ambiciones (mon reve, mon objectif).", to: "mas" }
    ], meta: "Meta: los 4 verbos clave salen sin pensar." },

  { dia: 3, titulo: "Expresiones perdidas", foco: "Las frases-Lego que dan mucho al hablar.",
    tareas: [
      { t: "Vocabulario", txt: "Sigue con las perdidas (expresiones). Se montan con piezas que ya tienes.", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 7: el infinitivo se escribe -er, aunque suene e.", to: "ortografia", rule: 7 },
      { t: "Oral", txt: "Dile a Claude tu IDOLO y tus AMBICIONES reales para montar tu guion.", to: null }
    ], meta: "Meta: pedir tu guion; primer bloque oral empezado." },

  { dia: 4, titulo: "Sustantivos perdidos (1)", foco: "Prioridad 2: los que caen seguro.",
    tareas: [
      { t: "Vocabulario", txt: "Sustantivos perdidos: l'achat, le rapport, la reussite, l'echec, le logiciel...", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 5: las letras finales -t -d -s -x se escriben pero no suenan.", to: "ortografia", rule: 5 },
      { t: "Oral", txt: "Ensaya el bloque Mes ambitions (3 min). Di lo que puedas de memoria.", to: "mas" }
    ], meta: "Meta: bloque de ambiciones dicho aunque con tropiezos." },

  { dia: 5, titulo: "Sustantivos perdidos (2)", foco: "Cerrar el resto de perdidos frecuentes.",
    tareas: [
      { t: "Vocabulario", txt: "Mas perdidos: le codt, le bilan, le tarif, le partenariat, la douane...", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 3: -mento se hace -ment (la t no suena, masculino).", to: "ortografia", rule: 3 },
      { t: "Oral", txt: "Moldes 6, 7 y 8: empezar a hablar de tu idolo (biografia).", to: "mas" }
    ], meta: "Meta: perdidos de Prioridad 2 en marcha." },

  { dia: 6, titulo: "Repaso + verbos dudosos", foco: "Consolidar la semana 1 y abrir Prioridad 3.",
    tareas: [
      { t: "Repaso", txt: "Estudia: hoy tocan repasos de lo de esta semana (Leitner los saca solos).", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 4: el frances DOBLA consonantes (ss, pp, ll, nn, rr, mm).", to: "ortografia", rule: 4 },
      { t: "Oral", txt: "Bloque Mon modele, frases 1-4 (quien es, biografia).", to: "mas" }
    ], meta: "Meta: bloque de ambiciones MEMORIZADO." },

  { dia: 7, titulo: "Expresiones dudosas", foco: "Prioridad 3: Lego barato.",
    tareas: [
      { t: "Vocabulario", txt: "Expresiones [L]: atteindre les objectifs, faire des affaires, faire face...", to: "estudiar" },
      { t: "Ortografia", txt: "Regla 2: -dad espanol se hace -te frances (femenino, con acento).", to: "ortografia", rule: 2 },
      { t: "Oral", txt: "Bloque Mon modele, frases 5-8 (sus logros).", to: "mas" }
    ], meta: "Meta: has visto las 7 reglas al menos una vez." },

  { dia: 8, titulo: "Sustantivos dudosos", foco: "Prioridad 4: muchos con puente.",
    tareas: [
      { t: "Vocabulario", txt: "Sustantivos [L]: l'investissement, le prit, l'impit, l'assurance...", to: "estudiar" },
      { t: "Ortografia", txt: "Drill mixto de TUS palabras: escribe las que fallas.", to: "ortografia" },
      { t: "Oral", txt: "Bloque Mon modele, frases 9-11 (por que lo admiras + conexion contigo).", to: "mas" }
    ], meta: "Meta: bloque del idolo esbozado entero." },

  { dia: 9, titulo: "Gramatica: comparar", foco: "Comparatif y superlatif (entra en el escrito).",
    tareas: [
      { t: "Gramatica", txt: "Comparatif/superlatif: plus... que, le plus..., meilleur (no plus bon). Tests de sustitucion.", to: null },
      { t: "Vocabulario", txt: "Repaso de lo dudoso (Estudiar).", to: "estudiar" },
      { t: "Oral", txt: "Bloque Conclusion (1 min): recap + mensaje personal.", to: "mas" }
    ], meta: "Meta: presentacion entera esbozada de principio a fin." },

  { dia: 10, titulo: "Gramatica: pronombres", foco: "COD/COI (le/la/les vs lui/leur).",
    tareas: [
      { t: "Gramatica", txt: "COD/COI: sustituye el complemento por su pronombre. je le donne / je lui donne.", to: null },
      { t: "Vocabulario", txt: "Repaso (Estudiar).", to: "estudiar" },
      { t: "Oral", txt: "Di la presentacion ENTERA seguida, sin cronometrar. Con los moldes.", to: "mas" }
    ], meta: "Mitad del camino: presentacion de cabo a rabo." },

  { dia: 11, titulo: "Ortografia intensiva", foco: "Atacar las 93 [O] por reglas (el 40% escrito).",
    tareas: [
      { t: "Ortografia", txt: "Drill largo de tus palabras [O]. Tapa, escribe, corrige.", to: "ortografia" },
      { t: "Vocabulario", txt: "Repaso corto (Estudiar).", to: "estudiar" },
      { t: "Oral", txt: "Pule los bloques 1 y 2 (ambiciones + idolo).", to: "mas" }
    ], meta: "Meta: bajar los fallos [O] en Progreso." },

  { dia: 12, titulo: "Conversacion: entrevista", foco: "Parte B (10 pts): entretien d'embauche.",
    tareas: [
      { t: "Conversacion", txt: "Frases comodin + preguntas tipicas (parlez-moi de vous, vos qualites, pourquoi ce poste).", to: null },
      { t: "Vocabulario", txt: "Repaso (Estudiar).", to: "estudiar" },
      { t: "Oral", txt: "Presentacion entera (moldes).", to: "mas" }
    ], meta: "Meta: 5 frases comodin memorizadas." },

  { dia: 13, titulo: "Conversacion: reserva", foco: "Parte B: reservation par telephone.",
    tareas: [
      { t: "Conversacion", txt: "Reservar por telefono: je voudrais reserver, pour quelle date, c'est a quel nom.", to: null },
      { t: "Ortografia", txt: "Repaso de las 2 reglas mas flojas.", to: "ortografia" },
      { t: "Oral", txt: "Presentacion CRONOMETRADA: no pasar de 10 min.", to: "mas" }
    ], meta: "Meta: presentacion bajo 10 min." },

  { dia: 14, titulo: "Simulacro escrito", foco: "Ensayar la parte escrita (40%).",
    tareas: [
      { t: "Simulacro", txt: "Escribe de memoria un bloque de vocabulario + una frase con comparatif y una con COD/COI.", to: null },
      { t: "Ortografia", txt: "Corrige con el pase de gramatica muda (plurales, -es/-ent, e/er/ez).", to: "ortografia" },
      { t: "Oral", txt: "Presentacion + una pregunta al publico al final.", to: "mas" }
    ], meta: "Meta: ver que reglas siguen fallando." },

  { dia: 15, titulo: "Repaso de fallos", foco: "Atacar SOLO lo que fallas.",
    tareas: [
      { t: "Repaso", txt: "Estudiar: lo dudoso que quede. Y mira tu registro de errores.", to: "estudiar" },
      { t: "Ortografia", txt: "Las reglas donde mas fallas.", to: "ortografia" },
      { t: "Oral", txt: "Presentacion entera + preguntas.", to: "mas" }
    ], meta: "Meta: montones de Progreso mas verdes." },

  { dia: 16, titulo: "Pronunciacion + oral", foco: "Nasales, R y U francesa; pulir el oral.",
    tareas: [
      { t: "Oral", txt: "Repite en voz alta las palabras con nasales, R y U. Grabate y escuchate.", to: "estudiar" },
      { t: "Ortografia", txt: "Repaso rapido de reglas.", to: "ortografia" },
      { t: "Oral", txt: "Presentacion cronometrada, cuidando la pronunciacion.", to: "mas" }
    ], meta: "Meta: sonar mas claro en las palabras clave." },

  { dia: 17, titulo: "Simulacro oral", foco: "Ensayo general del 60%.",
    tareas: [
      { t: "Simulacro", txt: "Presentacion entera SIN notas + conversacion espontanea (entrevista y reserva).", to: "mas" },
      { t: "Vocabulario", txt: "Repaso ligero (Estudiar).", to: "estudiar" }
    ], meta: "Meta: presentacion sin notas de principio a fin." },

  { dia: 18, titulo: "Repaso masivo", foco: "Consolidar todo lo dudoso.",
    tareas: [
      { t: "Repaso", txt: "Estudiar + Ortografia: todo lo que aun no esta solido.", to: "estudiar" },
      { t: "Oral", txt: "Presentacion cronometrada una vez.", to: "mas" }
    ], meta: "Meta: presentacion SOLIDA sin notas." },

  { dia: 19, titulo: "Solo repaso", foco: "Nada nuevo. Aflojar.",
    tareas: [
      { t: "Repaso", txt: "Repaso ligero de lo que ya sabes. No metas material nuevo.", to: "estudiar" },
      { t: "Oral", txt: "Di la presentacion una vez, tranquilo.", to: "mas" },
      { t: "Descanso", txt: "Duerme bien. El cerebro fija durmiendo.", to: null }
    ], meta: "Meta: llegar descansado, no agotado." },

  { dia: 20, titulo: "Vispera / examen", foco: "Checklist y calma.",
    tareas: [
      { t: "Descanso", txt: "Checklist: PowerPoint subido, portatil cargado, presentacion ensayada.", to: null },
      { t: "Repaso", txt: "Repasa solo tus 20 demonios esta manana. Nada mas.", to: "estudiar" },
      { t: "Oral", txt: "Respira. Tu punto fuerte es el oral. Ve a por ello.", to: null }
    ], meta: "Meta: entrar tranquilo. Ya has hecho el trabajo." }
];
