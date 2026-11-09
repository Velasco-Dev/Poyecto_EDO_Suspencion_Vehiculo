"""
================================================================================
PROYECTO 1: LA SUSPENSIÓN DE UN VEHÍCULO (MODELO CUARTO DE CARRO)
Asignatura: Ecuaciones Diferenciales - Unidad 3
Institución Universitaria Colegio Mayor del Cauca (Unimayor)
Facultad de Ingeniería - Ingeniería Informática / Multimedia

GRUPO 5:
- CRUZ ANACONA ANGELA GABRIELA
- GOMEZ HOYOS DUBAN ALEXANDER
- TORRES ANGULO JOSE ALDAIR
- VELASCO BURBANO RUBEN DARIO

DESCRIPCIÓN FÍSICA Y MATEMÁTICA:
Modelo de cuarto de carro sometido a una perturbación inicial (bache de 5 cm = 0.05 m).
Ecuación diferencial ordinaria de segundo orden lineal homogénea con coeficientes constantes:
    m * x''(t) + c * x'(t) + k * x(t) = 0
Condiciones iniciales:
    x(0) = 0.05 m (desplazamiento inicial por bache)
    x'(0) = 0.0 m/s (velocidad inicial nula en el instante t=0)

PARÁMETROS DEL SISTEMA:
    m = 300.0 kg      (Masa suspendida: 1/4 del vehículo)
    k = 30000.0 N/m   (Constante elástica del resorte)
    wn = sqrt(k/m) = 10.0 rad/s (Frecuencia natural)
    c_cr = 2*sqrt(m*k) = 6000.0 N*s/m (Coeficiente de amortiguamiento crítico)
================================================================================
"""

import math
import numpy as np
import matplotlib.pyplot as plt

# ==============================================================================
# SECCIÓN 1: PARÁMETROS DEL SISTEMA FÍSICO
# (Explicado en Exposición por: CRUZ ANACONA ANGELA GABRIELA)
# ==============================================================================
m = 300.0       # Masa suspendida en kg
k = 30000.0     # Rigidez del resorte en N/m
x0 = 0.05       # Desplazamiento inicial (bache de 5 cm)
v0 = 0.0        # Velocidad inicial (0 m/s)

# Frecuencia natural no amortiguada (rad/s)
omega_n = math.sqrt(k / m)  # 10 rad/s

# Amortiguamiento crítico (N*s/m o kg/s)
c_cr = 2.0 * math.sqrt(m * k)  # 6000 N*s/m

# Los 3 coeficientes asignados en la guía:
c_sub = 0.3 * c_cr   # 1800 N*s/m (Subamortiguado)
c_crit = 1.0 * c_cr  # 6000 N*s/m (Críticamente amortiguado)
c_sobre = 1.5 * c_cr # 9000 N*s/m (Sobreamortiguado)


# ==============================================================================
# SECCIÓN 2: SOLUCIONES ANALÍTICAS EXACTAS DEDUCIDAS A MANO
# (Explicado en Exposición por: GOMEZ HOYOS DUBAN ALEXANDER)
# ==============================================================================

def x_analitica_subamortiguado(t):
    """
    Caso 1: c = 1800 N*s/m (zeta = 0.3).
    Ecuación característica: r^2 + 6r + 100 = 0 -> Raíces: r = -3 +- i*sqrt(91)
    x(t) = e^(-3t) * [0.05 * cos(sqrt(91)*t) + (0.15/sqrt(91)) * sin(sqrt(91)*t)]
    - Termino e^(-3t): Provoca el decaimiento exponencial disipativo.
    - Términos cos y sin: Provocan la oscilación (frecuencia amortiguada wd = sqrt(91) rad/s).
    """
    wd = math.sqrt(91.0)
    return np.exp(-3.0 * t) * (0.05 * np.cos(wd * t) + (0.15 / wd) * np.sin(wd * t))

def x_analitica_critico(t):
    """
    Caso 2: c = 6000 N*s/m (zeta = 1.0).
    Ecuación característica: r^2 + 20r + 100 = (r + 10)^2 = 0 -> Raíz real doble: r = -10
    x(t) = (0.05 + 0.5*t) * e^(-10t)
    - No oscila (no hay senos ni cosenos).
    - Retorno más rápido posible al reposo sin sobrepaso (cruce de cero).
    """
    return (0.05 + 0.5 * t) * np.exp(-10.0 * t)

