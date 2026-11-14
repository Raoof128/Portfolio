import type { ProjectTranslations } from "./types";

export const esProjects = {
  "sentinel-ssh": {
    description:
      "Inspección SSH limitada por políticas para agentes de IA. Una pasarela MCP en Rust ofrece 17 herramientas tipadas de solo lectura para hosts Linux registrados, sin dar acceso a un intérprete de comandos.",
    fullDescription:
      "SentinelSSH conecta agentes de IA con hosts Linux registrados mediante MCP y OpenSSH. La pasarela en modo observador comprueba políticas, rutas y límites de recursos antes de ejecutar comandos de inspección predefinidos. Las descargas se guardan como artefactos locales verificados con SHA-256, accesibles por identificador y rango. Esta versión de desarrollo aplica sus límites en la pasarela; no es un entorno aislado remoto ni cuenta con una revisión de seguridad independiente.",
    problem:
      "El acceso SSH sin restricciones expone todas las capacidades de la cuenta y puede llenar el contexto del modelo con información remota sensible.",
    solution: [
      "Sustituir comandos arbitrarios por herramientas tipadas y hosts, directorios raíz y servicios registrados por el operador.",
      "Separar resultados acotados de descargas masivas, con permiso de exportación explícito y artefactos locales verificados.",
    ],
    proof: [
      "El repositorio público documenta el modo observador, los contratos de las herramientas, el modelo de seguridad y un entorno SSH de pruebas desechable.",
      "La aplicación de restricciones en el host, los cambios, las aprobaciones y las subidas quedan para etapas futuras; aquí no se afirma una auditoría independiente ni una nueva ejecución de pruebas.",
    ],
    features: [
      "17 herramientas cubren datos del host, archivos, registros, servicios, comprobaciones de salud, descargas y control de operaciones.",
      "Los resultados acotados, las lecturas por rango, la cancelación y los lotes facilitan la inspección.",
    ],
    measures: [
      "Las claves de host fijadas, la denegación por defecto y las rutas acotadas restringen las solicitudes de la pasarela.",
      "La cuenta SSH puede permitir más acciones que la pasarela. El contenido remoto no es de confianza; el filtrado de credenciales no garantiza eliminar todos los secretos.",
    ],
  },
  forma: {
    description:
      "Una aplicación para crear rutinas, registrar cada serie y seguir el progreso. Disponible en la web con cuentas y modo invitado local; las aplicaciones nativas para iPhone y Apple Watch están en desarrollo.",
    fullDescription:
      "FORMA reúne la planificación, el registro de entrenamientos y la revisión del progreso. La aplicación web, creada con React y TypeScript, ofrece cuentas con historial sincronizado y un modo invitado independiente con almacenamiento local en el navegador. Un proyecto nativo en SwiftUI lleva la experiencia a iPhone, Apple Watch y widgets. La web está disponible; las aplicaciones nativas son versiones de desarrollo, todavía no publicadas en App Store.",
    problem:
      "Los planes y las notas de entrenamiento suelen estar repartidos entre distintas herramientas, lo que dificulta seguir una rutina y revisar el progreso de forma constante.",
    solution: [
      "Reunir la planificación, el entrenamiento activo y la revisión del progreso en un solo espacio.",
      "Ofrecer cuentas sincronizadas junto a un modo invitado local independiente.",
      "Desarrollar experiencias nativas para iPhone, Apple Watch y widgets que permitan entrenar sin el navegador.",
    ],
    proof: [
      "La aplicación web pública está disponible en forma.raoufabedini.dev.",
      "El repositorio documenta la planificación, el registro de series, el historial y los controles de seguridad de las cuentas.",
      "Las aplicaciones nativas para iPhone y Apple Watch siguen en desarrollo; la aceptación en dispositivos físicos y la publicación en App Store son etapas independientes.",
    ],
    features: [
      "Rutinas personalizadas, calendario semanal y biblioteca de ejercicios con búsqueda.",
      "Registro de peso, repeticiones, tiempo y distancia, con temporizadores de descanso y notas.",
      "Historial, marcas personales y copia de seguridad y restauración en JSON con validación.",
    ],
    measures: [
      "Sesiones validadas por el servidor y consultas limitadas a los datos del miembro autenticado.",
      "Autenticación multifactor, revocación de sesiones y tokens de entrenador revocables con caducidad.",
      "Los datos de invitado permanecen en el navegador sin cifrar; hay que guardar una copia antes de borrar los datos del sitio.",
    ],
  },
  "invisible-window-research": {
    title: "Investigación de la ventana invisible",
    description:
      "Artículo en formato IEEE sobre una vulnerabilidad estructural en la supervisión con WebRTC. Evasión del 100% en configuraciones de laboratorio probadas con Windows 10/11 y macOS 14–26, mediante APIs documentadas y con divulgación responsable.",
    fullDescription:
      "Artículo de 13 páginas en formato IEEE que documenta una vulnerabilidad estructural en la supervisión de exámenes con WebRTC. SetWindowDisplayAffinity de Windows y NSWindow.SharingType.none de macOS permiten excluir una ventana de las rutas de captura probadas mientras sigue visible en la pantalla física. Esto cuestiona la premisa de confianza de la supervisión basada en capturas. Las pruebas de concepto lograron evasión del 100% en configuraciones de laboratorio probadas con Windows y macOS, incluido macOS 26, donde se suponía mitigado el ataque. Las configuraciones eran simuladas, no productos comerciales; macOS 26 usó CGWindowListCreateImage y screencapture nativos en lugar de getDisplayMedia() del navegador, y Linux no se probó. Los hallazgos reflejan las versiones probadas a marzo de 2026 y pueden cambiar con futuras correcciones.",
    problem:
      "La supervisión remota detecta contenido prohibido capturando la pantalla mediante getDisplayMedia() de WebRTC y presupone que el fotograma refleja la pantalla física. La investigación demuestra una brecha: APIs de pantalla documentadas excluyeron ventanas de las rutas probadas sin elevar privilegios ni modificar el kernel. Los resultados corresponden a configuraciones controladas y simuladas de Windows y macOS; no demuestran eludir todos los navegadores o productos comerciales.",
    solution: [
      "Formalización de la ruptura del límite de confianza entre la API de captura de pantalla de W3C y la composición del sistema operativo.",
      "Estudio de SetWindowDisplayAffinity en Win32 y NSWindow.SharingType.none en macOS, ambas documentadas en los SDK oficiales.",
      "Pruebas de concepto en Win32 C y Swift que demuestran la evasión completa de la captura.",
      "Evaluación de configuraciones simuladas en un laboratorio controlado con Windows 10/11 y macOS 14–26; no se probaron productos comerciales, y macOS 26 usó captura nativa en lugar de getDisplayMedia() del navegador.",
      "Análisis de qué mecanismos de detección conductual (seguimiento de la mirada, dinámica del ratón, enumeración de procesos) pueden y no pueden detectar el ataque.",
      "Propuesta y evaluación de cinco contramedidas, desde medidas desplegables (enumeración de indicadores) hasta soluciones a largo plazo (atestación de hardware).",
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
      "Notificación a Microsoft MSRC en febrero de 2026; en abril de 2026 se clasificó como diseño previsto (by design), no como vulnerabilidad de seguridad.",
      "Notificación a Apple Product Security en marzo de 2026; ese mes se clasificó como diseño previsto (by design), no como problema de seguridad.",
      "Publicación tras las respuestas de los proveedores en mayo de 2026.",
      "El código de prueba de concepto se retiene por motivos de doble uso.",
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
      "Prototipo de investigación de autorización y contención inspeccionable para agentes de IA con herramientas. Estudio con controles emparejados de octubre de 2026: los ensayos restringidos con efectos nuevos en Llama-3.2-3B bajaron de 17/24 a 0/24 y se conservaron 23/24 finalizaciones útiles. La base de gpt-6-luna ya era 0/24; no se observó protección adicional.",
    fullDescription:
      "Project Simurgh es un prototipo de investigación de código abierto y autor único para inspeccionar lo que se permite hacer a un agente de IA. El anfitrión conserva el estado de delegación, parada, vigencia y credenciales; cada propuesta de herramienta se comprueba fuera del modelo. Sus archivos de evidencia firmados con Ed25519 se reproducen sin conexión con un solo comando. Su estudio de transferencia de octubre de 2026 informa de un beneficio en un modelo y un resultado nulo en otro. Los resultados anteriores de fallos del clasificador y AgentDojo permanecen como experimentos congelados separados; la prepublicación original de integridad del dispositivo documenta la trayectoria previa.",
    problem:
      "Un agente con herramientas puede proponer acciones después de cambiar su estado de delegación, parada, vigencia o credenciales. Los controles del anfitrión deben aplicar ese estado fuera del modelo. Evaluarlos exige bases emparejadas, resultados de tareas útiles e incertidumbre: una base ya limpia no demuestra protección adicional.",
    solution: [
      "Conserva en el anfitrión el estado de delegación, parada, vigencia y credenciales y comprueba cada propuesta fuera del modelo; los archivos de evidencia firmados con Ed25519 se reproducen sin conexión con un solo comando.",
      "Estudio de transferencia de octubre de 2026: 24 tareas, dos ensayos por tarea, tres controles emparejados (solo credenciales, compuesto, denegar todo), dos modelos y 288 ramas reproducidas; del protocolo al paquete publicado del 15 al 17 de octubre de 2026",
      "En Meta Llama-3.2-3B los controles compuestos redujeron los ensayos restringidos con efectos nuevos de 17/24 a 0/24, conservaron 23/24 finalizaciones útiles y no bloquearon ninguna propuesta válida",
      "La base de OpenAI gpt-6-luna ya era 0/24; el estudio no informa de protección adicional en ese modelo",
      "Incertidumbre por estado: los 24 ensayos restringidos se agrupan en seis estados; los intervalos Wilson 95% son 43.6–97.0% frente a 0.0–39.0%, y parte de la diferencia se da por construcción",
    ],
    proof: [
      "Estudio de transferencia con controles emparejados de octubre de 2026: 24 tareas × dos ensayos × tres controles × dos modelos; 288 ramas reproducidas. Se publican juntos el resultado positivo de Llama-3.2-3B y el nulo de gpt-6-luna",
      "Llama-3.2-3B: ensayos restringidos con efectos nuevos 17/24 → 0/24, finalizaciones útiles 23/24, ninguna propuesta válida bloqueada; gpt-6-luna: base 0/24, sin protección adicional observada",
      "Alcance de los grupos: 24 ensayos restringidos en seis estados. Intervalos Wilson 95% por estado de 43.6–97.0% frente a 0.0–39.0%; parte de la diferencia se da por construcción",
      "Defecto de integración de OpenAI Responses API: un error de ubicación del rol provocó 8/8 rechazos de flujos. Se conservaron las trazas originales; una corrección congelada del rol developer completó 2/3 flujos autorizados y rechazó 5/5 restringidos, con un rechazo aún abierto",
      "Etapa anterior congelada del clasificador (2026): Llama Guard 4 12B real sobre 180 casos; la evidencia de contención cubrió los 138/138 casos maliciosos omitidos, incluidos 120 de inyección en etapas posteriores del flujo fuera de la visión de un clasificador de entrada. Es una afirmación de cobertura, no un ranking de clasificadores",
      "Reduje el éxito de ataque dirigido de un agente Llama-3.3-70B en vivo en AgentDojo de 9/140 a 0/140 con inyecciones preregistradas en la suite workspace (etapa congelada, 2026); la ejecución determinista completa de las cuatro suites registró 0/949 de éxito de ataque con 949/949 de utilidad sin ataque (ambos acotados a experimentos pequeños)",
      "Construí el trabajo para que pueda reproducirse: los archivos de evidencia firmados con Ed25519 se reproducen sin conexión con un solo comando; 39 demostraciones en Lean 4 están tras una compuerta de verificación que falla ante cualquier marcador de posición “sorry” sin demostrar; 5,171 pruebas superadas en la ejecución de humo del 19 de octubre de 2026; 92 versiones. El paquete raíz declara AGPL-3.0-or-later.",
      "Auditoría de 919 de los documentos propios del proyecto y publicación de los 141 hallazgos fechados, incluidas exageraciones de cierres anteriores, en el README.",
      "El DOI del archivo de software actual 10.5281/zenodo.21737792 se distingue del DOI de la prepublicación original de integridad del dispositivo 10.5281/zenodo.20374849 y de las demás prepublicaciones",
    ],
    stack: [
      "Controles de autorización compuestos y herramientas de reproducción en Python 3.12",
      "Explorador de evidencias en React y CLI JSON compartida",
      "Archivos de evidencia firmados con Ed25519 que se reproducen sin conexión con un solo comando",
      "OpenAI Responses API con llamadas a herramientas",
      "Llama-3.2-3B / Llama-3.3-70B autoalojados",
      "Modelos Lean 4 de propiedades seleccionadas",
      "Pasarela de contención anterior congelada (Node.js / JavaScript)",
    ],
    features: [
      "El estado de delegación, parada, vigencia y credenciales del anfitrión se comprueba fuera del modelo para cada propuesta de herramienta",
      "Los controles emparejados de solo credenciales, compuesto y denegar todo separan el efecto del anfitrión de la base del modelo y de las tareas útiles",
      "Construí el trabajo para que pueda reproducirse: los archivos de evidencia firmados con Ed25519 se reproducen sin conexión con un solo comando",
      "La arquitectura anterior congelada usaba cuatro límites: cortafuegos de entrada, guardia de procedencia del contexto, compuerta de invocación de herramientas y cortafuegos de fugas de salida",
    ],
    measures: [
      "Las comprobaciones del anfitrión gobiernan las propuestas permitidas; el prototipo y sus experimentos pequeños no establecen una garantía universal de seguridad",
      "Los resultados positivos y nulos se publican juntos, con incertidumbre por grupos de estados y la parte de la diferencia que se da por construcción explícitas",
      "El fallo de ubicación del rol OpenAI y su corrección congelada siguen visibles; un rechazo de un flujo autorizado permanece abierto",
      "39 demostraciones en Lean 4 están tras una compuerta de verificación que falla ante cualquier marcador de posición “sorry” sin demostrar",
      "La evidencia de contención anterior congelada complementa los clasificadores de entrada; no son un detector general de jailbreak ni demuestran impedir toda salida insegura del modelo",
    ],
    papers: [
      {
        label: "Prepublicación anterior de integridad del dispositivo",
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
          "Prototipo ficticio de investigación, ajeno a un banco, que convierte límites de privacidad y de afirmaciones excesivas en pruebas comprobables por máquina: cortafuegos de 46 nombres de campo prohibidos cuyos rechazos se auditan, cortafuegos determinista de privacidad de IA sin conexión y recibos por respuesta anclados en cadenas HMAC por sesión. En el congelamiento de la evidencia pasaron 417/417 tests unitarios, 43/43 controles de extremo a extremo y 27/27 controles de seguridad en tres auditorías de privacidad y una compuerta estática sin salida de datos. Una prueba formativa con cinco evaluadores y 30 sesiones registró cero valores sensibles en la evidencia y una comprensión de la lista de limitaciones de 5/5.",
      },
    ],
  },
  "project-zurvan": {
    description:
      "Motor de conocimiento documental que prioriza el almacenamiento local, con ingesta Python, recuperación SQLite FTS5/vectorial y servidor Rust MCP stdio con escrituras mediante Python. La evaluación sellada actual sigue abierta.",
    fullDescription:
      "Project Zurvan es un motor de conocimiento que prioriza el almacenamiento local y convierte documentos de texto compatibles en una wiki enlazada, consultable y compatible con git, accesible a agentes mediante MCP. Python gestiona la ingesta y las escrituras autoritativas; un servidor Rust nativo sirve las lecturas, mientras el servidor Python permanece como referencia y alternativa. La recuperación híbrida usa SQLite FTS5, embeddings locales y expansión del grafo. Las imágenes se registran como elementos pendientes de interpretación visual, sin interpretarlas automáticamente. El repositorio público incluye investigación en curso de evaluación sellada.",
    problem:
      "Los agentes necesitan memoria persistente y estructurada que conserve las relaciones entre afirmaciones, fuentes y decisiones. Un sistema local útil también debe mostrar cuándo su índice está desactualizado, qué fuentes no se han extraído y qué ha establecido realmente su evaluación de recuperación.",
    solution: [
      "Ingesta Python de Markdown, PDF con texto y TXT; las imágenes crean elementos pendientes de interpretación visual y las figuras PDF quedan marcadas sin transcribir.",
      "Extrae afirmaciones, conceptos, entidades y decisiones tipados a una wiki enlazada; las escrituras autoritativas pasan por el registro de conocimiento.",
      "Combina SQLite FTS5, embeddings semánticos locales y expansión de vecinos del grafo, con información explícita sobre la vigencia del índice y el registro.",
      "Servidor Rust MCP stdio de lectura con escrituras y evaluación mediante Python; el servidor Python permanece como referencia y alternativa.",
      "Federa almacenes registrados explícitamente para búsqueda entre proyectos, memoria de decisiones, detección de contradicciones y seguimiento de políticas.",
    ],
    proof: [
      "Motor de conocimiento que prioriza el almacenamiento local y sirve afirmaciones y decisiones a agentes mediante MCP (218 pruebas)",
      "Registro de paridad real Rust/Python del 20 de octubre: 314 casos por protocolo, 312 PASS, 2 divergencias esperadas y 0 FAIL con MCP 2025-11-25 y 2026-07-28; mediciones comunicadas por el repositorio.",
      "Almacén compatible con Obsidian con siete tipos documentados de nodos: afirmaciones, conceptos, entidades, decisiones, sesiones, contradicciones y síntesis.",
      "El flujo paquete de evidencias → informe → revisión → publicación puede ejecutarse localmente; la red usada por la extracción sigue dependiendo del proveedor LLM configurado.",
      "Se conserva el historial anterior de 18 fases; la recuperación posterior, Rust MCP y la evaluación sellada tienen registros fechados propios. Z1b se integró antes de cerrarse y permanece explícitamente NOT CLOSED.",
    ],
    stack: [
      "Ingesta y puente de escritura en Python 3.10+",
      "Servidor MCP nativo en Rust; referencia y alternativa en Python",
      "SQLite FTS5 + sqlite-vec 0.1.6",
      "Embeddings MiniLM locales para recuperación semántica",
      "MCP stdio: 15 herramientas, 7 recursos y 4 prompts",
      "Proveedores LLM OpenAI / Anthropic / Ollama / Mock",
      "Estructura de almacén compatible con Obsidian",
    ],
    features: [
      "Ingiere Markdown, PDF con texto y TXT en una wiki enlazada y consultable; las imágenes generan elementos pendientes de interpretación visual, sin OCR ni extracción visual automáticos.",
      "La extracción LLM produce afirmaciones, conceptos, entidades y decisiones tipados; las fuentes sin extraer y las figuras PDF sin transcribir quedan marcadas explícitamente.",
      "La recuperación híbrida FTS5 y semántica local, con expansión de vecinos del grafo, reúne contexto con marcas de vigencia del índice y el registro de conocimiento.",
      "El servidor Rust MCP stdio sirve lecturas nativas; las escrituras y la evaluación usan un puente Python, conservando la implementación de referencia y la activación explícita de escritura.",
      "La federación de proyectos permite búsqueda entre almacenes registrados, detección de contradicciones y seguimiento de políticas.",
      "Sirve afirmaciones y decisiones a agentes mediante MCP; 218 pruebas",
    ],
    measures: [
      "Los documentos y la recuperación de embeddings locales permanecen en el almacén configurado; la extracción LLM puede usar proveedores locales/simulados u OpenAI/Anthropic configurados, por lo que el procesamiento externo depende del proveedor elegido.",
      "Las escrituras MCP están desactivadas por defecto y requieren activación explícita; la lista de lecturas permitidas y las restricciones de fuentes sin procesar se aplican tanto a Rust como a Python.",
      "Los registros de almacenes del usuario se guardan en ~/.zurvan/projects.json fuera del árbol del proyecto; la publicación y la salida de evidencias tienen límites locales de ocultación de datos independientes.",
      "Proveedor Mock LLM para desarrollo y pruebas seguros sin exponer claves API.",
      "Memoria del agente aislada por almacén; la federación entre almacenes exige registro explícito.",
    ],
  },
  gitswitch: {
    description:
      "Cliente Git multiplataforma para varias identidades, revisión de repositorios y commits asistidos por IA, con modos de generación en la nube, con modelos locales y sin conexión.",
    fullDescription:
      "GitSwitch es un cliente Git con Electron y React para desarrolladores que gestionan varias identidades y repositorios. Combina gestión SSH y de cuentas, revisión de diferencias, flujos GitHub/GitLab y generación configurable de mensajes mediante proveedores de nube, modelos locales o heurísticas sin conexión. El proceso principal gestiona las operaciones privilegiadas y las credenciales descifradas.",
    problem:
      "Quienes gestionan repositorios personales y laborales necesitan identidades Git coherentes, revisión útil de diferencias y control deliberado del código enviado a servicios de IA.",
    solution: [
      "Gestión de cuentas y SSH sobre identidades Git globales y locales del repositorio.",
      "Proveedores intercambiables Gemini, OpenAI, Anthropic y modelos locales, con modo heurístico sin conexión.",
      "Separación del renderer y las operaciones privilegiadas del proceso principal mediante un puente IPC restringido.",
      "Consentimiento explícito para IA en la nube, ocultación opcional de diferencias y validación de commits con contexto del repositorio.",
    ],
    proof: [
      "El manifiesto de paquetes fijado declara Electron ^39.2.6 y React ^19.2.1.",
      "El código activa contextIsolation y sandbox y desactiva nodeIntegration.",
      "safeStorage cifra los archivos de credenciales y rechaza almacenarlos si el cifrado no está disponible.",
      "Los proveedores implementan consentimiento para la nube, opciones locales/sin conexión y tiempo de espera de generación configurable.",
    ],
    features: [
      "Gestión de varias cuentas SSH e identidades Git.",
      "Generación de commits mediante Gemini, OpenAI, Anthropic, LLM locales o heurísticas sin conexión.",
      "Visor de diferencias consciente del repositorio y flujos de solicitudes de incorporación GitHub/GitLab.",
      "Consentimiento para IA en la nube, ocultación opcional de datos en diferencias y solicitudes acotadas.",
    ],
    measures: [
      "Secretos cifrados en reposo mediante Electron safeStorage; se rechaza el almacenamiento si el cifrado no está disponible.",
      "Renderer aislado con sandbox, aislamiento de contexto e integración Node desactivada.",
      "Límites IPC validados, límites de entrada y tiempos de espera de operaciones.",
      "Consentimiento para IA en la nube y ocultación opcional de diferencias; borrar referencias JavaScript no garantiza borrar la memoria.",
    ],
    stack: [
      "Electron 39",
      "React 19",
      "TypeScript 5.9",
      "Zustand 5",
      "Gemini / OpenAI / Anthropic / LLM locales",
      "Vitest + Playwright",
    ],
  },
  "mehr-guard": {
    description:
      "Escáner sin conexión de phishing en QR y URL en Kotlin Multiplatform: ML de ensamble más 25 heurísticas con 87% de F1 y menos de 5 ms, modo red team de 19 escenarios.",
    fullDescription:
      "Mehr Guard es un escáner sin conexión de phishing en QR y URL en Kotlin Multiplatform, con interfaces nativas o de navegador para 5 plataformas: ML de ensamble más 25 heurísticas con 87% de F1 y menos de 5 ms, con un modo red team de 19 escenarios.",
    problem:
      "Los QR son un vector frecuente de phishing, pero la mayoría de los escáneres suben datos a la nube, comprometiendo la privacidad. Los usuarios necesitan verificar URL sin filtrar su historial de navegación.",
    solution: [
      "Creé un núcleo local de análisis de URL con Kotlin Multiplatform",
      "Combiné ML de ensamble (regresión logística, gradient boosting y reglas de decisión) con 25 heurísticas",
      "Orientado a 5 plataformas (Android, iOS, JVM, JS, Wasm); el repositorio declara ~100% de lógica de detección compartida (~52% del código total)",
      "El análisis se completa en menos de 5 ms",
    ],
    proof: [
      "ML de ensamble más 25 heurísticas con 87% de F1",
      "Análisis en menos de 5 ms",
      "Modo red team de 19 escenarios",
      "./judge/verify_offline.sh ejecuta pruebas unitarias del motor compartido; no constituyen una captura independiente del tráfico de red saliente",
      "El repositorio declara ~100% de lógica de detección compartida (~52% del código total)",
    ],
    features: [
      "5 plataformas de destino (Android, iOS, JVM, JS, Wasm)",
      "Modelo de ensamble: regresión logística, gradient boosting y reglas de decisión",
      "Detección de suplantación de marcas, ataques homógrafos y redirecciones maliciosas",
      "Motor heurístico (25 heurísticas)",
      "Modo red team de 19 escenarios",
    ],
    measures: [
      "El análisis local de PhishingEngine está diseñado para no consultar URL en la nube",
      "ML y puntuación heurística en el dispositivo",
      "El análisis no requiere subir la URL escaneada",
      "Las pruebas unitarias sin conexión comprueban finalización, determinismo y tiempos; la interceptación de tráfico de red no se ha verificado de forma independiente",
    ],
  },
  "syllabus-sync": {
    description:
      "Startup de Macquarie University Incubator: una base de código Next.js/TypeScript compartida que convierte programas de asignaturas universitarias en datos estructurados. Raouf es cofundador y dirigió el backend de seguridad; 503 pruebas en 92 archivos.",
    fullDescription:
      "Syllabus-Sync es una plataforma independiente para la experiencia estudiantil creada inicialmente para estudiantes de Macquarie University, que abarca planificación académica, plazos de evaluación, orientación por el campus, notificaciones y gestión de perfiles. Raouf es cofundador de esta startup de Macquarie University Incubator y dirigió el backend de seguridad (passkeys WebAuthn, MFA con TOTP, seguridad a nivel de fila de Postgres, registro de auditoría resistente a manipulaciones) de su base de código Next.js/TypeScript compartida, que convierte programas de asignaturas universitarias en datos estructurados; 503 pruebas en 92 archivos.",
    problem:
      "Los estudiantes necesitan un lugar coherente para plazos de evaluación, planificación académica e información del campus, con seguridad de cuentas y límites claros para los datos personales.",
    solution: [
      "Cofundé la startup y dirigí el backend de seguridad (passkeys WebAuthn, MFA con TOTP, seguridad a nivel de fila de Postgres, registro de auditoría resistente a manipulaciones) de la base de código Next.js/TypeScript compartida",
      "Implementé middleware de rutas protegidas, passkeys, MFA, acceso a datos limitado al usuario y controles de auditoría",
      "Integré planificación, calendarios, orientación por el campus y notificaciones sobre conjuntos de datos académicos configurables",
      "Convierte programas de asignaturas universitarias en datos estructurados",
    ],
    proof: [
      "La aceptación de la startup en Macquarie University Incubator y el papel de cofundador constan en el currículo y perfil aportados",
      "503 pruebas en 92 archivos",
      "Desplegado con Cloudflare Workers; la disponibilidad actual de la demo no se verificó de forma independiente",
      "El código del middleware devuelve 503 si no se resuelve la autenticación de una API protegida y 401 para API protegidas sin autenticación",
      "Raouf dirigió el backend de seguridad: passkeys WebAuthn, MFA con TOTP, seguridad a nivel de fila de Postgres y registro de auditoría resistente a manipulaciones",
      "Las passkeys usan credenciales de clave pública; esto no significa que todos los flujos de autenticación compatibles prescindan de contraseñas",
    ],
    features: [
      "Planificación académica, plazos de evaluación, calendario, orientación por el campus y notificaciones",
      "Convierte programas de asignaturas universitarias en datos estructurados",
      "Herramientas estudiantiles con múltiples perfiles y conjuntos de datos académicos específicos de cada institución",
      "503 pruebas en 92 archivos",
    ],
    measures: [
      "El middleware protege las rutas de página configuradas y las API no públicas, con excepciones públicas explícitas y rechazo seguro si no se resuelve la autenticación de la API",
      "Row-Level Security de Supabase y acceso a base de datos limitado al usuario",
      "Passkeys WebAuthn/FIDO2 junto con los flujos compatibles de contraseña y MFA",
      "Validación de esquemas, controles CSRF, registro de auditoría y limitación de frecuencia por ruta",
      "Escaneo de secretos configurado en CI",
    ],
    stack: [
      "Next.js 16 + React 19",
      "TypeScript 5",
      "Supabase PostgreSQL",
      "TanStack Query + Zustand",
      "Leaflet + Google Maps",
      "Framer Motion + Radix UI",
      "Cloudflare Workers / OpenNext",
      "Upstash Redis + Sentry",
    ],
  },
  "divan-open-day": {
    title: "Divan · Jornada de puertas abiertas",
    description:
      "Experiencia poética bilingüe en inglés y persa de Hafez y Rumi, creada para un puesto de Open Day de Persian Society. Cada visitante recibe un verso validado contra las fuentes, traducción, atribución y recitación opcional. El uso sin conexión requiere una versión verificada en caché; la selección de poemas permanece en el dispositivo y los datos de conexión del alojamiento tienen un límite de privacidad separado.",
    fullDescription:
      "Divan es una experiencia bilingüe de poesía persa creada para un puesto de Open Day de Persian Society. El visitante elige Hafez o Rumi, piensa una intención sin enviarla y recibe un verso validado contra las fuentes con traducción al inglés, atribución y recitación opcional. Una versión verificada y almacenada en caché permite el uso sin conexión. La aplicación estática no tiene cuentas, formulario de intenciones, base de datos de visitantes ni endpoint de analítica; los datos de conexión limitados que procesan el proveedor de alojamiento y el perímetro de red mantienen un límite de privacidad separado.",
    problem:
      "Un puesto público de Open Day necesita una experiencia cultural rápida que funcione con Wi-Fi inestable, evite recopilar intenciones o elecciones de poemas y presente poesía persa vinculada a fuentes con atribución clara y caligrafía en texto real. Las comprobaciones técnicas de fuentes deben distinguirse de la aprobación cultural y de la evidencia manual con tecnologías de asistencia.",
    solution: [
      "Compilé exactamente 60 registros de Hafez + 60 de Rumi (120 en total), vinculados a ediciones inmutables con procedencia de las fuentes documentada y verificable por máquina",
      "Creé un service worker con comprobación de integridad para que una versión verificada y en caché siga siendo utilizable sin red",
      "La bolsa de barajado Web Crypto selecciona los versos en el dispositivo; ningún servidor registra lo que recibe cada visitante",
      "Rendericé tipografía Nastaliq en texto real y una dirección artística distinta para Hafez y Rumi inspirada en la miniatura persa, en lugar de imágenes de caligrafía aplanadas",
      "Incorporé accesibilidad desde el inicio: marcado bilingüe/RTL, aislamiento bidireccional, regiones dinámicas y compatibilidad con forced-colors y movimiento reducido",
    ],
    proof: [
      "El código no tiene formulario de visitantes, cookies de seguimiento, endpoint de analítica ni backend; sessionStorage solo guarda el estado público de versión y selección de poemas",
      "La disponibilidad sin conexión se establece mediante el estado verificado de versión y caché, sin darla por supuesta tras cada carga inicial",
      "La compilación de producción rechaza fixtures sintéticos y exige evidencia del corpus vinculada a las fuentes; el informe de julio de 2026 registra 60 Hafez + 60 Rumi",
      "Las suites Vitest configuradas cubren pruebas unitarias, de componentes, accesibilidad, uso sin conexión, compartir, rendimiento y seguridad, con e2e en Playwright Chromium; son comprobaciones técnicas, no certificación cultural ni manual de tecnologías de asistencia",
    ],
    stack: [
      "Vite",
      "React 19",
      "TypeScript estricto",
      "Service worker escrito a mano",
      "Web Crypto (colección en orden aleatorio (shuffle bag))",
      "Vitest (unidad / componente / accesibilidad a11y / sin conexión)",
      "Playwright (Chromium de extremo a extremo e2e)",
      "pnpm 10.33 · Node 22.16",
    ],
    features: [
      "Corpus bilingüe validado contra fuentes: exactamente 60 Hafez + 60 Rumi = 120 registros, vinculados a ediciones inmutables y procedencia documentada verificable por máquina",
      "La selección de versos usa una bolsa de barajado Web Crypto calculada en el dispositivo, sin intervención del servidor",
      "Diseño para uso sin conexión: un service worker escrito a mano con verificación de integridad mantiene el puesto operativo con redes inestables",
      "Dirección artística culturalmente diferenciada por poeta y tipografía Nastaliq en texto real (escritura persa real, nunca imágenes rasterizadas)",
      "Marcado bilingüe con dirección del texto, aislamiento bidireccional, regiones dinámicas y compatibilidad con forced-colors y movimiento reducido",
    ],
    measures: [
      "Sin cuentas ni envío de intenciones; las elecciones de poemas permanecen en el dispositivo, sin base de datos de la aplicación ni cookies de seguimiento",
      "Cliente estático sin backend en ejecución, base de datos de visitantes ni endpoint de analítica; los proveedores de alojamiento pueden procesar datos técnicos de conexión limitados según su configuración",
      "sessionStorage solo guarda el estado público de versión, poeta y selección de poemas; la preferencia de movimiento se guarda localmente en localStorage",
      "El compilador de producción rechaza datos sintéticos/de prueba antes del despliegue",
      "Atribución vinculada a las fuentes con verificación de derechos (MIT para el código; poesía y traducciones conservan sus propias licencias, p. ej., CC BY-SA)",
      "Origen estático tras un túnel saliente, sin puertos de aplicación publicados por el host",
    ],
  },
  "nexus-archive": {
    description:
      "Bóveda multimedia personal y seguimiento de empleo con estética ciberpunk, React, Litestar y Supabase. Recomendaciones asistidas por IA, chat persistente, cifrado Fernet configurado para notas de conclusiones y cookies de autenticación emitidas por el backend con un flujo de renovación.",
    fullDescription:
      "Nexus Archive es una bóveda multimedia personal y seguimiento de empleo con estética ciberpunk que combina frontend React, API Litestar e identidad y persistencia en Supabase. Un panel reúne libros, películas, anime, candidaturas, valoraciones, notas de conclusiones, sesiones de chat persistentes y recomendaciones asistidas por IA. Las escrituras de notas requieren una clave Fernet configurada, y los controles de cookies, duración de tokens y base de datos en producción dependen de la configuración documentada del despliegue.",
    problem:
      "Los gestores de medios fragmentan las colecciones de entretenimiento entre plataformas y pueden tener controles de seguridad débiles. Nexus Archive reúne títulos, valoraciones, notas y recomendaciones en una sola cuenta con controles de acceso a nivel de fila.",
    solution: [
      "Creé una bóveda full-stack con React 19 + API Litestar, respaldada por Supabase PostgreSQL con Row Level Security",
      "Implementé cookies HttpOnly SameSite=Strict emitidas por el backend y renovación; los tokens de acceso también se devuelven en respuestas de sesión legibles por el frontend",
      "Integré Gemini AI para recomendaciones multimedia con limitación de frecuencia compartida por usuario y alternativa local",
      "Añadí cifrado Fernet con clave obligatoria para notas de conclusiones, limpieza de entradas, delimitadores XML de contexto y enmascaramiento de PII por patrones para solicitudes al modelo",
    ],
    proof: [
      "El código de autenticación establece cookies HttpOnly SameSite=Strict e implementa rotación en la renovación; las cookies seguras y duración de tokens de producción requieren configuración",
      "Las definiciones de CI incluyen Bandit, pip-audit, npm audit y gitleaks; su presencia no demuestra una ejecución satisfactoria en HEAD",
      "Los escenarios Locust ejercitan solicitudes autenticadas al endpoint de recomendaciones; no se afirma ningún resultado medido de rendimiento",
      "Estructura de IaC en Terraform para despliegues reproducibles en Supabase + Vercel",
    ],
    features: [
      "Recomendaciones multimedia asistidas por IA mediante Gemini con degradación controlada",
      "Transcripciones persistentes de chat con IA, saneamiento por usuario y actualización de la caché de consultas",
      "Seguimiento de estados, valoraciones y reseñas de anime, películas y libros, además de candidaturas y sugerencias relacionadas con el empleo",
      "Filtrado y búsqueda inteligentes en toda la biblioteca multimedia",
    ],
    measures: [
      "Cookies de autenticación HttpOnly SameSite=Strict emitidas por el backend; las respuestas de inicio y renovación también exponen tokens de acceso a la sesión del frontend",
      "Flujo /auth/refresh mediante cookies con reintento silencioso del cliente; los tiempos de vida cortos y las cookies seguras requieren configuración del despliegue",
      "Las mitigaciones de entrada al LLM usan delimitadores XML, limpieza de cadenas y enmascaramiento de PII por patrones; no garantizan inmunidad a inyección de prompts ni eliminación completa de PII",
      "El cifrado Fernet de notas de conclusiones requiere TAKEAWAY_ENCRYPTION_KEY; las escrituras se rechazan sin la clave y el cifrado del chat depende de esa configuración",
      "CI configura Bandit, pip-audit, npm audit y escaneo de secretos; configurar comprobaciones no equivale a un resultado actual satisfactorio del workflow",
    ],
  },
  nanomatch: {
    description:
      "Motor de cruce C++20 con prioridad precio-tiempo, cuatro tipos de órdenes y libros por símbolo. El repositorio declara 9.29M operaciones mixtas de alta/cancelación por segundo en un benchmark sintético de un solo hilo en Apple M-series, compilado en Release.",
    fullDescription:
      "NanoMatch es un libro de órdenes limitadas y motor de cruce C++20 con prioridad precio-tiempo. Admite órdenes Limit, Market, IOC y FOK, libros independientes por símbolo, entrada/salida CSV y benchmarks sintéticos de rendimiento con operaciones mixtas y latencia de inserción. README declara 9.29M operaciones/s en Apple M-series en modo Release; esta auditoría no volvió a ejecutar ese resultado.",
    problem:
      "Las bolsas necesitan cruzar órdenes con latencias muy bajas. Entender el motor a nivel de sistemas requiere construirlo desde cero con restricciones reales de rendimiento.",
    solution: [
      "Implementé cruce con prioridad precio-tiempo (FIFO) para órdenes Limit, Market, IOC y FOK",
      "Implementé búsqueda por ID de orden con complejidad esperada O(1), cancelación O(log M) mediante el árbol de niveles de precio y modificación por cancelación y nueva alta",
      "Creé un asignador independiente con pool de capacidad fija y un benchmark comparativo con new/delete",
      "Añadí múltiples instrumentos con libros de órdenes independientes por símbolo",
    ],
    proof: [
      "Rendimiento declarado por el repositorio: 9.29M operaciones mixtas de alta/cancelación/s en Apple M-series, Release -O3 -march=native; 5 millones de operaciones sintéticas, semilla fija 42",
      "El benchmark de latencia de inserción informa p50/p99/p99.9 para add_order; no son medidas de latencia de cancelación",
      "El código define 137 casos de Google Test en 18 archivos de pruebas; esta auditoría no volvió a comprobar su estado de aprobación actual",
      "La configuración de CI incluye ASan, UBSan, cppcheck y clang-format para envíos a main y pull requests",
    ],
    features: [
      "Algoritmo de cruce con prioridad precio-tiempo (FIFO)",
      "4 tipos de órdenes: Limit, Market, IOC, Fill-or-Kill",
      "Búsqueda por ID de orden de complejidad esperada O(1); la cancelación también busca en un árbol de niveles de precio en O(log M), y la modificación cancela y vuelve a añadir",
      "Asignador independiente con pool de capacidad fija y benchmark de asignación separado",
    ],
    measures: [
      "AddressSanitizer y UndefinedBehaviorSanitizer en CI",
      "137 casos de Google Test declarados en 18 archivos fuente de pruebas",
      "Trabajo de análisis estático cppcheck configurado para envíos a main y pull requests",
      "Sin dependencias externas en tiempo de ejecución",
    ],
  },
  sentinelflow: {
    description:
      "Sistema de detección de intrusiones de red C++17 con captura libpcap, siete analizadores de protocolos, reglas inspiradas en Snort y heurísticas con estado para escaneos, inundaciones SYN y túneles DNS. Procesa 500,000+ paquetes/s en un benchmark sintético de un solo hilo.",
    fullDescription:
      "SentinelFlow es un sistema de detección de intrusiones de red en tiempo real que captura tráfico en vivo o procesa archivos pcap, analiza cabeceras en varias capas OSI, identifica firmas de ataque y anomalías, y exporta alertas a consola y CSV.",
    problem:
      "Comprender la detección de intrusiones de red exige seguir por separado la captura de paquetes, el análisis de protocolos, las comprobaciones de firmas y las heurísticas con estado, ya que tienen costes de rendimiento distintos.",
    solution: [
      "Implementé análisis por capas de Ethernet, IPv4, TCP, UDP, ICMP, DNS y ARP",
      "Creé un motor de reglas configurable inspirado en Snort para coincidencias flexibles de firmas",
      "Añadí detección de amenazas con estado para escaneos de puertos, inundaciones SYN y túneles DNS",
      "Añadí un microbenchmark de un solo hilo del analizador sobre 5 millones de paquetes sintéticos Ethernet/IPv4/TCP SYN-ACK repetidos; excluye captura, detección y alertas",
    ],
    proof: [
      "500,000+ paquetes/s en un benchmark sintético de un solo hilo",
      "Cobertura: 7 protocolos en las capas 2-7",
      "El código define 27 casos de Google Test en 10 archivos; el registro de cambios de marzo de 2026 declara un resultado histórico de 27/27",
      "Admite captura en vivo y análisis de archivos pcap",
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
      "Alertas con gravedad codificada por colores (LOW → CRITICAL)",
      "27 casos de Google Test declarados en 10 archivos de pruebas de analizadores, detectores, reglas e integración",
      "Exportación CSV para análisis forense e integración SIEM",
      "Filtros BPF configurables para captura dirigida",
    ],
  },
  ecrsm: {
    title: "Monitor de seguridad de ejecución en la nube con eBPF",
    description:
      "Prototipo educativo de seguridad en ejecución con código eBPF de tracepoints de solo lectura, heurísticas de metadatos en Go, panel React alimentado por SSE y plantillas de despliegue en Kubernetes.",
    fullDescription:
      "ECRSM es un prototipo educativo de seguridad en ejecución con programas eBPF de tracepoints de syscalls, lector de perf-buffer y reglas de metadatos en Go, panel React que consume SSE y plantillas Helm de despliegue. Muestra los componentes de la visibilidad a nivel del kernel. Esta auditoría de fuentes no validó la captura de eventos de extremo a extremo, precisión de detección, sobrecarga ni despliegue en Kubernetes.",
    problem:
      "La monitorización en ejecución a nivel del kernel es difícil de estudiar. ECRSM ofrece una referencia educativa para recopilar metadatos de syscalls, generar alertas heurísticas y presentarlas en un panel en laboratorios aislados.",
    solution: [
      "Escribí programas eBPF de tracepoints de solo lectura para cinco tipos de eventos de syscalls",
      "Creé un lector de perf-buffer en Go, búsqueda de ID de contenedor, indicios de pod basados en el entorno y heurísticas de metadatos",
      "Creé un panel React respaldado por un endpoint de alertas Server-Sent Events",
      "Añadí scripts locales de simulación y recursos Helm para uso educativo en laboratorio",
    ],
    proof: [
      "El código define heurísticas para conexiones de shells, primitivas de inyección y rutas de ejecución sospechosas; aquí no se midió la precisión de detección",
      "Existe código de transporte por perf-buffer; esta auditoría no midió su sobrecarga de ejecución",
      "Los ID de contenedores se extraen de cgroups en /proc; las etiquetas de pod son indicios del entorno del agente, no atribución Kubernetes verificada por proceso",
      "Incluye scripts locales sintéticos, pero esta auditoría no realizó una ejecución de detección de extremo a extremo",
    ],
    stack: ["eBPF (C)", "Go (agente)", "React (panel)", "Kubernetes (Helm)"],
    features: [
      "Programas eBPF de tracepoints para execve, connect, ptrace, memfd_create y mmap ejecutable",
      "Enriquecimiento de metadatos en Go y heurísticas educativas para reverse shells, primitivas de inyección y ejecuciones sospechosas",
      "Panel React que consume Server-Sent Events en /events",
      "Plantillas Helm DaemonSet y del panel para despliegues en laboratorios aislados",
    ],
    measures: [
      "Recopilación eBPF de solo lectura de metadatos de procesos y red",
      "La sonda no captura el contenido de los paquetes; los nombres de procesos y archivos aún pueden contener metadatos sensibles",
      "La plantilla de despliegue usa modo privilegiado, hostPID y capacidades BPF/SYS_ADMIN/SYS_PTRACE; está destinada a laboratorios aislados",
      "Incluye scripts de simulación locales para entornos educativos aislados; esta auditoría no los ejecutó",
    ],
  },
  simurghforge: {
    description:
      "Conversor de archivos local para macOS creado con Tauri v2, Rust y React 19. Nueve adaptadores de motor cubren imágenes, documentos, audio, vídeo y datos estructurados; las conversiones respaldadas por CLI requieren herramientas instaladas.",
    fullDescription:
      "SimurghForge es un conversor local para macOS creado con Tauri v2, backend Rust y React 19/TypeScript. Enruta pares de archivos compatibles a través de cuatro motores Rust nativos y cinco adaptadores CLI. La conversión por lotes usa concurrencia acotada y progreso por archivo. Las funciones FFmpeg, LibreOffice, Pandoc, ImageMagick y Python/Pandas requieren las herramientas locales correspondientes. Esta auditoría de fuentes no probó la cobertura de pares de formatos ni la ejecución del paquete macOS.",
    problem:
      "Convertir archivos suele exigir subir documentos sensibles a la nube, usar varias herramientas o instalar aplicaciones Electron pesadas. Hace falta una herramienta única, rápida y privada que procese formatos habituales localmente.",
    solution: [
      "Creé dos niveles de motores: cuatro motores Rust nativos y cinco adaptadores CLI, incluido Python/Pandas",
      "Implementé detección por cabecera con alternativa por extensión y enrutamiento del motor por par de formatos",
      "Diseñé orquestación por lotes con control de concurrencia mediante semáforo Tokio",
      "Configuré un objetivo macOS .app y etiquetas de ajustes Low/Medium/High/Lossless; las dependencias CLI siguen siendo independientes",
    ],
    proof: [
      "El código cubre cinco categorías de archivos; el total anunciado de 49 formatos no está conciliado con el registro actual de 44 claves de entrada de la interfaz",
      "Se definen nueve variantes de motor, con enrutamiento según tipo de entrada detectado y formato de salida solicitado",
      "El backend limita a 50 archivos y 1–8 trabajos de conversión concurrentes mediante semáforo Tokio",
      "La conversión usa motores locales y no requiere API de nube; no se realizó una prueba de tráfico de red saliente",
    ],
    features: [
      "9 motores de conversión: 4 nativos Rust + 5 conectados mediante CLI (FFmpeg, LibreOffice, Pandoc, Pandas, ImageMagick)",
      "Conversiones compatibles entre imágenes, documentos, audio, vídeo y datos estructurados, según el motor y las herramientas instaladas",
      "Conversión por lotes de hasta 50 archivos con concurrencia configurable (semáforo Tokio)",
      "Detección por cabecera de archivo con alternativa por extensión, seguida de enrutamiento de entrada/salida al motor",
    ],
    measures: [
      "La conversión se ejecuta localmente sin API de nube ni cuenta de subida obligatorias",
      "Las firmas de archivo conocidas orientan el enrutamiento; permanece una alternativa por extensión que no impide toda suplantación de formato",
      "Rutas de entrada canonicalizadas, comprobaciones de componentes del directorio padre, límites de tamaño, validación de extensión de salida y argumentos estructurados para subprocesos",
      "Objetivo de compilación macOS .app; los formatos respaldados por CLI dependen de herramientas de conversión instaladas por separado",
    ],
    stack: [
      "Tauri v2 (Rust 1.77+)",
      "React 19.2.4",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "FFmpeg",
      "LibreOffice",
      "Pandoc",
      "Python Pandas",
      "ImageMagick",
    ],
  },
  aion: {
    description:
      "Preguntas y respuestas bíblicas con reconocimiento de referencias, búsqueda directa de versículos/capítulos, recuperación semántica con palabras clave + pgvector y streaming en tiempo real de Gemini 3.1 Flash Lite. Aplicación móvil React Native/Expo y envoltorio de escritorio Tauri v2.",
    fullDescription:
      "Aion es un acompañante bíblico con recuperación que reconoce referencias: consulta directa de versículos/capítulos, filtrado por palabras clave y búsqueda semántica pgvector aportan contexto, y Gemini 3.1 Flash Lite transmite las respuestas mediante Supabase Edge Functions. Incluye tarjetas de versículos con atribución, cliente móvil React Native/Expo y envoltorio de escritorio Tauri v2. Su benchmark de 40 preguntas puntúa la calidad de recuperación, el respaldo de citas y la robustez ante premisas falsas: R@5 de 0.941, respaldo medio de citas de 0.978, cero citas sin respaldo y 6/6 rechazos de premisas falsas. La voz nativa opcional tiene una limitación separada de credenciales del cliente.",
    problem:
      "Las herramientas de estudio bíblico buscan solo palabras clave y pierden el sentido, o usan chatbots que inventan versículos. Hace falta conversación basada en las Escrituras con citas verificables.",
    solution: [
      "Creé recuperación con reconocimiento de referencias combinando consulta directa de versículos/capítulos, filtrado por palabras clave, embeddings OpenAI de 1536 dimensiones y ordenación (ranking) semántica pgvector",
      "Implementé streaming SSE en tiempo real desde Gemini mediante Supabase Edge Functions",
      "Diseñé tarjetas enriquecidas de versículos en línea con atribución completa de libro/capítulo/versículo para su verificación",
      "Añadí soporte multiplataforma: React Native para móvil + Tauri v2 para escritorio nativo",
    ],
    proof: [
      "Construí y puntué un benchmark de 40 preguntas sobre calidad de recuperación, respaldo de citas y robustez ante premisas falsas: R@5 de 0.941, respaldo medio de citas de 0.978, cero citas sin respaldo y 6/6 rechazos de premisas falsas",
      "Limitación por IP (ráfaga de 5/min, 30/3 h, 200/día) con denegación por defecto",
      "La caché de respuestas por coincidencia exacta evita llamadas LLM repetidas para consultas idénticas",
      "Autenticación anónima sin registro; Supabase RLS se aplica a todas las tablas",
    ],
    features: [
      "Recuperación con reconocimiento de referencias: consulta directa de versículos/capítulos, extracción de palabras clave con regex, embeddings OpenAI de 1536 dimensiones y búsqueda semántica pgvector",
      "Streaming SSE en tiempo real desde Gemini mediante Supabase Edge Functions",
      "Tarjetas enriquecidas de versículos en línea con atribución de libro/capítulo/versículo",
      "Multiplataforma: React Native (iOS/Android) + Tauri v2 (macOS/Windows/Linux)",
    ],
    measures: [
      "Las credenciales de chat y embeddings (OpenAI, Gemini y service_role) usan secretos de Edge Functions. La voz nativa opcional requiere, en cambio, una credencial OpenAI aportada por el cliente para llamadas directas a Whisper y queda fuera de ese límite de aislamiento del servidor",
      "Limitación por IP: ráfaga de 5/min, 30/3hrs por IP y máximo global de 200/day",
      "Row-Level Security (RLS) en todas las tablas Supabase",
      "Límite de 500 caracteres por mensaje para evitar relleno de tokens",
      "Caché de respuestas por coincidencia exacta (sin nueva llamada LLM para una consulta repetida idéntica)",
      "Rechazo seguro: los errores de limitación de frecuencia deniegan por defecto",
    ],
    papers: [
      {
        label: "Prepublicación",
        status: "Prepublicación de benchmark piloto",
        description:
          "Prepublicación de 8 páginas: construí y puntué un benchmark de 40 preguntas sobre calidad de recuperación, respaldo de citas y robustez ante premisas falsas: R@5 de 0.941, respaldo medio de citas de 0.978, cero citas sin respaldo y 6/6 rechazos de premisas falsas.",
      },
    ],
    stack: [
      "React Native 0.81",
      "Expo 54",
      "TypeScript",
      "Supabase PostgreSQL",
      "pgvector",
      "OpenAI Embeddings",
      "Gemini 3.1 Flash Lite",
      "Tauri v2",
      "TanStack Query v5",
      "React Native StyleSheet",
    ],
  },
} satisfies ProjectTranslations;
