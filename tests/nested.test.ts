import { generateQris, parseQris, validateQris } from "../src";
import type { QrisObject } from "../src";

describe("Nested template (ID 26) handling", () => {
  const nestedFields: QrisObject = [
    { id: "00", value: "01" },
    {
      id: "26",
      value: [
        { id: "00", value: "IDDANA" },
        { id: "02", value: "123456789012345" },
      ],
    },
    { id: "52", value: "0000" },
    { id: "53", value: "360" },
    { id: "58", value: "ID" },
    { id: "59", value: "DANA" },
    { id: "60", value: "JAKARTA" },
  ];

  const raw = generateQris(nestedFields);

  it("round-trips nested templates", () => {
    const parsed = parseQris(raw);
    const template26 = parsed.find((f) => f.id === "26");
    expect(template26).toBeDefined();
    expect(Array.isArray(template26!.value)).toBe(true);
    // @ts-ignore
    expect(template26!.value.length).toBe(2);
  });

  it("passes validation with correct subfield mapping", () => {
    const res = validateQris(raw);
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
  });
});
