/**
 * ==============================================================================
 * MOTOR DE SIMULACIÓN Y FÍSICA DE SUSPENSIÓN (EDO 2° ORDEN)
 * Asignatura: Ecuaciones Diferenciales - Unidad 3
 * Institución: Institución Universitaria Colegio Mayor del Cauca (Unimayor)
 * Grupo 5: Cruz Angela, Gómez Duban, Torres José, Velasco Rubén
 * ==============================================================================
 * Ecuación Diferencial:
 *   m * x''(t) + c * x'(t) + k * x(t) = 0
 *   x(0) = 0.05 m (bache de 5 cm),  x'(0) = 0 m/s
 *
 * Conversión a sistema de 1° orden para RK4:
 *   u = x
 *   v = x'
 *   u' = v
 *   v' = (-c*v - k*u) / m
 * ==============================================================================
 */

export const DEFAULT_PARAMS = {
  m: 300.0,      // kg (masa suspendida: un cuarto de carro)
  k: 30000.0,    // N/m (constante del resorte)
  x0: 0.05,      // m (desplazamiento inicial por bache: 5 cm)
  v0: 0.0,       // m/s (velocidad inicial en reposo)
  tf: 3.0,       // s (tiempo total de análisis según guía)
  h: 0.0005      // s (paso de integración temporal)
};

/**
 * Calcula las propiedades fundamentales del oscilador amortiguado
 */
export function calculateOscillatorProperties(m, k, c) {
  const omega_n = Math.sqrt(k / m);          // Frecuencia natural [rad/s]
  const c_cr = 2.0 * Math.sqrt(m * k);        // Amortiguamiento crítico [N*s/m]
  const zeta = c / c_cr;                     // Factor de amortiguamiento adimensional

  let regimen = 'Subamortiguado';
  let omega_d = 0;

  if (Math.abs(zeta - 1.0) < 1e-4) {
    regimen = 'Críticamente amortiguado';
  } else if (zeta > 1.0) {
    regimen = 'Sobreamortiguado';
  } else {
    regimen = 'Subamortiguado';
    omega_d = omega_n * Math.sqrt(1.0 - zeta * zeta); // Frecuencia amortiguada [rad/s]
  }

  return {
    omega_n,
    c_cr,
    zeta,
    regimen,
    omega_d
  };
}

/**
 * Derivada del sistema de primer orden: f(t, [u, v])
 */
function systemDerivative(u, v, m, c, k) {
  return {
    du: v,
    dv: (-c * v - k * u) / m
  };
}

/**
 * Integrador numérico Runge-Kutta de 4to orden (RK4)
 * Precisión local O(h^5), precisión global O(h^4)
 */
export function rk4Integrate(m, c, k, x0, v0, tf = 3.0, h = 0.0005) {
  const steps = Math.floor(tf / h) + 1;
  const t = new Float64Array(steps);
  const x = new Float64Array(steps);
  const v = new Float64Array(steps);

  t[0] = 0.0;
  x[0] = x0;
  v[0] = v0;

  for (let i = 0; i < steps - 1; i++) {
    const ti = i * h;
    const xi = x[i];
    const vi = v[i];

    // k1
    const d1 = systemDerivative(xi, vi, m, c, k);

    // k2
    const x_k1 = xi + 0.5 * h * d1.du;
    const v_k1 = vi + 0.5 * h * d1.dv;
    const d2 = systemDerivative(x_k1, v_k1, m, c, k);

    // k3
    const x_k2 = xi + 0.5 * h * d2.du;
    const v_k2 = vi + 0.5 * h * d2.dv;
    const d3 = systemDerivative(x_k2, v_k2, m, c, k);

    // k4
    const x_k3 = xi + h * d3.du;
    const v_k3 = vi + h * d3.dv;
    const d4 = systemDerivative(x_k3, v_k3, m, c, k);

    // Actualización ponderada Runge-Kutta
    x[i + 1] = xi + (h / 6.0) * (d1.du + 2.0 * d2.du + 2.0 * d3.du + d4.du);
    v[i + 1] = vi + (h / 6.0) * (d1.dv + 2.0 * d2.dv + 2.0 * d3.dv + d4.dv);
    t[i + 1] = ti + h;
  }

  return { t, x, v };
}

/**
 * Solución analítica exacta para cualquier valor de c, m, k con x(0)=x0, v(0)=v0
 */
