# Proyecto 1: La Suspensión de un Vehículo (Modelo Cuarto de Carro)
**Ecuaciones Diferenciales Ordinarias — Unidad 3 (Ecuaciones Diferenciales Lineales de Orden Superior)**  
**Institución Universitaria Colegio Mayor del Cauca (Unimayor)**  
**Facultad de Ingeniería — Programa de Ingeniería Informática**  
**Popayán, Colombia — Semestre Académico 2026**

---

## Integrantes del Proyecto (Grupo 5)

| Nombre Completo | Rol en Sustentación Oral | Módulo Principal |
| :--- | :--- | :--- |
| **CRUZ ANACONA ANGELA GABRIELA** | Ponente 1: Planteamiento Físico y Parámetros | Formulación EDO, Frecuencia Natural $\omega_n$, Amortiguamiento Crítico $c_{cr}$ |
| **GOMEZ HOYOS DUBAN ALEXANDER** | Ponente 2: Deducción Analítica a Mano | Ecuación Característica, Discriminante $\Delta$, Soluciones Exactas Casos 1, 2 y 3 |
| **TORRES ANGULO JOSE ALDAIR** | Ponente 3: Implementación Numérica RK4 | Reducción a Sistema de 1° Orden, Integrador RK4 ($h=10^{-4}\text{ s}$), Error Residual |
| **VELASCO BURBANO RUBEN DARIO** | Ponente 4: Métricas de Ingeniería y Cierre | Tiempo de Asentamiento $t_s$, Sobreimpulso $M_p$, Veredicto Ambulancia vs. Carreras |

---

## 1. Declaración de Uso de Asistentes de IA (Requisito Oficial Pág. 10)
En cumplimiento estricto con las directrices de la guía docente de la Unidad 3:
* **Herramienta utilizada:** Antigravity AI (Google DeepMind).
* **Alcance de la asistencia:** Apoyo en el andamiaje del diseño de interfaz reactiva *Liquid Glass*, generación del pipeline de shaders PBR en Three.js, estructuración de las flashcards de sustentación oral con tipografía KaTeX y generación del grafo de conocimiento arquitectónico con **Graphify** bajo la filosofía **Ponytail Ultra**.
* **Dominio Conceptual:** El código de integración numérica Runge-Kutta 4to orden (RK4) y las decisiones de diseño físico vehicular fueron verificados, asimilados y defendidos con solvencia técnica por los integrantes del Grupo 5.

---

## 2. Fundamentos Físicos y Formulación Matemática

El sistema analiza la dinámica vertical de una rueda y el 25% de la carrocería de un automóvil (modelo de **cuarto de carro** o *quarter-car model*) tras superar instantáneamente un bache de $5\text{ cm}$ ($x_0 = 0.05\text{ m}$):

```
         [ Masa suspendida m = 300 kg ]   <--- Carrocería (25% del vehículo)
               |               |
         [ Resorte k ]   [ Amortiguador c ]
               |               |
       ═════════════════════════════════  <--- Bache inicial x(0) = 0.05 m
```

### Ecuación Diferencial Canónica
Aplicando la Segunda Ley de Newton ($\sum F = m a$):
$$m x''(t) = -k x(t) - c x'(t)$$

Reordenando a su forma canónica lineal homogénea de segundo orden con coeficientes constantes:
$$m x''(t) + c x'(t) + k x(t) = 0 \iff x''(t) + \frac{c}{300}x'(t) + 100 x(t) = 0$$

### Parámetros Maestros del Sistema
* **Masa suspendida:** $m = 300.0\text{ kg}$
* **Rigidez del resorte elástico:** $k = 30\,000.0\text{ N/m}$
* **Desplazamiento inicial por bache:** $x(0) = 0.05\text{ m} = 5\text{ cm}$
* **Velocidad inicial en reposo:** $x'(0) = 0.0\text{ m/s}$
* **Frecuencia natural no amortiguada:**
  $$\omega_n = \sqrt{\frac{k}{m}} = \sqrt{\frac{30\,000}{300}} = \sqrt{100} = 10.0\text{ rad/s} \quad (\approx 1.59\text{ Hz})$$
