import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Onboarding from "@/pages/Onboarding";

describe("Onboarding", () => {
  it("exibe CTA de entrada e não mostra Apple", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.queryByText(/Entrar com Apple/i)).toBeNull();
  });

  it("permite iniciar sessão local", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/ia-selection" element={<div>IA</div>} />
        </Routes>
      </MemoryRouter>
    );
    const btn = screen.getByRole("button", { name: /Entrar/i });
    fireEvent.click(btn);
    expect(localStorage.getItem("sentinela_local_user")).toBeTruthy();
  });
});
