// data/presentacion.js -- window.PRESENTACION
// Fuente: french-b1-neuro/04-oral-presentacion/esqueleto-memorizable.md
// Texto SAGRADO: copiado del repo, no inventado ni "mejorado".
// Contrato (SPEC.md): { moldes:[{n, fr, es}], bloques:[{titulo, min, frases:[{fr,es}]}] }

window.PRESENTACION = {
  moldes: [
    { n: 1, fr: "Je m'appelle... j'ai... ans.", es: "Me llamo... tengo... años." },
    { n: 2, fr: "Aujourd'hui, je vais vous parler de...", es: "Hoy voy a hablarles de..." },
    { n: 3, fr: "Ma présentation a trois parties...", es: "Mi presentación tiene tres partes..." },
    { n: 4, fr: "Mon rêve, c'est de...", es: "Mi sueño es..." },
    { n: 5, fr: "À long terme, mon objectif est de...", es: "A largo plazo, mi objetivo es..." },
    { n: 6, fr: "La personne que j'admire, c'est...", es: "La persona que admiro es..." },
    { n: 7, fr: "Il / Elle est né(e) en... a commencé...", es: "Él / Ella nació en... empezó..." },
    { n: 8, fr: "Son plus grand succès, c'est...", es: "Su mayor éxito es..." },
    { n: 9, fr: "Je l'admire parce que...", es: "Lo / La admiro porque..." },
    { n: 10, fr: "Comme..., je veux...", es: "Como..., yo quiero..." },
    { n: 11, fr: "Pour conclure...", es: "Para concluir..." },
    { n: 12, fr: "Merci de votre attention. Vous avez des questions ?", es: "Gracias por su atención. ¿Tienen preguntas?" }
  ],

  bloques: [
    {
      titulo: "Mes ambitions",
      min: 3,
      frases: [
        { fr: "Bonjour, je m'appelle [Àlex]. J'ai [edad] ans.", es: "Hola, me llamo [Àlex]. Tengo [edad] años." },
        { fr: "Je suis [étudiant / passionné de...] et j'aime [tus intereses].", es: "Soy [estudiante / apasionado de...] y me gusta [tus intereses]." },
        { fr: "Aujourd'hui, je vais vous parler de [mes ambitions et d'une personne que j'admire].", es: "Hoy voy a hablarles de [mis ambiciones y de una persona que admiro]." },
        { fr: "Ma présentation a trois parties : d'abord mes ambitions, ensuite mon modèle, et enfin ma conclusion.", es: "Mi presentación tiene tres partes: primero mis ambiciones, luego mi modelo, y por último mi conclusión." },
        { fr: "Mon rêve, c'est de [+ infinitivo: travailler dans..., créer..., voyager...].", es: "Mi sueño es [+ infinitivo: trabajar en..., crear..., viajar...]." },
        { fr: "À court terme, je veux [objetivo cercano].", es: "A corto plazo, quiero [objetivo cercano]." },
        { fr: "À long terme, mon objectif est de [objetivo lejano].", es: "A largo plazo, mi objetivo es [objetivo lejano]." },
        { fr: "Ce qui me motive, c'est [lo que te mueve].", es: "Lo que me motiva es [lo que te mueve]." }
      ]
    },
    {
      titulo: "Mon modèle",
      min: 6,
      frases: [
        { fr: "La personne que j'admire, c'est [nombre].", es: "La persona que admiro es [nombre]." },
        { fr: "C'est [un entrepreneur / une journaliste / ...] dans le domaine de [campo].", es: "Es [un empresario / una periodista / ...] en el campo de [campo]." },
        { fr: "Il / Elle est né(e) en [año] à [lugar].", es: "Él / Ella nació en [año] en [lugar]." },
        { fr: "Il / Elle a commencé [su inicio].", es: "Él / Ella empezó [su inicio]." },
        { fr: "Ensuite, il / elle a [siguiente paso].", es: "Luego, él / ella [siguiente paso]." },
        { fr: "Son plus grand succès, c'est [logro].", es: "Su mayor éxito es [logro]." },
        { fr: "Grâce à [algo], il / elle a [resultado].", es: "Gracias a [algo], él / ella [resultado]." },
        { fr: "Aujourd'hui, il / elle est connu(e) pour [por qué es famoso/a].", es: "Hoy, él / ella es conocido/a por [por qué es famoso/a]." },
        { fr: "Je l'admire parce que [razón: sa persévérance, sa créativité, son courage...].", es: "Lo / La admiro porque [razón: su perseverancia, su creatividad, su valentía...]." },
        { fr: "Ce qui m'inspire, c'est [el valor concreto].", es: "Lo que me inspira es [el valor concreto]." },
        { fr: "Comme [nombre], je veux [cómo conecta con TU ambición].", es: "Como [nombre], yo quiero [cómo conecta con TU ambición]." }
      ]
    },
    {
      titulo: "Conclusion",
      min: 1,
      frases: [
        { fr: "Pour conclure, je vous ai parlé de [mes ambitions et de + ídolo].", es: "Para concluir, les he hablado de [mis ambiciones y de + ídolo]." },
        { fr: "Ce que je retiens, c'est que [tu lección].", es: "Lo que me llevo es que [tu lección]." },
        { fr: "Je vais [cómo lo aplicarás] pour réaliser mes rêves.", es: "Voy a [cómo lo aplicarás] para realizar mis sueños." },
        { fr: "Merci de votre attention.", es: "Gracias por su atención." },
        { fr: "Est-ce que vous avez des questions ?", es: "¿Tienen alguna pregunta?" }
      ]
    }
  ]
};
