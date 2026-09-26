import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("formatea montos en soles con 2 decimales", () => {
    const result = formatCurrency(1234.5);
    expect(result).toContain("S/");
    expect(result).toContain("1,234.50");
  });

  it("formatea cero", () => {
    expect(formatCurrency(0)).toContain("0.00");
  });
});
