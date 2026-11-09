# Proyecto 1: La Suspensión de un Vehículo (Modelo Cuarto de Carro)
**Ecuaciones Diferenciales Ordinarias — Unidad 3 (Ecuaciones de Orden Superior)**  
**Institución Universitaria Colegio Mayor del Cauca (Unimayor)**  
**Facultad de Ingeniería — Ingeniería Informática · Ingeniería Multimedia**

---

## Integrantes (Grupo 5)
1. **CRUZ ANACONA ANGELA GABRIELA**
2. **GOMEZ HOYOS DUBAN ALEXANDER**
3. **TORRES ANGULO JOSE ALDAIR**
4. **VELASCO BURBANO RUBEN DARIO**

---

## 1. Declaración de Uso de Asistentes de Inteligencia Artificial (Requisito Página 10)
En cumplimiento estricto con las condiciones del documento guía:
- **Herramienta utilizada:** Antigravity AI (Google DeepMind).
- **Finalidad:** Asistencia en la estructuración de la arquitectura de la aplicación web, diseño de interfaz reactiva Liquid Glass, implementación del algoritmo Runge-Kutta 4to orden (RK4) en JavaScript/Python y elaboración de flashcards para la preparación de la defensa oral.
- **Defensa:** Todos los integrantes del grupo dominan y son capaces de explicar cada línea de código, algoritmo y deducción analítica.

---

## 2. Estructura del Repositorio

```text
├── app/                              # Aplicación Web Interactiva (React + Vite + Tailwind)
│   ├── dist/                         # Build estático optimizado para GitHub Pages
│   ├── public/                       # Activos (Logo Unimayor, Script Python descargable)
│   ├── src/                          # Código fuente
│   │   ├── components/               # Animación SVG/Canvas, Gráfica RK4, Exposición, Flashcards
│   │   ├── physics/                  # Motor físico EDO, RK4 y soluciones exactas
│   │   ├── data/                     # Datos de diapositivas y guion de las flashcards
│   │   └── App.jsx                   # Componente principal
│   └── package.json                  # Dependencias y scripts
├── python/
│   └── suspension_sim.py             # Script oficial en Python con NumPy y Matplotlib (Pág. 9)
├── referencia/
│   ├── Proyectos_EDO_U3.pdf          # Guía docente oficial de la Unidad 3
│   └── logotipo-actual.webp          # Escudo institucional Unimayor
├── requirements.txt                  # Dependencias Python (numpy, matplotlib)
└── README.md                         # Este archivo
```

---

## 3. Instrucciones de Ejecución

### Opción 1: Ejecutar la Aplicación Web Interactiva (`app/`)
La web contiene el **Laboratorio Interactivo de Suspensión**, la **Gráfica de Superposición RK4 vs Exacta**, la **Deducción Matemática a Mano**, las **Flashcards de Estudio** y el **Modo Exposición (Slide Deck de 15 Minutos)**.

```bash
# 1. Ingresar a la carpeta de la aplicación
cd app

# 2. Instalar dependencias (si no se han instalado)
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
```
> Abrir en el navegador la URL local indicada (ej. `http://localhost:5173`).

#### Despliegue en GitHub Pages:
La carpeta `app/dist/` ya está precompilada con rutas relativas (`base: './'`). Basta con subir la carpeta a la rama `gh-pages` o configurarlo desde los Settings de GitHub Pages.

---

### Opción 2: Ejecutar el Script en Python (`python/suspension_sim.py`)
Implementa fielmente el esqueleto de la página 9 del documento:

```bash
# 1. Crear y activar el entorno virtual
python -m venv .venv
.\.venv\Scripts\activate   # En Windows PowerShell

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Ejecutar la simulación
python python/suspension_sim.py
```
> El script mostrará en consola los tiempos de asentamiento $t_s$, el porcentaje de sobreimpulso $M_p$, los errores máximos y abrirá la ventana gráfica con la superposición exacta de las tres curvas.

---

## 4. Resultados Clave Obtenidos

| Régimen | Coeficiente $c$ | Tiempo Asentamiento $t_s$ ($|x| \le 1\text{ mm}$) | Sobreimpulso ($M_p$) | Verificación Guía |
| :--- | :---: | :---: | :---: | :---: |
| **Subamortiguado** | $1800\text{ N}\cdot\text{s/m}$ ($0.3 c_{cr}$) | **$1.12\text{ s}$** | **$37.23\%$** | Récord de ~1.1 s y rebote del 37% |
| **Crítico** | $6000\text{ N}\cdot\text{s/m}$ ($1.0 c_{cr}$) | **$0.58\text{ s}$** | **$0.00\%$** | El más veloz, sin rebote (~0.58 s) |
| **Sobreamortiguado** | $9000\text{ N}\cdot\text{s/m}$ ($1.5 c_{cr}$) | **$1.07\text{ s}$** | **$0.00\%$** | Retorno retardado (~1.07 s) |

---

## 5. Conclusión de Ingeniería
- **Ambulancia:** Amortiguamiento crítico ($c = 6000\text{ N}\cdot\text{s/m}$). Retorna al reposo en solo $0.58\text{ s}$ sin cruzar el equilibrio ($0.00\%$ sobreimpulso), evitando rebotes lesivos para pacientes con trauma espinal.
- **Carro de carreras:** Suspensión de alta tasa con rigidez $k$ y amortiguamiento $c$ elevados para minimizar el balanceo de carrocería y maximizar el agarre de los neumáticos (*contact patch*) a altas velocidades.
