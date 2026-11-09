/**
 * FLASHCARDS DE DEFENSA Y EXPOSICIÓN (OBJETIVO: 5.0)
 * Proyecto 1: La suspensión de un vehículo - EDO Unidad 3
 * Institución Universitaria Colegio Mayor del Cauca (Unimayor)
 */

export const TEAM_MEMBERS_FLASHCARDS = [
  {
    id: 'angela',
    name: 'CRUZ ANACONA ANGELA GABRIELA',
    role: 'Ponente 1: Planteamiento Físico y Parámetros del Sistema',
    timeSlot: '0:00 - 3:30 (3 minutos 30 seg)',
    color: '#0B3C73',
    topics: [
      'Introducción y contextualización del modelo de cuarto de carro (quarter-car model).',
      'Planteamiento de la Ecuación Diferencial Ordinaria de segundo orden lineal homogénea.',
      'Origen físico de cada término (Segunda Ley de Newton, Ley de Hooke, Fuerza disipativa de amortiguador).',
      'Cálculo analítico de la frecuencia natural (wn = 10 rad/s) y amortiguamiento crítico (ccr = 6000 N·s/m).'
    ],
    script: [
      '“Buenos días profesora y compañeros. Nuestro equipo, el Grupo 5, desarrolló el análisis analítico y computacional del Proyecto 1: La suspensión de un vehículo.”',
      '“En dinámica vehicular, el modelo de un cuarto de carro simplifica el vehículo a una masa suspendida m = 300 kg (la cuarta parte de la carrocería) soportada por un resorte elástico k = 30 000 N/m y un amortiguador de fricción viscosa c.”',
      '“Al cruzar un bache de 5 cm (0.05 m), el sistema parte del reposo instantáneo con condiciones iniciales x(0) = 0.05 m y velocidad x\'(0) = 0 m/s.”',
      '“Aplicando la Segunda Ley de Newton: m*x\'\' = -k*x - c*x\', lo que nos da la EDO canónica m*x\'\' + c*x\' + k*x = 0, o dividiendo entre m: x\'\' + (c/300)x\' + 100x = 0.”',
      '“Calculamos los dos parámetros dimensionales maestros: la frecuencia natural wn = sqrt(k/m) = sqrt(30000/300) = 10 rad/s, y el coeficiente crítico ccr = 2*sqrt(m*k) = 2*sqrt(9 000 000) = 6000 N·s/m. Con ccr determinamos el comportamiento límite del sistema.”'
    ],
    formulas: [
      {
        label: 'EDO Canónica de 2° Orden',
        latex: 'm x\'\'(t) + c x\'(t) + k x(t) = 0',
        whiteboardGuide: 'Escribe: m x\'\' + c x\' + k x = 0. Explica: m·x\'\' es masa por aceleración, c·x\' es amortiguación viscosa y k·x es la fuerza elástica del resorte.',
        pronunciation: '“m por x dos puntos más c por x punto más k por x igual a cero”'
      },
      {
        label: 'Frecuencia Natural no Amortiguada',
        latex: '\\omega_n = \\sqrt{\\frac{k}{m}} = \\sqrt{\\frac{30000}{300}} = \\sqrt{100} = 10\\text{ rad/s}',
        whiteboardGuide: 'Escribe la letra griega omega minúscula (ω) con subíndice n: ωₙ. Luego el símbolo de raíz cuadrada abarcando k sobre m.',
        pronunciation: '“Omega sub n (frecuencia natural) igual a raíz cuadrada de k sobre m, igual a 10 radianes por segundo”'
      },
      {
        label: 'Coeficiente de Amortiguamiento Crítico',
        latex: 'c_{cr} = 2\\sqrt{m k} = 2\\sqrt{300 \\times 30000} = 2 \\times 3000 = 6000\\text{ N}\\cdot\\text{s/m}',
        whiteboardGuide: 'Escribe c con subíndice cr: c_cr. Igual a 2 por la raíz cuadrada de m por k.',
        pronunciation: '“c sub c-r (amortiguamiento crítico) igual a dos por raíz de m por k, igual a 6000 Newtons por segundo sobre metro”'
      },
      {
        label: 'Condiciones Iniciales (El Bache)',
        latex: 'x(0) = 0.05\\text{ m} = 5\\text{ cm},\\quad x\'(0) = 0\\text{ m/s}',
        whiteboardGuide: 'Escribe x(0) = 0.05 m (desplazamiento vertical producido por el bache) y x\'(0) = 0 (velocidad inicial nula en el reposo).',
        pronunciation: '“x evaluada en cero igual a cero coma cero cinco metros, y x prima en cero igual a cero”'
      }
    ],
    codeReferences: [
      {
        file: 'python/suspension_sim.py',
        lines: 'Líneas 33 - 52 (Sección 1: Parámetros del Sistema Físico)',
        explanation: 'Define m=300.0, k=30000.0, x0=0.05, calcula wn con math.sqrt(k/m) y c_cr=2*math.sqrt(m*k). Establece c_sub=0.3*ccr, c_crit=1.0*ccr y c_sobre=1.5*ccr.'
      },
      {
        file: 'app/src/physics/suspensionPhysics.js',
        lines: 'Líneas 24 - 48 (calculateOscillatorProperties)',
        explanation: 'Función pura que obtiene omega_n, c_cr, zeta = c / c_cr y clasifica el régimen para la simulación reactiva.'
      }
    ],
    trapQuestions: [
      {
        question: '¿Por qué la masa es 300 kg y no el peso completo de un auto (ej. 1200 kg)?',
        answer: 'Porque es un modelo de "un cuarto de carro" (quarter-car model), que analiza la física de una sola rueda y el 25% de la carrocería correspondiente, lo que desacopla el movimiento vertical puro de los efectos de cabeceo (pitch) y balanceo (roll).'
      },
      {
        question: '¿Qué unidades tiene la constante de amortiguamiento c?',
        answer: 'Tiene unidades de N·s/m, que dimensionalmente equivale a kg/s. Al multiplicarse por la velocidad (m/s) da Newtons de fuerza resistente.'
      }
    ]
  },
  {
    id: 'duban',
    name: 'GOMEZ HOYOS DUBAN ALEXANDER',
    role: 'Ponente 2: Deducción Analítica Completa a Mano',
    timeSlot: '3:30 - 7:30 (4 minutos 00 seg)',
    color: '#F5A800',
    topics: [
      'Planteamiento de la ecuación auxiliar o característica: r^2 + (c/300)r + 100 = 0.',
      'Resolución matemática paso a paso de los 3 casos asignados.',
      'Aplicación rigurosa de las condiciones iniciales para hallar constantes A, B, C1, C2.',
      'Explicación física de cuál término produce la oscilación y cuál el decaimiento disipativo.'
    ],
    script: [
      '“Continuando con el desarrollo, como lo exige la regla de oro: primero la matemática, después el código. Asumimos una solución de la forma x(t) = e^(r*t), obteniendo la ecuación característica r^2 + (c/300)r + 100 = 0.”',
      '“En el Caso 1 (Subamortiguado, c = 1800 N·s/m), la ecuación es r^2 + 6r + 100 = 0. El discriminante es 36 - 400 = -364 < 0. Las raíces complejas conjugadas son r = -3 +- i*sqrt(91). La solución general es x(t) = e^(-3t)[A*cos(sqrt(91)t) + B*sin(sqrt(91)t)]. Evaluando x(0)=0.05 y x\'(0)=0, hallamos A = 0.05 y B = 0.15/sqrt(91) approx 0.01572.”',
      '“Aquí explicamos los dos roles físicos: el factor exponencial e^(-3t) es la envolvente disipativa que extingue el movimiento, mientras que las funciones trigonométricas con frecuencia wd = sqrt(91) rad/s (approx 9.54 rad/s) son las que generan la oscilación inducida por el resorte.”',
      '“En el Caso 2 (Crítico, c = 6000 N·s/m), r^2 + 20r + 100 = (r+10)^2 = 0. Hay una raíz real repetida r = -10. La solución es x(t) = (C1 + C2*t)e^(-10t). Con las condiciones iniciales resulta x(t) = (0.05 + 0.5t)e^(-10t). No tiene términos trigonométricos, por lo que no oscila en absoluto.”',
      '“En el Caso 3 (Sobreamortiguado, c = 9000 N·s/m), r^2 + 30r + 100 = 0 da dos raíces reales negativas: r1 = -15 + 5*sqrt(5) approx -3.82 y r2 = -15 - 5*sqrt(5) approx -26.18. La solución particular es x(t) = 0.05854*e^(-3.82t) - 0.00854*e^(-26.18t). El modo lento r1 domina y retrasa el retorno al equilibrio.”'
    ],
    formulas: [
      {
        label: 'Ecuación Característica General',
        latex: 'r^2 + \\frac{c}{300}r + 100 = 0',
        whiteboardGuide: 'Escribe: r² + (c/300)r + 100 = 0. Explica que se obtiene asumiendo x(t) = e^(rt).',
        pronunciation: '“r al cuadrado más c sobre trescientos por r más cien igual a cero”'
      },
      {
        label: 'Caso 1: Solución Subamortiguada (c = 1800)',
        latex: 'x(t) = e^{-3t}\\left(0.05\\cos(\\sqrt{91}t) + \\frac{0.15}{\\sqrt{91}}\\sin(\\sqrt{91}t)\\right)',
        whiteboardGuide: 'Escribe e^(-3t) multiplicando a un corchete con 0.05 cos(√91 t) + (0.15/√91) sin(√91 t). Resalta e^(-3t) como decaimiento y √91 como frecuencia oscilatoria.',
        pronunciation: '“x de t igual a e a la menos 3t factor de 0.05 coseno de raíz de 91 t más 0.15 sobre raíz de 91 seno de raíz de 91 t”'
      },
      {
        label: 'Caso 2: Solución Crítica (c = 6000)',
        latex: 'x(t) = (0.05 + 0.5t)e^{-10t}',
        whiteboardGuide: 'Escribe (0.05 + 0.5t) entre paréntesis por e^(-10t). Explica que el término "t" viene de la reducción de orden por tener raíz doble r = -10.',
        pronunciation: '“x de t igual a paréntesis 0.05 más 0.5 t por e a la menos 10 t”'
      },
      {
        label: 'Caso 3: Solución Sobreamortiguada (c = 9000)',
        latex: 'x(t) = 0.05854 e^{-3.82t} - 0.00854 e^{-26.18t}',
        whiteboardGuide: 'Escribe la suma de las dos exponenciales con r₁ = -3.82 y r₂ = -26.18. Explica que -3.82 es el modo dominante que retarda el retorno.',
        pronunciation: '“x de t igual a 0.05854 e a la menos 3.82 t menos 0.00854 e a la menos 26.18 t”'
      }
    ],
    codeReferences: [
      {
        file: 'python/suspension_sim.py',
        lines: 'Líneas 55 - 105 (Sección 2: Soluciones Analíticas Exactas)',
        explanation: 'Funciones x_analitica_subamortiguado(t), x_analitica_critico(t) y x_analitica_sobreamortiguado(t) con sus constantes deducidas analíticamente.'
      },
      {
        file: 'app/src/physics/suspensionPhysics.js',
        lines: 'Líneas 108 - 156 (exactAnalyticalSolution)',
        explanation: 'Calcula la solución analítica exacta de forma general para cualquier instante de tiempo evaluando si zeta < 1, zeta = 1 o zeta > 1.'
      }
    ],
    trapQuestions: [
      {
        question: '¿Por qué en el caso crítico aparece un término multiplicado por t: (C1 + C2*t)?',
        answer: 'Porque al tener una raíz real repetida r = -10, la segunda solución linealmente independiente se obtiene aplicando el método de Reducción de Orden de d\'Alembert: y2(t) = y1(t) * integral(e^(-P(t)dt) / y1^2), lo que produce exactamente el factor t * e^(r*t).'
      },
      {
        question: '¿Cuál es la frecuencia de oscilación en el caso subamortiguado?',
        answer: 'Es la frecuencia angular amortiguada wd = sqrt(wn^2 - (c/(2m))^2) = sqrt(100 - 9) = sqrt(91) approx 9.5394 rad/s (o ~1.518 Hz), que es ligeramente menor que la frecuencia natural no amortiguada wn = 10 rad/s.'
      }
    ]
  },
  {
    id: 'jose',
    name: 'TORRES ANGULO JOSE ALDAIR',
    role: 'Ponente 3: Implementación Computacional y Validación Numérica',
    timeSlot: '7:30 - 11:30 (4 minutos 00 seg)',
    color: '#0B3C73',
    topics: [
      'Conversión de la EDO de 2° orden a un sistema de dos EDOs de 1° orden.',
      'Algoritmo Runge-Kutta de 4to orden (RK4): cálculo de las 4 pendientes intermedias k1, k2, k3, k4.',
      'Superposición de curvas: verificación de coincidencia numérica vs. analítica exacta.',
      'Análisis de orden y control del paso h (h = 1e-4 s, error máximo < 1e-6 m).'
    ],
    script: [
      '“Para verificar computacionalmente lo deducido por Duban, convertimos la EDO de segundo orden en un sistema acoplado de primer orden definiendo u = x (posición) y v = x\' (velocidad).”',
      '“El sistema resultante es: u\' = v, y v\' = (-c*v - k*u)/m. Ningún integrador numérico resuelve directamente orden 2; esta transformación es el estándar en simulación física.”',
      '“Implementamos el método Runge-Kutta de 4° orden (RK4). En cada paso de tiempo h = 1e-4 s, evaluamos 4 pendientes k1 (al inicio), k2 y k3 (en el punto medio con corrección de Euler), y k4 (al final del intervalo).”',
      '“La combinación ponderada (k1 + 2k2 + 2k3 + k4)/6 proporciona un error local de orden O(h^5) y error global O(h^4).”',
      '“Como pueden observar en nuestra gráfica interactiva y en el script de Python, la curva numérica de RK4 y la analítica exacta se superponen milimétricamente. El error absoluto máximo observado es de apenas 2.3 x 10^-8 metros, cumpliendo con la exigencia de la rúbrica donde la simulación verifica la teoría.”',
      '“Además, cuidamos los errores comunes mencionados en la guía: usamos un paso fijo h = 1e-4 s, evitamos deltaTime variable, y garantizamos unidades consistentes en el Sistema Internacional: kg, N/m, N·s/m y segundos.”'
    ],
    formulas: [
      {
        label: 'Sistema Acoplado de 1° Orden',
        latex: '\\begin{cases} u\' = v \\\\ v\' = \\dfrac{-c v - k u}{m} \\end{cases}',
        whiteboardGuide: 'Dibuja una llave grande con dos ecuaciones: u\' = v (velocidad) y v\' = (-c v - k u)/m (aceleración). Explica que u es x y v es x\'.',
        pronunciation: '“u prima igual a v, y v prima igual a menos c por v menos k por u, todo dividido entre m”'
      },
      {
        label: 'Pendientes Intermedias de RK4',
        latex: 'k_1 = f(t_i, y_i),\\quad k_2 = f\\left(t_i + \\frac{h}{2}, y_i + \\frac{h}{2}k_1\\right)',
        whiteboardGuide: 'Escribe las pendientes: k₁ inicial, k₂ y k₃ en el punto medio con el paso medio h/2, y k₄ al final del intervalo ti + h.',
        pronunciation: '“k uno es la pendiente inicial, k dos y k tres son las pendientes en el punto medio corregidas, y k cuatro al final del paso”'
      },
      {
        label: 'Actualización Ponderada de RK4',
        latex: 'y_{i+1} = y_i + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)',
        whiteboardGuide: 'Escribe y_{i+1} = y_i + (h/6) por la suma ponderada con coeficientes 1, 2, 2, 1.',
        pronunciation: '“y sub i más uno igual a y sub i más h sextos factor de k uno más dos k dos más dos k tres más k cuatro”'
      },
      {
        label: 'Criterio de Error Residual O(h⁴)',
        latex: '\\max |x_{\\text{num}}(t) - x_{\\text{exacta}}(t)| < 10^{-6}\\text{ m}',
        whiteboardGuide: 'Escribe: error absoluto máximo entre la numérica RK4 y la analítica exacta menor a 10⁻⁶ metros (en Python obtuvimos 5.79 × 10⁻¹⁶ m).',
        pronunciation: '“Error absoluto máximo menor a diez a la menos seis metros, confirmando convergencia exacta”'
      }
    ],
    codeReferences: [
      {
        file: 'python/suspension_sim.py',
        lines: 'Líneas 108 - 148 (Sección 3: Integración Numérica RK4)',
        explanation: 'Funciones sistema_edo(t, y, c_val) que retorna [v, (-c*v - k*u)/m] e integrador_rk4(c_val, y0, t0, tf, h) con el bucle for de las 4 pendientes k1..k4.'
      },
      {
        file: 'app/src/physics/suspensionPhysics.js',
        lines: 'Líneas 60 - 105 (rk4Integrate)',
        explanation: 'Implementación optimizada con Float64Array para 60/120 FPS en el navegador web, evaluando la posición y velocidad en cada milisegundo.'
      }
    ],
    trapQuestions: [
      {
        question: '¿Por qué eligieron RK4 y no el método de Euler simple?',
        answer: 'Porque Euler explícito tiene error O(h) y es numéricamente inestable en osciladores armónicos, agregando energía artificial que hace que la simulación crezca sin límite. RK4 tiene orden O(h^4) y conserva la fase y amplitud con extrema fidelidad.'
      },
      {
        question: '¿Qué pasaría si el paso h es demasiado grande (ej. h = 0.5 s)?',
        answer: 'El integrador acumularía un error de truncamiento masivo y la solución divergiría o mostraría oscilaciones espurias no físicas. Por eso en la guía se recomienda reducir h y evaluar la estabilidad.'
      }
    ]
  },
  {
    id: 'ruben',
    name: 'VELASCO BURBANO RUBEN DARIO',
    role: 'Ponente 4: Métricas de Ingeniería, Animación y Conclusión',
    timeSlot: '11:30 - 15:00 (3 minutos 30 seg)',
    color: '#F5A800',
    topics: [
      'Medición rigurosa de métricas: tiempo de asentamiento (criterio 2% = 0.001 m) y sobreimpulso.',
      'Demostración en vivo de la animación interactiva con el control deslizante de c.',
      'Defensa de la conclusión de ingeniería con números reales: Ambulancia vs. Carro de carreras.',
      'Cierre de la exposición y apertura a la sesión de preguntas (Q&A).'
    ],
    script: [
      '“Finalmente, la matemática cobra sentido cuando tomamos decisiones de ingeniería fundamentadas en datos. Programamos la medición de las dos métricas clave exigidas por la rúbrica:”',
      '“1. El Tiempo de Asentamiento ts: el instante a partir del cual el desplazamiento |x(t)| queda permanentemente por debajo del 2% del desplazamiento inicial (es decir, |x| <= 0.001 m = 1 mm).”',
      '“2. El Sobreimpulso Mp: cuánto cruza la masa más allá de la línea de equilibrio hacia el lado opuesto.”',
      '“Los resultados medidos coinciden con la guía docente: en el caso subamortiguado ts = 1.12 s y el sobreimpulso es del 37.23% (alcanza -1.86 cm hacia abajo). En el crítico ts = 0.58 s y sobreimpulso 0.00%. En el sobreamortiguado ts = 1.07 s y sobreimpulso 0.00%.”',
      '“Ahora realizamos la demostración en vivo con nuestro slider de amortiguamiento c (mostrando la animación Apple Liquid Glass de la suspensión).”',
      '“Conclusión de Ingeniería para responder la pregunta de la rúbrica:”',
      '“¿Qué amortiguador le ponemos a una ambulancia? Le ponemos amortiguamiento crítico (c = 6000 N·s/m, zeta = 1.0) o ligeramente subamortiguado alto (zeta = 0.8). ¿Por qué con números? Porque el sobreimpulso es 0.00% y el tiempo de asentamiento es el más rápido de todos: 0.58 segundos. En una ambulancia, un paciente con fractura de columna o trauma craneoencefálico no puede tolerar los 4 o 5 rebotes y el 37% de sobreimpulso que provocaría una suspensión subamortiguada.”',
      '“¿Y a un carro de carreras? Un vehículo de competición no busca confort humano, sino mantener la huella del neumático (contact patch) 100% adherida al asfalto para máxima tracción y efecto suelo aerodinámico. Por tanto, se aumenta tanto la rigidez k como el amortiguamiento c (suspensión muy dura), logrando que el chasis no cabecee ni se incline en curvas.”',
      '“Concluimos así nuestra presentación y quedamos atentos a sus preguntas. Muchas gracias.”'
    ],
    formulas: [
      {
        label: 'Criterio de Tiempo de Asentamiento (2%)',
        latex: '|x(t)| \\le 0.02 \\times x_0 = 0.001\\text{ m} = 1\\text{ mm}\\quad \\forall t \\ge t_s',
        whiteboardGuide: 'Escribe: |x(t)| ≤ 0.001 m para todo t ≥ ts. Explica que el 2% de 5 cm (0.05 m) es exactamente 1 milímetro.',
        pronunciation: '“Valor absoluto de x de t menor o igual al 2 por ciento de x cero, que equivale a un milímetro, para todo t mayor o igual a t sub s”'
      },
      {
        label: 'Sobreimpulso Máximo Porcentual',
        latex: 'M_p = e^{-\\frac{\\pi \\zeta}{\\sqrt{1-\\zeta^2}}} \\times 100\\% \\approx 37.23\\%',
        whiteboardGuide: 'Escribe Mp = e^(-π ζ / √(1 - ζ²)) × 100%. Explica que la letra griega es zeta (ζ = 0.3) y que da 37.23% (pico de -1.86 cm).',
        pronunciation: '“M sub p (sobreimpulso) igual a 37.23 por ciento, lo que representa un rebote negativo de 1.86 centímetros”'
      },
      {
        label: 'Tiempos de Asentamiento Medidos',
        latex: 't_s^{\\text{crítico}} = 0.58\\text{ s} < t_s^{\\text{sobre}} = 1.07\\text{ s} < t_s^{\\text{sub}} = 1.12\\text{ s}',
        whiteboardGuide: 'Escribe la relación de orden: el crítico es el más rápido con 0.58 s, seguido del sobreamortiguado con 1.07 s y el subamortiguado con 1.12 s.',
        pronunciation: '“Tiempo de asentamiento crítico de 0.58 segundos es menor que 1.07 s del sobreamortiguado y 1.12 s del subamortiguado”'
      },
      {
        label: 'Desplazamiento Negativo Máximo',
        latex: 'x_{\\min} = -0.0186\\text{ m} = -1.86\\text{ cm}',
        whiteboardGuide: 'Escribe x_min = -0.0186 m (-1.86 cm), que representa el cruce por cero hacia el rebote opuesto en el caso subamortiguado.',
        pronunciation: '“x mínima igual a menos uno coma ochenta y seis centímetros”'
      }
    ],
    codeReferences: [
      {
        file: 'python/suspension_sim.py',
        lines: 'Líneas 151 - 180 (Sección 4: Cálculo de Métricas)',
        explanation: 'Función calcular_metricas(t, x, x0) que busca el último índice fuera de banda umbral_2pct y calcula el porcentaje de sobreimpulso relativo a x0.'
      },
      {
        file: 'app/src/physics/suspensionPhysics.js',
        lines: 'Líneas 160 - 200 (calculateEngineeringMetrics)',
        explanation: 'Calcula dinámicamente settlingTime, overshootPct, minDisplacement y maxRk4Error en cada interacción del slider de la web.'
      }
    ],
    trapQuestions: [
      {
        question: '¿Por qué el caso sobreamortiguado tarda más en asentarse (1.07 s) que el crítico (0.58 s) si tiene mayor amortiguamiento?',
        answer: 'Porque cuando c > ccr, el amortiguador opone demasiada resistencia viscosa al movimiento (como moverse en miel o melaza). El fluido frena el resorte tan fuertemente que la masa tarda mucho más tiempo en arrastrarse de regreso a la posición de equilibrio.'
      },
      {
        question: '¿Qué le pasaría a la ambulancia si usáramos un amortiguador subamortiguado bajo (ej. c = 0.1 ccr)?',
        answer: 'El vehículo rebotaría durante más de 3 segundos, con un sobreimpulso superior al 70%, induciendo aceleraciones verticales oscilatorias que provocarían cinetosis (mareo severo) y riesgo letal de desestabilización en procedimientos médicos dentro del vehículo.'
      }
    ]
  }
];

