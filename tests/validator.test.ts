import { generateQris, validateQris } from "../src";
import type { QrisObject } from "../src";

const baseFields: QrisObject = [
  { id: "00", value: "01" },
  { id: "52", value: "5311" },
  { id: "53", value: "360" },
  { id: "58", value: "ID" },
  { id: "59", value: "GOODMERCHANT" },
  { id: "60", value: "JAKARTA" },
];

describe("validateQris structural rules", () => {
  it("detects missing required field", () => {
    const missingCurrency: QrisObject = baseFields.filter((f) => f.id !== "53");
    const raw = generateQris(missingCurrency);
    const res = validateQris(raw);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.id === "53")).toBe(true);
  });

  it("detects length violations (too short)", () => {
    const badLen: QrisObject = baseFields.map((f) =>
      f.id === "52" ? { ...f, value: "12" } : f
    );
    const res = validateQris(generateQris(badLen));
    expect(res.valid).toBe(false);
    expect(res.errors.find((e) => e.id === "52")).toBeDefined();
  });

  it("detects length violations (too long)", () => {
    const badLen: QrisObject = baseFields.map((f) =>
      f.id === "59" ? { ...f, value: "A".repeat(26) } : f
    );
    const res = validateQris(generateQris(badLen));
    expect(res.valid).toBe(false);
    expect(res.errors.find((e) => e.id === "59")).toBeDefined();
  });

  it("flags missing CRC when not included", () => {
    const rawNoCRC = generateQris(baseFields, { includeCRC: false });
    const res = validateQris(rawNoCRC);
    expect(res.valid).toBe(false);
    expect(res.errors.find((e) => e.id === "63")).toBeDefined();
  });
});
