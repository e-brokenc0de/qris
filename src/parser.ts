import type { QrisField, QrisObject } from "./types";
import { TAGS } from "./grammar/tags";
import { getTagMeta } from "./grammar/getTagMeta";

function isTemplate(id: string): boolean {
  return TAGS[id]?.template ?? false;
}

interface ParseResult {
  fields: QrisObject;
  nextPos: number;
}

function parseFieldList(
  data: string,
  pos: number,
  parentId?: string
): ParseResult {
  const fields: QrisObject = [];

  while (pos + 4 <= data.length) {
    const id = data.slice(pos, pos + 2);
    const lenStr = data.slice(pos + 2, pos + 4);
    const len = parseInt(lenStr, 10);

    if (Number.isNaN(len) || len < 0) {
      throw new Error(`Invalid length for ${id} at position ${pos}`);
    }

    const valueStart = pos + 4;
    const valueEnd = valueStart + len;

    if (valueEnd > data.length) {
      throw new Error(
        `Unexpected end of string when reading value of ID ${id}`
      );
    }

    const rawValue = data.slice(valueStart, valueEnd);

    let value: string | QrisField[] = rawValue;
    if (isTemplate(id)) {
      // Recursively parse subfields, passing current id as parent context
      value = parseFieldList(rawValue, 0, id).fields;
    }

    const meta = getTagMeta(id, parentId);
    const name = meta?.name;

    fields.push({ id, value, name });

    pos = valueEnd;

    if (id === "63") {
      // CRC is always last; stop parsing
      break;
    }
  }

  return { fields, nextPos: pos };
}

export function parseQris(input: string): QrisObject {
  if (!/^[0-9A-Z]+$/i.test(input)) {
    // throw new Error(
    //   "Input contains invalid characters. Only alphanumeric expected."
    // );
  }

  const { fields, nextPos } = parseFieldList(input, 0);

  if (nextPos !== input.length) {
    throw new Error("Trailing data after parsing QRIS string.");
  }

  return fields;
}
