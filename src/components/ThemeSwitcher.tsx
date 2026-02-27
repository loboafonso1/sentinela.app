import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import FavoriteButton from "@/components/FavoriteButton";

const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  const opts = [
    { id: "blue", label: "Blue" },
    { id: "purple", label: "Purple" },
    { id: "red", label: "Red" },
  ];
  return (
    <div className="flex gap-2">
      {opts.map(o => (
        <div key={o.id} className="flex items-center gap-1">
          <Button
            variant={theme === o.id ? "default" : "outline"}
            onClick={() => setTheme(o.id)}
            className="rounded-xl"
          >
            {o.label}
          </Button>
          <FavoriteButton itemId={`theme-${o.id}`} compact />
        </div>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
