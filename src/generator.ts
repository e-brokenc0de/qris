import type { QrisField, QrisObject } from "./types";
import { crc16Ccitt } from "./utils/crc16";

function encodeField(field: QrisField): string {
  const { id, value } = field;

  let encodedValue: string;
  if (Array.isArray(value)) {
    encodedValue = value.map(encodeField).join("");
  } else {
    encodedValue = value;
  }

  const lenStr = encodedValue.length.toString().padStart(2, "0");
  return `${id}${lenStr}${encodedValue}`;
}

export interface GenerateOptions {
  includeCRC?: boolean;
}

export function generateQris(
  fields: QrisObject,
  opts: GenerateOptions = {}
): string {
  const { includeCRC = true } = opts;

  // Filter out any pre-existing CRC field to avoid duplication
  const withoutCRC = fields.filter((f) => f.id !== "63");

  let partial = withoutCRC.map(encodeField).join("");

  if (includeCRC) {
    // Append CRC placeholder "6304" before computing checksum.
    const crcInput = partial + "6304";
    const crc = crc16Ccitt(crcInput);
    partial += `6304${crc}`;
  }

  return partial;
}
