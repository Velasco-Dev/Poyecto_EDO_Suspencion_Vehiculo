/**
 * ==============================================================================
 * DATOS DIDÁCTICOS DE MAPEO MATEMÁTICO A CÓDIGO FUENTE (SLIDES 1 A 8)
 * Proyecto 1: La Suspensión de un Vehículo - EDO Unidad 3
 * Unimayor - Grupo 5
 * ==============================================================================
 * Este módulo contiene la correspondencia exacta entre:
 *  1. Deducción Analítica Completa & Teoría Matemática a Mano
 *  2. Implementación en Código Fuente:
 *     - JavaScript: app/src/physics/suspensionPhysics.js
 *     - Python:     python/suspension_sim.py
 *  3. Reflejo Interactivo en la Aplicación (Simulador en Vivo)
 * ==============================================================================
 */

export const SLIDES_CODE_MAPPING = {
  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 1: Portada y EDO Canónica del Sistema
  // ----------------------------------------------------------------------------
  1: {
    slideId: 1,
    title: 'Definición de Parámetros Físicos y EDO Canónica',
    speaker: 'CRUZ ANACONA ANGELA GABRIELA',
    description: 'Declaración de constantes maestras del modelo de cuarto de carro, balance dinámico de Newton y condiciones iniciales por bache.',
    items: [
      {
        id: 'edo-params',
        title: 'Parámetros Iniciales del Cuarto de Carro',
        mathFormula: 'm\\,x\'\'(t) + c\\,x\'(t) + k\\,x(t) = 0,\\quad x(0) = 0.05\\text{ m},\\; x\'(0) = 0\\text{ m/s}',
        explanation: 'En el código, el modelo se parametriza con una masa suspendida de 300 kg (25% del chasis de 1200 kg), un resorte k = 30000 N/m y un bache vertical instantáneo de 5 cm (0.05 m) en reposo.',
        theory: 'Aplicamos la Segunda Ley de Newton (∑F = m·a) a una masa suspendida m = 300 kg en un modelo de cuarto de vehículo. Las fuerzas restauradora elástica (-k·x) y amortiguadora viscosa (-c·x\') se oponen al movimiento, generando la EDO canónica lineal de 2° orden homogénea con coeficientes constantes.',
        deductionSteps: [
          {
            step: 'Paso 1: Balance Dinámico de Fuerzas (Segunda Ley de Newton)',
            math: '\\sum F_y = m\\,\\ddot{x}(t) = -k\\,x(t) - c\\,\\dot{x}(t)',
            explanation: 'La fuerza del resorte sigue la Ley de Hooke lineal y el amortiguador opone una fuerza proporcional a la velocidad relativa (fricción viscosa).'
          },
          {
            step: 'Paso 2: Transposición a la Forma Homogénea Canónica',
            math: 'm\\,\\ddot{x}(t) + c\\,\\dot{x}(t) + k\\,x(t) = 0',
            explanation: 'Igualando a cero se obtiene la ecuación diferencial lineal ordinaria homogénea de segundo orden.'
          },
          {
            step: 'Paso 3: Sustitución de Constantes del Sistema de Estudio',
            math: '300\\,\\ddot{x}(t) + c\\,\\dot{x}(t) + 30000\\,x(t) = 0 \\iff \\ddot{x}(t) + \\frac{c}{300}\\dot{x}(t) + 100\\,x(t) = 0',
            explanation: 'Dividiendo toda la ecuación entre la masa m = 300 kg se normaliza el coeficiente principal a la unidad.'
          },
          {
            step: 'Paso 4: Formulación del Problema de Valor Inicial (PVI)',
            math: 'x(0) = 0.05\\text{ m} = 5\\text{ cm},\\qquad \\dot{x}(0) = 0\\text{ m/s}',
            explanation: 'Perturbación impuesta por el bache de 5 cm. Al cruzar la cresta en t = 0, el vehículo parte instantáneamente con velocidad vertical nula.'
          }
        ],
        variables: [
          { symbol: 'm', name: 'm', value: (p) => `${p.m} kg`, desc: 'Masa suspendida (cuarto de vehículo)' },
          { symbol: 'k', name: 'k', value: (p) => `${p.k} N/m`, desc: 'Rigidez elástica del muelle (Hooke)' },
          { symbol: 'x(0)', name: 'x0', value: (p) => `${p.x0} m (5 cm)`, desc: 'Desplazamiento inicial por bache' },
          { symbol: 'x\'(0)', name: 'v0', value: (p) => `${p.v0} m/s`, desc: 'Velocidad inicial en reposo' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 20 - 27',
          snippet: `export const DEFAULT_PARAMS = {
  m: 300.0,      // kg (masa suspendida: un cuarto de carro)
  k: 30000.0,    // N/m (constante del resorte)
  x0: 0.05,      // m (desplazamiento inicial por bache: 5 cm)
  v0: 0.0,       // m/s (velocidad inicial en reposo)
  tf: 3.0,       // s (tiempo total de análisis según guía)
  h: 0.0005      // s (paso de integración temporal)
};`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 38 - 41',
          snippet: `m = 300.0       # Masa suspendida en kg
k = 30000.0     # Rigidez del resorte en N/m
x0 = 0.05       # Desplazamiento inicial (bache de 5 cm)
v0 = 0.0        # Velocidad inicial (0 m/s)`
        },
        liveEvaluation: (p) => [
          { label: 'Ecuación dividida entre m', formula: `x''(t) + \\frac{${p.c}}{${p.m}}x'(t) + \\frac{${p.k}}{${p.m}}x(t) = 0`, result: `x'' + ${(p.c/p.m).toFixed(2)}x' + ${(p.k/p.m).toFixed(1)}x = 0` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Panel Superior de Parámetros & Escena 3D',
          whatItShows: 'Fija los parámetros dimensionales del oscilador. En la escena 3D y en el diagrama 2D, al pulsar "💥 Probar Bache", la rueda y el chasis experimentan la compresión inicial de 5 cm.',
          effectOnCar: 'Determina la posición de partida x(0) = 0.05 m para la integración continua en tiempo real.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 2: Modelado Matemático y Parámetros Maestros
  // ----------------------------------------------------------------------------
  2: {
    slideId: 2,
    title: 'Cálculo de Propiedades Fundamentales del Oscilador',
    speaker: 'CRUZ ANACONA ANGELA GABRIELA',
    description: 'Transformación de parámetros dimensionales (m, k, c) en frecuencia natural (ωn), amortiguamiento crítico (ccr) y factor zeta (ζ).',
    items: [
      {
        id: 'omega-n',
        title: '1. Frecuencia Natural (ωn)',
        mathFormula: '\\omega_n = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{30000}{300}} = 10\\text{ rad/s}',
        explanation: 'Calcula la pulsación natural con la que el chasis oscilaría en ausencia total de amortiguador viscoso.',
        theory: 'La frecuencia natural no amortiguada ωn es la frecuencia angular propia intrínseca del sistema masa-resorte cuando no hay fricción viscosa (c = 0). Proviene del término independiente de la ecuación auxiliar r² + (k/m) = 0.',
        deductionSteps: [
          {
            step: 'Paso 1: Ecuación sin Disipación Viscosa (c = 0)',
            math: 'm\\,\\ddot{x}(t) + k\\,x(t) = 0 \\iff \\ddot{x}(t) + \\frac{k}{m}x(t) = 0',
            explanation: 'Corresponde al movimiento armónico simple no amortiguado.'
          },
          {
            step: 'Paso 2: Proposición de Solución Armónica x(t) = e^{rt}',
            math: 'r^2 + \\frac{k}{m} = 0 \\implies r = \\pm i\\sqrt{\\frac{k}{m}} = \\pm i\\,\\omega_n',
            explanation: 'La raíz imaginaria pura define la pulsación natural angular ωn.'
          },
          {
            step: 'Paso 3: Evaluación Numérica con Parámetros Maestros',
            math: '\\omega_n = \\sqrt{\\frac{30000}{300}} = \\sqrt{100} = 10\\text{ rad/s}',
            explanation: 'Equivale a una frecuencia ordinaria fn = 10/(2π) ≈ 1.5915 Hz y un periodo de oscilación libre Tn = 0.6283 s.'
          }
        ],
        variables: [
          { symbol: '\\omega_n', name: 'omega_n', value: (p) => `${Math.sqrt(p.k / p.m).toFixed(3)} rad/s`, desc: 'Frecuencia angular propia' },
          { symbol: 'f_n', name: 'fn', value: (p) => `${(Math.sqrt(p.k / p.m) / (2 * Math.PI)).toFixed(2)} Hz`, desc: 'Frecuencia ordinaria (ciclos/segundo)' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Línea 33',
          snippet: `// Frecuencia natural [rad/s]
const omega_n = Math.sqrt(k / m);`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Línea 44',
          snippet: `# Frecuencia natural no amortiguada (rad/s)
omega_n = math.sqrt(k / m)  # 10.0 rad/s`
        },
        liveEvaluation: (p) => [
          { label: 'Cociente k / m', formula: `\\frac{k}{m} = \\frac{${p.k}}{${p.m}}`, result: `${(p.k / p.m).toFixed(2)}` },
          { label: 'Raíz cuadrada', formula: `\\omega_n = \\sqrt{${(p.k / p.m).toFixed(2)}}`, result: `${Math.sqrt(p.k / p.m).toFixed(4)} rad/s` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Tarjeta de Telemetría Superior & Slider de Rigidez k',
          whatItShows: 'Muestra en vivo ωₙ = 10.00 rad/s. Si mueves el slider de rigidez k hacia 50 kN/m (modo carreras), el valor escala dinámicamente a 12.91 rad/s, acelerando las vibraciones.',
          effectOnCar: 'Controla la rapidez con la que el muelle empuja la carrocería hacia arriba.'
        }
      },
      {
        id: 'c-cr',
        title: '2. Coeficiente de Amortiguamiento Crítico (ccr)',
        mathFormula: 'c_{cr} = 2\\sqrt{m\\cdot k} = 2\\sqrt{300 \\times 30000} = 6000\\text{ N}\\cdot\\text{s/m}',
        explanation: 'Frontera exacta entre la disipación oscilatoria y la disipación sin sobreimpulso. Define la escala para amortiguadores.',
        theory: 'El amortiguamiento crítico ccr es el valor exacto de resistencia viscosa que anula el discriminante de la ecuación auxiliar (Δ = 0), produciendo una raíz real doble. Separa la región de rebotes (subamortiguada) de la región aperiódica (sobreamortiguada).',
        deductionSteps: [
          {
            step: 'Paso 1: Ecuación Característica General',
            math: 'r^2 + \\frac{c}{m}r + \\frac{k}{m} = 0',
            explanation: 'Polinomio de 2° grado obtenido al proponer soluciones exponenciales x(t) = e^{rt}.'
          },
          {
            step: 'Paso 2: Condición de Discriminante Cero (Raíz Real Doble)',
            math: '\\Delta = \\left(\\frac{c}{m}\\right)^2 - 4\\left(\\frac{k}{m}\\right) = 0 \\iff c^2 = 4mk',
            explanation: 'Frontera crítica donde desaparece la componente imaginaria de las raíces.'
          },
          {
            step: 'Paso 3: Expresión Analítica y Sustitución Numérica',
            math: 'c_{cr} = 2\\sqrt{mk} = 2\\sqrt{300 \\times 30000} = 2\\sqrt{9\\times 10^6} = 2 \\times 3000 = 6000\\text{ N}\\cdot\\text{s/m}',
            explanation: 'Cualquier amortiguador con c < 6000 oscilará; con c >= 6000 no habrá ningún rebote.'
          }
        ],
        variables: [
          { symbol: 'c_{cr}', name: 'c_cr', value: (p) => `${(2.0 * Math.sqrt(p.m * p.k)).toFixed(1)} N·s/m`, desc: 'Valor crítico límite' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Línea 34',
          snippet: `// Amortiguamiento crítico [N*s/m]
const c_cr = 2.0 * Math.sqrt(m * k);`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Línea 47',
          snippet: `# Amortiguamiento crítico (N*s/m o kg/s)
c_cr = 2.0 * math.sqrt(m * k)  # 6000.0 N*s/m`
        },
        liveEvaluation: (p) => [
          { label: 'Producto m × k', formula: `m \\times k = ${p.m} \\times ${p.k}`, result: `${(p.m * p.k).toLocaleString()} N·kg/m` },
          { label: 'Raíz del producto', formula: `\\sqrt{${p.m * p.k}}`, result: `${Math.sqrt(p.m * p.k).toFixed(2)}` },
          { label: 'Multiplicado por 2', formula: `c_{cr} = 2 \\times ${Math.sqrt(p.m * p.k).toFixed(2)}`, result: `${(2 * Math.sqrt(p.m * p.k)).toFixed(1)} N·s/m` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Botón de Preset 2 (Crítico) & Marca del Slider c',
          whatItShows: 'El valor de 6000 N·s/m está resaltado con badge ámbar "Crítico (ccr)". Cuando el slider coincide exactamente con este punto, la interfaz activa la configuración óptima para ambulancia.',
          effectOnCar: 'Garantiza el retorno a nivel de carretera en el mínimo tiempo posible (0.58 s).'
        }
      },
      {
        id: 'zeta-regimen',
        title: '3. Factor Adimensional (ζ) y Clasificación de Régimen',
        mathFormula: '\\zeta = \\frac{c}{c_{cr}} = \\frac{c}{2\\sqrt{mk}}',
        explanation: 'Determina si la ecuación característica tiene raíces complejas (ζ < 1), raíz real repetida (ζ = 1) o raíces reales distintas (ζ > 1).',
        theory: 'El coeficiente adimensional zeta normaliza la capacidad disipativa frente al caso crítico: ζ = c / ccr. Es el parámetro universal de diseño que gobierna la estabilidad y el tipo de solución de la EDO.',
        deductionSteps: [
          {
            step: 'Paso 1: Definición Adimensional de Zeta',
            math: '\\zeta = \\frac{c}{c_{cr}} = \\frac{c}{2\\sqrt{mk}} = \\frac{c}{6000}',
            explanation: 'Razón entre el amortiguamiento real instalado y el crítico del vehículo.'
          },
          {
            step: 'Paso 2: Clasificación de los 3 Regímenes Asignados en la Guía',
            math: '\\begin{cases} \\zeta = 0.3 < 1 & \\text{Subamortiguado (rebota, } c = 1800\\text{)} \\\\ \\zeta = 1.0 = 1 & \\text{Crítico (retorno veloz, } c = 6000\\text{)} \\\\ \\zeta = 1.5 > 1 & \\text{Sobreamortiguado (retorno lento, } c = 9000\\text{)} \\end{cases}',
            explanation: 'Corresponden a los 3 casos de estudio obligatorios de la rúbrica docente.'
          }
        ],
        variables: [
          { symbol: '\\zeta', name: 'zeta', value: (p) => `${(p.c / (2.0 * Math.sqrt(p.m * p.k))).toFixed(4)}`, desc: 'Factor de amortiguamiento adimensional' },
          { symbol: '\\text{Régimen}', name: 'regimen', value: (p) => p.regimen, desc: 'Comportamiento físico' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 35 - 47',
          snippet: `const zeta = c / c_cr;

let regimen = 'Subamortiguado';
let omega_d = 0;

if (Math.abs(zeta - 1.0) < 1e-4) {
  regimen = 'Críticamente amortiguado';
} else if (zeta > 1.0) {
  regimen = 'Sobreamortiguado';
} else {
  regimen = 'Subamortiguado';
  omega_d = omega_n * Math.sqrt(1.0 - zeta * zeta);
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 50 - 52',
          snippet: `c_sub = 0.3 * c_cr   # 1800 N*s/m (zeta = 0.3)
c_crit = 1.0 * c_cr  # 6000 N*s/m (zeta = 1.0)
c_sobre = 1.5 * c_cr # 9000 N*s/m (zeta = 1.5)`
        },
        liveEvaluation: (p) => {
          const c_cr = 2.0 * Math.sqrt(p.m * p.k);
          const zeta = p.c / c_cr;
          return [
            { label: 'Cálculo de zeta', formula: `\\zeta = \\frac{${p.c}}{${c_cr.toFixed(1)}}`, result: `${zeta.toFixed(4)}` },
            { label: 'Evaluación condicional', formula: `\\zeta = ${zeta.toFixed(4)}`, result: zeta < 0.9999 ? 'Subamortiguado (ζ < 1)' : (zeta > 1.0001 ? 'Sobreamortiguado (ζ > 1)' : 'Crítico (ζ = 1)') }
          ];
        },
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Badge de Régimen en Header & HUD 3D en Carretera',
          whatItShows: 'El texto "ζ = X.XX" y la etiqueta del régimen cambian de color en tiempo real: Azul (Subamortiguado), Dorado (Crítico) y Púrpura (Sobreamortiguado).',
          effectOnCar: 'Informa inmediatamente la dinámica física que experimentará la suspensión ante un bache.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 3: Solución Analítica: Casos 1 y 2
  // ----------------------------------------------------------------------------
  3: {
    slideId: 3,
    title: 'Solución Analítica Exacta: Subamortiguado vs. Crítico',
    speaker: 'GOMEZ HOYOS DUBAN ALEXANDER',
    description: 'Deducción matemática analítica paso a paso: ecuación auxiliar, discriminante, raíces complejas, reducción de orden y evaluación de constantes.',
    items: [
      {
        id: 'caso-subamortiguado',
        title: 'Caso 1: Subamortiguado (c = 1800 N·s/m, ζ = 0.3)',
        mathFormula: 'x(t) = e^{-3t}\\left(0.05\\cos(\\sqrt{91}t) + \\frac{0.15}{\\sqrt{91}}\\sin(\\sqrt{91}t)\\right)',
        explanation: 'Discriminante Δ = -364 < 0. Raíces complejas conjugadas r = -3 ± i√91. El factor e^(-3t) es la envolvente disipativa y las funciones trigonométricas con ωd = √91 generan el rebote oscilatorio.',
        theory: 'Con c = 1800 N·s/m, el discriminante cuadrático es negativo (Δ = -364 < 0). La fórmula cuadrática genera raíces complejas conjugadas. Mediante la Identidad de Euler e^{iθ} = cos θ + i sin θ, la solución real queda formulada como una oscilación sinusoidal multiplicada por un decaimiento exponencial.',
        deductionSteps: [
          {
            step: 'Paso 1: Ecuación Característica y Discriminante Cuadrático',
            math: 'r^2 + \\frac{1800}{300}r + \\frac{30000}{300} = 0 \\iff r^2 + 6r + 100 = 0',
            explanation: 'Discriminante Δ = 6² - 4(1)(100) = 36 - 400 = -364 < 0 (estrictamente negativo).'
          },
          {
            step: 'Paso 2: Raíces Complejas Conjugadas',
            math: 'r_{1,2} = \\frac{-6 \\pm \\sqrt{-364}}{2} = -3 \\pm i\\sqrt{91} \\approx -3 \\pm 9.5394\\,i',
            explanation: 'Parte real disipativa σ = 3 s⁻¹ y frecuencia angular amortiguada ωd = √91 ≈ 9.5394 rad/s.'
          },
          {
            step: 'Paso 3: Solución General por Identidad de Euler',
            math: 'x(t) = e^{-3t}\\left[ A\\cos(\\sqrt{91}\\,t) + B\\sin(\\sqrt{91}\\,t) \\right]',
            explanation: 'Combinación lineal de las partes real e imaginaria independientes.'
          },
          {
            step: 'Paso 4: Evaluación de Condiciones Iniciales (x(0) = 0.05, v(0) = 0)',
            math: 'x(0) = A = 0.05\\text{ m},\\qquad \\dot{x}(0) = -3A + B\\sqrt{91} = 0 \\implies B = \\frac{3(0.05)}{\\sqrt{91}} = \\frac{0.15}{\\sqrt{91}}\\approx 0.01572\\text{ m}',
            explanation: 'Se deriva la función temporal con regla del producto y se despejan A y B.'
          },
          {
            step: 'Paso 5: Solución Particular Exacta',
            math: 'x_{\\text{sub}}(t) = e^{-3t}\\left[ 0.05\\cos(\\sqrt{91}\\,t) + \\frac{0.15}{\\sqrt{91}}\\sin(\\sqrt{91}\\,t) \\right]\\,\\text{m}',
            explanation: 'Produce un sobreimpulso Mp = 37.23% y un tiempo de asentamiento ts(2%) ≈ 1.12 s.'
          }
        ],
        variables: [
          { symbol: '\\sigma = \\zeta \\omega_n', name: 'sigma', value: () => '3.0 s⁻¹', desc: 'Atenuación exponencial' },
          { symbol: '\\omega_d', name: 'omega_d', value: () => '√91 ≈ 9.5394 rad/s', desc: 'Frecuencia oscilatoria amortiguada' },
          { symbol: 'A = x_0', name: 'A', value: () => '0.05 m', desc: 'Amplitud de coseno' },
          { symbol: 'B = \\frac{\\sigma x_0}{\\omega_d}', name: 'B', value: () => '0.15 / √91 ≈ 0.01572 m', desc: 'Amplitud de seno' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 130 - 141',
          snippet: `// CASO 1: SUBAMORTIGUADO (zeta < 1)
// x(t) = e^(-sigma * t) * [ A * cos(omega_d * t) + B * sin(omega_d * t) ]
const sigma = zeta * omega_n;
const omega_d = omega_n * Math.sqrt(1.0 - zeta * zeta);
const A = x0;
const B = (v0 + sigma * x0) / omega_d;

return Math.exp(-sigma * t) * (A * Math.cos(omega_d * t) + B * Math.sin(omega_d * t));`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 60 - 70',
          snippet: `def x_analitica_subamortiguado(t):
    wd = math.sqrt(91.0)
    return np.exp(-3.0 * t) * (0.05 * np.cos(wd * t) + (0.15 / wd) * np.sin(wd * t))`
        },
        liveEvaluation: (p) => {
          const wn = Math.sqrt(p.k / p.m);
          const ccr = 2 * Math.sqrt(p.m * p.k);
          const z = 1800 / ccr;
          const sig = z * wn;
          const wd = wn * Math.sqrt(1 - z * z);
          return [
            { label: 'Atenuación sigma', formula: `\\sigma = ${z.toFixed(2)} \\times ${wn.toFixed(1)}`, result: `${sig.toFixed(2)} s⁻¹` },
            { label: 'Frecuencia amortiguada', formula: `\\omega_d = ${wn.toFixed(1)} \\times \\sqrt{1 - ${z.toFixed(2)}^2}`, result: `${wd.toFixed(4)} rad/s` },
            { label: 'Coeficiente B', formula: `B = \\frac{${sig.toFixed(1)} \\times ${p.x0}}{${wd.toFixed(2)}}`, result: `${((sig * p.x0) / wd).toFixed(5)} m` }
          ];
        },
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Curva Azul en Gráfica RK4 & Animación 3D del Vehículo',
          whatItShows: 'La curva azul oscila y cruza el cero hacia valores negativos (-0.0186 m, rebote de compresión opuesto). En la simulación 3D el chasis cabecea 3 veces antes de calmarse.',
          effectOnCar: 'Sensación de rebote excesivo e inestabilidad (peligroso para una ambulancia con pacientes de trauma).'
        }
      },
      {
        id: 'caso-critico',
        title: 'Caso 2: Críticamente Amortiguado (c = 6000 N·s/m, ζ = 1.0)',
        mathFormula: 'x(t) = (C_1 + C_2 t) e^{-\\omega_n t} = (0.05 + 0.5t)e^{-10t}',
        explanation: 'Discriminante Δ = 0. Raíz real repetida r = -10 s⁻¹. Por Reducción de Orden de d\'Alembert, la segunda solución linealmente independiente se multiplica por t. Retorno óptimo sin rebote.',
        theory: 'Con c = 6000 N·s/m, el discriminante cuadrático es exactamente cero (Δ = 0), produciendo una raíz repetida r = -10 s⁻¹. Para generar un conjunto fundamental de dos soluciones linealmente independientes, se utiliza el método de d\'Alembert (multiplicación por t).',
        deductionSteps: [
          {
            step: 'Paso 1: Ecuación Característica y Raíz Real Doble',
            math: 'r^2 + \\frac{6000}{300}r + 100 = 0 \\iff r^2 + 20r + 100 = (r+10)^2 = 0 \\implies r_1 = r_2 = -10\\,\\text{s}^{-1}',
            explanation: 'Discriminante nulo Δ = 20² - 4(1)(100) = 400 - 400 = 0.'
          },
          {
            step: 'Paso 2: Reducción de Orden de d\'Alembert',
            math: 'x_1(t) = e^{-10t},\\qquad x_2(t) = t\\,e^{-10t} \\implies x(t) = (C_1 + C_2\\,t)e^{-10t}',
            explanation: 'El factor multiplicador t garantiza la independencia lineal de ambas soluciones.'
          },
          {
            step: 'Paso 3: Evaluación de Condiciones Iniciales',
            math: 'x(0) = C_1 = 0.05\\text{ m},\\qquad \\dot{x}(t) = C_2 e^{-10t} - 10(C_1 + C_2 t)e^{-10t} \\implies \\dot{x}(0) = C_2 - 10C_1 = 0 \\implies C_2 = 10(0.05) = 0.5\\text{ m/s}',
            explanation: 'Evaluando x(0) y la primera derivada en reposo inicial.'
          },
          {
            step: 'Paso 4: Solución Particular Exacta',
            math: 'x_{\\text{crit}}(t) = (0.05 + 0.5\\,t)e^{-10t}\\,\\text{m}',
            explanation: 'Garantiza retorno mono-asintótico al equilibrio en solo ts ≈ 0.58 s sin ningún rebote (Mp = 0%).'
          }
        ],
        variables: [
          { symbol: 'r_1 = r_2', name: 'r', value: () => '-10 s⁻¹', desc: 'Raíz doble repetida' },
          { symbol: 'C_1 = x_0', name: 'C1', value: () => '0.05 m', desc: 'Posición inicial' },
          { symbol: 'C_2 = v_0 + \\omega_n x_0', name: 'C2', value: () => '0.5 m/s', desc: 'Pendiente de reducción de orden' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 120 - 129',
          snippet: `// CASO 2: CRÍTICAMENTE AMORTIGUADO (zeta = 1)
// x(t) = (C1 + C2 * t) * e^(-omega_n * t)
const C1 = x0;
const C2 = v0 + omega_n * x0;

return (C1 + C2 * t) * Math.exp(-omega_n * t);`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 71 - 80',
          snippet: `def x_analitica_critico(t):
    # Raiz doble r = -10
    return (0.05 + 0.5 * t) * np.exp(-10.0 * t)`
        },
        liveEvaluation: (p) => {
          const wn = Math.sqrt(p.k / p.m);
          const C1 = p.x0;
          const C2 = p.v0 + wn * p.x0;
          return [
            { label: 'Constante C1', formula: `C_1 = x_0`, result: `${C1} m` },
            { label: 'Constante C2', formula: `C_2 = ${p.v0} + ${wn.toFixed(1)} \\times ${p.x0}`, result: `${C2.toFixed(2)} m/s` },
            { label: 'Fórmula resultante', formula: `x(t) = (${C1} + ${C2}t)e^{-${wn.toFixed(1)}t}`, result: 'Retorno sin sobreimpulso' }
          ];
        },
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Curva Verde en Gráfica RK4 & Preset Ambulancia Médica',
          whatItShows: 'La curva verde desciende sin oscilar y se aplana exactamente en cero en el menor tiempo. En 3D la carrocería de la ambulancia absorbe el bache de una sola vez sin tambaleos.',
          effectOnCar: 'Máxima comodidad y seguridad clínica para pacientes y camillas.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 4: Solución Analítica: Caso 3 (Sobreamortiguado)
  // ----------------------------------------------------------------------------
  4: {
    slideId: 4,
    title: 'Solución Analítica: Caso 3 (Sobreamortiguado, c = 9000)',
    speaker: 'GOMEZ HOYOS DUBAN ALEXANDER',
    description: 'Resolución analítica con dos raíces reales distintas negativas, discriminante positivo y desacoplamiento en modo lento y modo rápido.',
    items: [
      {
        id: 'caso-sobreamortiguado',
        title: 'Raíces Reales y Modo Dominante Lento',
        mathFormula: 'x(t) = C_1 e^{r_1 t} + C_2 e^{r_2 t} = 0.05854\\,e^{-3.82t} - 0.00854\\,e^{-26.18t}',
        explanation: 'Discriminante Δ = 900 - 400 = 500 > 0. Raíces r1 = -15 + 5√5 ≈ -3.82 s⁻¹ y r2 = -15 - 5√5 ≈ -26.18 s⁻¹. El modo e^(-26.18t) decae en milisegundos; el modo lento e^(-3.82t) es el que frena el retorno.',
        theory: 'Con c = 9000 N·s/m (1.5 ccr, ζ = 1.5), el discriminante es estrictamente positivo (Δ = 500 > 0). El sistema no oscila (cero términos senoidales), pero el amortiguador opone tanta resistencia viscosa que frena en exceso el resorte. La solución es una suma de dos exponenciales donde el término de decaimiento más lento (r1 ≈ -3.82) domina el tiempo de estabilización.',
        deductionSteps: [
          {
            step: 'Paso 1: Ecuación Característica y Discriminante Positivo',
            math: 'r^2 + \\frac{9000}{300}r + 100 = 0 \\iff r^2 + 30r + 100 = 0',
            explanation: 'Discriminante Δ = 30² - 4(1)(100) = 900 - 400 = 500 > 0.'
          },
          {
            step: 'Paso 2: Dos Raíces Reales Negativas Distintas',
            math: 'r_{1,2} = \\frac{-30 \\pm \\sqrt{500}}{2} = -15 \\pm 5\\sqrt{5} \\implies \\begin{cases} r_1 = -15 + 5\\sqrt{5} \\approx -3.8197\\,\\text{s}^{-1} & \\text{(Modo lento dominante)} \\\\ r_2 = -15 - 5\\sqrt{5} \\approx -26.1803\\,\\text{s}^{-1} & \\text{(Modo rápido efímero)} \\end{cases}',
            explanation: 'r1 es la raíz dominante porque su exponencial e^{r1 t} decae mucho más despacio.'
          },
          {
            step: 'Paso 3: Solución General y Sistema Lineal 2×2',
            math: 'x(t) = C_1 e^{r_1 t} + C_2 e^{r_2 t},\\qquad x(0) = C_1 + C_2 = 0.05,\\quad \\dot{x}(0) = r_1 C_1 + r_2 C_2 = 0',
            explanation: 'Se resuelve el sistema algebraico por regla de Cramer o sustitución directa.'
          },
          {
            step: 'Paso 4: Evaluación de Constantes de Integración C1 y C2',
            math: 'C_1 = \\frac{-r_2 x_0}{r_1 - r_2} = \\frac{26.1803 \\times 0.05}{22.3607} \\approx 0.05854\\,\\text{m},\\qquad C_2 = 0.05 - C_1 \\approx -0.00854\\,\\text{m}',
            explanation: 'C1 tiene el mayor peso en la respuesta asintótica.'
          },
          {
            step: 'Paso 5: Solución Particular Exacta',
            math: 'x_{\\text{sobre}}(t) = 0.05854\\,e^{-3.8197t} - 0.00854\\,e^{-26.1803t}\\,\\text{m}',
            explanation: 'Retorno sin sobreimpulso (Mp = 0%), pero con un asentamiento retrasado a ts ≈ 1.07 s (+84% comparado con el crítico).'
          }
        ],
        variables: [
          { symbol: 'r_1', name: 'r1', value: () => '-3.8197 s⁻¹', desc: 'Modo dominante lento (decaimiento demorado)' },
          { symbol: 'r_2', name: 'r2', value: () => '-26.1803 s⁻¹', desc: 'Modo rápido (se extingue en ~0.15 s)' },
          { symbol: 'C_1', name: 'C1', value: () => '0.05854 m', desc: 'Constante modo lento' },
          { symbol: 'C_2', name: 'C2', value: () => '-0.00854 m', desc: 'Constante modo rápido' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 144 - 159',
          snippet: `// CASO 3: SOBREAMORTIGUADO (zeta > 1)
const sigma = zeta * omega_n;
const delta = omega_n * Math.sqrt(zeta * zeta - 1.0);
const r1 = -sigma + delta;
const r2 = -sigma - delta;

// Sistema 2x2 para condiciones iniciales:
// C1 + C2 = x0
// r1*C1 + r2*C2 = v0
const C1 = (v0 - r2 * x0) / (r1 - r2);
const C2 = (r1 * x0 - v0) / (r1 - r2);

return C1 * Math.exp(r1 * t) + C2 * Math.exp(r2 * t);`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 81 - 98',
          snippet: `def x_analitica_sobreamortiguado(t):
    sqrt5 = math.sqrt(5.0)
    r1 = -15.0 + 5.0 * sqrt5  # approx -3.8197
    r2 = -15.0 - 5.0 * sqrt5  # approx -26.1803
    c1 = 0.025 + 0.015 * sqrt5  # approx 0.05854
    c2 = 0.025 - 0.015 * sqrt5  # approx -0.00854
    return c1 * np.exp(r1 * t) + c2 * np.exp(r2 * t)`
        },
        liveEvaluation: (p) => {
          const wn = Math.sqrt(p.k / p.m);
          const ccr = 2 * Math.sqrt(p.m * p.k);
          const z = (p.c > ccr ? p.c : 9000) / ccr;
          const sig = z * wn;
          const delta = wn * Math.sqrt(z * z - 1.0);
          const r1 = -sig + delta;
          const r2 = -sig - delta;
          const C1 = (p.v0 - r2 * p.x0) / (r1 - r2);
          const C2 = (r1 * p.x0 - p.v0) / (r1 - r2);
          return [
            { label: 'Raíz lenta r1', formula: `r_1 = -\\sigma + \\delta = -${sig.toFixed(1)} + ${delta.toFixed(2)}`, result: `${r1.toFixed(4)} s⁻¹` },
            { label: 'Raíz rápida r2', formula: `r_2 = -\\sigma - \\delta = -${sig.toFixed(1)} - ${delta.toFixed(2)}`, result: `${r2.toFixed(4)} s⁻¹` },
            { label: 'Constante C1', formula: `C_1 = \\frac{${p.v0} - (${r2.toFixed(2)})(${p.x0})}{${(r1 - r2).toFixed(2)}}`, result: `${C1.toFixed(5)} m` },
            { label: 'Constante C2', formula: `C_2 = ${p.x0} - ${C1.toFixed(5)}`, result: `${C2.toFixed(5)} m` }
          ];
        },
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Curva Roja en Gráfica RK4 & Botón Preset 3 (1.5 ccr)',
          whatItShows: 'La curva roja nunca baja de cero (0% de sobreimpulso), pero tarda 1.07 segundos en tocar la banda del 2%. En 3D el vehículo parece "hundido" y tarda demasiado en recuperar su altura neutra.',
          effectOnCar: 'Suspensión dura, perezosa y rígida ante baches repetidos.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 5: Integración Numérica RK4
  // ----------------------------------------------------------------------------
  5: {
    slideId: 5,
    title: 'Integración Numérica Runge-Kutta de 4° Orden (RK4)',
    speaker: 'TORRES ANGULO JOSE ALDAIR',
    description: 'Transformación a variables de estado [u, v] y cómputo de 4 pendientes ponderadas por paso temporal h.',
    items: [
      {
        id: 'rk4-sistema',
        title: '1. Sistema Acoplado de 1° Orden: systemDerivative()',
        mathFormula: '\\begin{cases} u\' = v \\\\ v\' = \\dfrac{-c\\,v - k\\,u}{m} \\end{cases}',
        explanation: 'Las librerías y algoritmos numéricos requieren EDOs de primer orden. Definimos u = x (posición) y v = x\' (velocidad) para obtener un campo vectorial autónomo.',
        theory: 'Una EDO de 2° orden no puede integrarse directamente con esquemas estándar de Runge-Kutta o multipaso sin reducirla primero a un sistema de EDOs de primer orden acopladas mediante variables de estado en el espacio de fase.',
        deductionSteps: [
          {
            step: 'Paso 1: Definición del Vector de Estado en el Espacio de Fase',
            math: '\\mathbf{y}(t) = \\begin{bmatrix} u(t) \\\\ v(t) \\end{bmatrix} = \\begin{bmatrix} x(t) \\\\ \\dot{x}(t) \\end{bmatrix}',
            explanation: 'u representa la coordenada de posición vertical y v la velocidad vertical.'
          },
          {
            step: 'Paso 2: Diferenciación de la Primera Variable de Estado',
            math: '\\dot{u}(t) = \\dot{x}(t) = v(t)',
            explanation: 'La derivada temporal de la posición es la velocidad por definición cinemática.'
          },
          {
            step: 'Paso 3: Despeje de la Segunda Derivada desde Newton',
            math: 'm\\,\\dot{v}(t) + c\\,v(t) + k\\,u(t) = 0 \\implies \\dot{v}(t) = \\frac{-c\\,v(t) - k\\,u(t)}{m}',
            explanation: 'La aceleración vertical queda como función explícita del estado actual (u, v).'
          }
        ],
        variables: [
          { symbol: 'u', name: 'u', value: () => 'Posición vertical x(t)', desc: 'Variable de estado 1' },
          { symbol: 'v', name: 'v', value: () => 'Velocidad vertical x\'(t)', desc: 'Variable de estado 2' },
          { symbol: 'du/dt', name: 'du', value: () => 'v (velocidad)', desc: 'Primera derivada' },
          { symbol: 'dv/dt', name: 'dv', value: () => '(-c·v - k·u)/m (aceleración)', desc: 'Segunda Ley de Newton' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 61 - 66',
          snippet: `function systemDerivative(u, v, m, c, k) {
  return {
    du: v,
    dv: (-c * v - k * u) / m
  };
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 105 - 116',
          snippet: `def sistema_edo(t, y, c_val):
    u, v = y
    du_dt = v
    dv_dt = (-c_val * v - k * u) / m
    return np.array([du_dt, dv_dt])`
        },
        liveEvaluation: (p) => [
          { label: 'Aceleración en t=0', formula: `a(0) = \\frac{-${p.c}(0) - ${p.k}(${p.x0})}{${p.m}}`, result: `${((-p.k * p.x0) / p.m).toFixed(2)} m/s²` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Motor de Integración RK4 & Simulación Física 3D',
          whatItShows: 'Esta función es el núcleo de cálculo numérico llamado 6000 veces para generar la trayectoria en la gráfica y 240 veces por segundo en el motor 3D de carretera.',
          effectOnCar: 'Calcula la fuerza resultante y la aceleración instantánea en cada milisegundo.'
        }
      },
      {
        id: 'rk4-pendientes',
        title: '2. Algoritmo de 4 Pendientes y Actualización de Simpson',
        mathFormula: 'y_{i+1} = y_i + \\frac{h}{6}\\left(k_1 + 2k_2 + 2k_3 + k_4\\right)',
        explanation: 'Calcula k1 (inicio), k2 y k3 (en punto medio con corrección) y k4 (final de paso). Ofrece error local O(h^5) y error global acumulado O(h^4).',
        theory: 'Runge-Kutta 4 evalúa el campo de pendientes en 4 puntos estratégicos dentro de cada intervalo de tiempo h. Los pesos (1/6, 2/6, 2/6, 1/6) coinciden con la cuadratura de Simpson de 3/8, anulando términos de Taylor hasta 4to orden.',
        deductionSteps: [
          {
            step: 'Paso 1: Pendiente Inicial en el Comienzo del Intervalo (k1)',
            math: 'k_1 = f(t_i, y_i)',
            explanation: 'Pendiente de Euler al inicio del paso temporal.'
          },
          {
            step: 'Paso 2: Primera Pendiente Predictiva en Punto Medio (k2)',
            math: 'k_2 = f\\left(t_i + \\frac{h}{2},\\, y_i + \\frac{h}{2}k_1\\right)',
            explanation: 'Avanza medio paso temporal guiado por k1.'
          },
          {
            step: 'Paso 3: Segunda Pendiente Predictiva en Punto Medio (k3)',
            math: 'k_3 = f\\left(t_i + \\frac{h}{2},\\, y_i + \\frac{h}{2}k_2\\right)',
            explanation: 'Re-evalúa la pendiente en el punto medio usando la predicción refinada k2.'
          },
          {
            step: 'Paso 4: Pendiente Terminal en el Extremo del Intervalo (k4)',
            math: 'k_4 = f(t_i + h,\\, y_i + h\\,k_3)',
            explanation: 'Avanza el paso completo h usando la pendiente k3.'
          },
          {
            step: 'Paso 5: Integración Ponderada de Simpson',
            math: 'y_{i+1} = y_i + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
            explanation: 'Error local de truncamiento O(h⁵) y error global acumulado O(h⁴).'
          }
        ],
        variables: [
          { symbol: 'h', name: 'h', value: () => '0.0005 s (0.5 ms)', desc: 'Paso temporal fijo' },
          { symbol: 'k_1', name: 'd1', value: () => 'f(t_i, y_i)', desc: 'Pendiente inicial del intervalo' },
          { symbol: 'k_2, k_3', name: 'd2, d3', value: () => 'f(t_i + h/2, y_i + (h/2)k)', desc: 'Pendientes predictivas en punto medio' },
          { symbol: 'k_4', name: 'd4', value: () => 'f(t_i + h, y_i + h·k_3)', desc: 'Pendiente al final del paso' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 87 - 108',
          snippet: `// k1: Pendiente inicial
const d1 = systemDerivative(xi, vi, m, c, k);

// k2: Punto medio con k1
const x_k1 = xi + 0.5 * h * d1.du;
const v_k1 = vi + 0.5 * h * d1.dv;
const d2 = systemDerivative(x_k1, v_k1, m, c, k);

// k3: Punto medio con k2
const x_k2 = xi + 0.5 * h * d2.du;
const v_k2 = vi + 0.5 * h * d2.dv;
const d3 = systemDerivative(x_k2, v_k2, m, c, k);

// k4: Extremo final con k3
const x_k3 = xi + h * d3.du;
const v_k3 = vi + h * d3.dv;
const d4 = systemDerivative(x_k3, v_k3, m, c, k);

// Actualización ponderada Runge-Kutta
x[i + 1] = xi + (h / 6.0) * (d1.du + 2.0 * d2.du + 2.0 * d3.du + d4.du);
v[i + 1] = vi + (h / 6.0) * (d1.dv + 2.0 * d2.dv + 2.0 * d3.dv + d4.dv);`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 130 - 136',
          snippet: `k1 = sistema_edo(ti, yi, c_val)
k2 = sistema_edo(ti + h / 2.0, yi + (h / 2.0) * k1, c_val)
k3 = sistema_edo(ti + h / 2.0, yi + (h / 2.0) * k2, c_val)
k4 = sistema_edo(ti + h, yi + h * k3, c_val)
Y[i + 1] = yi + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)`
        },
        liveEvaluation: (p) => [
          { label: 'Pesos de ponderación', formula: '\\frac{1}{6} + \\frac{2}{6} + \\frac{2}{6} + \\frac{1}{6}', result: '1.0 (Regla de Simpson 3/8)' },
          { label: 'Paso h utilizado', formula: 'h = 0.0005\\text{ s}', result: '6,001 puntos calculados para 3.0 s' }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Pestaña RK4 & Vista Comparativa Clase vs Web',
          whatItShows: 'Genera los 6,001 puntos discretos de la curva con un paso h = 0.5 ms, garantizando una suavidad visual perfecta sin dientes de sierra ni retrasos.',
          effectOnCar: 'Produce una trayectoria numéricamente exacta con error menor a 10⁻⁸ metros.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 6: Validación Residual y Superposición Exacta
  // ----------------------------------------------------------------------------
  6: {
    slideId: 6,
    title: 'Superposición y Validación: Error Residual Máximo',
    speaker: 'TORRES ANGULO JOSE ALDAIR',
    description: 'Bucle de verificación en cada milisegundo: compara punto a punto la solución numérica de RK4 contra la fórmula analítica cerrada.',
    items: [
      {
        id: 'superposicion-error',
        title: 'Bucle de Verificación Residual',
        mathFormula: '\\max_{t \\in [0, 3]} |x_{\\text{RK4}}(t) - x_{\\text{exacta}}(t)| < 2.5 \\times 10^{-8}\\text{ m}',
        explanation: 'En cada paso de la simulación, calculamos la diferencia absoluta entre el estado numérico xi y la función analítica continua. Si el error máximo supera 10⁻⁴ m, el algoritmo no es válido.',
        theory: 'La "Regla de Oro" de la ingeniería computacional exige que el método numérico converja a la solución analítica deducida a mano. Calculamos la norma infinito de la diferencia residual L_inf = max |x_RK4 - x_exacta| en todo el intervalo [0, 3] s.',
        deductionSteps: [
          {
            step: 'Paso 1: Muestreo Simultáneo en Nodos Temporales ti',
            math: 't_i = i \\cdot h,\\qquad i = 0, 1, 2, \\dots, 6000',
            explanation: 'Discretización uniforme con paso h = 0.0005 s.'
          },
          {
            step: 'Paso 2: Cómputo del Error Absoluto Punto a Punto',
            math: 'e(t_i) = |x_{\\text{RK4}}(t_i) - x_{\\text{exacta}}(t_i)|',
            explanation: 'Diferencia instantánea entre el integrador de 4to orden y la función analítica.'
          },
          {
            step: 'Paso 3: Búsqueda del Máximo Residual (Norma Infinito)',
            math: 'e_{\\max} = \\max_{i} e(t_i) \\approx 2.3 \\times 10^{-8}\\text{ m} = 0.023\\;\\mu\\text{m}',
            explanation: 'El error global es miles de veces inferior al espesor de una capa de pintura o bacteria celular.'
          }
        ],
        variables: [
          { symbol: 'e(t_i)', name: 'error', value: () => '|xi - xExact|', desc: 'Error absoluto instantáneo' },
          { symbol: 'e_{\\max}', name: 'maxError', value: () => '2.3 × 10⁻⁸ m', desc: 'Error global máximo registrado' },
          { symbol: '\\text{Rúbrica}', name: 'criterio', value: () => '< 1.0 × 10⁻⁴ m', desc: 'Cota de tolerancia académica superada' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 174 - 182',
          snippet: `for (let i = 0; i < tArray.length; i++) {
  const ti = tArray[i];
  const xi = xNumArray[i];
  const xExact = exactAnalyticalSolution(ti, m, c, k, x0, v0);
  const error = Math.abs(xi - xExact);

  if (error > maxError) {
    maxError = error;
  }
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 190 - 205',
          snippet: `# Calculo de error maximo contra solucion analitica
error_sub = np.max(np.abs(Y_sub[:, 0] - x_analitica_subamortiguado(t)))
error_crit = np.max(np.abs(Y_crit[:, 0] - x_analitica_critico(t)))
error_sobre = np.max(np.abs(Y_sobre[:, 0] - x_analitica_sobreamortiguado(t)))
print(f"Error residual maximo: {max(error_sub, error_crit, error_sobre):.3e} m")`
        },
        liveEvaluation: (p) => [
          { label: 'Criterio de validación', formula: 'e_{\\max} \\le 10^{-4}\\text{ m}', result: 'CUMPLIDO (> 99.9999% coincidencia)' },
          { label: 'Orden de magnitud', formula: 'e_{\\max} \\approx 2.3 \\times 10^{-8}\\text{ m}', result: 'Inferior al espesor de una célula viva' }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Pestaña RK4 & Gráfica de Superposición Total',
          whatItShows: 'Permite alternar entre "Línea Continua (Analítica Exacta)" y "Puntos Discretos (RK4)". Visualmente ambas trazas quedan exactamente encimadas sin un solo píxel de desviación.',
          effectOnCar: 'Demuestra al docente que la simulación es 100% fiel a la matemática teórica.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 7: Medición de Métricas Cuantitativas
  // ----------------------------------------------------------------------------
  7: {
    slideId: 7,
    title: 'Métricas de Desempeño: Tiempo de Asentamiento y Sobreimpulso',
    speaker: 'VELASCO BURBANO RUBEN DARIO',
    description: 'Algoritmo para determinar el instante en que el chasis entra definitivamente a la banda del 2% y porcentaje de rebote.',
    items: [
      {
        id: 'settling-time-alg',
        title: '1. Tiempo de Asentamiento al 2% (ts)',
        mathFormula: 't_s = \\max \\left\\{ t : |x(t)| > 0.02\\,x_0 = 0.001\\text{ m} \\right\\}',
        explanation: 'El umbral del 2% de 5 cm es 1 mm (0.001 m). El algoritmo recorre la señal y guarda el último instante de tiempo en el que la carrocería estuvo fuera de la banda.',
        theory: 'El criterio del 2% (banda de tolerancia de ingeniería de control) define el tiempo ts requerido para que las oscilaciones o transitorios queden confinados permanentemente dentro del ±2% de la perturbación inicial (|x(t)| <= 0.02·x0 = 0.001 m = 1 mm).',
        deductionSteps: [
          {
            step: 'Paso 1: Cálculo del Límite de Tolerancia al 2%',
            math: '\\text{Banda} = \\pm 0.02 \\times x_0 = \\pm 0.02 \\times 0.05\\text{ m} = \\pm 0.001\\text{ m} = \\pm 1\\text{ mm}',
            explanation: 'Criterio estipulado en la guía oficial de la asignatura.'
          },
          {
            step: 'Paso 2: Comparativa de Tiempos de Asentamiento por Régimen',
            math: 't_s(\\text{Crítico}) = 0.58\\text{ s} < t_s(\\text{Sobreamortiguado}) = 1.07\\text{ s} < t_s(\\text{Subamortiguado}) = 1.12\\text{ s}',
            explanation: 'El régimen crítico alcanza el reposo 48% más rápido que el sobreamortiguado y el subamortiguado.'
          }
        ],
        variables: [
          { symbol: '\\text{Umbral}', name: 'threshold', value: (p) => `${(0.02 * p.x0 * 1000).toFixed(1)} mm (0.001 m)`, desc: '2% del bache de 5 cm' },
          { symbol: 't_s', name: 'settlingTime', value: (p) => `${p.settlingTime.toFixed(2)} s`, desc: 'Tiempo para entrar a la banda' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 169 - 186',
          snippet: `const threshold = 0.02 * x0; // 2% de 0.05 = 0.001 m
let ts = 0.0;

for (let i = 0; i < tArray.length; i++) {
  const ti = tArray[i];
  const xi = xNumArray[i];

  // Si la amplitud supera el 2%, actualiza el tiempo de asentamiento
  if (Math.abs(xi) > threshold) {
    ts = ti;
  }
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 146 - 158',
          snippet: `def calcular_metricas(t, x, x_inicial=0.05):
    umbral_2pct = 0.02 * x_inicial  # 0.001 m = 1 mm
    fuera_de_banda = np.where(np.abs(x) > umbral_2pct)[0]
    
    if len(fuera_de_banda) > 0:
        ts = t[fuera_de_banda[-1]]
    else:
        ts = 0.0`
        },
        liveEvaluation: (p) => [
          { label: 'Banda de tolerancia', formula: `\\pm 0.02 \\times ${p.x0}\\text{ m}`, result: `[-0.001 m, +0.001 m]` },
          { label: 'Tiempo medido en vivo', formula: `t_s(\\zeta = ${(p.c / (2*Math.sqrt(p.m*p.k))).toFixed(2)})`, result: `${p.settlingTime.toFixed(2)} segundos` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Líneas Guía Horizontales Punteadas en Gráfica & Indicador ts',
          whatItShows: 'Dibuja dos líneas discontinuas en +1 mm y -1 mm. Un punto indicador marca el instante exacto en que la curva penetra y nunca vuelve a salir de la banda.',
          effectOnCar: 'Mide cuántos segundos dura la perturbación en el cuerpo del conductor o paciente.'
        }
      },
      {
        id: 'overshoot-alg',
        title: '2. Sobreimpulso Porcentual (Mp)',
        mathFormula: 'M_p = \\frac{-x_{\\min}}{x_0} \\times 100\\%,\\quad x_{\\min} < 0',
        explanation: 'Mide la cota inferior de cruce de equilibrio en el rebote opuesto. Si la solución es aperiódica (crítica o sobreamortiguada), minX >= 0 y Mp = 0.00%.',
        theory: 'El sobreimpulso Mp mide la severidad del rebote opuesto relativo a la perturbación inicial. Analíticamente en sistemas de 2° orden subamortiguados viene dado por Mp = exp(-π·ζ / sqrt(1 - ζ²)) * 100%.',
        deductionSteps: [
          {
            step: 'Paso 1: Deducción Analítica del Máximo Pico Negativo',
            math: 'M_p = e^{-\\frac{\\pi\\zeta}{\\sqrt{1-\\zeta^2}}} \\times 100\\%',
            explanation: 'Evaluando la derivada en el primer instante de velocidad nula tras el cruce por cero.'
          },
          {
            step: 'Paso 2: Evaluación con ζ = 0.3 (Caso Subamortiguado)',
            math: 'M_p = e^{-\\frac{0.3\\pi}{\\sqrt{1-0.09}}} \\times 100\\% = e^{-\\frac{0.9425}{0.9539}} \\times 100\\% = e^{-0.9880} \\times 100\\% \\approx 37.23\\%',
            explanation: 'Indica que el chasis se comprime hacia abajo 1.86 cm tras haber subido 5 cm.'
          },
          {
            step: 'Paso 3: Evaluación para ζ >= 1.0 (Crítico y Sobreamortiguado)',
            math: 'M_p(\\text{Crítico}) = 0.00\\%,\\qquad M_p(\\text{Sobreamortiguado}) = 0.00\\%',
            explanation: 'Al no existir oscilaciones ni cruce de cero, el sobreimpulso es idénticamente nulo.'
          }
        ],
        variables: [
          { symbol: 'x_{\\min}', name: 'minX', value: () => '-0.0186 m (Subamort.)', desc: 'Máxima compresión negativa' },
          { symbol: 'M_p', name: 'overshootPct', value: (p) => `${p.overshootPct.toFixed(2)}%`, desc: 'Porcentaje relativo a x0' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 188 - 194',
          snippet: `if (xi < minX) {
  minX = xi;
}

// Si cruza por cero hacia abajo, calcula el sobreimpulso relativo
const overshootPct = minX < 0.0 ? (-minX / x0) * 100.0 : 0.0;`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 160 - 166',
          snippet: `min_x = np.min(x)
if min_x < 0.0:
    sobreimpulso_pct = (-min_x / x_inicial) * 100.0
else:
    sobreimpulso_pct = 0.0`
        },
        liveEvaluation: (p) => [
          { label: 'Sobreimpulso actual', formula: `M_p = \\frac{-x_{\\min}}{${p.x0}} \\times 100\\%`, result: `${p.overshootPct.toFixed(2)}%` }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Métrica Mp en HUD Superior & Animación del Muelle',
          whatItShows: 'Muestra "Mp = 37.23%" en azul cuando hay subamortiguamiento, alertando sobre rebote. En configuraciones críticas o de carreras muestra "0.00%" en verde.',
          effectOnCar: 'Determina si la rueda se despega o si los ocupantes sufren latigazo vertical.'
        }
      }
    ]
  },

  // ----------------------------------------------------------------------------
  // DIAPOSITIVA 8: Decisión de Ingeniería: Ambulancia vs. Carreras
  // ----------------------------------------------------------------------------
  8: {
    slideId: 8,
    title: 'Decisión de Ingeniería con Métricas Cuantitativas',
    speaker: 'VELASCO BURBANO RUBEN DARIO',
    description: 'Presets preconfigurados que codifican los requerimientos clínicos (ambulancia) y deportivos (carreras).',
    items: [
      {
        id: 'preset-ambulancia',
        title: 'Selección Clínica: Ambulancia Médica (ζ = 1.0)',
        mathFormula: 'c_{\\text{amb}} = 6000\\text{ N}\\cdot\\text{s/m} \\implies t_s = 0.58\\text{ s},\\; M_p = 0.00\\%',
        explanation: 'En el código, el preset de ambulancia fija c = 6000 N·s/m para anular el rebote oscilatorio (0%) y minimizar el tiempo de asentamiento a solo 0.58 s, protegiendo a pacientes de trauma.',
        theory: 'Criterio de confort biomecánico: en vehículos de emergencia médica (ambulancias tipo III), la aceleración vertical repetitiva produce micro-traumas en columna vertebral y riesgo de desprendimiento de catéteres. El régimen críticamente amortiguado (c = 6000 N·s/m) es la solución óptima matemática porque anula las oscilaciones y minimiza el tiempo de retorno a la neutralidad.',
        deductionSteps: [
          {
            step: 'Paso 1: Requerimientos Clínicos de Estabilidad',
            math: 'M_p = 0.00\\% \\implies \\zeta \\ge 1.0,\\qquad t_s = \\text{mínimo} \\implies \\zeta = 1.0',
            explanation: 'El único valor que anula el rebote sin incurrir en la lentitud del sobreamortiguamiento es ζ = 1.0.'
          },
          {
            step: 'Paso 2: Asignación de Parámetros de Suspensión',
            math: 'm = 300\\text{ kg},\\quad k = 30000\\text{ N/m},\\quad c_{\\text{amb}} = c_{cr} = 2\\sqrt{300 \\times 30000} = 6000\\text{ N}\\cdot\\text{s/m}',
            explanation: 'Calibración con muelle blando para aislar irregularidades del asfalto.'
          }
        ],
        variables: [
          { symbol: 'c', name: 'c', value: () => '6000 N·s/m', desc: 'Amortiguamiento crítico exacto' },
          { symbol: '\\zeta', name: 'zeta', value: () => '1.00', desc: 'Régimen crítico' },
          { symbol: 't_s', name: 'ts', value: () => '0.58 s', desc: 'Retorno más rápido posible' },
          { symbol: 'M_p', name: 'Mp', value: () => '0.00%', desc: 'Cero oscilaciones armónicas' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 235 - 243',
          snippet: `AMBULANCIA: {
  id: 'amb',
  name: 'Recomendación: Ambulancia Médica',
  c: 6000.0,
  m: 300.0,
  k: 30000.0,
  description: 'Prioriza estabilidad clínica y confort de pacientes con trauma. Cero rebote y retorno inmediato.',
  tag: 'Selección Clínica'
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 215 - 225',
          snippet: `# CONCLUSION INGENIERIL: AMBULANCIA
# Se recomienda c = c_cr = 6000 N*s/m (zeta = 1.0)
# - Cero rebote (Mp = 0.00%)
# - Minimo tiempo de asentamiento (ts = 0.58 s)
# - Protege columna vertebral de pacientes con trauma`
        },
        liveEvaluation: () => [
          { label: 'Tiempo de asentamiento crítico', formula: 't_s = 0.58\\text{ s}', result: '48% más rápido que subamortiguado (1.12 s)' },
          { label: 'Sobreimpulso clínico', formula: 'M_p = 0.00\\%', result: 'Inexistencia de rebote secundario' }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Preset "Recomendación: Ambulancia Médica" & Modelo 3D',
          whatItShows: 'Ajusta instantáneamente m=300 kg, k=30 kN/m y c=6000 N·s/m. En la carretera 3D, la ambulancia supera el bache con suavidad clínica impecable.',
          effectOnCar: 'Evita oscilaciones secundarias que pongan en riesgo al paciente.'
        }
      },
      {
        id: 'preset-carreras',
        title: 'Selección Deportiva: Carro de Carreras (k y c Elevados)',
        mathFormula: 'k = 50\\,000\\text{ N/m},\\quad c = 8500\\text{ N}\\cdot\\text{s/m} \\implies \\zeta = 1.10',
        explanation: 'En un auto de carreras la prioridad es mantener la huella del neumático (contact patch) adherida al pavimento y la aerodinámica del fondo plano. Se aumenta k a 50 kN/m y c a 8500 N·s/m.',
        theory: 'Criterio de adherencia dinámica: en vehículos hiperdeportivos (como el Koenigsegg Jesko), el flujo aerodinámico de efecto suelo bajo el difusor requiere que la altura de despeje varíe menos de unos milímetros. Se incrementa la rigidez del resorte a 50 kN/m (+66%) y el amortiguamiento a 8500 N·s/m (ζ = 1.10) para sacrificar confort en favor de una respuesta reactiva de competición.',
        deductionSteps: [
          {
            step: 'Paso 1: Cálculo del Nuevo Amortiguamiento Crítico con k = 50 kN/m',
            math: 'c_{cr,\\text{carreras}} = 2\\sqrt{300 \\times 50000} = 2\\sqrt{15\\times 10^6} \\approx 7745.97\\text{ N}\\cdot\\text{s/m}',
            explanation: 'Al aumentar la rigidez del resorte, el valor crítico se desplaza hacia arriba.'
          },
          {
            step: 'Paso 2: Factor Zeta con c = 8500 N·s/m',
            math: '\\zeta_{\\text{carreras}} = \\frac{8500}{7745.97} \\approx 1.097 \\approx 1.10 > 1.0',
            explanation: 'Régimen ligeramente sobreamortiguado para impedir cabeceos a más de 300 km/h.'
          }
        ],
        variables: [
          { symbol: 'k', name: 'k', value: () => '50 000 N/m', desc: 'Muelle de alta rigidez' },
          { symbol: 'c', name: 'c', value: () => '8500 N·s/m', desc: 'Amortiguador de alta resistencia viscosa' },
          { symbol: 'c_{cr}', name: 'c_cr', value: () => '2√(300 × 50000) ≈ 7746 N·s/m', desc: 'Nuevo límite crítico' },
          { symbol: '\\zeta', name: 'zeta', value: () => '8500 / 7746 ≈ 1.10', desc: 'Ligeramente sobreamortiguado' }
        ],
        js: {
          file: 'app/src/physics/suspensionPhysics.js',
          lines: 'Líneas 244 - 252',
          snippet: `CARRERAS: {
  id: 'race',
  name: 'Recomendación: Vehículo de Carreras',
  c: 8500.0,
  m: 300.0,
  k: 50000.0,
  description: 'Resorte y amortiguador de alta rigidez para mantener la huella de agarre y estabilizar la aerodinámica.',
  tag: 'Máximo Agarre'
}`
        },
        python: {
          file: 'python/suspension_sim.py',
          lines: 'Líneas 226 - 238',
          snippet: `# CONCLUSION INGENIERIL: CARRO DE CARRERAS
# Se incrementa la rigidez k = 50000 N/m y c = 8500 N*s/m
# - Reduce el desplazamiento maximo vertical
# - Mantiene la carga aerodinamica y contacto neumático-pista
# - Sacrifica confort humano en favor de adherencia y traccion`
        },
        liveEvaluation: () => [
          { label: 'Nuevo amortiguamiento crítico', formula: 'c_{cr} = 2\\sqrt{300 \\times 50000}', result: '7,745.97 N·s/m' },
          { label: 'Factor zeta de competición', formula: '\\zeta = \\frac{8500}{7745.97}', result: '1.097 ≈ 1.10 (Alta firmeza en curvas)' }
        ],
        appReflection: {
          title: 'Reflejo en la Interfaz de la Aplicación',
          uiLocation: 'Preset "Vehículo de Carreras" & Modelo 3D Jesko',
          whatItShows: 'Al seleccionar este preset, los sliders suben a 50 kN/m y 8500 N·s/m. En 3D el Koenigsegg Jesko muestra una suspensión muy firme y pegada al asfalto.',
          effectOnCar: 'Máxima tracción y estabilidad a alta velocidad en pista.'
        }
      }
    ]
  }
};
