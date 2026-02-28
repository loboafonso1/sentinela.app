import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Treino from "./pages/Treino";
import Evolucao from "./pages/Evolucao";
import Configuracoes from "./pages/Configuracoes";
import Bloqueio from "./pages/Bloqueio";
import NotFound from "./pages/NotFound";
import Favoritos from "./pages/Favoritos";
import Onboarding from "./pages/Onboarding";
import DailyStudy from "./pages/DailyStudy";
import Resumo from "./pages/Resumo";
import AuthCallback from "./pages/AuthCallback";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/estudos" element={<ProtectedRoute><DailyStudy /></ProtectedRoute>} />
          <Route path="/treino" element={<ProtectedRoute><Treino /></ProtectedRoute>} />
          <Route path="/evolucao" element={<ProtectedRoute><Evolucao /></ProtectedRoute>} />
          <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
          <Route path="/resumo" element={<ProtectedRoute><Resumo /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="/bloqueio" element={<ProtectedRoute><Bloqueio /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
