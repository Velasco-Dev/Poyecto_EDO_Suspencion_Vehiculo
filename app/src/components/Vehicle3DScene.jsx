import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Eye,
  Maximize2,
  X,
  Activity,
  RotateCcw,
  Layers,
  Sparkles,
  CarFront,
  ShieldAlert
} from 'lucide-react';

/**
 * Vehicle3DScene - Nueva integración limpia de Animacion_Carretera.html
 * 
 * Reemplaza la versión anterior eliminando la saturación de botones y
 * ofreciendo una integración fluida tanto embebida como en Vista Técnica (Modal).
 */
export default function Vehicle3DScene({
  m = 300,
  c = 6000,
  k = 30000,
  x0 = 0.05,
  v0 = 0.0,
  regimen = 'Crítico',
  zeta = 1.0,
  focusedVehicle = null,
  setFocusedVehicle,
  isTechnicalOpen: externalModalOpen,
  setIsTechnicalOpen: setExternalModalOpen,
}) {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [modalIframeKey, setModalIframeKey] = useState(0);
  const [xrayActive, setXrayActive] = useState(false);

  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setIsModalOpen = useCallback(
    (open) => {
      if (setExternalModalOpen) {
        setExternalModalOpen(open);
      } else {
        setInternalModalOpen(open);
      }
    },
    [setExternalModalOpen]
  );

  const cardIframeRef = useRef(null);
  const modalIframeRef = useRef(null);

  // Enviar mensaje a un iframe de forma segura
  const postToIframe = useCallback((iframeRef, message) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(message, '*');
      } catch (_) {
        // En caso de que el iframe aún esté cargando
      }
    }
  }, []);

  // Enviar comando a los iframes activos
  const broadcast = useCallback(
    (message) => {
      if (!isModalOpen) {
        postToIframe(cardIframeRef, message);
      } else {
        postToIframe(modalIframeRef, message);
      }
    },
    [isModalOpen, postToIframe]
  );

  // Sincronizar cámara cuando cambia el vehículo enfocado desde los presets
  useEffect(() => {
    let camera = 'overview';
    if (focusedVehicle === 'carreras') camera = 'jesko';
    else if (focusedVehicle === 'ambulancia') camera = 'ambulance';

    const timer = setTimeout(() => {
      broadcast({ type: 'set-camera', camera });
    }, 300);

    return () => clearTimeout(timer);
  }, [focusedVehicle, broadcast]);

  // Manejar eventos desde el iframe (ej. presionar ESC dentro del iframe)
  useEffect(() => {
    const handleWindowMessage = (e) => {
      if (e.data?.type === 'close-modal') {
        setIsModalOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, setIsModalOpen]);

  // Desencadenar bache
  const handleTriggerBump = () => {
    broadcast({ type: 'trigger-bump' });
  };

  // Alternar vista Rayos X
  const handleToggleXray = () => {
    const nextXray = !xrayActive;
    setXrayActive(nextXray);
    broadcast({ type: 'set-xray', enabled: nextXray });
  };

  // Recargar escena embebida
  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full overflow-hidden rounded-[1.6rem] border border-slate-200 bg-[#0b1120] shadow-inner flex flex-col">
      {/* ═══════════════ BARRA SUPERIOR SIMPLIFICADA ═══════════════ */}
      <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Identificador de escena */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 px-3 py-1.5 shadow-lg backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            {focusedVehicle === 'carreras'
              ? '🏎️ Koenigsegg Jesko Attack'
              : focusedVehicle === 'ambulancia'
              ? '🚑 Ambulancia Tipo III'
              : 'Escala 1:1 · Jesko vs Ambulancia'}
          </span>
          <span className="hidden sm:inline-block text-[10px] text-slate-300 border-l border-white/20 pl-2">
            Carretera Panorámica
          </span>
        </div>

        {/* Acciones principales simplificadas */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Botón Simular Bache */}
          <button
            onClick={handleTriggerBump}
            className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/60 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 shadow hover:bg-white/15 hover:text-white transition cursor-pointer backdrop-blur-md"
            title="Activar o probar baches en la ruta"
          >
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Baches</span>
          </button>

          {/* Botón Rayos X (Suspensión) */}
          <button
            onClick={handleToggleXray}
            className={`flex items-center gap-1 rounded-xl border px-2.5 py-1.5 text-[11px] font-semibold transition cursor-pointer backdrop-blur-md shadow ${
              xrayActive
                ? 'border-orange-500/80 bg-orange-500/25 text-orange-200'
                : 'border-white/15 bg-black/60 text-slate-200 hover:bg-white/15 hover:text-white'
            }`}
            title="Alternar transparencia Rayos X para ver la suspensión"
          >
            <Layers className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden sm:inline">Rayos X</span>
          </button>

          {/* Botón Recargar */}
          <button
            onClick={handleReload}
            className="rounded-xl border border-white/15 bg-black/60 p-1.5 text-slate-200 shadow hover:bg-white/15 hover:text-white transition cursor-pointer backdrop-blur-md"
            title="Reiniciar vista 3D"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* BOTÓN PROTAGONISTA: VISTA TÉCNICA (Lanza el modal) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-3 py-1.5 shadow-md shadow-blue-900/40 transition-all cursor-pointer border border-blue-400/30"
            title="Abrir Vista Técnica interactiva completa con cámaras y telemetría"
          >
            <Maximize2 className="h-3.5 w-3.5 text-blue-200" />
            <span>Vista Técnica</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ ESCENA EMBEBIDA ═══════════════ */}
      <div className="relative flex-1 w-full h-full">
        {isModalOpen ? (
          // Placeholder cuando el modal está activo para no duplicar WebGL
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 text-center z-10 backdrop-blur-sm">
            <Eye className="w-10 h-10 text-blue-400 mb-3 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold">Vista Técnica activa en pantalla completa</h3>
            <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
              Interactúa con las cámaras y configuraciones en el visor principal.
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              Cerrar Vista Técnica
            </button>
          </div>
        ) : (
          <iframe
            ref={cardIframeRef}
            key={iframeKey}
            src="./models/Animacion_Carretera.html?embedded=true"
            title="Animación Carretera 3D"
            className="h-full w-full border-0 select-none"
            allow="fullscreen"
            loading="eager"
          />
        )}
      </div>

      {/* ═══════════════ PIE INFORMATIVO DISCRETO ═══════════════ */}
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
        <div className="pointer-events-auto rounded-xl border border-white/10 bg-black/60 px-3 py-1 text-[10px] text-slate-300 backdrop-blur-md">
          <span className="font-semibold text-white">Interacción:</span> Arrastra para rotar · Rueda para zoom · Clic en <strong className="text-blue-300">Vista Técnica</strong> para pantalla completa
        </div>
        <div className="pointer-events-auto hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-slate-300 backdrop-blur-md">
          <span className="text-amber-400 font-bold">ζ = {zeta.toFixed(2)}</span>
          <span>·</span>
          <span>{regimen}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MODAL DE VISTA TÉCNICA (ANIMACIÓN CARRETERA COMPLETA)
          ═══════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista Técnica: Comparativa 3D de Suspensión en Carretera"
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Barra Superior del Modal */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[#090d16] px-4 sm:px-6 z-10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black shadow-md">
                3D
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                    Vista Técnica: Comparativa en Carretera
                  </h2>
                  <span className="hidden sm:inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                    Escala 1:1
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-400">
                  Koenigsegg Jesko (Attack) vs Ambulancia Tipo III · ζ = {zeta.toFixed(2)} ({regimen}) · m = {m} kg · k = {(k / 1000).toFixed(0)} kN/m · c = {c.toFixed(0)} N·s/m
                </p>
              </div>
            </div>

            {/* Acciones de la barra del Modal */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalIframeKey((prev) => prev + 1)}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
                title="Reiniciar vista en el modal"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reiniciar</span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-red-500/20 hover:bg-red-500/30 text-red-200 border-red-500/40 px-3.5 py-1.5 text-xs font-bold shadow transition cursor-pointer"
                title="Cerrar vista técnica (o presiona Escape)"
              >
                <X className="h-4 w-4 text-red-300" />
                <span>Cerrar</span>
                <kbd className="hidden sm:inline-block rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-red-300 border border-white/10">
                  ESC
                </kbd>
              </button>
            </div>
          </header>

          {/* Iframe a Pantalla Completa dentro del Modal */}
          <div className="relative flex-1 w-full h-full overflow-hidden bg-[#0b1120]">
            <iframe
              ref={modalIframeRef}
              key={modalIframeKey}
              src="./models/Animacion_Carretera.html"
              title="Vista Técnica: Animación Carretera 3D"
              className="h-full w-full border-0 select-none"
              allow="fullscreen"
              loading="eager"
            />
          </div>
        </div>
      )}
    </div>
  );
}
