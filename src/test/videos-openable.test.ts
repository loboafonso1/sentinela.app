import { describe, it, expect } from "vitest";
import { getDayModule } from "@/modules";

const extract = (u: string): string | null => {
  const r1 = /(?:youtube\.com\/.*(?:\?|&)v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const r2 = /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/;
  const m1 = u.match(r1);
  if (m1) return m1[1];
  const m2 = u.match(r2);
  return m2 ? m2[1] : null;
};

describe("YouTube IDs for days 1–7", () => {
  it("extracts IDs when module defines video_url", () => {
    for (let d = 1; d <= 7; d++) {
      const mod = getDayModule(d);
      if (mod?.video_url) {
        const id = extract(mod.video_url);
        expect(id && id.length).toBe(11);
      }
    }
  });
});
