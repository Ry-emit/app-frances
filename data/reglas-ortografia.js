// data/ortografia.js
// window.ORTO = las 7 reglas de ortografia-patrones.md
// Fuente: /Users/alexcatala/french-b1-neuro/02-gramatica/ortografia-patrones.md
// Contrato (SPEC.md): { id, titulo, regla, porque, ejemplos, drill }, ... 7
//   drill = pares [espanol, frances] (frances con articulo si lo lleva, se corrige exacto)

window.ORTO = [
  {
    id: 1,
    titulo: "El sonido \"sión\" se escribe -tion",
    regla: "Suena \"sión\", se escribe -tion, con t, no c. Es la regla que más veces te salva.",
    porque: "En español ese sonido se escribe con c (-ción). En francés casi siempre es con t (-tion). Cuidado con la fusion, la excepción real: esa va con s.",
    ejemplos: [
      "négociation", "présentation", "planification", "promotion",
      "exportation", "importation", "distribution", "réputation",
      "coopération", "opération", "subvention", "évaluation", "satisfaction"
    ],
    drill: [
      ["negociación", "la négociation"],
      ["promoción", "la promotion"],
      ["distribución", "la distribution"],
      ["evaluación", "l'évaluation"]
    ]
  },
  {
    id: 2,
    titulo: "\"-dad\" español → -té francés",
    regla: "Lo que en español acaba en -dad, en francés acaba en -té. Femenino y con acento en la é.",
    porque: "El español acaba en -dad; el francés recorta la terminación a -té. El fallo típico es dejar el final español puesto o comerse el acento de la é.",
    ejemplos: [
      "la rentabilité", "la productivité", "la responsabilité sociale"
    ],
    drill: [
      ["rentabilidad", "la rentabilité"],
      ["productividad", "la productivité"],
      ["responsabilidad", "la responsabilité"]
    ]
  },
  {
    id: 3,
    titulo: "\"-mento\" → -ment (la t no suena, masculino)",
    regla: "Lo que en español acaba en -mento, en francés acaba en -ment. La t no suena. Es masculino (le).",
    porque: "La t final de -ment no suena al hablar, por eso se olvida al escribir. Además son palabras masculinas (le), no femeninas como en español.",
    ejemplos: [
      "le développement", "le département", "le recrutement"
    ],
    drill: [
      ["desarrollo", "le développement"],
      ["departamento", "le département"],
      ["reclutamiento", "le recrutement"]
    ]
  },
  {
    id: 4,
    titulo: "El francés dobla consonantes",
    regla: "Donde el español pone una consonante, el francés a menudo pone dos. Sospecha de -ss- -pp- -ll- -nn- -rr- -mm-.",
    porque: "El oído español no distingue la consonante doblada del francés, así que se tiende a escribir una sola. Ojo: no todas doblan, la banque e innover van con una sola.",
    ejemplos: [
      "fournisseur", "concurrence", "développement", "coopération",
      "coordonner", "collaborer", "innover", "la banque"
    ],
    drill: [
      ["proveedor", "le fournisseur"],
      ["coordinar", "coordonner"],
      ["competencia", "la concurrence"],
      ["colaborar", "collaborer"]
    ]
  },
  {
    id: 5,
    titulo: "Letra final muda",
    regla: "Las letras finales -t, -d, -s, -x se escriben pero no suenan.",
    porque: "Estas letras no suenan al final de la palabra, así que el oído no las pide, pero se escriben igual.",
    ejemplos: [
      "le produit", "le contrat", "le projet", "le crédit",
      "le budget", "le coût", "le taux de change"
    ],
    drill: [
      ["contrato", "le contrat"],
      ["coste", "le coût"],
      ["producto", "le produit"],
      ["proyecto", "le projet"]
    ]
  },
  {
    id: 6,
    titulo: "El acento é (agudo)",
    regla: "Donde el español lleva la e fuerte, el francés suele llevar é. Es la letra que más se te olvida.",
    porque: "Es la letra que más se olvida porque el español no marca esa e con tilde en estas palabras. En francés sí lleva acento agudo.",
    ejemplos: [
      "la stratégie", "la réunion", "le crédit", "la réputation",
      "l'évaluation", "le département", "la négociation", "la réussite"
    ],
    drill: [
      ["estrategia", "la stratégie"],
      ["reunión", "la réunion"],
      ["crédito", "le crédit"],
      ["reputación", "la réputation"]
    ]
  },
  {
    id: 7,
    titulo: "El infinitivo se escribe -er (aunque suene \"é\")",
    regla: "El infinitivo se escribe -er, aunque el oído oiga \"é\".",
    porque: "El oído oye \"é\" al final y tienta a escribir -é o -ez. El infinitivo real de estos verbos es -er, aunque suene igual.",
    ejemplos: [
      "négocier", "coordonner", "lancer", "analyser", "évaluer",
      "planifier", "réviser", "communiquer", "présenter", "rencontrer",
      "collaborer", "innover", "adapter"
    ],
    drill: [
      ["negociar", "négocier"],
      ["lanzar", "lancer"],
      ["analizar", "analyser"]
    ]
  }
];
