import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Crown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);

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
          <div className="px-6 pt-3 pb-6">
            <h1 className="text-2xl font-extrabold tracking-wide text-white text-center mb-1">SENTINELA</h1>
            <p className="text-sm text-white/80 text-center mb-4">Elite</p>
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="h-1.5 w-8 rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <Button
                aria-label="Entrar com Google"
                onClick={async () => {
                  try {
                    setGoogleLoading(true);
                    const { data, error } = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: { redirectTo: `${window.location.origin}/#/auth/callback` }
                    });
                    if (error || !data?.url) {
                      toast.info("Login com Google ainda não está habilitado.");
                      setGoogleLoading(false);
                      return;
                    }
                    window.location.href = data.url;
                  } catch (_) {
                    toast.info("Login com Google ainda não está habilitado.");
                    setGoogleLoading(false);
                  }
                }}
                variant="outline"
                disabled={googleLoading}
                aria-busy={googleLoading}
                className="rounded-2xl border-white/30 text-white hover:bg-white/10 px-5 py-4 inline-flex items-center justify-center gap-2 leading-tight w-full"
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin shrink-0" />
                    Conectando…
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Entrar com Google
                  </>
                )}
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
            <span className="text-xs text-white/80">Acesso exclusivo para membros ativos.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
