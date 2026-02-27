import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FavoriteButton from "@/components/FavoriteButton";

describe("FavoriteButton", () => {
  const KEY = "sentinela_favorites";
  beforeEach(() => {
    localStorage.removeItem(KEY);
  });

  it("toggles favorite state and persists to localStorage", () => {
    render(<FavoriteButton itemId="treino-diario" />);
    const btn = screen.getByRole("button", { name: /adicionar aos favoritos/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
    expect(stored).toContain("treino-diario");
    expect(screen.getByRole("button", { name: /remover dos favoritos/i })).toBeInTheDocument();
  });
});
