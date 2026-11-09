import React from 'react';
import { 
  Activity, BarChart3, BookOpen, Presentation, 
  Award, Download, Sparkles 
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenFlashcards }) {
  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3 sm:px-6 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Identidad Institucional Unimayor */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <img 
              src="./logotipo-actual.webp" 
              alt="Unimayor Logo" 
              className="w-10 h-10 object-contain drop-shadow-md rounded bg-white/10 p-0.5" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                  UNIMAYOR · GRUPO 5
                </span>
                <span className="text-[10px] bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded-full border border-blue-700/50">
                  EDO U3
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
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

        {/* Pestañas de Navegación de Modos */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-[#0B3C73] text-white border border-[#F5A800]/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Laboratorio Interactivo</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-[#0B3C73] text-white border border-[#F5A800]/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Superposición RK4</span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
              activeTab === 'math'
                ? 'bg-[#0B3C73] text-white border border-[#F5A800]/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Deducción a Mano</span>
          </button>

          <button
            onClick={() => setActiveTab('deck')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer ${
              activeTab === 'deck'
                ? 'bg-[#0B3C73] text-white border border-[#F5A800]/50 shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exposición (15 Min)</span>
          </button>
        </nav>

        {/* Acciones Rápidas: Flashcards 5.0 y Descarga de Python */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenFlashcards}
            className="liquid-glass-button-gold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            title="Abrir flashcards de preparación para cada integrante"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Flashcards 5.0</span>
          </button>

          <a
            href="./suspension_sim.py"
            download="suspension_sim.py"
            className="liquid-glass-button px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-gray-200 hover:text-white"
            title="Descargar script Python con NumPy y Matplotlib oficial"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Script Python</span>
          </a>
        </div>

      </div>
    </header>
  );
}
