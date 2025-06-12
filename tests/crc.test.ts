import { crc16Ccitt } from "../src/utils/crc16";

describe("crc16Ccitt", () => {
  it("computes known CRC value for 123456789", () => {
    expect(crc16Ccitt("123456789")).toBe("29B1");
  });

  it("returns 4-char uppercase hex", () => {
    const crc = crc16Ccitt("HELLO");
    expect(crc).toMatch(/^[0-9A-F]{4}$/);
  });
});
