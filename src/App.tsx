import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
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
import PreviewLessons from "./pages/PreviewLessons";
import MeuPlano from "./pages/MeuPlano";

const queryClient = new QueryClient();

import { checkUserSubscription } from "@/lib/subscriptions";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const uid = user?.id ?? "";
  const { data: hasSub, isLoading } = useQuery({
    queryKey: ["subscription", uid],
    queryFn: () => checkUserSubscription(uid),
    enabled: !!uid,
    staleTime: 60_000,
  });
  if (loading || isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasSub) return <Navigate to="/assinar" replace />;
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
          <Route path="/assinar" element={<MeuPlano />} />
          <Route
            path="/preview"
            element={
              (import.meta.env.DEV || import.meta.env.VITE_PREVIEW_MODE === "true")
                ? <ProtectedRoute><PreviewLessons /></ProtectedRoute>
                : <Navigate to="/" replace />
            }
          />
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
