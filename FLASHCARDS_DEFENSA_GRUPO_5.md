# Flashcards de Exposición y Guía de Defensa (Meta: Calificación 5.0)
**Proyecto 1:** La suspensión de un vehículo (Modelo de cuarto de carro)  
**Asignatura:** Ecuaciones Diferenciales — Unidad 3  
**Institución:** Institución Universitaria Colegio Mayor del Cauca (Unimayor)  
**Duración Total:** 15 minutos de exposición + 5 minutos de preguntas (Q&A)  
**Grupo 5 (4 Integrantes):**
1. **CRUZ ANACONA ANGELA GABRIELA** (0:00 - 3:30)
2. **GOMEZ HOYOS DUBAN ALEXANDER** (3:30 - 7:30)
3. **TORRES ANGULO JOSE ALDAIR** (7:30 - 11:30)
4. **VELASCO BURBANO RUBEN DARIO** (11:30 - 15:00)

---

## 📖 Guía Rápida de Símbolos y Notación para el Tablero

Antes de salir a exponer, memoriza estos símbolos para no tener dudas al escribir con tiza o marcador:

| Símbolo | Nombre y Cómo se Lee | Qué Significa Físicamente | Cómo se Escribe en el Tablero |
| :---: | :--- | :--- | :--- |
| **$\omega_n$** | *Omega sub n* | **Frecuencia natural no amortiguada:** Rapidez intrínseca de oscilación sin fricción. | Dibuja una **$w$ redondeada** con una pequeña **$n$** en el subíndice inferior derecho ($\omega_n = 10\text{ rad/s}$). |
| **$c_{cr}$** | *c sub c-r* | **Amortiguamiento crítico:** Valor umbral de disipación que evita el rebote ($6000\text{ N}\cdot\text{s/m}$). | Una letra **$c$** minúscula con subíndice **$cr$** ($c_{cr} = 2\sqrt{mk}$). |
| **$\zeta$** | *Zeta* | **Factor de amortiguamiento adimensional:** $\zeta = c / c_{cr}$. Decide si subamortigua, es crítico o sobreamortigua. | Un trazo en zigzag curvado (como una $s$ con gancho inferior) o escribe simplemente la letra griega $\zeta$. |
| **$\omega_d$** | *Omega sub d* | **Frecuencia amortiguada:** Rapidez de oscilación real en presencia de fricción ($\omega_d = \sqrt{91} \approx 9.54\text{ rad/s}$). | Una **$w$ redondeada** con subíndice **$d$** ($\omega_d = \omega_n\sqrt{1-\zeta^2}$). |
| **$x(t)$** | *x de t* | **Desplazamiento vertical de la carrocería:** Posición en metros respecto al equilibrio. | Letra $x$ con paréntesis $(t)$. |
| **$x'(t)$** | *x prima de t* (o $\dot{x}$) | **Velocidad vertical de la carrocería** ($m/s$). | Letra $x$ con un apóstrofe arriba. |
| **$x''(t)$** | *x dos primas de t* (o $\ddot{x}$) | **Aceleración vertical de la carrocería** ($m/s^2$). | Letra $x$ con dos comillas o apóstrofes. |
| **$t_s$** | *t sub s* | **Tiempo de asentamiento:** Instante a partir del cual $\|x(t)\| \le 2\% \times 0.05\text{ m} = 0.001\text{ m}$ (1 mm). | Una **$t$** minúscula con subíndice **$s$** (*settling time*). |
| **$M_p$** | *M sub p* | **Sobreimpulso porcentual:** Cuánto pasa la masa hacia el lado opuesto ($37.23\%$ en subamortiguado). | Una **$M$** mayúscula con subíndice **$p$** (*peak overshoot*). |

---

## ⏱️ Cronograma Maestro de los 15 Minutos

```text
[0:00 - 3:30]  CRUZ ANACONA ANGELA GABRIELA    -> Modelo de cuarto de carro, física y parámetros (wn, ccr)
[3:30 - 7:30]  GOMEZ HOYOS DUBAN ALEXANDER     -> Deducción analítica a mano de los 3 casos y constantes
[7:30 - 11:30] TORRES ANGULO JOSE ALDAIR       -> Conversión a 1° orden, algoritmo RK4 y superposición exacta
[11:30 - 15:00] VELASCO BURBANO RUBEN DARIO    -> Métricas cuantitativas, simulación en vivo y conclusión
[15:00 - 20:00] TODOS LOS INTEGRANTES          -> Sesión de preguntas de la docente y el auditorio
```

