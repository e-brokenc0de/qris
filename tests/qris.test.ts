import { generateQris, parseQris, validateQris } from "../src";
import type { QrisObject } from "../src";

// Helper to build a minimal valid QRIS object
const sampleFields: QrisObject = [
  { id: "00", value: "01" },
  { id: "52", value: "5311" },
  { id: "53", value: "360" },
  { id: "58", value: "ID" },
  { id: "59", value: "TEST" },
  { id: "60", value: "JAKARTA" },
];

describe("QRIS Utils library", () => {
  const raw = generateQris(sampleFields);

  it("generates a QRIS string with valid CRC", () => {
    const { valid, errors } = validateQris(raw);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it("parses the generated string back to an AST equal to original fields", () => {
    const ast = parseQris(raw);
    // Remove CRC field and name property before comparison
    const withoutCrc = ast
      .filter((f) => f.id !== "63")
      .map(({ id, value }) => ({ id, value }));
    expect(withoutCrc).toEqual(sampleFields);
  });

  it("detects CRC errors", () => {
    // Flip last character to corrupt CRC
    const corrupted = raw.slice(0, -1) + (raw.slice(-1) === "0" ? "1" : "0");
    const { valid, errors } = validateQris(corrupted);
    expect(valid).toBe(false);
    expect(errors.find((e) => e.id === "63")).toBeDefined();
  });
});
