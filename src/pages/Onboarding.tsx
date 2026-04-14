import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    void user;
  }, [user]);

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-gradient-to-br from-[#1A0035] via-[#0A0014] to-[#FF00D9]/10 text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,0,217,0.22)_0%,_transparent_55%)] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_35%_10%,_rgba(122,0,255,0.35)_0%,_transparent_55%)] z-0" />

      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-between px-6 pt-10 pb-14">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-sm bg-[#00F2FF] shadow-[0_0_12px_rgba(0,242,255,0.6)]" />
            <span className="text-[10px] uppercase tracking-[0.45em] text-white/70 font-bold">SENTINELA ELITE</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="w-full max-w-md flex flex-col items-center">
          <div className="relative w-[270px] h-[420px]">
            <div className="absolute inset-0 rounded-[999px] bg-gradient-to-b from-[#7A00FF]/35 to-transparent blur-2xl" />
            <div className="absolute left-1/2 top-10 -translate-x-1/2 w-56 h-56 rounded-full bg-[#FF00D9]/10 blur-xl" />
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <img src="/images/onboarding/hero.png" alt="" className="h-[420px] object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.6)]" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-4xl font-serif font-bold tracking-[0.12em]">SENTINELA</h1>
            <p className="text-sm text-white/60 mt-2">Elite</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="w-10 h-1 rounded-full bg-white/25" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="w-full max-w-md space-y-3">
          {showEmail && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 font-bold">Email (opcional)</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/10"
                inputMode="email"
                autoComplete="email"
              />
            </div>
          )}

          <button
            onClick={async () => {
              setLoading(true);
              signIn(email);
              navigate("/ia-selection");
              setLoading(false);
            }}
            disabled={loading}
            className="w-full rounded-2xl bg-black/35 border border-white/10 backdrop-blur-xl py-4 px-5 flex items-center justify-center gap-3 active:scale-[0.99] transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <span className="text-sm font-semibold text-white/80">Conectando…</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-semibold text-white/85">Entrar com Google</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowEmail((v) => !v)}
            className="w-full text-[10px] uppercase tracking-[0.35em] text-white/35 py-2"
          >
            {showEmail ? "Ocultar email" : "Usar email"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
