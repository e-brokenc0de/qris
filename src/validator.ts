import type { QrisObject, QrisField } from "./types";
import { TAGS } from "./grammar/tags";
import { getTagMeta } from "./grammar/getTagMeta";
import { crc16Ccitt } from "./utils/crc16";
import { generateQris } from "./generator";
import { parseQris } from "./parser";

export interface ValidationError {
  id: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function validateField(
  field: QrisField,
  errors: ValidationError[],
  parentId?: string
): void {
  const meta = getTagMeta(field.id, parentId);
  if (!meta) {
    // Unknown tag – not necessarily an error but warn
    return;
  }

  if (Array.isArray(field.value)) {
    // Template – recurse
    field.value.forEach((child) => validateField(child, errors, field.id));
  } else {
    const len = field.value.length;
    if (meta.minLength !== undefined && len < meta.minLength) {
      errors.push({
        id: field.id,
        message: `Value too short (min ${meta.minLength})`,
      });
    }
    if (meta.maxLength !== undefined && len > meta.maxLength) {
      if (!errors.find((e) => e.id === field.id)) {
        errors.push({
          id: field.id,
          message: `Value '${meta?.name}' too long (max ${meta.maxLength}). current length: ${len} (value: ${field.value})`,
        });
      }
    }
  }
}

export function validateQris(
  inputOrObject: string | QrisObject
): ValidationResult {
  let obj: QrisObject;
  let raw: string;

  if (typeof inputOrObject === "string") {
    raw = inputOrObject;
    obj = parseQris(inputOrObject);
  } else {
    obj = inputOrObject;
    raw = generateQris(obj, { includeCRC: false });
  }

  const errors: ValidationError[] = [];

  // Check required fields
  for (const [id, meta] of Object.entries(TAGS)) {
    if (meta.required) {
      const present = obj.some((f) => f.id === id);
      if (!present) {
        errors.push({ id, message: "Missing required field" });
      }
    }
  }

  // Structural validation
  obj.forEach((f) => validateField(f, errors));

  // CRC check
  const crcField = obj.find((f) => f.id === "63" && !Array.isArray(f.value));
  if (crcField) {
    const providedCRC = crcField.value as string;
    // Compute expected
    const beforeValue = raw.slice(0, raw.length - 4); // Exclude the 4-char CRC value
    const expected = crc16Ccitt(beforeValue);
    if (providedCRC.toUpperCase() !== expected.toUpperCase()) {
      errors.push({
        id: "63",
        message: `CRC mismatch (expected ${expected}, got ${providedCRC})`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