* **Coeficiente de amortiguamiento crítico:**
  $$c_{cr} = 2\sqrt{m k} = 2\sqrt{300 \times 30\,000} = 2\sqrt{9\,000\,000} = 6000.0\text{ N}\cdot\text{s/m}$$
* **Factor de amortiguamiento adimensional:** $\zeta = \frac{c}{c_{cr}} = \frac{c}{6000}$

---

## 3. Deducción Analítica Exacta vs. Integración Numérica RK4

Asumiendo una solución exponencial $x(t) = e^{r t}$, se obtiene la **ecuación auxiliar o característica**:
$$r^2 + \frac{c}{300}r + 100 = 0$$

El comportamiento dinámico queda gobernado estrictamente por el discriminante:
$$\Delta = \left(\frac{c}{300}\right)^2 - 400$$

### Caso 1: Régimen Subamortiguado ($c = 1800\text{ N}\cdot\text{s/m}$, $\zeta = 0.3$)
* **Discriminante:** $\Delta = 36 - 400 = -364 < 0$
* **Raíces complejas conjugadas:** $r_{1,2} = -3 \pm i\sqrt{91}$
* **Frecuencia angular amortiguada:** $\omega_d = \sqrt{\omega_n^2 - \alpha^2} = \sqrt{100 - 9} = \sqrt{91} \approx 9.5394\text{ rad/s}$
* **Solución analítica exacta:**
  $$x_{\text{sub}}(t) = e^{-3t}\left[0.05\cos(\sqrt{91}t) + \frac{0.15}{\sqrt{91}}\sin(\sqrt{91}t)\right]$$

### Caso 2: Régimen Críticamente Amortiguado ($c = 6000\text{ N}\cdot\text{s/m}$, $\zeta = 1.0$)
* **Discriminante:** $\Delta = 400 - 400 = 0$
* **Raíz real doble repetida:** $r_1 = r_2 = -10.0\text{ s}^{-1}$
* **Reducción de orden de d'Alembert:** Produce el término lineal $t \cdot e^{-10t}$.
* **Solución analítica exacta:**
  $$x_{\text{crit}}(t) = (0.05 + 0.5t)e^{-10t}$$

### Caso 3: Régimen Sobreamortiguado ($c = 9000\text{ N}\cdot\text{s/m}$, $\zeta = 1.5$)
* **Discriminante:** $\Delta = 900 - 400 = 500 > 0$
* **Raíces reales negativas distintas:**
  $$r_1 = -15 + 5\sqrt{5} \approx -3.8197\text{ s}^{-1} \quad (\text{modo lento dominante})$$
  $$r_2 = -15 - 5\sqrt{5} \approx -26.1803\text{ s}^{-1} \quad (\text{modo rápido disipativo})$$
* **Solución analítica exacta:**
  $$x_{\text{sobre}}(t) = 0.05854\,e^{-3.8197t} - 0.00854\,e^{-26.1803t}$$

---

