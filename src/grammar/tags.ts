export interface TagMeta {
  id: string; // two-digit numeric string
  name: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  template?: boolean; // If true, the value contains nested TLVs
  constant: string;
}

// Partial list – extend as needed
const rawTags: Record<string, Omit<TagMeta, "constant">> = {
  "00": {
    id: "00",
    name: "Payload Format Indicator",
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  "01": {
    id: "01",
    name: "Point of Initiation Method",
    minLength: 2,
    maxLength: 2,
  },

  // Merchant Account Information (template IDs 26–51)
  ...Object.fromEntries(
    Array.from({ length: 26 }).map((_, i) => {
      const id = String(i + 26).padStart(2, "0");
      let name = `Merchant Account Information ${id}`;
      if (id === "26") {
        name = "Merchant Presented QR";
      } else if (id === "51") {
        name = "National Switch";
      }

      return [
        id,
        {
          id,
          name,
          template: true,
        } as TagMeta,
      ];
    })
  ),

  "52": {
    id: "52",
    name: "Merchant Category Code",
    minLength: 4,
    maxLength: 4,
    required: true,
  },
  "53": {
    id: "53",
    name: "Transaction Currency",
    minLength: 3,
    maxLength: 3,
    required: true,
  },
  "54": { id: "54", name: "Transaction Amount" },
  "55": { id: "55", name: "Tip or Convenience Indicator" },
  "56": { id: "56", name: "Value of Convenience Fee Fixed" },
  "57": { id: "57", name: "Value of Convenience Fee Percentage" },
  "58": {
    id: "58",
    name: "Country Code",
    minLength: 2,
    maxLength: 2,
    required: true,
  },
  "59": {
    id: "59",
    name: "Merchant Name",
    minLength: 1,
    maxLength: 25,
    required: true,
  },
  "60": {
    id: "60",
    name: "Merchant City",
    minLength: 1,
    maxLength: 15,
    required: true,
  },
  "61": { id: "61", name: "Postal Code" },

  "62": { id: "62", name: "Additional Data Field Template", template: true },
  "63": { id: "63", name: "CRC", minLength: 4, maxLength: 4, required: true },
  "64": {
    id: "64",
    name: "Merchant Information – Language Template",
    template: true,
  },
};

// Add template IDs 26–51 dynamically
for (let i = 26; i <= 51; i++) {
  const id = String(i).padStart(2, "0");
  let name = `Merchant Account Information ${id}`;
  if (id === "26") {
    name = "Merchant Presented QR";
  } else if (id === "51") {
    name = "National Switch";
  }

  rawTags[id] = {
    id,
    name,
    template: true,
  } as any;
}

function toConst(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export const TAGS: Record<string, TagMeta> = {} as any;
export const NUM_TO_CONST: Record<string, string> = {};
export const CONST_TO_NUM: Record<string, string> = {};

for (const [id, meta] of Object.entries(rawTags)) {
  const constant = toConst(meta.name);
  const full: TagMeta = { ...meta, constant } as TagMeta;
  TAGS[id] = full;
  NUM_TO_CONST[id] = constant;
  CONST_TO_NUM[constant] = id;
}

// ---------------------------------------------------------------------------
// Sub-tag definitions for specific templates (e.g., Merchant Account Info 26)
// ---------------------------------------------------------------------------

// Raw sub-tag definitions keyed by parent template ID then by sub-tag ID.
const rawSubTags: Record<string, Record<string, Omit<TagMeta, "constant">>> = {
  "26": {
    "00": { id: "00", name: "Globally Unique Identifier" },
    "01": { id: "01", name: "Merchant ID" },
    "02": { id: "02", name: "Store / terminal identifier" },
    "03": { id: "03", name: "Processor / acquirer code" },
  },
  "51": {
    "00": { id: "00", name: "National switch GUID" },
    "02": { id: "02", name: "Reference issued by the switch" },
    "03": { id: "03", name: "Same acquirer code carried forward" },
  },
};

export const SUB_TAGS: Record<string, Record<string, TagMeta>> = {};

for (const [parent, children] of Object.entries(rawSubTags)) {
  SUB_TAGS[parent] = {};
  for (const [id, meta] of Object.entries(children)) {
    const constant = toConst(meta.name);
    SUB_TAGS[parent][id] = { ...meta, constant } as TagMeta;
  }
}
