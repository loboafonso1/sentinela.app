import { motion } from "framer-motion";
import { User, Shield, Award, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import BottomNav from "@/components/BottomNav";

const Perfil = () => {
  const { user, signOut } = useAuth();
  const [levelName, setLevelName] = useState("Carregando...");

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("user_level_name")
          .eq("id", user.id)
          .single();
        if (data?.user_level_name) setLevelName(data.user_level_name);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#0A0014] text-white pb-32">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <header className="relative z-10 px-8 pt-12 pb-12 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7A00FF] to-[#FF00D9] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0A0014] flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-white/20" />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 p-2 bg-[#00F2FF] rounded-lg shadow-[0_0_15px_#00F2FF]">
            <Shield className="w-4 h-4 text-black" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold tracking-tight mb-1"
        >
          {user?.email?.split('@')[0] || "Agente Sentinela"}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] uppercase tracking-[0.4em] text-[#00F2FF] font-bold"
        >
          {levelName}
        </motion.p>
      </header>

      <main className="relative z-10 px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
            <span className="block text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">Missões</span>
            <span className="text-xl font-bold">12</span>
          </div>
          <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
            <span className="block text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">Ranking</span>
            <span className="text-xl font-bold">#42</span>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Conquistas", icon: Award },
            { label: "Histórico de Análise", icon: Shield },
          ].map((item, i) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5 text-white/40" />
                <span className="text-sm font-bold text-white/80">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </button>
          ))}
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-between p-6 bg-red-500/5 border border-red-500/10 rounded-[2rem] hover:bg-red-500/10 transition-all mt-8"
          >
            <div className="flex items-center gap-4">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-sm font-bold text-red-400">Encerrar Sessão</span>
            </div>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Perfil;