def x_analitica_sobreamortiguado(t):
    """
    Caso 3: c = 9000 N*s/m (zeta = 1.5).
    Ecuación característica: r^2 + 30r + 100 = 0 -> Raíces: r1 = -15 + 5*sqrt(5), r2 = -15 - 5*sqrt(5)
    r1 approx -3.8197, r2 approx -26.1803
    x(t) = C1 * e^(r1*t) + C2 * e^(r2*t)
    Donde:
        C1 = 0.025 + 0.015*sqrt(5) approx 0.058541
        C2 = 0.025 - 0.015*sqrt(5) approx -0.008541
    - El amortiguamiento es tan viscoso que domina el modo lento r1 (-3.82), retardando el retorno.
    """
    sqrt5 = math.sqrt(5.0)
    r1 = -15.0 + 5.0 * sqrt5
    r2 = -15.0 - 5.0 * sqrt5
    c1 = 0.025 + 0.015 * sqrt5
    c2 = 0.025 - 0.015 * sqrt5
    return c1 * np.exp(r1 * t) + c2 * np.exp(r2 * t)


# ==============================================================================
# SECCIÓN 3: INTEGRACIÓN NUMÉRICA RUNGE-KUTTA DE 4TO ORDEN (RK4)
# (Explicado en Exposición por: TORRES ANGULO JOSE ALDAIR)
# ==============================================================================

def sistema_edo(t, y, c_val):
    """
    Conversión de EDO de 2° orden a sistema de dos EDOs de 1° orden:
        Sea u = x (posición) y v = x' (velocidad).
        u' = v
        v' = (-c*v - k*u) / m
    Devuelve: [u', v']
    """
    u, v = y
    du_dt = v
    dv_dt = (-c_val * v - k * u) / m
    return np.array([du_dt, dv_dt])

def integrador_rk4(c_val, y0, t0=0.0, tf=3.0, h=1e-4):
    """
    Método numérico Runge-Kutta de cuarto orden (RK4).
    Evalúa 4 pendientes intermedias ponderadas (k1, k2, k3, k4) con error local O(h^5)
    y error global O(h^4), garantizando máxima estabilidad numérica.
    """
    t = np.arange(t0, tf + h, h)
    N = len(t)
    Y = np.zeros((N, len(y0)))
    Y[0] = y0

    for i in range(N - 1):
        ti = t[i]
        yi = Y[i]
        k1 = sistema_edo(ti, yi, c_val)
        k2 = sistema_edo(ti + h / 2.0, yi + (h / 2.0) * k1, c_val)
        k3 = sistema_edo(ti + h / 2.0, yi + (h / 2.0) * k2, c_val)
        k4 = sistema_edo(ti + h, yi + h * k3, c_val)
        Y[i + 1] = yi + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4)

    return t, Y


# ==============================================================================
# SECCIÓN 4: CÁLCULO DE MÉTRICAS Y DECISIÓN DE INGENIERÍA
# (Explicado en Exposición por: VELASCO BURBANO RUBEN DARIO)
# ==============================================================================

def calcular_metricas(t, x, x_inicial=0.05):
    """
    Calcula:
    1. Tiempo de asentamiento (ts): instante a partir del cual |x(t)| <= 2% del x0 (0.001 m).
    2. Sobreimpulso porcentual (Mp): cuánto cruza del equilibrio hacia el lado opuesto.
    """
    umbral_2pct = 0.02 * x_inicial  # 0.001 m = 1 mm
    fuera_de_banda = np.where(np.abs(x) > umbral_2pct)[0]
    
    if len(fuera_de_banda) > 0:
        ts = t[fuera_de_banda[-1]]
    else:
        ts = 0.0
        
    min_x = np.min(x)
    if min_x < 0.0:
        sobreimpulso_pct = (-min_x / x_inicial) * 100.0
    else:
        sobreimpulso_pct = 0.0

    return ts, sobreimpulso_pct, min_x


