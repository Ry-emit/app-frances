# Français B1 — Negocios · App local

App de estudio para tu examen de francés B1 de negocios. Todo funciona **offline** salvo el modo Examen (que usa la IA de Claude).

## Arrancar

```bash
cd ~/french-b1-app
python3 server.py
```

Luego abre **http://localhost:8000** en el navegador.

Otro puerto: `PORT=8080 python3 server.py`

## Modos

- **🃏 Tarjetas** — 154 tarjetas (139 vocab + 15 gramática) con repetición espaciada. Toca para girar, puntúa (Difícil / Regular / Fácil) y las que fallas vuelven antes.
  - **Selector de Sentido**: 🇫🇷→🇪🇸 Francés · 🇪🇸→🇫🇷 Español · 🔀 Mixto (alterna ambos sentidos dentro de la misma tanda). Se puede cambiar a mitad de tanda sin perder el progreso.
  - **Tandas de 10 (maestría)**: las tarjetas van en niveles de 10, ordenadas de lo más básico a lo más avanzado. **No terminas la tanda hasta poner las 10 como Fácil** — las que marcas Regular/Difícil vuelven a salir hasta que las clavas.
  - **Recuadro de traducción** debajo: escribes el significado (Enter) y la app lo comprueba. En ES→FR es estricto con la ortografía (solo perdona acentos); en FR→ES tolera erratas leves. Los aciertos/fallos alimentan tu **eficiencia** ("¿lo sabes de memoria?") en Progreso.
- **🛤️ Camino** — recorrido lineal, progresivo y acumulativo de 15 niveles, de las bases a frases completas.
  - **Vocabulario y gramática = tarjeta (sin opciones)**: ves la palabra y tienes que **traducirla** (escribiéndola) **y decirla** (pronunciarla). Solo la dominas si aciertas **las dos cosas**. Cada tema pasa primero **FR→ES** (ves francés) y luego **ES→FR** (ves español, lo escribes en francés).
  - Después: gramática (tarjeta + completar la frase), **construir frases** (ordenar palabras), **pronunciar frases completas**, y **repaso mixto** de todo.
  - Orden: 1–50 → 51–100 → verbos → expresiones → gramática → frases → maestría.
  - **⚑ Punto de control cada 5 niveles**: un "Repaso de tus fallos" obligatorio que junta tus tarjetas difíciles, traducciones falladas, pronunciaciones flojas y quiz errados. Al acertarlos, salen de tu lista de fallos. Hay que superarlo para seguir.
  - **Maestría**: niveles de 10; no acabas hasta hacerlas **todas bien** (traducción + pronunciación); lo que falles vuelve a salir. Nota = **% a la primera** (★). Supera uno para desbloquear el siguiente y **repite cualquiera cuando quieras**.
  - Todo queda registrado en `progreso/` (traducciones falladas, pronunciaciones, niveles) para adaptar el estudio con el tiempo.
  - 🔊 **Escuchar** la palabra y la frase con voz francesa.
  - 🎤 **Practicar mi voz**: lo dices en voz alta y la app te da un **% de acierto**, marca en verde/rojo qué palabras entendió, y —si la IA está activada— te da un **consejo de acento y pronunciación**. Requiere **Chrome o Edge** y permiso de micrófono.

### Voz (en ⚙️ Ajustes)
La app usa **voces neuronales** (naturales, como una persona real): Vivienne, Denise, Eloise, Josephine, Yvette ♀ · Rémy, Henri ♂. Se generan en tu servidor local con `edge-tts` (gratis, sin clave) y se cachean en `.tts-cache/` — la segunda vez que suena algo es instantáneo. También ajustas **velocidad** y **claridad/tono**, con botón *Probar voz*.

Si el servidor no está corriendo (p. ej. abres el HTML a pelo), cae automáticamente a las voces del sistema.

> La primera vez: `python3 -m venv .venv && ./.venv/bin/pip install edge-tts` (ya está hecho). `python3 server.py` detecta el venv y lo usa solo.
- **⚔️ Desafío** — preguntas tipo examen con racha de aciertos. Los fallos van al Entrenamiento.
- **💬 Diálogo** — juego de rol (accueil client, réservation hôtel, compte-rendu). Escucha cada frase con 🔊 y, tras cada réplica, **dila en voz alta con 🎤** para puntuarte. Al terminar la escena ves tu **valoración /10** (aciertos + pronunciación), qué corregir, y la evaluación del profe (IA). Si elegiste mal, practicas la respuesta correcta.
- **🏋️ Entrenar** — sesión automática estilo Duolingo (10 ejercicios) construida con tus puntos débiles: tarjetas difíciles, quiz fallados y frases que pronuncias flojo. **Lo que falles vuelve a salir** dentro de la misma sesión.
- **🎓 Examen** — examinador con IA (diagnóstico, oral, escrito y blitz con cronómetro real). Puedes **responder hablando** con el 🎤 de la caja de texto (dictado fr-FR).
- **📊 Progreso** — XP, racha, precisión, dominio por bloque y actividad semanal. Se guarda en tu navegador.

### Atajos (en Tarjetas)
`Espacio` girar · `1` difícil · `2` regular · `3` fácil · `S` sonido · en Desafío: `A B C D`.

## Activar el modo Examen (IA)

Necesita una clave de Anthropic. Dos opciones:

**A) En el servidor (recomendado):**
```bash
ANTHROPIC_API_KEY=sk-ant-... python3 server.py
```

**B) En la app:** pulsa ⚙️ Ajustes (arriba a la derecha) y pega tu clave. Se guarda solo en tu navegador y se envía directamente a Anthropic.

Modelo por defecto: Claude Sonnet 5 (cambiable en Ajustes).

## Velocidad de la voz
Píldora **🔊 0.9×** en la barra superior: clic para ciclar 🐢 0.6× → 0.75× → 0.9× → 1.0× (suena una muestra al cambiar). Afecta a toda la app. Ajuste fino en ⚙️.

## Carpeta `progreso/` — tu historial de errores
La app guarda automáticamente en disco (vía servidor):
- `progreso/pron.jsonl` — cada intento de pronunciación (frase, lo que se entendió, %).
- `progreso/errores.jsonl` — fallos de quiz, diálogos y niveles.
- `progreso/escenas.jsonl` — valoraciones de escenas y niveles completados.
- `progreso/RESUMEN.md` — resumen legible autogenerado con tus frases más flojas y errores repetidos.

**Para pedir correcciones a Claude**: abre Claude Code y dile «lee ~/french-b1-app/progreso/ y hazme correcciones» — verá tu historial completo.

## Archivos
- `index.html` — la app (autocontenida).
- `server.py` — servidor local: estáticos + proxy Claude + TTS neuronal + registro de progreso.
- `CONTEXT.md` — material completo del examen (referencia).
- `progreso/` — historial de errores y pronunciación (autogenerado).
