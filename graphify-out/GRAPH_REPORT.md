# Graph Report - Poyecto_EDO_Suspencion_Vehiculo  (2026-11-24)

## Corpus Check
- 21 files · ~79,616 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 149 nodes · 289 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f9339ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- numpy
- PresentationDeck.jsx
- KaTeXMath
- steps
- deploy.yml
- vite.config.js
- dependencies
- package.json
- framer-motion@^14.14.0
- scripts
- katex
- react-dom

## God Nodes (most connected - your core abstractions)
1. `react` - 15 edges
2. `App()` - 14 edges
3. `KaTeXMath()` - 13 edges
4. `lucide-react` - 13 edges
5. `exactAnalyticalSolution()` - 10 edges
6. `SuspensionCalculator()` - 8 edges
7. `calculateEngineeringMetrics()` - 8 edges
8. `calculateOscillatorProperties()` - 8 edges
9. `rk4Integrate()` - 8 edges
10. `PresentationDeck()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CodeCalculationModal()` --calls--> `KaTeXMath()`  [EXTRACTED]
  app/src/components/CodeCalculationModal.jsx → app/src/components/KaTeXMath.jsx
- `PresentationDeck()` --calls--> `KaTeXMath()`  [EXTRACTED]
  app/src/components/PresentationDeck.jsx → app/src/components/KaTeXMath.jsx
- `StepCard()` --calls--> `KaTeXMath()`  [EXTRACTED]
  app/src/components/SuspensionCalculator.jsx → app/src/components/KaTeXMath.jsx
- `SuspensionCalculator()` --calls--> `KaTeXMath()`  [EXTRACTED]
  app/src/components/SuspensionCalculator.jsx → app/src/components/KaTeXMath.jsx
- `App()` --calls--> `ClassComparisonView()`  [EXTRACTED]
  app/src/App.jsx → app/src/components/ClassComparisonView.jsx

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "numpy"
Cohesion: 0.11
Nodes (12): calcular_metricas(), integrador_rk4(), sistema_edo(), x_analitica_critico(), x_analitica_sobreamortiguado(), x_analitica_subamortiguado(), calcular_metricas(), integrador_rk4() (+4 more)

### Community 1 - "PresentationDeck.jsx"
Cohesion: 0.19
Nodes (21): App(), CodeCalculationModal(), Header(), PresentationDeck(), customCanvasBackgroundColor, SimulationChart(), SuspensionAnimation(), fmt() (+13 more)

### Community 2 - "KaTeXMath"
Cohesion: 0.29
Nodes (8): ClassComparisonView(), FlashcardsModal(), FormattedMathText(), PrintableFlashcard(), KaTeXMath(), MathDeductionView(), SLIDES_PRESENTATION, TEAM_MEMBERS_FLASHCARDS

### Community 3 - "steps"
Cohesion: 0.12
Nodes (17): environment, runs-on, steps, name, url, jobs, build-and-deploy, id (+9 more)

### Community 4 - "deploy.yml"
Cohesion: 0.15
Nodes (12): concurrency, cancel-in-progress, group, name, on, push, workflow_dispatch, permissions (+4 more)

### Community 5 - "vite.config.js"
Cohesion: 0.20
Nodes (11): devDependencies, tailwindcss@^4.0.8, @tailwindcss/vite@^4.0.8, @types/react-dom@^19.0.4, vite@^6.2.0, @vitejs/plugin-react@^4.3.4, tailwindcss, @tailwindcss/vite (+3 more)

### Community 6 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, lucide-react@^0.475.0, react@^19.0.0, react-chartjs-2@^5.3.0, @react-three/drei@^10.7.9, @react-three/fiber@^9.8.2, three@^0.187.0, react-chartjs-2 (+3 more)

### Community 7 - "package.json"
Cohesion: 0.22
Nodes (8): chart.js@^4.4.8, @types/react@^19.0.10, name, private, type, version, chart.js, @types/react

### Community 9 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PresentationDeck.jsx` to `KaTeXMath`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `numpy` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `PresentationDeck.jsx` to `KaTeXMath`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `framer-motion@^14.14.0`, `katex`, `react-dom`, `package.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._