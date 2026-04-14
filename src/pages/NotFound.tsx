import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-[#0A0014] text-white flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <div className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold">Sistema</div>
        <div className="text-3xl font-serif font-bold tracking-[0.12em]">Rota inválida</div>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] uppercase tracking-[0.35em] text-white/70"
        >
          Voltar
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;