### Integrador Numérico Runge-Kutta de 4to Orden (RK4)
Para resolver computacionalmente la ecuación de 2° orden sin paquetes de caja negra, se descompone en un sistema acoplado de dos variables de estado ($u = x$ posición, $v = x'$ velocidad):
$$\begin{cases} 
\dfrac{du}{dt} = v \\ 
\dfrac{dv}{dt} = \dfrac{-c v - k u}{m} 
\end{cases}$$

Con paso temporal fijo $h = 10^{-4}\text{ s}$ ($0.1\text{ ms}$), se calculan las cuatro pendientes vectoriales $k_1, k_2, k_3, k_4$:
$$k_1 = f(t_n, y_n), \quad k_2 = f\left(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_1\right), \quad k_3 = f\left(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_2\right), \quad k_4 = f(t_n + h, y_n + h k_3)$$
$$y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

* **Validación de Precisión Numérica:**
  $$\max_{t \in [0, 3]} |x_{\text{numérico}}(t) - x_{\text{exacto}}(t)| < 2.5 \times 10^{-8}\text{ m}$$
  La superposición gráfica alcanza una convergencia superior al **$99.9999\%$**, validando plenamente la teoría matemática mediante la simulación computacional.

---

## 4. Resultados Cuantitativos y Decisión de Ingeniería

| Régimen Físico | Coeficiente $c$ | Factor $\zeta$ | Tiempo de Asentamiento $t_s$ ($|x| \le 1\text{ mm}$) | Sobreimpulso ($M_p$) | Pico Opuesto ($x_{\min}$) | Verificación Guía Docente |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Subamortiguado** | $1800\text{ N}\cdot\text{s/m}$ | $0.30$ | **$1.12\text{ s}$** | **$37.23\%$** | $-1.86\text{ cm}$ | Récord de ~1.1 s, 4 rebotes |
| **Crítico** | $6000\text{ N}\cdot\text{s/m}$ | $1.00$ | **$0.58\text{ s}$** | **$0.00\%$** | $0.00\text{ cm}$ | El retorno más veloz sin oscilar |
| **Sobreamortiguado** | $9000\text{ N}\cdot\text{s/m}$ | $1.50$ | **$1.07\text{ s}$** | **$0.00\%$** | $0.00\text{ cm}$ | Cero rebote, disipación lenta |

### Conclusión y Veredicto de Ingeniería
1. **¿Qué suspensión instalar a una Ambulancia?**
   * **Veredicto:** **Amortiguamiento Crítico ($c = 6000\text{ N}\cdot\text{s/m}$, $\zeta = 1.0$)** o levemente subamortiguado alto ($\zeta = 0.8$).
   * **Fundamento cuantitativo:** El sobreimpulso es estrictamente del **$0.00\%$** y el tiempo de asentamiento es el mínimo posible en la física (**$0.58\text{ segundos}$**). Un paciente con trauma craneoencefálico, fractura vertebral o durante una punción intravenosa no puede tolerar los 4 rebotes y la inversión de fuerza del $37\%$ del caso subamortiguado, ni el retraso en la estabilización del caso sobreamortiguado.
2. **¿Qué suspensión instalar a un Carro de Carreras (Koenigsegg Jesko)?**
   * **Veredicto:** **Suspensión Rígida de Alta Tasa ($k \gg 30\text{ kN/m}$, $c \gg 6000\text{ N}\cdot\text{s/m}$)**.
   * **Fundamento cuantitativo:** En competición automotriz no se busca confort para pasajeros, sino mantener la huella de contacto del neumático (*contact patch*) permanentemente adherida al asfalto y conservar el ángulo de ataque del difusor aerodinámico y efecto suelo en curvas a alta velocidad sin balanceos de carrocería (*roll*) ni cabeceos (*pitch*).

---

## 5. Arquitectura Gráfica 3D Procedural (Three.js / WebGL)

A diferencia de proyectos tradicionales que importan archivos `.gltf` o `.obj` de 40 a 80 MB (mallas estáticas que bloquean la carga web), todo el entorno 3D fue construido **100% de manera procedural en código matemático JavaScript con Three.js (WebGL 2.0)** con un peso total inferior a **80 KB**:

```
                              [ Three.js WebGL Engine ]
                                         │
     ┌───────────────────────────────────┼──────────────────────────────────┐
     ▼                                   ▼                                  ▼
[ Koenigsegg Jesko ]            [ Ambulancia Tipo III ]             [ Entorno Carretera ]
• Splines Catmull-Rom           • Box-Lofting paramétrico          • Desplazamiento UV asfalto
• Lofting buildGridMesh         • Bahía médica interior            • Reciclaje Object Pooling
• Puertas Diedrales (35°)       • Monitor ECG con pulso animado    • Postes, árboles y guardarraíl
• Laca Supercar Red PBR         • Camilla y cilindros de O2        • Softboxes de estudio HDRI
• Rines Y-spoke + Lathe Tires   • Ballestas traseras multilámina   • Tone Mapping ACES Filmic
```

### Características Técnicas del Modelado 3D
* **Superficies Paramétricas y Splines:** La carrocería del Jesko se generó mediante curvas de Catmull-Rom transversales y longitudinales evaluadas con `buildGridMesh`, garantizando continuidad de curvatura $G^2$ para reflejos continuos sin faceteado.
* **Cinemática de Puertas Diedrales (*Synchro-Helix*):** Sistema de bisagra rotacional que se abre y eleva a **35°** con cinemática exterior para evitar colisiones con el faldón lateral.
* **Coilovers Concéntricos Öhlins Racing:** Ensamble unificado compuesto por cuerpo roscado de amortiguador, vástago cromado telescópico que se desliza por su centro y resorte helicoidal paramétrico (`createCoilSpringGeo`) que se comprime y expande en tiempo real en función de la posición física $x(t)$ de la EDO a 60 FPS:
  $$\mathbf{r}(s) = \begin{pmatrix} R\cos(2\pi N s) \\ [L_0 - x(t)] s \\ R\sin(2\pi N s) \end{pmatrix}$$
* **Geometría de Rodadura Escalonada:** Neumáticos modelados con `THREE.LatheGeometry` rotando un perfil 2D en torno al eje axial, y rines de 5 radios en estrella modelados con `THREE.ExtrudeGeometry` y discos cerámicos perforados proceduralmente. Despeje de capó aumentado (+4.5 cm) para evitar clipping durante compresión máxima de suspensión.
* **Pipeline de Renderizado Fotorrealista PBR (Physically Based Rendering):**
  * Materiales `THREE.MeshPhysicalMaterial` con microfacetas de Cook-Torrance.
  * Capa de laca automotriz transparente: `clearcoat: 1.0` y `clearcoatRoughness: 0.10` sobre pintura Rojo Supercar (`0xd91428`).
  * Iluminación de estudio en canvas equirrectangular HDRI dinámico (simulación de softboxes).
  * Mapeo tonal cinematográfico de la Academia: `THREE.ACESFilmicToneMapping`.
  * Sombras suaves de alta resolución con filtrado porcentual: `THREE.PCFSoftShadowMap` ($2048 \times 2048$).
* **Carretera Infinita con Cero Fugas de Memoria:**
  * El asfalto permanece estático y desplaza continuamente sus coordenadas UV (`asphaltTex.offset.y -= dz * factor`).
  * Postes de iluminación y vegetación implementan un patrón de **Object Pooling**: cuando superan $z < -100\text{ m}$, se trasladan instantáneamente a $z = +120\text{ m}$ sin destruir ni crear mallas en la GPU.

---

## 6. Plataforma Web Interactiva (React 19 + Vite)

La interfaz de usuario implementa un diseño de alta gama tipo *Apple Liquid Glass* con componentes desacoplados:
1. **Laboratorio Interactivo de Simulación (`App.jsx` + `SuspensionCalculator.jsx`):** Controles deslizantes para $m$, $c$, $k$, $x_0$, $v_0$ con badges reactivos de régimen físico, selector rápido de coeficientes ($0.3 c_{cr}$, $1.0 c_{cr}$, $1.5 c_{cr}$) y presets preconfigurados (Ambulancia, Jesko Pista, Sedán Familiar).
2. **Vista Técnica 3D (`Vehicle3DScene.jsx`):** Ventana de inspección 3D a pantalla completa, presets de cámara cinematográfica (Frontal, Lateral, Isométrica, POV Conductor, Vista Macro de Suspensión), modo Rayos X (carrocería translúcida para ver los coilovers), switch de apertura de puertas y pulsador manual de bache.
3. **Gráfica Dinámica de Fase y Tiempo (`SimulationChart.jsx`):** Curva analítica continua vs. puntos de integración numérica RK4 mediante Chart.js, delimitando la banda de tolerancia al 2% ($\pm 1\text{ mm}$) del tiempo de asentamiento.
4. **Deducción Matemática a Mano (`MathDeductionView.jsx`):** Desarrollo paso a paso de los 3 casos analíticos con fórmulas en KaTeX de alto contraste y guías de escritura en tablero.
5. **Comparativa con el Cuaderno de Clase (`ClassComparisonView.jsx`):** Alineación punto por punto con los apuntes y ejercicios de clase dictados por la docente.
6. **Validación Cruzada de Código (`CodeCalculationModal.jsx`):** Comparación simultánea entre el script oficial de Python (NumPy) y el motor numérico en JavaScript (Float64Array).
7. **Flashcards de Defensa Académica 5.0 (`FlashcardsModal.jsx`):**
   * 5 pestañas individuales organizadas por expositor (Angela Cruz, Duban Gómez, José Torres, Rubén Velasco y Arquitectura 3D).
   * Guion verbal recomendado, fórmulas matemáticas con pronunciación y guía de tablero, líneas de código asociadas y preguntas trampa con respuesta modelo.
   * **Exportación a PDF Editorial:** Maquetación de impresión profesional (`PrintableFlashcard`) con reglas CSS avanzadas de medios paginados (`break-inside: avoid !important;`, `print-avoid-break` y `print-page-break`). Garantiza **cero repetición de páginas, cero cortes de fórmulas o texto** y descarga individual por expositor o dossier completo de 5 fichas.
8. **Deck de Presentación (`PresentationDeck.jsx`):** 9 diapositivas diseñadas cronológicamente para la defensa oral de 15 minutos.

---

## 7. Base de Conocimiento y Gobernanza de Código (Graphify & Ponytail Ultra)

El proyecto cuenta con un **Grafo de Conocimiento persistente** en [`graphify-out/`](./graphify-out/) que modela la totalidad de dependencias entre módulos de cálculo y diseño:

```
[ Grafo del Proyecto: 149 Nodos | 303 Aristas | 11 Comunidades ]
                     Top 10 God Nodes (Hubs Arquitectónicos):
 1. KaTeXMath()                  - 16 aristas (Tipografía matemática KaTeX)
 2. react                        - 15 aristas (Framework frontend)
 3. App()                        - 14 aristas (Orquestador central de estado físico)
 4. lucide-react                 - 13 aristas (Sistema iconográfico)
 5. exactAnalyticalSolution()    - 10 aristas (Núcleo analítico de la EDO)
 6. SuspensionCalculator()       -  9 aristas (Control interactivo de parámetros)
 7. SimulationChart()            -  8 aristas (Visualización RK4 vs. Exacta)
 8. calculateEngineeringMetrics()-  8 aristas (Medición cuantitativa ts y Mp)
 9. calculateOscillatorProperties()-8 aristas (Propiedades físicas wn, ccr, zeta)
10. rk4Integrate()               -  8 aristas (Motor numérico Runge-Kutta 4)
```

### Protocolo de Desarrollo con Ponytail Ultra:
* **Blast Radius Check:** Antes de modificar cualquier archivo, se consulta el grafo vía CLI (`graphify query`) o herramientas MCP para identificar los consumidores dependientes y prever cualquier regresión.
* **Cero Repetición de Código:** Si una función física o geométrica ya existe (ej. `exactAnalyticalSolution` o `buildCoiloverGroup`), se reutiliza el nodo existente en lugar de duplicar lógica.
* **Sincronización Instantánea sin Costo:** Tras cualquier edición, se ejecuta `graphify update .` para actualizar el grafo vía AST local (0 costo de tokens).
* **Artefactos del Grafo:**
  * [`graphify-out/graph.html`](./graphify-out/graph.html): Explorador visual interactivo 2D/3D.
  * [`graphify-out/Poyecto_EDO_Suspencion_Vehiculo-callflow.html`](./graphify-out/Poyecto_EDO_Suspencion_Vehiculo-callflow.html): Diagramas de secuencia y tablas de llamadas Mermaid.
  * [`graphify-out/wiki/index.md`](./graphify-out/wiki/index.md): 21 artículos wiki en Markdown para consulta modular inmediata.

---

## 8. Estructura del Repositorio

```text
├── .graphifyignore                   # Filtros de exclusión para Graphify (.venv, node_modules, dist)
├── .graphifyrc                       # Configuración de consultas del grafo
├── graphify-out/                     # Grafo de conocimiento (JSON, HTML, reportes, wiki)
│   ├── graph.json                    # Estructura del grafo (149 nodos, 303 aristas)
│   ├── graph.html                    # Visor web interactivo del grafo
│   ├── GRAPH_REPORT.md               # Reporte técnico de arquitectura y comunidades
│   ├── Poyecto_EDO_Suspencion_...html# Diagramas de flujo de llamadas Mermaid
│   └── wiki/                         # 21 artículos wiki en Markdown
├── app/                              # Aplicación Web Interactiva (React 19 + Vite 6 + Tailwind 4)
│   ├── index.html                    # Punto de entrada HTML
│   ├── vite.config.js                # Configuración de compilación con base relativa
│   ├── package.json                  # Dependencias frontend (Three.js, Chart.js, KaTeX, Framer Motion)
│   ├── dist/                         # Build de producción optimizado
│   ├── public/                       # Activos estáticos y modelos autónomos
│   │   ├── suspension_sim.py         # Script Python descargable desde la web
│   │   ├── logotipo-actual.webp      # Escudo oficial Unimayor
│   │   └── models/                   # Visores 3D autónomos en WebGL puro
│   │       ├── Animacion_Carretera.html  # Simulación 3D principal de carretera y vehículos
│   │       ├── koenigsegg-jesko.html     # Showroom del Jesko con ajuste de colores
│   │       └── ambulancia-tipo-ii.html   # Showroom de la ambulancia con bahía médica
│   └── src/                          # Código fuente React
│       ├── App.jsx                   # Orquestador principal de estado y navegación
│       ├── index.css                 # Tokens CSS, temas Liquid Glass y reglas @media print
│       ├── main.jsx                  # Montaje React y estilos KaTeX
│       ├── components/               # Componentes de UI, gráficos y visualización 3D
│       │   ├── Vehicle3DScene.jsx        # Enlace postMessage con la simulación 3D
│       │   ├── SimulationChart.jsx       # Gráfica interactiva de superposición RK4 vs Analítica
│       │   ├── SuspensionCalculator.jsx  # Controles de parámetros físicos y presets
│       │   ├── SuspensionAnimation2D.jsx # Diagrama esquemático masa-resorte-amortiguador 2D
│       │   ├── FlashcardsModal.jsx       # Flashcards de defensa y exportador PDF sin cortes
│       │   ├── PresentationDeck.jsx      # Deck de 9 diapositivas para sustentación oral
│       │   ├── MathDeductionView.jsx     # Deducción analítica matemática a mano
│       │   ├── ClassComparisonView.jsx   # Comparación con el cuaderno de clase
│       │   ├── CodeCalculationModal.jsx  # Comparativa de código Python vs JS
│       │   ├── Header.jsx                # Barra superior institucional
│       │   └── KaTeXMath.jsx             # Renderizador vectorial de fórmulas KaTeX
│       ├── physics/                  # Núcleo de física y cálculo computacional
│       │   └── suspensionPhysics.js      # EDO, propiedades del oscilador, RK4 y métricas
│       └── data/                     # Datos estáticos estructurados
│           ├── flashcardsData.js         # Contenido de las 5 flashcards y 9 diapositivas
│           └── slidesCodeData.js         # Snippets de código para la presentación
├── python/                           # Simulación Científica Standalone en Python
│   └── suspension_sim.py             # Script oficial de EDO con NumPy y Matplotlib
├── referencia/                       # Documentación de soporte y enunciados
│   └── Proyectos_EDO_U3.pdf          # Guía docente oficial de la Unidad 3
├── requirements.txt                  # Dependencias de Python (numpy, matplotlib)
└── README.md                         # Documentación técnica integral del proyecto
```

---

## 9. Instrucciones de Instalación y Ejecución

### Opción A: Aplicación Web Interactiva (`app/`)
Requiere **Node.js 18+** o **Node.js 20+**:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/Poyecto_EDO_Suspencion_Vehiculo.git
cd Poyecto_EDO_Suspencion_Vehiculo/app

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
```
> Abrir en el navegador la URL local indicada (habitualmente `http://localhost:5173`).

#### Compilar para Producción (Deploy Estático / GitHub Pages):
```bash
npm run build
```
La carpeta `app/dist/` contiene los archivos minificados con rutas relativas listos para ser servidos desde cualquier servidor web estático o GitHub Pages.

---

### Opción B: Simulación Científica en Python (`python/suspension_sim.py`)
Requiere **Python 3.10+**:

```bash
# 1. Situarse en la raíz del proyecto
cd Poyecto_EDO_Suspencion_Vehiculo

# 2. Crear y activar entorno virtual
python -m venv .venv

# En Windows (PowerShell):
.\.venv\Scripts\activate

# En Linux/macOS:
source .venv/bin/activate

# 3. Instalar dependencias científicas
pip install -r requirements.txt

# 4. Ejecutar la simulación
python python/suspension_sim.py
```
> El script imprime en consola las tablas de convergencia numérica, los tiempos de asentamiento y abre la ventana interactiva de Matplotlib con la superposición gráfica de los 3 casos.

---

### Opción C: Visores 3D Autónomos en WebGL Puro
Los modelos 3D pueden ejecutarse de manera completamente independiente sin necesidad de compilar React ni instalar Node.js:
1. Abrir directamente en cualquier navegador moderno:
   * `app/public/models/Animacion_Carretera.html` (Simulación interactiva de carretera, baches, Jesko y Ambulancia).
   * `app/public/models/koenigsegg-jesko.html` (Showroom de estudio con personalizador de colores y apertura de puertas).
   * `app/public/models/ambulancia-tipo-ii.html` (Showroom de ambulancia y equipamiento médico).
2. O levantando un servidor local estático simple:
   ```bash
   npx serve app/public/models
   # o con Python:
   python -m http.server 8000 --directory app/public/models
   ```

---

### Opción D: Consultas en el Grafo de Conocimiento (Graphify CLI)
Si tienes instalado el CLI global de `graphify`:

```bash
# Consultar los nodos más conectados del proyecto
graphify god-nodes

# Consultar relaciones de impacto entre componentes
graphify query "cómo se comunican los cálculos de suspensión con la escena 3D"

# Trazar el camino de dependencias entre dos módulos
graphify path "exactAnalyticalSolution" "Vehicle3DScene" --undirected

# Explicar un componente específico y sus conexiones
graphify explain "Vehicle3DScene"

# Sincronizar el grafo tras realizar cambios en el código
graphify update .
```

---

## 10. Conclusiones y Cumplimiento de Criterios de Evaluación

1. **Rigor Matemático Estricto (Rúbrica: 1.0):** Se demostró la deducción analítica paso a paso a partir de la Segunda Ley de Newton, deduciendo con precisión las raíces del discriminante para los regímenes subamortiguado, críticamente amortiguado y sobreamortiguado.
2. **Validación Numérica (Rúbrica: 0.5):** La implementación manual de Runge-Kutta 4 (RK4) en JavaScript y Python valida la teoría con un error residual máximo inferior a $2.5 \times 10^{-8}\text{ m}$.
3. **Decisión de Ingeniería Fundamentada (Rúbrica: 1.0):** Se justificó con métricas cuantitativas reales ($t_s = 0.58\text{ s}$, $M_p = 0.00\%$) la selección de amortiguamiento crítico para la ambulancia y suspensión hiper-rígida para el vehículo de carreras.
4. **Innovación Tecnológica y Fotorrealismo 3D:** Se superó la expectativa tradicional mediante una arquitectura gráfica procedural Three.js sin peso (< 80 KB), coilovers concéntricos animados en tiempo real por la EDO y renderizado PBR con ACES Filmic.
5. **Preparación Académica Impecable:** Flashcards con guiones verbales, guías para el tablero, pronunciación fonética y exportador PDF con maquetación editorial sin cortes.
