import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronRight, Lock, Shield, Volume2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Switch } from "@/components/ui/switch";

const Configuracoes = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const sections = [
    {
      title: "Preferências",
      items: [
        { label: "Efeitos Sonoros", icon: Volume2, type: "switch" as const, state: audioEnabled, setter: setAudioEnabled },
        { label: "Notificações Push", icon: Bell, type: "switch" as const, state: notifEnabled, setter: setNotifEnabled },
      ],
    },
    {
      title: "Segurança",
      items: [
        { label: "Privacidade da Conta", icon: Shield, type: "link" as const },
        { label: "Termos de Uso", icon: Lock, type: "link" as const },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <header className="relative z-10 px-8 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-1 font-bold">Sistema</h2>
          <h1 className="text-3xl font-serif font-bold tracking-[0.1em]">Ajustes</h1>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 space-y-10">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#7A00FF] font-bold px-2">{section.title}</h4>

            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 text-white/40" />
                    <span className="text-sm font-bold text-white/80">{item.label}</span>
                  </div>

                  {item.type === "switch" ? (
                    <Switch checked={item.state} onCheckedChange={item.setter} className="data-[state=checked]:bg-[#00F2FF]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="pt-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">Versão do Sistema: 2.0.4-ELITE</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Configuracoes;

