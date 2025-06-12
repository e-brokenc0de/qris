// CRC-16/CCITT-FALSE implementation used by QRIS (polynomial 0x1021, initial 0xFFFF, no XOR out)
// Reference: EMV QR Code specification annex.

const POLY = 0x1021;

export function crc16Ccitt(data: string): string {
  let crc = 0xffff;

  for (let i = 0; i < data.length; i++) {
    let byte = data.charCodeAt(i);
    crc ^= byte << 8;

    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ POLY;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }

  // Return as upper-case hexadecimal, 4 characters, padded with leading zeros.
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