---

## 👤 Tarjeta 1: CRUZ ANACONA ANGELA GABRIELA
- **Rol:** Ponente 1 — Planteamiento Físico, Modelo Cuarto de Carro y Parámetros  
- **Tiempo Asignado:** `0:00 - 3:30` (3 minutos 30 segundos)  
- **Diapositivas en la Web:** Diapositivas 1 y 2  

### 🎯 Lo que debes dominar
- Justificar el modelo de cuarto de carro (*quarter-car model*).
- Formulación de la EDO de segundo orden homogénea con coeficientes constantes.
- Origen físico de cada término (Segunda Ley de Newton, Ley de Hooke y amortiguador viscoso).
- Cálculo analítico de $\omega_n = 10\text{ rad/s}$ y $c_{cr} = 6000\text{ N}\cdot\text{s/m}$.

### 🎙️ Guion Sugerido (Habla pausado y con seguridad técnica)
> *"Buenos días profesora y compañeros. Nuestro equipo, el Grupo 5, presenta el análisis analítico y computacional del Proyecto 1: La suspensión de un vehículo.*  
> *En dinámica automotriz, para estudiar la respuesta vertical de una suspensión ante irregularidades del asfalto se utiliza el modelo de un cuarto de carro. Este modelo aísla una rueda y la cuarta parte de la masa de la carrocería que le corresponde: $m = 300\text{ kg}$, soportada por un resorte elástico $k = 30\,000\text{ N/m}$ y un amortiguador de fricción viscosa $c$.*  
> *El vehículo supera un bache de $5\text{ cm}$, por lo que en el instante inicial $t=0$ se produce un desplazamiento inicial $x(0) = 0.05\text{ m}$ y una velocidad inicial en reposo $x'(0) = 0\text{ m/s}$.*  
> *Aplicando la Segunda Ley de Newton $\sum F = m a$, las fuerzas restauradoras del resorte $-k x$ y la fuerza disipativa del amortiguador $-c x'$ se oponen al movimiento, generando la EDO lineal canónica: $m x'' + c x' + k x = 0$, o dividiendo entre $300$: $x'' + \frac{c}{300}x' + 100x = 0$.*  
> *Calculamos analíticamente dos parámetros fundamentales: la frecuencia natural no amortiguada $\omega_n = \sqrt{k/m} = \sqrt{30000/300} = 10\text{ rad/s}$, y el coeficiente de amortiguamiento crítico $c_{cr} = 2\sqrt{mk} = 6000\text{ N}\cdot\text{s/m}$. A partir de $c_{cr}$ clasificamos los tres regímenes asignados en la guía."*

