import React from 'react';
import {
  Activity, BarChart3, BookOpen, Presentation,
  Award, Download, Calculator, Box
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenFlashcards }) {
  const tabs = [
    { id: 'simulator', label: 'Laboratorio Interactivo', icon: Activity, color: 'text-blue-600' },
    { id: 'chart', label: 'Superposición RK4', icon: BarChart3, color: 'text-sky-500' },
    { id: 'math', label: 'Deducción a Mano', icon: BookOpen, color: 'text-purple-500' },
    { id: 'calculator', label: 'Calculadora EDO', icon: Calculator, color: 'text-emerald-500' },
    { id: 'deck', label: 'Exposición (15 Min)', icon: Presentation, color: 'text-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3 sm:px-6 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Identidad Institucional */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <img
              src="./logotipo-actual.webp"
              alt="Unimayor Logo"
              className="w-10 h-10 object-contain drop-shadow-sm rounded-lg bg-white p-0.5 border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-blue-700 uppercase">
                  UNIMAYOR · GRUPO 5
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                  EDO U3
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                Simulador de Suspensión Vehicular
              </h1>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={onOpenFlashcards}
              className="liquid-glass-button-gold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 overflow-x-auto w-full md:w-auto text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? tab.color : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Acciones Rápidas */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenFlashcards}
            className="liquid-glass-button-gold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            title="Abrir flashcards de preparación"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Flashcards 5.0</span>
          </button>

          <a
            href="./suspension_sim.py"
            download="suspension_sim.py"
            className="liquid-glass-button px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            title="Descargar script Python"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Script Python</span>
          </a>
        </div>

      </div>
    </header>
  );
}
