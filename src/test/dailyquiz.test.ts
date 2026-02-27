import { renderHook, act } from "@testing-library/react";
import { useDailyQuiz } from "@/hooks/useDailyQuiz";

describe("useDailyQuiz", () => {
  it("initializes with items and allows answering", () => {
    const { result } = renderHook(() => useDailyQuiz());
    // Wait one tick for effect
    act(() => {});
    const total = result.current.total;
    expect(total).toBeGreaterThan(0);
    const idx = result.current.index;
    act(() => result.current.answer(0));
    expect(result.current.index).toBe(idx + 1);
  });
});
