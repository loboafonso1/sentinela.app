import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) navigate("/ia-selection");
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-800 via-purple-700 to-pink-600 text-primary-foreground flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="relative mb-6">
          <div className="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-black/20 flex items-center justify-center">
            <Crown className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[36px] bg-black/75 border border-white/10 shadow-2xl overflow-hidden"
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,.45)" }}
        >
          {/* Top fake status bar */}
          <div className="relative h-6">
            <div className="absolute right-3 top-1 h-1 w-10 rounded-full bg-white/40" />
          </div>
          {/* Hero photo with orbit dots */}
          <div className="relative px-6">
            <div className="absolute left-1/2 -translate-x-1/2 top-6 h-56 w-56 rounded-full bg-fuchsia-700/40" />
            <div className="absolute left-1/2 -translate-x-1/2 top-6 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute left-[18%] top-20 h-3 w-3 rounded-full bg-fuchsia-400" />
            <div className="absolute right-[18%] top-24 h-3 w-3 rounded-full bg-fuchsia-400" />
            <div className="absolute left-1/2 -translate-x-1/2 top-40 h-2 w-2 rounded-full bg-fuchsia-400" />
            <img
              src="/images/onboarding/hero.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
              alt="Imagem destaque"
              className="relative z-10 mx-auto max-h-96 object-contain"
            />
          </div>
          {/* Text and CTA inside card bottom */}
          <div className="px-6 pt-1 pb-6">
            <h1 className="text-2xl font-extrabold tracking-wide text-white text-center mb-1">SENTINELA</h1>
            <p className="text-sm text-white/80 text-center mb-4">Elite</p>
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="h-1.5 w-8 rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <Button
                aria-label="Entrar"
                onClick={async () => {
                  setLoading(true);
                  signIn(email);
                  navigate("/ia-selection");
                  setLoading(false);
                }}
                variant="outline"
                disabled={loading}
                aria-busy={loading}
                className="rounded-2xl border-white/30 text-white hover:bg-white/10 px-5 py-4 inline-flex items-center justify-center gap-2 leading-tight w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                    Conectando…
                  </>
                ) : (
                  <>
                    Entrar
                  </>
                )}
              </Button>
              <div className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2">
                  Email (opcional)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled
                className="rounded-2xl w-full text-white/90 bg-white/10 hover:bg-white/10 cursor-default py-3"
              >
                acesso liberado com email usado na compra
              </Button>
            </div>
          </div>
          {/* Bottom home bar */}
          <div className="flex items-center justify-center pb-3">
            <div className="h-1.5 w-24 rounded-full bg-white/40" />
          </div>
        </motion.div>
        {/* Footer trust line */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-xs text-white/80">
              Acesso exclusivo para membros ativos — use o email da compra.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
