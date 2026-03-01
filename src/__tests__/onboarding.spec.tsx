import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Onboarding from "@/pages/Onboarding";

vi.mock("@/lib/supabaseClient", () => {
  return {
    supabase: {
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({
          data: { url: "https://example.com" },
          error: null,
        }),
      },
    },
  };
});

describe("Onboarding", () => {
  it("exibe apenas 'Entrar com Google' e não mostra Apple", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Entrar com Google/i })).toBeInTheDocument();
    expect(screen.queryByText(/Entrar com Apple/i)).toBeNull();
  });

  it("aciona fluxo de OAuth do Google", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
        </Routes>
      </MemoryRouter>
    );
    const btn = screen.getByRole("button", { name: /Entrar com Google/i });
    fireEvent.click(btn);
    const { supabase } = await import("@/lib/supabaseClient");
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
  });
});
