import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-[#0A0014] text-white flex items-center justify-center">
      <div className="text-sm opacity-70">Redirecionando…</div>
    </div>
  );
};

export default AuthCallback;

