import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const { data: userRes } = await supabase.auth.getUser();
        if (!mounted) return;
        if (sess?.session && userRes?.user) {
          navigate("/estudos", { replace: true });
        } else {
          console.error("Supabase callback sem sessão ou usuário válido.", { sess, userRes });
          navigate("/", { replace: true });
        }
      } catch (e) {
        console.error("Erro no AuthCallback:", e);
        navigate("/", { replace: true });
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-sm opacity-80">Finalizando login...</div>
    </div>
  );
};

export default AuthCallback;
