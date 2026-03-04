import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "next-themes";

// Bridge: se o provedor OAuth redirecionar para /auth/callback (sem hash),
// converte para o caminho do HashRouter preservando query params.
if (location.pathname.startsWith("/auth/callback")) {
  const search = location.search || "";
  location.replace(`/#/auth/callback${search}`);
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="blue" enableSystem={false} themes={["blue", "purple", "red"]}>
    <App />
  </ThemeProvider>
);
