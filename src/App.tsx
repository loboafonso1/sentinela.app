import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/estudos" element={<DailyStudy />} />
          <Route path="/treino" element={<Treino />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/resumo" element={<Resumo />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/bloqueio" element={<Bloqueio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
