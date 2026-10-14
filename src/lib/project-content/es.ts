import type { ProjectTranslations } from "./types";

export const esProjects = {
  "invisible-window-research": {
    title: "Investigación de la ventana invisible",
    description:
      "Artículo en formato IEEE sobre una vulnerabilidad estructural en la supervisión con WebRTC. Evasión del 100% en configuraciones de laboratorio probadas con Windows 10/11 y macOS 14–26, mediante APIs documentadas y con divulgación responsable.",
    fullDescription:
      "Artículo de 13 páginas en formato IEEE que documenta una vulnerabilidad estructural en la supervisión de exámenes con WebRTC. SetWindowDisplayAffinity de Windows y NSWindow.SharingType.none de macOS permiten excluir una ventana de las rutas de captura probadas mientras sigue visible en la pantalla física. Esto cuestiona la premisa de confianza de la supervisión basada en capturas. Las pruebas de concepto lograron evasión del 100% en configuraciones de laboratorio probadas con Windows y macOS, incluido macOS 26, donde se suponía mitigado el ataque. Las configuraciones eran simuladas, no productos comerciales; macOS 26 usó CGWindowListCreateImage y screencapture nativos en lugar de getDisplayMedia() del navegador, y Linux no se probó. Los hallazgos reflejan las versiones probadas hasta marzo de 2026 y pueden cambiar con futuras correcciones.",
    problem:
      "La supervisión remota detecta contenido prohibido capturando la pantalla mediante getDisplayMedia() de WebRTC y presupone que el fotograma refleja la pantalla física. La investigación demuestra una brecha: APIs de pantalla documentadas excluyeron ventanas de las rutas probadas sin elevar privilegios ni modificar el kernel. Los resultados corresponden a configuraciones controladas y simuladas de Windows y macOS; no demuestran eludir todos los navegadores o productos comerciales.",
    solution: [
      "Formalización de la ruptura del límite de confianza entre la API de captura de pantalla de W3C y la composición del sistema operativo.",
      "Estudio de SetWindowDisplayAffinity en Win32 y NSWindow.SharingType.none en macOS, ambas documentadas en los SDK oficiales.",
      "Pruebas de concepto en Win32 C y Swift que demuestran la evasión completa de la captura.",
      "Evaluación de configuraciones simuladas en un laboratorio controlado con Windows 10/11 y macOS 14–26; no se probaron productos comerciales, y macOS 26 usó captura nativa en lugar de getDisplayMedia() del navegador.",
      "Análisis de las capacidades y limitaciones del seguimiento de la mirada, los movimientos del ratón y la enumeración de procesos.",
      "Propuesta y evaluación de cinco contramedidas, desde enumerar indicadores hasta la atestación de hardware a largo plazo.",
      "Divulgación coordinada con los fabricantes: Microsoft MSRC (notificado en febrero de 2026, clasificado en abril de 2026) y Apple Product Security (notificado y clasificado en marzo de 2026); ambos emitieron clasificaciones formales.",
    ],
    proof: [
      "Evasión del 100% en Windows 10/11 y macOS 14–26, medida sobre más de 10 000 fotogramas por configuración.",
      "Sin artefactos visuales en las capturas: ni rectángulos negros, errores de composición ni parpadeo.",
      "La exclusión siguió funcionando en rutas nativas probadas de macOS 26.3.1 pese a los cambios documentados de ScreenCaptureKit en macOS 15; no se probó directamente ScreenCaptureKit ni getDisplayMedia() del navegador en macOS 26.",
      "Linux con X11/Wayland no se evaluó; los resultados corresponden a las configuraciones probadas de Windows y macOS.",
      "La detección conductual no mostró un efecto significativo con esta muestra: seguimiento de mirada con p = 0.41 y n = 8, con potencia estadística insuficiente; los movimientos del ratón quedaron dentro de la variación normal del examen. Esto no demuestra que la detección conductual sea imposible en todos los contextos.",
      "Prepublicación en Zenodo bajo CC BY 4.0, DOI 10.5281/zenodo.20376495; 13 páginas y 53 referencias en formato de conferencia IEEE.",
    ],
    stack: [
      "Win32 C (prueba de concepto en Windows)",
      "Swift / AppKit (prueba de concepto en macOS)",
      "Python (verificación forense a nivel de píxel)",
      "LaTeX (plantilla de conferencia IEEE, 13 páginas, 53 referencias)",
    ],
    features: [
      "SetWindowDisplayAffinity + WDA_EXCLUDEFROMCAPTURE en Windows 10 v2004+ excluye la ventana de las rutas de captura de Windows probadas sin artefactos visuales.",
      "NSWindow.SharingType.none demostró exclusión en rutas nativas probadas de macOS 14–26; macOS 26 usó CGWindowListCreateImage y screencapture, no getDisplayMedia() del navegador ni una prueba directa de ScreenCaptureKit.",
      "Verificación forense: diferencia de píxeles del 80,27 % en el área de captura de Windows; una captura de 1 170 560 píxeles en macOS resultó totalmente transparente.",
    ],
    measures: [
      "Descubrimiento y verificación en enero de 2026.",
      "Notificación a Microsoft MSRC en febrero de 2026; en abril de 2026 se clasificó como comportamiento previsto, no como vulnerabilidad de seguridad.",
      "Notificación a Apple Product Security en marzo de 2026; ese mes se clasificó como comportamiento coherente con la documentación, no como problema de seguridad.",
      "Publicación tras las respuestas de los proveedores en mayo de 2026.",
      "El código de prueba de concepto no es público; disponible previa solicitud para investigadores de seguridad verificados.",
      "Solo APIs documentadas de usuario, sin explotación del kernel ni elevación de privilegios.",
      "Conforme a los códigos éticos de ACM e IEEE y las directrices de divulgación coordinada de CISA.",
    ],
    papers: [
      {
        label: "Prepublicación en formato IEEE",
        status: "Prepublicación CC BY 4.0",
        description:
          "Artículo de 13 páginas sobre evasión de capturas en varias plataformas y divulgación coordinada a los proveedores.",
      },
    ],
  },
  "project-simurgh": {
    description:
      "Marco de atestación de contención verificable para agentes de IA, independiente del proveedor y derivado de la vertiente defensiva de The Invisible Window. Produce pruebas firmadas con Ed25519 y reproducibles sin conexión sobre las acciones permitidas tras un fallo de seguridad; contuvo 138/138 casos omitidos por el clasificador y redujo el éxito de ataque de un agente en vivo en AgentDojo de 9/140 a 0/140.",
    fullDescription:
      "Project Simurgh es un marco de atestación de contención para IA agéntica, independiente del proveedor. Nació de la capa de integridad basada solo en metadatos de The Invisible Window para sesiones de alto riesgo y evolucionó hacia un sistema que registra lo que un agente desplegado tuvo permitido hacer después de fallar una salvaguarda. Simurgh firma un registro reproducible sin conexión de las acciones permitidas tras conectar el agente con herramientas, archivos, contexto y sistemas externos. Un revisor independiente puede verificar ese registro sin acceso al productor de las pruebas.",
    problem:
      "Los clasificadores de entrada pueden pasar por alto ataques. Cuando ocurre, el agente puede conservar autoridad para usar herramientas o acceder a archivos y sistemas externos. Los operadores necesitan controles posteriores que limiten esas acciones y pruebas que un revisor independiente pueda comprobar. Simurgh asume que el productor de las pruebas puede intentar que una ejecución parezca contenida y diseña la verificación en torno a ese riesgo.",
    solution: [
      "Rodea al agente con cuatro límites de contención y sella cada ejecución en un paquete de metadatos firmado con Ed25519, reconstruible byte a byte sin conexión.",
      "Asume que el productor miente: la reproducción de decisiones y la comprobación de integridad de la emisión permiten confirmar una contención real y refutar una falsa.",
      "Publica una frontera de Pareto entre contención y utilidad y una escala de reproducción de 12 niveles, recalculable sin modelo ni acceso al productor.",
      "Complementa los clasificadores en línea como defensa en profundidad sobre la autoridad del agente; declara con firma que no habría detectado el bypass de contenido de junio de 2026.",
      "Conserva su trayectoria publicada: el origen de integridad de Invisible Window y las afirmaciones de ausencia verificadas por máquina de Banking Shield alimentan el contrato actual.",
    ],
    proof: [
      "Clasificador de entrada real Llama Guard 4 12B sobre 180 casos: contuvo 138/138 casos maliciosos omitidos, incluidos 120 de inyección posterior que un clasificador de entrada no puede ver y 18 fallos directos; éxito combinado de ataque dirigido 0/150, sin ejecuciones de herramientas ni exportaciones inseguras.",
      "Agente en vivo con Llama-3.3-70B autoalojado en la suite de espacio de trabajo de AgentDojo y 140 inyecciones preregistradas: la puerta de autoridad redujo el éxito de 9/140 a 0/140 conservando la utilidad benigna.",
      "Ejecución determinista completa de las cuatro suites de AgentDojo, v2.49.0: casos benignos 97/97, utilidad sin ataque 949/949, éxito de ataque 0/949.",
      "Una segunda raíz independiente de procedencia firma el dictamen de publicación con la identidad OIDC de GitHub, no con la clave del desarrollador; una diferencia de un solo byte frente al dictamen registrado detiene el flujo antes de firmar.",
      "3057 pruebas automatizadas; reproducción sin conexión de la escala de publicación firmada con un solo comando; licencia AGPL-3.0.",
      "Trayectoria publicada en Zenodo bajo CC BY 4.0: prepublicación original de integridad DOI 10.5281/zenodo.20374849, piloto Phase C en un contexto relacionado con votaciones y prototipo Banking Shield de afirmaciones de ausencia.",
    ],
    stack: [
      "Pasarela de contención Node.js / JavaScript",
      "Paquetes firmados con Ed25519 y reproducibles sin conexión",
      "Verificador de igualdad de bytes JS ↔ Python",
      "Teoremas comprobados por máquina en Lean 4",
      "Segunda raíz de procedencia GitHub OIDC",
    ],
    features: [
      "Cuatro límites de contención: cortafuegos de entrada, guardia de procedencia del contexto, puerta de invocación de herramientas y cortafuegos de fugas de salida; todos emiten pruebas firmadas.",
      "Modelo de productor deshonesto: reproducir decisiones y comprobar la integridad de la emisión revela pruebas falsificadas u omitidas, verificables sin conexión por un revisor adversarial.",
      "Taxonomía de escapes: evasión de contención, engaño al verificador, fuera de alcance y evasión del límite de puerta; con campañas adaptativas de equipo rojo reproducibles.",
      "Recibos verificables de fricción acreditan que una aprobación precedió cada cruce de autoridad protegido, con dos claves distintas que impiden la autoaprobación y la alteración retrospectiva de fechas.",
    ],
    measures: [
      "Verificador independiente del productor: confía solo en la clave pública del firmante y funciona sin red para confirmar una afirmación real o refutar una falsa.",
      "Pruebas adversariales propias del núcleo en ocho clases: manipulación, cambio de clave, blanqueo canónico, colisión de resumen, reproducción entre etapas, mutación de prueba propia y deriva de política; la raíz resistió y dos debilidades se corrigieron en detector-v2 y se reevaluaron.",
      "Testigo independiente que contrasta cada recibo con un oráculo independiente de consecuencias: cero acusaciones falsas y cero mentiras omitidas en los casos de prueba.",
      "Cinco teoremas Lean comprobados por máquina: fail-closed, friction precedence, same-key-fails, friction coverage y no-silent-exemption.",
      "Limitaciones explícitas y firmadas: no es un detector de jailbreak, sino un filtro posterior complementario; no habría detectado el bypass de generación de contenido de junio de 2026.",
    ],
    papers: [
      {
        label: "Prepublicación en formato IEEE",
        status: "Prepublicación CC BY 4.0",
        description:
          "Continuación defensiva de 12 páginas de The Invisible Window: sustituye la vigilancia visual por pruebas de integridad basadas solo en metadatos.",
      },
      {
        label: "Prepublicación complementaria",
        status: "Prepublicación Phase C",
        description:
          "Piloto de 5 páginas en un contexto relacionado con votaciones, con 31 sesiones con consentimiento junto a un acto de una asociación estudiantil de Macquarie; excluye la elección del voto, encadena auditorías HMAC, rechaza campos prohibidos y cumple 5/5 controles de cierre de la recopilación.",
      },
      {
        label: "Prepublicación relacionada con banca",
        status: "Prepublicación preparada por el autor",
        description:
          "Prototipo ficticio de investigación, ajeno a un banco, que convierte límites de privacidad y de afirmaciones excesivas en pruebas comprobables por máquina: cortafuegos de 46 nombres de campo prohibidos cuyos rechazos se auditan, cortafuegos determinista de privacidad de IA sin conexión y recibos por respuesta anclados en cadenas HMAC por sesión. Al congelar las pruebas pasaron 417/417 tests unitarios, 43/43 controles de extremo a extremo y 27/27 controles de seguridad en tres auditorías de privacidad y una puerta estática sin salida de datos. Una prueba formativa con cinco evaluadores y 30 sesiones registró cero valores sensibles y una comprensión de la lista de limitaciones de 5/5.",
      },
    ],
  },
  "project-zurvan": {
    description:
      "Motor de conocimiento LLM que prioriza el almacenamiento local. Ingiere documentos, extrae afirmaciones, conceptos, entidades y decisiones, y los ofrece a agentes mediante un servidor MCP stdio. 218 pruebas superadas.",
    fullDescription:
      "Project Zurvan convierte documentos en una wiki enlazada, consultable y compatible con git, y la ofrece a agentes mediante un servidor Model Context Protocol, MCP. Inspirado en las notas de Andrej Karpathy sobre gestión del conocimiento, este motor LLM local está pensado para investigadores, ingenieros y agentes que necesitan memoria estructurada a largo plazo sin depender de la nube.",
    problem:
      "Los agentes LLM carecen de memoria persistente y estructurada entre sesiones. Los sistemas RAG requieren nube o pierden relaciones, como qué afirmación respalda una decisión o qué conceptos se contradicen. Una solución local debe ingerir documentos variados, conservar relaciones en un grafo y ofrecer consultas que protejan la privacidad.",
    solution: [
      "Ingesta local de MD, PDF, TXT e imágenes hacia un almacén de conocimiento SQLite.",
      "Extracción LLM de nodos tipados: afirmaciones, conceptos, entidades y decisiones, acumulados entre fuentes al crecer el corpus.",
      "Búsqueda híbrida FTS5 y semántica con expansión de vecinos del grafo para reunir contexto profundo.",
      "Servidor MCP stdio con zurvan_search, zurvan_context, zurvan_remember, zurvan_decision_add y herramientas de grafo para Claude Code y Cursor.",
      "Federación de proyectos con almacenes independientes, búsqueda cruzada, detección de contradicciones y seguimiento de deriva de políticas.",
    ],
    proof: [
      "218 pruebas superadas en 18 fases de desarrollo completadas.",
      "Servidor MCP verificado, con guías de configuración de Claude Code y Cursor.",
      "Integración con Obsidian y grafo de 7 tipos por color: afirmaciones, conceptos, entidades, decisiones, sesiones, contradicciones y síntesis.",
      "La secuencia de paquete de pruebas, informe, revisión y publicación funciona completamente sin conexión.",
      "Orquestación documentada para Claude Code y Codex: revisión previa, comprobación posterior y cierre de sesión.",
    ],
    stack: [
      "Python 3.10+",
      "SQLite FTS5 (búsqueda híbrida)",
      "Servidor MCP stdio",
      "Proveedores LLM OpenAI / Anthropic / Mock",
      "Estructura de almacén compatible con Obsidian",
    ],
    features: [
      "Ingiere Markdown, PDF, TXT e imágenes en una wiki enlazada, consultable y compatible con git.",
      "La extracción LLM genera nodos tipados de afirmaciones, conceptos, entidades y decisiones, acumulados entre fuentes.",
      "FTS5 y búsqueda semántica con expansión de vecinos del grafo para reunir contexto denso.",
      "Servidor MCP stdio con zurvan_search, zurvan_context, zurvan_remember, zurvan_decision_add y herramientas de grafo para Claude Code y Cursor.",
      "Federación de proyectos con búsqueda cruzada, contradicciones y seguimiento de políticas en almacenes independientes.",
      "218 pruebas superadas en 18 fases completadas.",
    ],
    measures: [
      "Diseño local, sin almacenamiento en la nube ni transmisión externa de documentos.",
      "MCP es de solo lectura por defecto; la escritura exige una opción explícita.",
      "Rutas de proyectos en ~/.zurvan/projects.json, nunca en el control de versiones.",
      "Proveedor Mock LLM para desarrollo y pruebas sin exponer claves API.",
      "Memoria aislada por almacén; la federación cruzada exige registro explícito.",
    ],
  },
  gitswitch: {
    description:
      "Cliente Git con IA para gestionar identidades múltiples y generar mensajes de commit semánticos, construido con Electron y React.",
    fullDescription:
      "GitSwitch es un cliente Git con IA para desarrolladores que trabajan con varias cuentas y repositorios. Cambia identidades de git y redacta mensajes de commit semánticos.",
    problem:
      "Gestionar identidades personales y laborales de git y redactar mensajes de commit coherentes suele ser difícil.",
    solution: [
      "Selector de identidad para la configuración global y local de git.",
      "Gemini 3 integrado para generar mensajes semánticos.",
      "Aplicación Electron moderna y segura con aislamiento estricto.",
      "Visor inteligente de diferencias para revisar mejor el código.",
    ],
    proof: [
      "Integración segura con el llavero del sistema.",
      "Borrado de claves API de la memoria.",
      "Tecnologías: React 19 + Electron 33.",
      "Interfaz inspirada en el estilo cyberpunk.",
    ],
    features: [
      "Gestión de varias cuentas personales y laborales.",
      "Mensajes de commit generados con Gemini 3.",
      "Visor de diferencias con resaltado de sintaxis.",
      "Gestión de repositorios con arrastrar y soltar.",
    ],
    measures: [
      "Claves API ocultadas en registros y borradas de la memoria.",
      "Secretos almacenados en el llavero del sistema.",
      "Tiempos de espera y saneamiento de entrada obligatorios.",
      "Diseño que prioriza la privacidad.",
    ],
  },
  "mehr-guard": {
    description:
      "Escáner de seguridad de QR y URL que prioriza la privacidad, construido con Kotlin Multiplatform; análisis 100% sin conexión para 5 plataformas.",
    fullDescription:
      "Mehr Guard es un escáner de QR y URL con Kotlin Multiplatform que prioriza la privacidad. Detecta phishing, suplantación de marcas y redirecciones maliciosas íntegramente en el dispositivo.",
    problem:
      "Los QR son una vía frecuente de phishing, pero muchos escáneres suben datos a la nube. Hace falta verificar URL sin filtrar el historial de navegación.",
    solution: [
      "Motor de análisis 100% sin conexión con Kotlin Multiplatform.",
      "Modelo de aprendizaje automático combinado con más de 25 comprobaciones heurísticas para la detección de amenazas.",
      "5 plataformas, que abarcan Android, iOS, JVM, JS y Wasm; ~100% de lógica de detección compartida, ~52% del código total.",
      "Latencia <5ms para escaneo en tiempo real.",
    ],
    proof: [
      "F1 del 87% en el corpus de equipo rojo.",
      "Rendimiento: latencia P99 <5ms.",
      "1248+ pruebas automatizadas y suite de equipo rojo con 19 ataques seleccionados.",
      "Privacidad: 0 llamadas de red verificadas mediante ./judge/verify_offline.sh.",
      "Código compartido: ~100% de la lógica de detección, ~52% del código total.",
    ],
    features: [
      "5 destinos: Android, iOS, JVM, JS y Wasm.",
      "Modelo combinado de regresión logística y potenciación por gradiente.",
      "Detección de suplantación de marca, homógrafos y redirecciones maliciosas.",
      "Motor heurístico con 25+ comprobaciones.",
      "Suite de equipo rojo integrada con 19 ataques seleccionados.",
    ],
    measures: [
      "Análisis 100% sin conexión, sin llamadas de red.",
      "Aprendizaje automático y heurísticas en el dispositivo.",
      "Sin recopilación de datos.",
      "Privacidad incorporada en la arquitectura.",
    ],
  },
  "syllabus-sync": {
    description:
      "Sistema operativo universitario basado en IA que convierte programas en PDF en datos estructurados para agentes. Aceptado como startup formal en la Incubadora de Macquarie; suite estudiantil completa con 503 pruebas en 92 archivos, activa en syllabus-sync.app.",
    fullDescription:
      "Syllabus Sync convierte programas universitarios estáticos en PDF en datos estructurados para agentes y ofrece calendario, mapa, notificaciones y gestión de varios perfiles. Este sistema universitario basado en IA fue aceptado como startup formal en la Incubadora de Macquarie y funciona en producción en syllabus-sync.app.",
    problem:
      "Las universidades australianas publican programas en PDF no estructurados. Los estudiantes copian las fechas a mano y los asistentes de IA inventan plazos al no disponer de una fuente fiable legible por máquina.",
    solution: [
      "OCR con LLM que extrae JSON de los PDF y lo valida con esquemas Zod.",
      "Syllabus-as-Code: evaluaciones y plazos versionados y comparables.",
      "Sistema estudiantil completo con calendario, navegación Leaflet + Google Maps y notificaciones push.",
      "Arquitectura preparada para bifurcarse: cualquier universidad australiana puede sustituir data/ y las variables de entorno.",
    ],
    proof: [
      "Aceptado como startup formal en la Incubadora de Macquarie en 2026.",
      "Activo en producción en syllabus-sync.app.",
      "503 pruebas en 92 archivos, todas superadas en CI.",
      "El proxy de confianza cero detecta errores de configuración por defecto, validado en producción.",
      "Diseñado para ~47 000 estudiantes de MQ y preparado para otras universidades australianas.",
      "Autenticación con claves de acceso WebAuthn; ningún secreto compartido sale del dispositivo.",
    ],
    features: [
      "OCR con LLM para extraer JSON estructurado de los programas PDF.",
      "Syllabus-as-Code: evaluaciones y plazos bajo control de versiones.",
      "Sistema estudiantil con calendario, recordatorios, mapa y notificaciones.",
      "503 pruebas en 92 archivos con controles de calidad CI/CD.",
    ],
    measures: [
      "Middleware de proxy de confianza cero; todas las rutas autenticadas por defecto.",
      "Seguridad por filas de Supabase en la base de datos.",
      "Claves de acceso WebAuthn/FIDO2, sin contraseñas almacenadas.",
      "Mitigación de inyección de instrucciones mediante salida limitada al esquema y saneamiento de entrada.",
      "Escáner de secretos en CI que bloquea patrones de credenciales en commits.",
    ],
  },
  "divan-open-day": {
    title: "Divan · Jornada de puertas abiertas",
    description:
      "Experiencia de poesía de Hafez y Rumi, bilingüe en persa e inglés y preparada para funcionar sin conexión, para un stand de la Sociedad Persa. El visitante elige poeta y recibe un verso revisado, traducción, fuente y recitación; sin cookies, rastreadores ni servidor.",
    fullDescription:
      "Divan es una experiencia bilingüe de poesía persa para un stand de puertas abiertas de la Sociedad Persa. El visitante elige Hafez o Rumi, formula una intención y recibe un verso revisado con traducción inglesa, fuente y recitación opcional. Funciona sin conexión y protege la privacidad por diseño: sin cookies, rastreadores, servidor ni entrada de visitantes, mantiene la fiabilidad en redes inestables sin recopilar datos de sus usuarios.",
    problem:
      "Un stand público necesita una experiencia cultural rápida y agradable que funcione con Wi-Fi inestable, respete plenamente la privacidad y presente poesía persa con rigor cultural y académico, sin versos inventados, caligrafía rasterizada ni recopilación de datos.",
    solution: [
      "Selección exacta de 60 versos de Hafez + 60 de Rumi, 120 en total, vinculados a ediciones inmutables con procedencia verificable.",
      "Aplicación preparada para funcionar sin conexión mediante un service worker escrito a mano.",
      "La colección en orden aleatorio (shuffle bag) de Web Crypto selecciona los versos en el dispositivo; ningún servidor registra lo que obtienen los visitantes.",
      "Tipografía Nastaliq viva y dirección artística propia de cada poeta, en lugar de imágenes planas.",
      "Accesibilidad desde el principio: marcado bilingüe y RTL, aislamiento bidireccional, regiones vivas, colores forzados y movimiento reducido.",
    ],
    proof: [
      "Sin recopilación: no hay cookies, rastreadores ni servidor; solo identificadores públicos de poemas en sessionStorage.",
      "Funciona completamente sin conexión tras la primera carga con un service worker que verifica la integridad.",
      "El compilador de producción rechaza datos sintéticos de pruebas antes del despliegue; solo se publica el corpus revisado.",
      "Suites Vitest de unidades, componentes, accesibilidad, modo sin conexión, compartir, rendimiento y seguridad, además de Playwright Chromium de extremo a extremo.",
    ],
    stack: [
      "Vite",
      "React 19",
      "TypeScript estricto",
      "Service worker escrito a mano",
      "Web Crypto (colección en orden aleatorio (shuffle bag))",
      "Vitest (unidad / componente / accesibilidad / sin conexión)",
      "Playwright (Chromium de extremo a extremo)",
      "pnpm 10.33 · Node 22.16",
    ],
    features: [
      "Corpus bilingüe revisado: 60 Hafez + 60 Rumi = 120 versos, ligados a ediciones inmutables con procedencia documentada.",
      "La selección de versos usa una colección en orden aleatorio (shuffle bag) de Web Crypto calculada en el dispositivo, sin intervención del servidor.",
      "Service worker manual con verificación de integridad para funcionar sin conexión en redes inestables.",
      "Dirección cultural por poeta con tipografía Nastaliq renderizada como texto, texto persa real y nunca imágenes rasterizadas.",
      "Marcado bilingüe con dirección, aislamiento bidireccional, regiones vivas, colores forzados y movimiento reducido.",
    ],
    measures: [
      "Privacidad por diseño: sin cookies, identificadores, rastreadores ni entrada de visitantes; no se transmite nada.",
      "Cliente estático, sin servidor, base de datos ni analítica.",
      "Solo identificadores públicos de edición y poema en sessionStorage; preferencia de movimiento guardada localmente.",
      "El compilador de producción rechaza datos sintéticos y de prueba antes de desplegar.",
      "Atribución ligada a la fuente y comprobación de derechos: MIT para código; poemas y traducciones conservan sus licencias, como CC BY-SA.",
      "Contenedor estático tras un túnel saliente, sin superficie entrante.",
    ],
  },
  "nexus-archive": {
    description:
      "Bóveda personal de medios de estilo cyberpunk con React, API Litestar y autenticación Supabase; recomendaciones de IA, notas cifradas y autenticación reforzada con cookies.",
    fullDescription:
      "Nexus Archive combina una interfaz React, una API Litestar y autenticación y persistencia Supabase en una bóveda de estilo cyberpunk. Permite gestionar libros, películas, anime, valoraciones, notas, chats y recomendaciones de IA en un panel único.",
    problem:
      "Los gestores de medios fragmentan las colecciones de entretenimiento entre plataformas y pueden tener controles de seguridad débiles. Nexus Archive reúne títulos, valoraciones, notas y recomendaciones en una sola cuenta con controles de acceso a nivel de fila.",
    solution: [
      "Bóveda full-stack con React 19, Litestar y Supabase PostgreSQL con seguridad por filas.",
      "Cookies HttpOnly gestionadas por el servidor en lugar de tokens Supabase legibles desde la interfaz.",
      "Gemini para recomendaciones, con límite de solicitudes compartido por usuario y alternativa local.",
      "Persistencia cifrada de notas y aislamiento de instrucciones con ocultación de datos personales.",
    ],
    proof: [
      "Autenticación reforzada: cookies HttpOnly + SameSite=Strict y rotación silenciosa de tokens.",
      "Controles CI: Bandit, pip-audit, npm audit y búsqueda de secretos.",
      "Pruebas de carga Locust para verificar rendimiento.",
      "Base Terraform de infraestructura como código para despliegues reproducibles Supabase + Vercel.",
    ],
    features: [
      "Recomendaciones Gemini con degradación controlada ante fallos.",
      "Transcripciones de chat en tiempo real con saneamiento por usuario.",
      "Estados, valoraciones y reseñas de anime, películas y libros.",
      "Filtrado y búsqueda inteligentes en toda la biblioteca.",
    ],
    measures: [
      "Cookies HttpOnly y SameSite=Strict, sin tokens legibles por la interfaz.",
      "Tokens de acceso breves con rotación silenciosa mediante /auth/refresh.",
      "Aislamiento con delimitadores XML, limpieza de cadenas y ocultación de datos personales.",
      "Notas cifradas con AES mediante TAKEAWAY_ENCRYPTION_KEY.",
      "Bandit, pip-audit, npm audit y búsqueda de secretos en CI.",
    ],
  },
  nanomatch: {
    description:
      "Libro de órdenes limitadas y motor de cruce de alto rendimiento en C++20. Benchmark sintético de un solo hilo: 1M+ órdenes por segundo y cancelación en menos de un microsegundo.",
    fullDescription:
      "NanoMatch es un libro de órdenes limitadas y motor de cruce en C++20 moderno. Simula las operaciones centrales de una bolsa, cruzando órdenes de compra y venta por prioridad de precio y tiempo a millones de operaciones por segundo.",
    problem:
      "Las bolsas necesitan cruzar órdenes con latencias muy bajas. Entender el motor a nivel de sistemas requiere construirlo desde cero con restricciones reales de rendimiento.",
    solution: [
      "Cruce por prioridad de precio y tiempo FIFO, con órdenes Limit, Market, IOC y FOK.",
      "Cancelación y modificación O(1) mediante índices de tabla hash.",
      "Asignador de pool que elimina asignaciones de heap en la ruta crítica.",
      "Soporte de varios instrumentos con libros independientes por símbolo.",
    ],
    proof: [
      "Rendimiento: 1M+ órdenes/segundo, benchmark sintético de un solo hilo.",
      "Suite completa con benchmarks de latencia p50/p99.",
      "60+ pruebas unitarias en 18 suites, todas superadas.",
      "ASan, UBSan, cppcheck y clang-format en CI con cada push.",
    ],
    features: [
      "Cruce por prioridad de precio y tiempo FIFO.",
      "4 tipos: Limit, Market, IOC y Fill-or-Kill.",
      "Cancelación y modificación O(1) mediante tabla hash.",
      "Asignador de pool propio que elimina la sobrecarga de heap.",
    ],
    measures: [
      "AddressSanitizer y UndefinedBehaviorSanitizer en CI.",
      "60+ pruebas unitarias en 18 suites.",
      "Análisis estático cppcheck con cada push.",
      "Sin dependencias externas en ejecución.",
    ],
  },
  sentinelflow: {
    description:
      "Detector de intrusiones en red en tiempo real con C++17, análisis por capas, reglas inspiradas en Snort y detección con estado. 500K+ paquetes/segundo en análisis puro de un solo hilo con tráfico SYN sintético.",
    fullDescription:
      "SentinelFlow captura tráfico en vivo o procesa archivos pcap, analiza cabeceras en varias capas OSI, identifica firmas de ataque y anomalías, y exporta alertas a consola y CSV.",
    problem:
      "La detección de intrusiones exige inspección profunda a velocidad de red. Los IDS comerciales son opacos; construir uno revela cómo funcionan el análisis de protocolos, las firmas y el seguimiento de estado.",
    solution: [
      "Análisis por capas de Ethernet, IPv4, TCP, UDP, ICMP, DNS y ARP.",
      "Motor configurable inspirado en Snort para comparar firmas con flexibilidad.",
      "Detección con estado de escaneos de puertos, inundaciones SYN y túneles DNS.",
      "Rendimiento de 500K+ paquetes/segundo en análisis de un solo hilo con SYN sintético.",
    ],
    proof: [
      "500K+ paquetes/segundo en análisis de un solo hilo con tráfico SYN sintético.",
      "Cobertura de 7 protocolos en capas 2-7.",
      "27 pruebas unitarias y de integración, todas superadas.",
      "Compatible con captura en vivo y análisis pcap.",
    ],
    stack: [
      "C++17",
      "libpcap",
      "CMake",
      "Google Test",
      "Reglas inspiradas en Snort",
      "Filtros BPF",
    ],
    features: [
      "Captura en vivo con libpcap y filtros BPF configurables.",
      "Análisis por capas de Ethernet, IPv4, TCP, UDP, ICMP, DNS y ARP.",
      "Reglas configurables inspiradas en Snort con comparación de firmas.",
      "Detección con estado de escaneos, inundaciones SYN y túneles DNS.",
    ],
    measures: [
      "Alertas por color según gravedad, de LOW a CRITICAL.",
      "27 pruebas unitarias y de integración para todas las capas.",
      "Exportación CSV para análisis forense e integración SIEM.",
      "Filtros BPF configurables para captura dirigida.",
    ],
  },
  ecrsm: {
    title: "Monitor de seguridad de ejecución en la nube con eBPF",
    description:
      "Conjunto sintético y de solo lectura para observar la ejecución, con eBPF del kernel, agente Go y panel React; monitor educativo.",
    fullDescription:
      "ECRSM es un monitor educativo de seguridad de ejecución en la nube basado en eBPF. Combina eBPF del kernel, un agente Go y un panel React en un conjunto sintético de solo lectura.",
    problem:
      "La seguridad de ejecución a nivel de kernel es compleja. ECRSM ofrece una plataforma educativa segura para aprender monitorización eBPF.",
    solution: [
      "Hooks eBPF para puntos seguros de trazado de llamadas al sistema.",
      "Agente Go para recoger y enriquecer metadatos.",
      "Panel React en tiempo real para visualizar los datos.",
      "Simulaciones sintéticas seguras de ataques.",
    ],
    proof: [
      "Detecta shells inversas, inyección de procesos y ejecuciones sospechosas.",
      "Transmisión por perf buffer de baja sobrecarga.",
      "Enriquecimiento de metadatos de contenedores y K8s.",
      "Verificable con scripts de ataque sintéticos.",
    ],
    stack: ["eBPF (C)", "Go (agente)", "React (panel)", "Kubernetes (Helm)"],
    features: [
      "Puntos de trazado: execve, connect, ptrace y mmap.",
      "Agente Go para enriquecimiento y reglas.",
      "Panel WebSocket en vivo.",
      "Despliegue Kubernetes DaemonSet.",
    ],
    measures: [
      "Inspección de solo lectura, sin escrituras al kernel.",
      "Solo metadatos, sin contenido ni secretos.",
      "Mínimo privilegio: solo capacidades BPF/SYS_ADMIN.",
      "Simulaciones sintéticas seguras.",
    ],
  },
  simurghforge: {
    description:
      "Convertidor universal para macOS: 49 formatos de imagen, documentos, audio, vídeo y datos con 9 motores. Sin nube, en un único paquete .app.",
    fullDescription:
      "SimurghForge es un convertidor universal para macOS con Tauri v2, backend Rust e interfaz React/TypeScript. Convierte 49 formatos de imágenes, documentos, audio, vídeo y datos estructurados mediante 9 motores: 4 nativos Rust para rendimiento y 5 enlazados por CLI para ampliar formatos. Todo se procesa localmente, sin dependencia de la nube.",
    problem:
      "Convertir archivos suele exigir subir documentos sensibles a la nube, usar varias herramientas o instalar aplicaciones Electron pesadas. Hace falta una herramienta única, rápida y privada que procese formatos habituales localmente.",
    solution: [
      "Arquitectura de tres niveles: Rust nativo para velocidad, CLI para funciones y Python para datos tabulares.",
      "Detección MIME por bytes mágicos para elegir automáticamente el motor.",
      "Procesamiento por lotes con semáforo Tokio para controlar concurrencia.",
      "Paquete .app único con ajustes de calidad baja, media, alta y sin pérdida.",
    ],
    proof: [
      "49 formatos en 5 categorías: imágenes, documentos, audio, vídeo y datos.",
      "9 motores con selección automática por MIME.",
      "Lotes de hasta 50 archivos con 1-8 hilos configurables.",
      "Cero llamadas de red; procesamiento local totalmente sin conexión.",
    ],
    features: [
      "9 motores: 4 nativos Rust y 5 enlazados por CLI, FFmpeg, LibreOffice, Pandoc, Pandas e ImageMagick.",
      "49 formatos de imagen, documentos, audio, vídeo y datos estructurados.",
      "Lotes de hasta 50 archivos con concurrencia configurable y semáforo Tokio.",
      "Detección MIME por bytes mágicos para seleccionar el motor.",
    ],
    measures: [
      "Procesamiento 100% local, sin red ni dependencia de la nube.",
      "Detección MIME por bytes mágicos contra extensiones falsificadas.",
      "Saneamiento de rutas en todas las operaciones.",
      "Paquete .app único, sin servicios ni demonios en segundo plano.",
    ],
  },
  aion: {
    description:
      "Compañero bíblico con IA y RAG híbrido: palabras clave y vectores pgvector, streaming SSE de Gemini y soporte multiplataforma con Tauri v2.",
    fullDescription:
      "Aion permite preguntar sobre las Escrituras en lenguaje natural. Sus respuestas se basan en datos bíblicos reales recuperados mediante RAG híbrido, con palabras clave y búsqueda semántica pgvector, y se transmiten en tiempo real por SSE desde Gemini. Funciona en móvil con React Native + Expo y en escritorio con Tauri v2.",
    problem:
      "Las herramientas de estudio bíblico buscan solo palabras clave y pierden el sentido, o usan chatbots que inventan versículos. Hace falta conversación basada en las Escrituras con citas verificables.",
    solution: [
      "RAG híbrido con extracción regex, embeddings OpenAI de 1536 dimensiones y búsqueda semántica pgvector.",
      "Streaming SSE de Gemini mediante Supabase Edge Functions.",
      "Tarjetas de versículos con libro, capítulo y versículo completos para verificar.",
      "React Native para móvil y Tauri v2 para escritorio nativo.",
    ],
    proof: [
      "La recuperación RAG híbrida fundamenta las respuestas en texto bíblico real, no inventado.",
      "Límites por IP: 5/min, 30/3hrs y 200/day; rechazo por defecto ante errores.",
      "Caché de coincidencia exacta que elimina costes LLM repetidos.",
      "Autenticación anónima sin registro; Supabase RLS en todas las tablas.",
    ],
    features: [
      "RAG híbrido con extracción regex, embeddings OpenAI de 1536 dimensiones y búsqueda pgvector.",
      "Streaming SSE de Gemini mediante Supabase Edge Functions.",
      "Tarjetas insertadas con atribución de libro, capítulo y versículo.",
      "React Native para iOS/Android y Tauri v2 para macOS/Windows/Linux.",
    ],
    measures: [
      "Claves OpenAI, Gemini y service_role solo en secretos de Edge Function del servidor.",
      "Límites por IP: ráfaga de 5/min, 30/3hrs por IP y tope global de 200/day.",
      "Seguridad por filas RLS en todas las tablas Supabase.",
      "Mensajes limitados a 500 caracteres contra el relleno de tokens.",
      "Caché de coincidencia exacta, sin coste LLM en consultas repetidas.",
      "Rechazo por defecto cuando falla el control de frecuencia.",
    ],
    papers: [
      {
        label: "Prepublicación",
        status: "Prepublicación de benchmark piloto",
        description:
          "Artículo de 8 páginas con un benchmark de 40 preguntas para RAG bíblico, que evalúa fidelidad de citas y resistencia a premisas falsas. La recuperación v3 alcanza R@5 = 0.941 y una media de citation_support = 0.978, sin citas carentes de respaldo y con rechazo de 6/6 premisas falsas.",
      },
    ],
  },
} satisfies ProjectTranslations;
