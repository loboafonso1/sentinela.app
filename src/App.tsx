import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Treino from "./pages/Treino";
import Evolucao from "./pages/Evolucao";
import Configuracoes from "./pages/Configuracoes";
import Bloqueio from "./pages/Bloqueio";
import NotFound from "./pages/NotFound";
import Favoritos from "./pages/Favoritos";
import Onboarding from "./pages/Onboarding";
import IASelection from "./pages/IASelection";
import ProximaEtapa from "./pages/ProximaEtapa";
import Treinamento from "./pages/Treino";
import Investigacao from "./pages/Investigacao";
import AnalisePadroes from "./pages/AnalisePadroes";
import ResultadoAnalise from "./pages/ResultadoAnalise";
import Progresso from "./pages/Evolucao";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import AuthCallback from "./pages/AuthCallback";
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/ia-selection" element={<ProtectedRoute><IASelection /></ProtectedRoute>} />
          <Route path="/proxima-etapa" element={<ProtectedRoute><ProximaEtapa /></ProtectedRoute>} />
          <Route path="/treinamento" element={<ProtectedRoute><Treinamento /></ProtectedRoute>} />
          <Route path="/investigacao" element={<ProtectedRoute><Investigacao /></ProtectedRoute>} />
          <Route path="/analise-padroes" element={<ProtectedRoute><AnalisePadroes /></ProtectedRoute>} />
          <Route path="/resultado-analise" element={<ProtectedRoute><ResultadoAnalise /></ProtectedRoute>} />
          <Route path="/progresso" element={<ProtectedRoute><Progresso /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
