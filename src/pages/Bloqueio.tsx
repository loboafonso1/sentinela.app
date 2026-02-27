import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, ExternalLink } from "lucide-react";

const Bloqueio = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-login px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center space-y-8"
      >
        <div className="mx-auto h-24 w-24 rounded-3xl bg-destructive/15 flex items-center justify-center">
          <Shield className="h-12 w-12 text-destructive" />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-serif font-bold text-foreground">Assinatura Inativa</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sua assinatura do Sentinela Elite precisa estar ativa para continuar sua evolução.
          </p>
        </div>

        <Button
          onClick={() => window.open("https://kiwify.com", "_blank")}
          className="w-full bg-gradient-sentinel text-primary-foreground font-semibold py-6 rounded-2xl shadow-sentinel text-base"
        >
          Renovar Assinatura <ExternalLink className="h-4 w-4 ml-2" />
        </Button>

        <button onClick={() => navigate("/login")} className="text-xs text-muted-foreground underline">
          Voltar ao login
        </button>
      </motion.div>
    </div>
  );
};

export default Bloqueio;
