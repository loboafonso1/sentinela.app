import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const STORAGE_KEY = "sentinela_favorites";

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function FavoriteButton({
  itemId,
  onChange,
  compact = false,
}: {
  itemId: string;
  onChange?: (fav: boolean) => void;
  compact?: boolean;
}) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(loadFavorites().includes(itemId));
  }, [itemId]);

  const toggle = () => {
    const current = loadFavorites();
    let next: string[];
    if (current.includes(itemId)) next = current.filter((id) => id !== itemId);
    else next = [...current, itemId];
    saveFavorites(next);
    setFav(next.includes(itemId));
    onChange?.(next.includes(itemId));
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={fav}
      aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={
        compact
          ? `inline-flex items-center justify-center rounded-lg border p-1.5 transition-colors ${
              fav ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            }`
          : `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              fav ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
            }`
      }
    >
      <Heart className={compact ? "h-4 w-4" : "h-4 w-4"} fill={fav ? "currentColor" : "none"} />
      {!compact && <span>{fav ? "Favorito" : "Favoritar"}</span>}
    </button>
  );
}
