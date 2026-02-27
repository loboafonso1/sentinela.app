import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockData } from "@/hooks/useMockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { User, Palette, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useTheme } from "next-themes";
import FavoriteButton from "@/components/FavoriteButton";
import { Switch } from "@/components/ui/switch";

const themes = [
  { id: "purple", label: "Roxo", class: "", color: "hsl(252 70% 60%)" },
  { id: "blue", label: "Azul", class: "theme-blue", color: "hsl(215 80% 55%)" },
  { id: "red", label: "Vermelho", class: "theme-red", color: "hsl(0 72% 51%)" },
] as const;

const Configuracoes = () => {
  const navigate = useNavigate();
  const { userData, updateName, resetApp } = useMockData();
  const [name, setName] = useState(userData.name);
  const { theme, setTheme } = useTheme();
  const [autoStart, setAutoStart] = useState(localStorage.getItem("sentinela_autostart_treino") === "true");

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  const handleSaveName = () => {
    if (name.trim()) updateName(name.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("sentinela_logged_in");
    localStorage.removeItem("sentinela_user_name");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-2">
        <div className="mx-auto max-w-lg">
          <h1 className="text-xl font-serif font-bold text-foreground">Configurações</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive section-gap mt-4">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-sentinel flex items-center justify-center shadow-sentinel">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{userData.name}</p>
              <p className="text-xs text-muted-foreground">{userData.level}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Alterar nome</label>
            <div className="flex gap-2">
              <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl bg-secondary border-border" />
              <Button onClick={handleSaveName} size="sm" className="bg-gradient-sentinel text-primary-foreground rounded-xl px-4">
                Salvar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Theme Color */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-3xl border border-border bg-card p-card">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Cor Principal</span>
          </div>
          <div className="flex gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`relative flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  theme === t.id ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <div
                  className="absolute right-2 top-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FavoriteButton itemId={`theme-${t.id}`} compact />
                </div>
                <div className="h-8 w-8 rounded-full" style={{ background: t.color }} />
                <span className="text-[10px] text-muted-foreground">{t.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <ThemeSwitcher />
          </div>
        </motion.div>

        {/* Fluxo */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-border bg-card p-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Iniciar treino automaticamente</p>
              <p className="text-xs text-muted-foreground">Ao abrir a tela Treino, comece direto o cronômetro.</p>
            </div>
            <Switch
              checked={autoStart}
              onCheckedChange={(v) => {
                setAutoStart(v);
                localStorage.setItem("sentinela_autostart_treino", v ? "true" : "false");
              }}
            />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="grid grid-cols-1 gap-2 mb-2">
            <Button
              onClick={() => {
                if (confirm("Redefinir dados locais do app (XP, quiz, progresso)? Você permanecerá logado.")) {
                  resetApp();
                }
              }}
              variant="outline"
              className="w-full rounded-2xl border-warning/30 text-warning hover:bg-warning/10 py-btn"
            >
              Redefinir dados (teste)
            </Button>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10 py-btn"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sair da Conta
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Configuracoes;
