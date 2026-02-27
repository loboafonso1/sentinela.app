import { useLocation, useNavigate } from "react-router-dom";
import { Home, Swords, TrendingUp, Settings, Heart, BarChart3 } from "lucide-react";

const tabs = [
  { path: "/dashboard", icon: Home, label: "Início" },
  { path: "/treino", icon: Swords, label: "Treino" },
  { path: "/evolucao", icon: TrendingUp, label: "Evolução" },
  { path: "/favoritos", icon: Heart, label: "Favoritos" },
  { path: "/resumo", icon: BarChart3, label: "Resumo" },
  { path: "/configuracoes", icon: Settings, label: "Config" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto max-w-lg flex items-center justify-around py-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary/15" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