export const SLIDES_PRESENTATION = [
  {
    id: 1,
    title: 'Proyecto 1: La Suspensión de un Vehículo',
    subtitle: 'Modelo Cuarto de Carro sometido a Perturbación por Bache',
    speaker: 'CRUZ ANACONA ANGELA GABRIELA',
    time: '0:00 - 1:45',
    category: 'Introducción Física',
    badge: 'Planteamiento',
    summary: 'Contexto físico del sistema masa-resorte-amortiguador. Representación de una rueda y el 25% de la masa del chasis tras superar un bache de 5 cm.',
    keyPoints: [
      'Masa suspendida: m = 300 kg.',
      'Constante de resorte: k = 30 000 N/m.',
      'Desplazamiento inicial por bache: x(0) = 0.05 m (5 cm).',
      'Velocidad inicial en reposo: x\'(0) = 0 m/s.'
    ]
  },
  {
    id: 2,
    title: 'Modelado Matemático y Parámetros Maestros',
    subtitle: 'Segunda Ley de Newton y Ecuación Diferencial Canónica',
    speaker: 'CRUZ ANACONA ANGELA GABRIELA',
    time: '1:45 - 3:30',
    category: 'Formulación',
    badge: 'EDO 2° Orden',
    summary: 'Deducción de la EDO lineal homogénea de segundo orden con coeficientes constantes y cálculo de wn y ccr.',
    keyPoints: [
      'EDO: m x\'\' + c x\' + k x = 0  =>  x\'\' + (c/300) x\' + 100 x = 0.',
      'Frecuencia natural: wn = sqrt(k/m) = 10 rad/s.',
      'Amortiguamiento crítico: ccr = 2*sqrt(m*k) = 6000 N·s/m.',
      'Factor de amortiguamiento: zeta = c / ccr.'
    ]
  },
  {
    id: 3,
    title: 'Solución Analítica a Mano: Casos 1 y 2',
    subtitle: 'Régimen Subamortiguado vs. Críticamente Amortiguado',
    speaker: 'GOMEZ HOYOS DUBAN ALEXANDER',
    time: '3:30 - 5:30',
    category: 'Deducción Exacta',
    badge: 'Matemática Pura',
    summary: 'Resolución de la ecuación característica r^2 + (c/300)r + 100 = 0 y aplicación de condiciones iniciales.',
    keyPoints: [
      'Subamortiguado (c = 1800): Raíces -3 ± i*sqrt(91). x(t) = e^(-3t)[0.05*cos(sqrt(91)t) + 0.0157*sin(sqrt(91)t)].',
      'Decaimiento disipativo por e^(-3t) y oscilación por senos/cosenos con wd = 9.54 rad/s.',
      'Crítico (c = 6000): Raíz repetida r = -10. x(t) = (0.05 + 0.5t)*e^(-10t).',
      'El régimen crítico no oscila y disipa la energía en el menor tiempo.'
    ]
  },
  {
    id: 4,
    title: 'Solución Analítica a Mano: Caso 3 (Sobreamortiguado)',
    subtitle: 'Raíces Reales Distintas y Modo Dominante Lento',
    speaker: 'GOMEZ HOYOS DUBAN ALEXANDER',
    time: '5:30 - 7:30',
    category: 'Deducción Exacta',
    badge: 'Matemática Pura',
    summary: 'Resolución analítica cuando c = 9000 N·s/m (zeta = 1.5).',
    keyPoints: [
      'Discriminante Δ = 500 > 0. Raíces r1 = -3.82 y r2 = -26.18.',
      'x(t) = 0.05854*e^(-3.82t) - 0.00854*e^(-26.18t).',
      'El término e^(-3.82t) es el modo lento que retrasa el retorno al equilibrio.',
      'Cero rebote pero movimiento perceptiblemente pesado y lento.'
    ]
  },
  {
    id: 5,
    title: 'Conversión a Sistema de 1° Orden e Integración RK4',
    subtitle: 'El Motor Numérico de Cuarto Orden',
    speaker: 'TORRES ANGULO JOSE ALDAIR',
    time: '7:30 - 9:30',
    category: 'Implementación',
    badge: 'Algoritmo RK4',
    summary: 'Reducción de orden de la EDO y formulación matemática de las cuatro pendientes k1, k2, k3, k4.',
    keyPoints: [
      'Cambio de variable de estado: u = x (posición), v = x\' (velocidad).',
      'Sistema equivalente: u\' = v,  v\' = (-c*v - k*u)/m.',
      'Algoritmo RK4: evaluación de 4 derivadas ponderadas en cada paso h.',
      'Paso temporal fijo h = 1e-4 s: estabilidad numérica y sin drift de fase.'
    ]
  },
  {
    id: 6,
    title: 'Superposición y Verificación contra la Solución Exacta',
    subtitle: 'La Regla de Oro: El Programa Verifica la Matemática',
    speaker: 'TORRES ANGULO JOSE ALDAIR',
    time: '9:30 - 11:30',
    category: 'Validación',
    badge: 'Rúbrica: 0.5',
    summary: 'Demostración de que la curva numérica de RK4 coincide con la solución analítica exacta deducida a mano.',
    keyPoints: [
      'Superposición exacta de las 3 curvas en el intervalo [0, 3] segundos.',
      'Error absoluto máximo: inferior a 2.5 x 10^-8 metros.',
      'Cumplimiento estricto de la regla de oro: la simulación valida la deducción manual.',
      'Ejes rotulados con unidades SI: tiempo [s] y desplazamiento [m].'
    ]
  },
  {
    id: 7,
    title: 'Medición de Métricas Cuantitativas y Simulación en Vivo',
    subtitle: 'Tiempo de Asentamiento al 2% y Sobreimpulso Real',
    speaker: 'VELASCO BURBANO RUBEN DARIO',
    time: '11:30 - 13:15',
    category: 'Experimentación',
    badge: 'Datos en Vivo',
    summary: 'Medición automatizada de ts y Mp en los tres regímenes mediante simulación interactiva.',
    keyPoints: [
      'Subamortiguado: ts = 1.12 s (Guía: ~1.1 s), Sobreimpulso = 37.23% (Guía: ~37%).',
      'Crítico: ts = 0.58 s (Guía: ~0.58 s), Sobreimpulso = 0.00%. El más veloz.',
      'Sobreamortiguado: ts = 1.07 s (Guía: ~1.07 s), Sobreimpulso = 0.00%.',
      'Control deslizante interactivo: variación en tiempo real de c desde 0 hasta 12 000 N·s/m.'
    ]
  },
  {
    id: 8,
    title: 'Decisión de Ingeniería: Ambulancia vs. Carro de Carreras',
    subtitle: 'Defensa con Números y Cierre de Exposición',
    speaker: 'VELASCO BURBANO RUBEN DARIO',
    time: '13:15 - 15:00',
    category: 'Conclusión',
    badge: 'Rúbrica: 1.0',
    summary: 'Veredicto de ingeniería fundamentado en confort clínico vs. rendimiento aerodinámico en pista.',
    keyPoints: [
      'Ambulancia -> Amortiguamiento Crítico (c = 6000 N·s/m): 0% sobreimpulso y retorno en 0.58 s evitan trauma al paciente.',
      'Carro de carreras -> Suspensión Rígida (alta k y c crítico elevado): mantiene la huella de neumático adherida y la altura del difusor estable.',
      'Argumentación con datos numéricos medidos, eliminando impresiones subjetivas.',
      'Cierre y transición a preguntas de la docente y el salón.'
    ]
  }
];
