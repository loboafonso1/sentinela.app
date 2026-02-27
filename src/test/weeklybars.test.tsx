import { render, screen } from "@testing-library/react";
import WeeklyBars from "@/components/WeeklyBars";
import React from "react";

describe("WeeklyBars", () => {
  it("renders fallback when no data", () => {
    render(<WeeklyBars data={[]} />);
    expect(screen.getByText(/Sem dados de atividade/)).toBeInTheDocument();
  });

  it("renders 7 bars with correct aria values", () => {
    const data = [
      { day: "Seg", value: 10 },
      { day: "Ter", value: 20 },
      { day: "Qua", value: 30 },
      { day: "Qui", value: 40 },
      { day: "Sex", value: 50 },
      { day: "Sáb", value: 60 },
      { day: "Dom", value: 70 },
    ];
    render(<WeeklyBars data={data} />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(7);
    expect(bars[0]).toHaveAttribute("aria-valuenow", "10");
    expect(bars[6]).toHaveAttribute("aria-valuenow", "70");
  });
});
