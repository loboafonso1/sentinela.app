import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 glow-gold">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gradient-gold">EXAMINAI</h1>
        </div>

        <div className="rounded-xl border border-gold bg-card p-6 shadow-gold space-y-5">
          {sent ? (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-serif font-semibold text-foreground">Email enviado!</h2>
              <p className="text-muted-foreground text-sm">Verifique sua caixa de entrada para redefinir sua senha.</p>
              <Link to="/login"><Button variant="outline" className="mt-4">Voltar ao login</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <h2 className="text-xl font-serif font-semibold text-foreground text-center">Recuperar Senha</h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email cadastrado</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="bg-secondary border-border" />
              </div>
              <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground font-semibold" disabled={loading}>
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Voltar ao login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RecuperarSenha;
