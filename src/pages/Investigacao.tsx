import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Move, CheckCircle2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Investigacao = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState("00:00:000");
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer de alta precisão (min:seg:ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - startTime;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      const ms = diff % 1000;
      setElapsedTime(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`
      );
    }, 10);
    return () => clearInterval(interval);
  }, [startTime]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const lastTouchRef = useRef({ x: 0, y: 0 });

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchRef.current.x;
    const deltaY = touch.clientY - lastTouchRef.current.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col overflow-hidden font-sans">
      {/* Header com Timer */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate("/treinamento")}
          className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-1 font-bold">Tempo de Análise</span>
          <div className="text-xl font-mono font-bold tracking-wider text-[#00F2FF] drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">
            {elapsedTime}
          </div>
        </div>

        <div className="w-11" /> {/* Spacer */}
      </div>

      {/* Área de Investigação (Imagem 360/Interativa) */}
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          animate={{ 
            scale: zoom,
            x: position.x,
            y: position.y
          }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="w-full h-full flex items-center justify-center"
        >
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cena do Desafio"
            className="min-w-full min-h-full object-cover select-none pointer-events-none"
          />
        </motion.div>

        {/* Overlay de HUD */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        
        {/* Marcadores de Mira/HUD */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/5 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-1 h-1 bg-[#00F2FF] rounded-full shadow-[0_0_10px_#00F2FF]" />
            <div className="absolute inset-0 border-t border-white/20 w-8 h-[1px] top-1/2 left-0" />
            <div className="absolute inset-0 border-t border-white/20 w-8 h-[1px] top-1/2 right-0" />
            <div className="absolute inset-0 border-l border-white/20 w-[1px] h-8 left-1/2 top-0" />
            <div className="absolute inset-0 border-l border-white/20 w-[1px] h-8 left-1/2 bottom-0" />
        </div>
      </div>

      {/* Controles e Botão Inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-8 pb-12 pt-12 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-8">
        <div className="flex justify-center gap-6">
          <button 
            onClick={handleZoomOut}
            className="p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl active:scale-90 transition-all"
          >
            <ZoomOut className="w-5 h-5 text-white/60" />
          </button>
          <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center">
             <Move className="w-4 h-4 text-white/20 animate-pulse" />
          </div>
          <button 
            onClick={handleZoomIn}
            className="p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl active:scale-90 transition-all"
          >
            <ZoomIn className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full py-6 bg-white text-black rounded-[2rem] font-bold tracking-[0.4em] uppercase text-[11px] flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Enviar Análise
        </motion.button>
      </div>

      {/* Efeito de Scanline/Ruído Digital */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[60] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default Investigacao;