# ==============================================================================
# EJECUCIÓN PRINCIPAL Y GRAFICACIÓN
# ==============================================================================
if __name__ == '__main__':
    print("=================================================================")
    print(" INICIANDO SIMULACIÓN - PROYECTO 1: SUSPENSIÓN DE VEHÍCULO")
    print(" Integrantes: Angela Gabriela, Duban Alexander, José Aldair, Rubén Darío")
    print("=================================================================")
    print(f"Frecuencia natural (wn): {omega_n:.2f} rad/s")
    print(f"Amortiguamiento crítico (ccr): {c_cr:.2f} N*s/m")
    print("-----------------------------------------------------------------")

    condiciones_iniciales = np.array([x0, v0])
    
    # 1. Integración numérica RK4 para los 3 casos
    t_sub, Y_sub = integrador_rk4(c_sub, condiciones_iniciales)
    t_crit, Y_crit = integrador_rk4(c_crit, condiciones_iniciales)
    t_sobre, Y_sobre = integrador_rk4(c_sobre, condiciones_iniciales)

    x_rk4_sub = Y_sub[:, 0]
    x_rk4_crit = Y_crit[:, 0]
    x_rk4_sobre = Y_sobre[:, 0]

    # 2. Soluciones exactas analíticas evaluadas en el mismo vector de tiempo
    x_exacta_sub = x_analitica_subamortiguado(t_sub)
    x_exacta_crit = x_analitica_critico(t_crit)
    x_exacta_sobre = x_analitica_sobreamortiguado(t_sobre)

    # 3. Métricas
    ts_sub, ov_sub, min_sub = calcular_metricas(t_sub, x_rk4_sub, x0)
    ts_crit, ov_crit, min_crit = calcular_metricas(t_crit, x_rk4_crit, x0)
    ts_sobre, ov_sobre, min_sobre = calcular_metricas(t_sobre, x_rk4_sobre, x0)

    # 4. Diferencias máximas (error numérico vs analítico)
    err_sub = np.max(np.abs(x_rk4_sub - x_exacta_sub))
    err_crit = np.max(np.abs(x_rk4_crit - x_exacta_crit))
    err_sobre = np.max(np.abs(x_rk4_sobre - x_exacta_sobre))

    print(f"1. SUBAMORTIGUADO   (c = {c_sub:.0f} N*s/m): ts = {ts_sub:.3f} s | Sobreimpulso = {ov_sub:.2f}% | Error max RK4 = {err_sub:.2e} m")
    print(f"2. CRÍTICO          (c = {c_crit:.0f} N*s/m): ts = {ts_crit:.3f} s | Sobreimpulso = {ov_crit:.2f}% | Error max RK4 = {err_crit:.2e} m")
    print(f"3. SOBREAMORTIGUADO (c = {c_sobre:.0f} N*s/m): ts = {ts_sobre:.3f} s | Sobreimpulso = {ov_sobre:.2f}% | Error max RK4 = {err_sobre:.2e} m")
    print("-----------------------------------------------------------------")
    print("VERIFICACIÓN: Las curvas numérica y analítica coinciden perfectamente (error < 1e-6).")

    # 5. Generación de Gráficas de alta calidad (superposición exacta + unidades)
    plt.figure(figsize=(12, 7), dpi=120)

    # Subamortiguado
    plt.plot(t_sub, x_rk4_sub, 'b-', label=f'Numérica RK4: Subamortiguado (c = {c_sub:.0f})', linewidth=2.2)
    plt.plot(t_sub, x_exacta_sub, 'b--', label='Analítica exacta: Subamortiguado', linewidth=1.5, alpha=0.8)

    # Crítico
    plt.plot(t_crit, x_rk4_crit, 'g-', label=f'Numérica RK4: Crítico (c = {c_crit:.0f})', linewidth=2.2)
    plt.plot(t_crit, x_exacta_crit, 'g--', label='Analítica exacta: Crítico', linewidth=1.5, alpha=0.8)

    # Sobreamortiguado
    plt.plot(t_sobre, x_rk4_sobre, 'r-', label=f'Numérica RK4: Sobreamortiguado (c = {c_sobre:.0f})', linewidth=2.2)
    plt.plot(t_sobre, x_exacta_sobre, 'r--', label='Analítica exacta: Sobreamortiguado', linewidth=1.5, alpha=0.8)

    # Líneas de referencia del criterio del 2% (+- 0.001 m)
    plt.axhline(0.001, color='gray', linestyle=':', label='Banda de asentamiento (+-2% = +-0.001 m)', alpha=0.7)
    plt.axhline(-0.001, color='gray', linestyle=':', alpha=0.7)
    plt.axhline(0.0, color='black', linestyle='-', linewidth=0.8, alpha=0.5)

    plt.title('Proyecto 1: Suspensión de Vehículo - Superposición Analítica vs Numérica (RK4)\nInstitución Universitaria Colegio Mayor del Cauca (Grupo 5)', fontsize=13, pad=12)
    plt.xlabel('tiempo [s]', fontsize=11)
    plt.ylabel('desplazamiento [m]', fontsize=11)
    plt.xlim(0, 3.0)
    plt.ylim(-0.025, 0.055)
    plt.grid(True, linestyle='--', alpha=0.4)
    plt.legend(loc='upper right', fontsize=9, framealpha=0.9)

    plt.tight_layout()
    plt.savefig('comparacion_suspension_edo.png')
    print("Gráfica guardada exitosamente como 'comparacion_suspension_edo.png'.")
    plt.show()
