import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="blue" enableSystem={false} themes={["blue", "purple", "red"]}>
    <App />
  </ThemeProvider>
);
