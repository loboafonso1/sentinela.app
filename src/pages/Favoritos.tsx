import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "@/components/FavoriteButton";
import BottomNav from "@/components/BottomNav";
import { Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "sentinela_favorites";

type FavoriteItem = {
  id: string;
  title: string;
  description?: string;
  path?: string;
};

const CATALOG: Record<string, FavoriteItem> = {
  "treino-diario": {
    id: "treino-diario",
    title: "Treino diário",
    description: "Sessão de 15 minutos de discernimento",
    path: "/treino",
  },
  "theme-blue": {
    id: "theme-blue",
    title: "Tema Azul",
    description: "Atalho de tema preferido",
    path: "/configuracoes",
  },
  "theme-purple": {
    id: "theme-purple",
    title: "Tema Roxo",
    description: "Atalho de tema preferido",
    path: "/configuracoes",
  },
  "theme-red": {
    id: "theme-red",
    title: "Tema Vermelho",
    description: "Atalho de tema preferido",
    path: "/configuracoes",
  },
};

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const Favoritos = () => {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("sentinela_logged_in")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    setIds(loadFavorites());
  }, []);

  const items = useMemo<FavoriteItem[]>(() => {
    return ids.map((id) => CATALOG[id] ?? { id, title: id });
  }, [ids]);

  const refresh = () => setIds(loadFavorites());

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-responsive pt-6 pb-4">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wider uppercase">Favoritos</span>
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground">Seus itens favoritos</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-responsive space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-card-lg text-center space-y-2">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Você ainda não favoritou nada. Toque no ícone de coração nas telas para salvar aqui.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-card p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className="text-foreground font-medium">{item.title}</p>
                {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {item.path && (
                  <Button onClick={() => navigate(item.path!)} className="rounded-xl bg-gradient-sentinel text-primary-foreground h-8 px-3">
                    Abrir <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
                <FavoriteButton itemId={item.id} onChange={refresh} />
              </div>
            </div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Favoritos;
