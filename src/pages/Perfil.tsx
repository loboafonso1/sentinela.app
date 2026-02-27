import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogOut } from "lucide-react";

const Perfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");

  useEffect(() => {
    const name = localStorage.getItem("sentinela_user_name");
    if (!name) { navigate("/login"); return; }
    setDisplayName(name);
    setNotificationEnabled(localStorage.getItem("sentinela_notifications") === "true");
    setReminderTime(localStorage.getItem("sentinela_reminder_time") || "08:00");
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("sentinela_user_name", displayName);
    localStorage.setItem("sentinela_notifications", String(notificationEnabled));
    localStorage.setItem("sentinela_reminder_time", reminderTime);
    toast({ title: "Perfil atualizado!" });
  };

  const handleLogout = () => {
    localStorage.removeItem("sentinela_user_name");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto max-w-lg flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <span className="font-serif font-semibold text-foreground">Perfil</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-secondary border-border rounded-xl" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Notificações</Label>
              <p className="text-xs text-muted-foreground">Lembrete diário de treino</p>
            </div>
            <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
          </div>
          {notificationEnabled && (
            <div className="space-y-2">
              <Label htmlFor="time">Horário do lembrete</Label>
              <Input id="time" type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="bg-secondary border-border rounded-xl" />
            </div>
          )}
          <Button onClick={handleSave} className="w-full bg-gradient-sentinel text-primary-foreground font-semibold rounded-xl">
            Salvar Alterações
          </Button>
        </div>

        <Button onClick={handleLogout} variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </main>
    </div>
  );
};

export default Perfil;