### 📐 Fórmulas y Cómo Dibujarlas en el Tablero
1. **EDO Canónica:**
   $$\mathbf{m x''(t) + c x'(t) + k x(t) = 0}$$
   - *En el tablero escribe:* $m x'' + c x' + k x = 0$. Explica que $m x''$ es masa $\times$ aceleración, $c x'$ es amortiguación y $k x$ es resorte.
   - *Pronunciación:* *"m por x dos puntos más c por x punto más k por x igual a cero"*.
2. **Frecuencia Natural:**
   $$\mathbf{\omega_n = \sqrt{\frac{k}{m}} = \sqrt{\frac{30\,000}{300}} = \sqrt{100} = 10\text{ rad/s}}$$
   - *En el tablero escribe:* Dibuja la letra griega $\omega$ con subíndice $n$, y la raíz cuadrada cubriendo la fracción $k/m$.
   - *Pronunciación:* *"Omega sub n igual a raíz cuadrada de k sobre m, igual a diez radianes por segundo"*.
3. **Amortiguamiento Crítico:**
   $$\mathbf{c_{cr} = 2\sqrt{m k} = 2\sqrt{300 \times 30\,000} = 6000\text{ N}\cdot\text{s/m}}$$
   - *En el tablero escribe:* Letra $c$ con subíndice $cr$, igual a $2$ por la raíz de $m \times k$.
   - *Pronunciación:* *"c sub c-r igual a dos raíz de m por k, igual a seis mil Newtons por segundo sobre metro"*.
4. **Condiciones Iniciales:**
   $$\mathbf{x(0) = 0.05\text{ m} = 5\text{ cm},\quad x'(0) = 0\text{ m/s}}$$

### 💻 Líneas de Código que te corresponden
- En `python/suspension_sim.py`: **Líneas 33 a 52** (Parámetros del Sistema Físico).
- En `app/src/physics/suspensionPhysics.js`: Función `calculateOscillatorProperties(m, k, c)`.

### 🛡️ Preguntas Trampa del Docente y Respuestas
- **Pregunta:** *"¿Por qué la masa es de 300 kg y no el peso completo de un auto (ej. 1200 kg)?"*  
  **Respuesta:** *"Porque es un modelo de cuarto de carro (quarter-car). Analiza la física de un solo neumático y el 25% de la carrocería, desacoplando el movimiento vertical puro de los efectos de balanceo y cabeceo."*
- **Pregunta:** *"¿Qué unidades dimensionales tiene la constante c?"*  
  **Respuesta:** *"Tiene unidades de $\text{N}\cdot\text{s/m}$, que dimensionalmente en el Sistema Internacional es equivalente a $\text{kg/s}$. Al multiplicarse por la velocidad ($\text{m/s}$) resulta exactamente en Newtons ($\text{N}$)."*

---

## 👤 Tarjeta 2: GOMEZ HOYOS DUBAN ALEXANDER
- **Rol:** Ponente 2 — Deducción Analítica Completa a Mano (La Regla de Oro)  
- **Tiempo Asignado:** `3:30 - 7:30` (4 minutos 00 segundos)  
- **Diapositivas en la Web:** Diapositivas 3 y 4  

### 🎯 Lo que debes dominar
- Plantear la ecuación característica: $r^2 + \frac{c}{300}r + 100 = 0$.
- Resolver analíticamente los 3 casos:
  - Subamortiguado ($c = 1800\text{ N}\cdot\text{s/m}$): raíces complejas conjugadas.
  - Crítico ($c = 6000\text{ N}\cdot\text{s/m}$): raíz real repetida y reducción de orden.
  - Sobreamortiguado ($c = 9000\text{ N}\cdot\text{s/m}$): dos raíces reales negativas distintas.
- Explicar qué término produce la oscilación y cuál el decaimiento.

### 🎙️ Guion Sugerido
> *"Continuando con el desarrollo, como lo exige la regla de oro de este trabajo: primero la matemática, después el programa. Para resolver la EDO lineal con coeficientes constantes, proponemos la solución exponencial $x(t) = e^{rt}$, obteniendo la ecuación característica: $r^2 + \frac{c}{300}r + 100 = 0$.*  
> *En el Caso 1 (Subamortiguado, $c = 0.3 c_{cr} = 1800\text{ N}\cdot\text{s/m}$), la ecuación es $r^2 + 6r + 100 = 0$. El discriminante $\Delta = 36 - 400 = -364 < 0$ produce raíces complejas conjugadas: $r = -3 \pm i\sqrt{91} \approx -3 \pm 9.5394 i$.*  
> *La solución general es $x(t) = e^{-3t}[A\cos(\sqrt{91}t) + B\sin(\sqrt{91}t)]$. Aplicando las condiciones iniciales: $x(0) = 0.05 \implies A = 0.05$. Derivando y evaluando $x'(0) = 0$, obtenemos $-3A + B\sqrt{91} = 0$, de donde $B = \frac{0.15}{\sqrt{91}} \approx 0.01572$. La solución particular exacta es $x(t) = e^{-3t}[0.05\cos(\sqrt{91}t) + \frac{0.15}{\sqrt{91}}\sin(\sqrt{91}t)]$. El término $e^{-3t}$ es la envolvente disipativa que extingue el movimiento, y las funciones trigonométricas son las que producen la oscilación periódica a una frecuencia amortiguada $\omega_d = \sqrt{91} \approx 9.54\text{ rad/s}$.*  
> *En el Caso 2 (Crítico, $c = 6000\text{ N}\cdot\text{s/m}$), $r^2 + 20r + 100 = (r+10)^2 = 0$. Raíz doble $r = -10$. Aplicando reducción de orden, la solución es $x(t) = (C_1 + C_2 t)e^{-10t}$. Con las condiciones iniciales hallamos $C_1 = 0.05$ y $C_2 = 0.5$, dando $x(t) = (0.05 + 0.5t)e^{-10t}$. Al carecer de términos armónicos, no oscila y disipa la energía en el tiempo más breve posible.*  
> *En el Caso 3 (Sobreamortiguado, $c = 9000\text{ N}\cdot\text{s/m}$), $r^2 + 30r + 100 = 0$ genera dos raíces reales negativas: $r_1 = -15 + 5\sqrt{5} \approx -3.82$ y $r_2 = -15 - 5\sqrt{5} \approx -26.18$. La solución es $x(t) = 0.05854 e^{-3.82t} - 0.00854 e^{-26.18t}$. El modo lento $r_1$ domina la dinámica y retrasa el retorno al reposo."*

### 📐 Fórmulas y Cómo Dibujarlas en el Tablero
1. **Ecuación Característica:**
   $$\mathbf{r^2 + \frac{c}{300}r + 100 = 0}$$
2. **Caso 1: Subamortiguado ($c = 1800\text{ N}\cdot\text{s/m}$):**
   $$\mathbf{x(t) = e^{-3t}\left[ 0.05\cos(\sqrt{91}t) + \frac{0.15}{\sqrt{91}}\sin(\sqrt{91}t) \right]}$$
   - *En el tablero resalta:* Encierra $e^{-3t}$ y ponle una flecha que diga *"Decaimiento disipativo"*, y a $\cos(\sqrt{91}t)$ una flecha que diga *"Frecuencia oscilatoria $\omega_d = \sqrt{91}\text{ rad/s}$"*.
3. **Caso 2: Crítico ($c = 6000\text{ N}\cdot\text{s/m}$):**
   $$\mathbf{x(t) = (0.05 + 0.5 t) e^{-10t}}$$
   - *En el tablero resalta:* La variable $t$ multiplicando a $0.5$ surge de la reducción de orden por tener raíz doble $r=-10$.
4. **Caso 3: Sobreamortiguado ($c = 9000\text{ N}\cdot\text{s/m}$):**
   $$\mathbf{x(t) = 0.05854 e^{-3.82 t} - 0.00854 e^{-26.18 t}}$$

### 💻 Líneas de Código que te corresponden
- En `python/suspension_sim.py`: **Líneas 55 a 105** (`x_analitica_subamortiguado`, `x_analitica_critico`, `x_analitica_sobreamortiguado`).
- En `app/src/physics/suspensionPhysics.js`: Función `exactAnalyticalSolution`.

### 🛡️ Preguntas Trampa del Docente y Respuestas
- **Pregunta:** *"¿Por qué en el caso crítico aparece un término multiplicado por t: $(C_1 + C_2 t)$?"*  
  **Respuesta:** *"Porque al existir una raíz repetida $r=-10$, la segunda solución linealmente independiente se deduce mediante el método de Reducción de Orden de d'Alembert: $y_2(t) = y_1(t) \int \frac{e^{-\int P(t)dt}}{y_1^2} dt$, lo que genera formalmente el factor $t e^{rt}$."*
- **Pregunta:** *"¿Por qué $\omega_d = 9.54\text{ rad/s}$ es menor que $\omega_n = 10\text{ rad/s}$?"*  
  **Respuesta:** *"Porque la fricción del amortiguador reduce la velocidad angular del sistema. La relación analítica es $\omega_d = \omega_n \sqrt{1 - \zeta^2} = 10\sqrt{1 - 0.3^2} = \sqrt{91} \approx 9.5394\text{ rad/s}$."*

---

## 👤 Tarjeta 3: TORRES ANGULO JOSE ALDAIR
- **Rol:** Ponente 3 — Implementación Computacional y Validación Numérica (RK4)  
- **Tiempo Asignado:** `7:30 - 11:30` (4 minutos 00 segundos)  
- **Diapositivas en la Web:** Diapositivas 5 y 6  

### 🎯 Lo que debes dominar
- Reducción de la EDO de 2° orden a un sistema de dos EDOs de 1° orden.
- Algoritmo Runge-Kutta de 4to orden (RK4): significado de $k_1, k_2, k_3, k_4$.
- Error local $O(h^5)$ y global $O(h^4)$, con paso fijo $h = 10^{-4}\text{ s}$.
- Demostración de superposición analítica vs. numérica (error máximo $< 10^{-8}\text{ m}$).
- Rótulos obligatorios de ejes y unidades en el Sistema Internacional.

### 🎙️ Guion Sugerido
> *"Para verificar computacionalmente lo deducido por Duban, convertimos la EDO de segundo orden en un sistema equivalente de primer orden definiendo el vector de estado: $u = x$ (posición) y $v = x'$ (velocidad).*  
> *El sistema resultante es: $u' = v$, y $v' = \frac{-c v - k u}{m}$. Esta transformación es obligatoria porque ningún integrador numérico resuelve derivadas de orden superior directamente.*  
> *Implementamos el método Runge-Kutta de cuarto orden (RK4). En cada paso de integración $h = 10^{-4}\text{ s}$, el algoritmo calcula cuatro pendientes intermedias:*  
> *1. $k_1$: pendiente al inicio del intervalo.*  
> *2. $k_2$: estimación en el punto medio usando la pendiente $k_1$.*  
> *3. $k_3$: corrección en el punto medio con $k_2$.*  
> *4. $k_4$: pendiente al final del paso usando $k_3$.*  
> *El nuevo estado se obtiene promediando ponderadamente: $Y_{i+1} = Y_i + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$.*  
> *Como pueden observar en nuestra gráfica interactiva y en el script de Python, la curva numérica de RK4 y la analítica exacta se superponen de manera idéntica. El error absoluto residual observado es del orden de $10^{-8}$ metros, lo que confirma con rigor computacional que la deducción manual es correcta.*  
> *Cumplimos además con la exigencia de la rúbrica de etiquetar rigurosamente los ejes: el eje horizontal representa el tiempo en segundos $[s]$ y el vertical el desplazamiento en metros $[m]$, delimitados por la banda de tolerancia del $2\%$."*

### 📐 Fórmulas y Cómo Dibujarlas en el Tablero
1. **Sistema de 1° Orden:**
   $$\mathbf{\begin{cases} u' = v \\ v' = \dfrac{-c v - k u}{m} \end{cases}}$$
   - *En el tablero escribe:* Una llave que agrupe las dos ecuaciones de primer orden. Explica que $u=x$ y $v=x'$.
2. **Pendientes de RK4:**
   $$\mathbf{k_1 = f(t_i, y_i),\quad k_2 = f\left(t_i + \frac{h}{2}, y_i + \frac{h}{2}k_1\right)}$$
   $$\mathbf{k_3 = f\left(t_i + \frac{h}{2}, y_i + \frac{h}{2}k_2\right),\quad k_4 = f(t_i + h, y_i + h k_3)}$$
3. **Ponderación RK4:**
   $$\mathbf{y_{i+1} = y_i + \frac{h}{6}\left(k_1 + 2k_2 + 2k_3 + k_4\right)}$$
4. **Error Residual:**
   $$\mathbf{E(h) = \max |x_{\text{num}}(t) - x_{\text{exacta}}(t)| < 10^{-6}\text{ m}}$$

### 💻 Líneas de Código que te corresponden
- En `python/suspension_sim.py`: **Líneas 108 a 148** (`sistema_edo` e `integrador_rk4`).
- En `app/src/physics/suspensionPhysics.js`: Función `rk4Integrate`.

### 🛡️ Preguntas Trampa del Docente y Respuestas
- **Pregunta:** *"¿Por qué implementaron RK4 y no el método de Euler explícito?"*  
  **Respuesta:** *"Porque Euler explícito tiene error $O(h)$ y es energéticamente inestable para osciladores armónicos, inyectando energía espuria que hace divergir la amplitud. RK4 es de cuarto orden $O(h^4)$, es estable y conserva la amplitud y fase exacta con pasos razonables."*
- **Pregunta:** *"¿Qué error se cometería al comparar las curvas evaluadas en tiempos distintos?"*  
  **Respuesta:** *"Se cometería un error de interpolación temporal artificial. Por eso evaluamos la solución analítica exactamente en el mismo vector discreto de tiempos que la simulación numérica."*

---

## 👤 Tarjeta 4: VELASCO BURBANO RUBEN DARIO
- **Rol:** Ponente 4 — Métricas de Ingeniería, Animación en Vivo y Conclusión de Diseño  
- **Tiempo Asignado:** `11:30 - 15:00` (3 minutos 30 segundos)  
- **Diapositivas en la Web:** Diapositivas 7 y 8  

### 🎯 Lo que debes dominar
- Medición del tiempo de asentamiento $t_s$ (criterio del 2%: $|x(t)| \le 0.001\text{ m}$).
- Medición del sobreimpulso $M_p$ (% y metros).
- Manejo en vivo del slider interactivo de $c$ en la web.
- Conclusión de ingeniería: **Ambulancia vs. Carro de Carreras** con datos numéricos.

### 🎙️ Guion Sugerido
> *"Finalmente, el modelado matemático y la simulación cobran su valor definitivo cuando tomamos decisiones de ingeniería fundamentadas en datos objetivos. Programamos la medición automatizada de las dos métricas exigidas:*  
> *1. El Tiempo de Asentamiento $t_s$: instante a partir del cual $|x(t)|$ queda permanentemente confinado dentro de la banda del $2\%$ de la perturbación inicial, es decir, $|x| \le 0.001\text{ m} = 1\text{ mm}$.*  
> *2. El Sobreimpulso Porcentual $M_p$: cuánto se pasa la masa al lado opuesto del equilibrio.*  
> *Nuestras mediciones concuerdan con la guía oficial:*  
> *• Subamortiguado: $t_s = 1.12\text{ s}$, y sobreimpulso del $37.23\%$ (la masa baja hasta $-1.86\text{ cm}$).*  
> *• Crítico: $t_s = 0.58\text{ s}$, con sobreimpulso del $0.00\%$. Es el retorno más veloz posible.*  
> *• Sobreamortiguado: $t_s = 1.07\text{ s}$, con sobreimpulso del $0.00\%$. El fluido viscoso ralentiza el movimiento.*  
> *Demostramos en vivo en nuestra web el comportamiento dinámico moviendo el slider de $c$.*  
> *Conclusión de Ingeniería para la defensa:*  
> *¿Qué suspensión elegiríamos para una ambulancia? Elegimos régimen críticamente amortiguado ($c = 6000\text{ N}\cdot\text{s/m}$). Con números: ofrece $0.00\%$ de sobreimpulso y el menor tiempo de asentamiento ($0.58\text{ s}$). En una ambulancia, un paciente con lesión cervical o cirugía de emergencia no tolera los 4 rebotes y el $37\%$ de sobreimpulso de una suspensión subamortiguada.*  
> *¿Y para un carro de carreras? Un monoplaza de competición no prioriza el confort humano, sino mantener la huella de contacto del neumático (contact patch) adherida al pavimento y preservar la altura constante del fondo plano para maximizar el efecto suelo aerodinámico. Por ello, se utilizan suspensiones de alta rigidez con resortes duros y amortiguamiento elevado que evitan el balanceo en curva.*  
> *Con esto concluimos nuestra exposición y quedamos atentos a sus preguntas. Muchas gracias."*

### 📐 Fórmulas y Cómo Dibujarlas en el Tablero
1. **Criterio de Asentamiento al 2%:**
   $$\mathbf{|x(t)| \le 0.02 \times x_0 = 0.001\text{ m} = 1\text{ mm}\quad \forall t \ge t_s}$$
2. **Sobreimpulso Porcentual:**
   $$\mathbf{M_p = e^{-\frac{\pi \zeta}{\sqrt{1-\zeta^2}}} \times 100\% \approx 37.23\%}$$
   - *En el tablero escribe:* La letra griega es zeta ($\zeta = 0.3$). El sobreimpulso resulta en $37.23\%$, correspondiente a un pico negativo de $x_{\min} = -0.0186\text{ m} = -1.86\text{ cm}$.
3. **Comparación de Tiempos:**
   $$\mathbf{t_s^{\text{crítico}} = 0.58\text{ s} < t_s^{\text{sobre}} = 1.07\text{ s} < t_s^{\text{sub}} = 1.12\text{ s}}$$

### 💻 Líneas de Código que te corresponden
- En `python/suspension_sim.py`: **Líneas 151 a 180** (`calcular_metricas`).
- En `app/src/physics/suspensionPhysics.js`: Función `calculateEngineeringMetrics`.

### 🛡️ Preguntas Trampa del Docente y Respuestas
- **Pregunta:** *"¿Por qué el caso sobreamortiguado tarda más en estabilizarse ($1.07\text{ s}$) que el crítico ($0.58\text{ s}$) si tiene un amortiguador más potente ($9000\text{ N}\cdot\text{s/m}$)?"*  
  **Respuesta:** *"Porque cuando $c > c_{cr}$, la fuerza viscosa disipativa es tan alta que frena al resorte de manera excesiva. El sistema queda gobernado por el modo propio dominante $r_1 = -3.82$, que decae mucho más lento que el régimen crítico con tasa $e^{-10t}$."*
- **Pregunta:** *"¿Qué ocurriría en la ambulancia si el amortiguador estuviera desgastado y $c$ cayera a $600\text{ N}\cdot\text{s/m}$?"*  
  **Respuesta:** *"El factor $\zeta$ caería a $0.1$. El sobreimpulso superaría el $72\%$ y el vehículo oscilaría por más de 3 segundos, produciendo aceleraciones verticales resonantes y riesgo clínico severo para los pacientes."*
