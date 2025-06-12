# QRIS Utils

> Parse, validate and generate strings compliant with **QRIS – Quick Response Code Indonesian Standard** (Merchant Presented Mode, static & dynamic).

---

## Installation

```sh
# with bun
bun add @brokenc0de/qris

# or with npm
npm install @brokenc0de/qris
```

> **Note** The package ships as ESM + CJS builds and is fully typed (d.ts).

---

## Quick-start

```ts
import { parseQris, validateQris, generateQris } from "@brokenc0de/qris";

const raw = `00020101021226590016A0110100000000000270530303105802040758026559009TOKOPEDIA6013JAKARTA UTARA61051234562620450053037646304C49E`;

// 1️⃣ Parse → AST
const ast = parseQris(raw);

// 2️⃣ Validate
const { valid, errors } = validateQris(raw);
if (!valid) console.error(errors);

// 3️⃣ Modify & regenerate
const amountField = ast.find((f) => f.id === "54");
if (amountField) amountField.value = "1000";
const newRaw = generateQris(ast); // CRC auto-recalculated
```

---

## API

### `parseQris(raw: string): QrisObject`

Returns an array of `QrisField` objects (recursive AST). Throws if the string is malformed.

### `generateQris(obj: QrisObject, options?)`

Serialises the AST back to a QRIS string. Options:

- `includeCRC` (default `true`) – append CRC-16/CCITT checksum.

### `validateQris(raw | obj)`

Returns `{ valid: boolean, errors: ValidationError[] }` performing:

- structural checks (mandatory tags, min/max length)
- checksum verification

### Types

```ts
interface QrisField {
  id: string; // "00" – "99"
  value: string | QrisField[]; // nested TLVs for template tags
  name?: string; // friendly tag description
}

type QrisObject = QrisField[];
```

---

## CLI (optional)

The library is code-first, but you can run quick one-offs with `bunx` / `npx`:

```sh
bunx qris-utils parse "<string>"
```

(Coming soon.)

---

## Development

1. `bun install` – install deps.
2. `bun test` – Jest unit tests (11+ assertions & fixtures).
3. `bun run build` – Bundles with **tsup**.

### Releasing

- Conventional Commits + Semantic Release.
- Push to `master` and GitHub Actions will test, build, version, publish to npm and create release notes.

---

## Roadmap

- Full BI rule-book conformance (dynamic QR / DOMESTIC MCC validation)
- CLI utilities
- QR image (SVG/PNG) encoder
- 100 % unit test coverage

---

## License

MIT © brokenc0de
