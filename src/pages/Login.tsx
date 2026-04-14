import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-login px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm space-y-10 text-center"
      >
        {/* Logo */}
        <div className="space-y-5">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-sentinel shadow-premium"
          >
            <Shield className="h-14 w-14 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-serif font-bold text-gradient-sentinel tracking-widest"
          >
            SENTINELA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-semibold text-primary tracking-[0.3em] uppercase"
          >
            ELITE
          </motion.p>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-sm"
        >
          Acesso exclusivo para membros
        </motion.p>

        {/* Login */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <div className="rounded-2xl bg-card/40 border border-border px-4 py-4 text-left">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 font-semibold">
              Email (opcional)
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-background/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/20"
              inputMode="email"
              autoComplete="email"
            />
          </div>
          <Button
            onClick={async () => {
              setLoading(true);
              signIn(email);
              navigate("/ia-selection");
              setLoading(false);
            }}
            disabled={loading}
            aria-busy={loading}
            className="w-full py-5 px-5 rounded-2xl bg-card border border-border text-foreground hover:bg-secondary font-medium text-sm gap-2 inline-flex items-center justify-center leading-tight"
            variant="outline"
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

          
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-muted-foreground/60"
        >
          Acesso vitalício enquanto sua assinatura estiver ativa.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;
