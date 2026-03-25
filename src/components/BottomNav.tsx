import { useLocation, useNavigate } from "react-router-dom";
import { Swords, BarChart3, User, Settings } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { path: "/treinamento", icon: Swords, label: "Treino" },
  { path: "/progresso", icon: BarChart3, label: "Progresso" },
  { path: "/perfil", icon: User, label: "Perfil" },
  { path: "/configuracoes", icon: Settings, label: "Ajustes" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Não exibir BottomNav em telas de entrada/onboarding/login ou investigação
  const hideNavPaths = ["/", "/login", "/ia-selection", "/auth/callback", "/investigacao"];
  if (hideNavPaths.includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/5 bg-[#0A0014]/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-lg flex items-center justify-around py-3 pb-[env(safe-area-inset-bottom,12px)] px-4">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-1.5 px-4 transition-all duration-300 group"
            >
              <div className={`relative p-2 rounded-2xl transition-all duration-500 ${
                active 
                  ? "bg-gradient-to-br from-[#7A00FF]/20 to-[#FF00D9]/20 shadow-[0_0_20px_rgba(122,0,255,0.2)]" 
                  : "hover:bg-white/5"
              }`}>
                <Icon className={`h-6 w-6 transition-all duration-500 ${
                  active ? "text-white scale-110" : "text-white/40 group-hover:text-white/60"
                }`} />
                
                {active && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-2xl bg-white/10 blur-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                active ? "text-white opacity-100" : "text-white/30 opacity-60 group-hover:opacity-80"
              }`}>
                {label}
              </span>

              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-1 w-1 h-1 bg-[#00F2FF] rounded-full shadow-[0_0_10px_#00F2FF]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