export function exactAnalyticalSolution(t, m, c, k, x0, v0 = 0.0) {
  const { omega_n, zeta } = calculateOscillatorProperties(m, k, c);

  if (Math.abs(zeta - 1.0) < 1e-4) {
    // -------------------------------------------------------------
    // CASO 2: CRÍTICAMENTE AMORTIGUADO (zeta = 1)
    // x(t) = (C1 + C2 * t) * e^(-omega_n * t)
    // C1 = x0
    // C2 = v0 + omega_n * x0
    // -------------------------------------------------------------
    const C1 = x0;
    const C2 = v0 + omega_n * x0;
    return (C1 + C2 * t) * Math.exp(-omega_n * t);
  } else if (zeta < 1.0) {
    // -------------------------------------------------------------
    // CASO 1: SUBAMORTIGUADO (zeta < 1)
    // x(t) = e^(-zeta * omega_n * t) * [ A * cos(omega_d * t) + B * sin(omega_d * t) ]
    // A = x0
    // B = (v0 + zeta * omega_n * x0) / omega_d
    // -------------------------------------------------------------
    const sigma = zeta * omega_n;
    const omega_d = omega_n * Math.sqrt(1.0 - zeta * zeta);
    const A = x0;
    const B = (v0 + sigma * x0) / omega_d;
    return Math.exp(-sigma * t) * (A * Math.cos(omega_d * t) + B * Math.sin(omega_d * t));
  } else {
    // -------------------------------------------------------------
    // CASO 3: SOBREAMORTIGUADO (zeta > 1)
    // Raíces reales: r1, r2 = -zeta * omega_n +- omega_n * sqrt(zeta^2 - 1)
    // x(t) = C1 * e^(r1 * t) + C2 * e^(r2 * t)
    // C1 + C2 = x0
    // r1 * C1 + r2 * C2 = v0
    // C1 = (v0 - r2 * x0) / (r1 - r2)
    // C2 = (r1 * x0 - v0) / (r1 - r2)
    // -------------------------------------------------------------
    const sigma = zeta * omega_n;
    const delta = omega_n * Math.sqrt(zeta * zeta - 1.0);
    const r1 = -sigma + delta;
    const r2 = -sigma - delta;
    const C1 = (v0 - r2 * x0) / (r1 - r2);
    const C2 = (r1 * x0 - v0) / (r1 - r2);
    return C1 * Math.exp(r1 * t) + C2 * Math.exp(r2 * t);
  }
}

/**
 * Calcula las métricas de ingeniería requeridas por la rúbrica:
 * - Tiempo de asentamiento (ts): instante a partir del cual |x| < 2% de x0 (0.001 m).
 * - Sobreimpulso porcentual (Mp): cuánto cruza del equilibrio hacia el lado opuesto.
 * - Error máximo entre solución numérica RK4 y solución analítica exacta.
 */
export function calculateEngineeringMetrics(tArray, xNumArray, m, c, k, x0, v0 = 0.0) {
  const threshold = 0.02 * x0; // 2% de 0.05 = 0.001 m
  let ts = 0.0;
  let minX = 0.0;
  let maxError = 0.0;

  for (let i = 0; i < tArray.length; i++) {
    const ti = tArray[i];
    const xi = xNumArray[i];
    const xExact = exactAnalyticalSolution(ti, m, c, k, x0, v0);
    const error = Math.abs(xi - xExact);

    if (error > maxError) {
      maxError = error;
    }

    if (Math.abs(xi) > threshold) {
      ts = ti;
    }

    if (xi < minX) {
      minX = xi;
    }
  }

  const overshootPct = minX < 0.0 ? (-minX / x0) * 100.0 : 0.0;

  return {
    settlingTime: ts,
    overshootPct,
    minDisplacement: minX,
    maxRk4Error: maxError,
    threshold
  };
}

/**
 * Presets preconfigurados para la exposición y experimentación
 */
export const PRESETS = {
  SUBAMORTIGUADO: {
    id: 'sub',
    name: '1. Subamortiguado (0.3 ccr)',
    c: 1800.0,
    m: 300.0,
    k: 30000.0,
    description: 'Oscilación pronunciada con envolvente exponencial. Rebota cerca de 37% y demora ~1.12 s en asentarse.',
    tag: 'Rebote Alto (37%)'
  },
  CRITICO: {
    id: 'crit',
    name: '2. Críticamente Amortiguado (ccr)',
    c: 6000.0,
    m: 300.0,
    k: 30000.0,
    description: 'El retorno más rápido posible al reposo sin oscilación (0% sobreimpulso). Se asienta en solo ~0.58 s.',
    tag: 'Óptimo Confort (Ambulancia)'
  },
  SOBREAMORTIGUADO: {
    id: 'sobre',
    name: '3. Sobreamortiguado (1.5 ccr)',
    c: 9000.0,
    m: 300.0,
    k: 30000.0,
    description: 'Fluido muy viscoso; frena el movimiento pero tarda más en regresar a la posición neutra (~1.07 s).',
    tag: 'Retorno Lento / Rígido'
  },
  AMBULANCIA: {
    id: 'amb',
    name: 'Recomendación: Ambulancia Médica',
    c: 6000.0,
    m: 300.0,
    k: 30000.0,
    description: 'Prioriza estabilidad clínica y confort de pacientes con trauma. Cero rebote y retorno inmediato.',
    tag: 'Selección Clínica'
  },
  CARRERAS: {
    id: 'race',
    name: 'Recomendación: Vehículo de Carreras',
    c: 8500.0,
    m: 300.0,
    k: 50000.0,
    description: 'Resorte y amortiguador de alta rigidez para mantener la huella de agarre y estabilizar la aerodinámica.',
    tag: 'Máximo Agarre'
  }
};
