// Gramática del examen: comparatif/superlatif + COD/COI. window.GRAMMAR
window.GRAMMAR = [
  {w:"plus … que",g:null,en:"more … than (comparatif +)",ex:"Elle est plus grande que lui.",cat:"grammar"},
  {w:"moins … que",g:null,en:"less … than (comparatif −)",ex:"Il est moins grand qu'elle.",cat:"grammar"},
  {w:"aussi … que",g:null,en:"as … as (comparatif =)",ex:"Ils sont aussi grands que leurs amis.",cat:"grammar"},
  {w:"autant de … que",g:null,en:"as much/many … as (quantité =)",ex:"Nous avons autant de travail qu'eux.",cat:"grammar"},
  {w:"meilleur(e) que",g:null,en:"better than — adjectif BON irregular",ex:"Ce produit est meilleur que l'autre.",cat:"grammar"},
  {w:"mieux que",g:null,en:"better than — adverbe BIEN irregular",ex:"Il parle mieux que moi.",cat:"grammar"},
  {w:"pire que",g:null,en:"worse than — MAUVAIS irregular",ex:"Ce résultat est pire que prévu.",cat:"grammar"},
  {w:"le/la plus … (de)",g:null,en:"the most … (superlatif +)",ex:"Elle est la plus grande de la ville.",cat:"grammar"},
  {w:"le/la moins … (de)",g:null,en:"the least … (superlatif −)",ex:"Ce sont les cours les moins intéressants.",cat:"grammar"},
  {w:"le meilleur / la meilleure",g:null,en:"the best — superlatif de BON",ex:"C'est le meilleur produit du marché.",cat:"grammar"},
  {w:"le mieux",g:null,en:"the best — superlatif de BIEN",ex:"C'est lui qui travaille le mieux.",cat:"grammar"},
  {w:"COI → lui (sing.)",g:null,en:"à lui / à elle → lui (pronom COI singular)",ex:"Je parle à Marie → Je lui parle.",cat:"grammar"},
  {w:"COI → leur (plur.)",g:null,en:"à eux / à elles → leur (pronom COI plural)",ex:"Je parle à mes collègues → Je leur parle.",cat:"grammar"},
  {w:"Impératif affirmatif + COI",g:null,en:"tras el imperativo afirmativo: Parle-lui !",ex:"Donne les clés à Jean → Donne-lui les clés.",cat:"grammar"},
  {w:"adjectif → adverbe (-ment)",g:null,en:"adjetivo femenino + -ment = adverbio",ex:"rapide → rapidement / lent → lentement / évident → évidemment",cat:"grammar"},
  // --- Superlativo: formas que faltaban ---
  {w:"le pire / la pire",g:null,en:"el/la peor — superlativo de MAUVAIS",ex:"C'est le pire résultat de l'année.",cat:"grammar"},
  {w:"le plus de / le moins de + nom",g:null,en:"el que más / menos … (superlativo de cantidad)",ex:"C'est elle qui a le plus de clients.",cat:"grammar"},
  // --- COD: pronombres de objeto directo (le/la/l'/les) ---
  {w:"Je le lis.",g:null,en:"COD masculino (le rapport) → le. 'Je lis le rapport' → ?",ex:"Je lis le rapport → Je le lis.",cat:"grammar"},
  {w:"Elle l'écrit.",g:null,en:"COD ante vocal → l'. 'Elle écrit l'email' → ?",ex:"Elle écrit l'email → Elle l'écrit.",cat:"grammar"},
  {w:"Elle les signe.",g:null,en:"COD plural (les contrats) → les. 'Elle signe les contrats' → ?",ex:"Elle signe les contrats → Elle les signe.",cat:"grammar"},
  {w:"Je vais le voir.",g:null,en:"COD + infinitivo: el pronombre va ANTES del infinitivo. 'Je vais voir le chien' → ?",ex:"Je vais voir le chien → Je vais le voir.",cat:"grammar"},
  {w:"Je les ai trouvées.",g:null,en:"COD + passé composé: ante el auxiliar y CONCUERDA. 'J'ai trouvé les clés' → ?",ex:"J'ai trouvé les clés → Je les ai trouvées.",cat:"grammar"},
  {w:"Regarde-le.",g:null,en:"COD + imperativo afirmativo: detrás, con guion. 'Regarde le chien' → ?",ex:"Regarde le chien → Regarde-le.",cat:"grammar"},
  // --- COI: reglas de colocación que faltaban ---
  {w:"Je vais lui donner le livre.",g:null,en:"COI + infinitivo: ante el infinitivo. 'Je vais donner le livre à Jean' → ?",ex:"Je vais donner le livre à Jean → Je vais lui donner le livre.",cat:"grammar"},
  {w:"Je lui ai donné les clés.",g:null,en:"COI + passé composé: ante el auxiliar (NO concuerda). 'J'ai donné les clés à Marie' → ?",ex:"J'ai donné les clés à Marie → Je lui ai donné les clés.",cat:"grammar"},
  {w:"COD: le, la, l', les — COI: lui, leur",g:null,en:"resumen 3ª persona: objeto directo = le/la/l'/les · objeto indirecto (à…) = lui/leur",ex:"Je le vois (COD) · Je lui parle (COI).",cat:"grammar"},
];
