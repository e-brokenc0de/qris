# QRIS Utils

Lightweight TypeScript toolkit to **parse, validate and generate** strings that follow the _QRIS – Quick Response Code Indonesian Standard_ (Merchant Presented Mode — static & dynamic).

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [CLI](#cli-optional)
- [Development](#development)
- [License](#license)

---

## Features

- 📦 **Fully-typed** API (ESM & CommonJS bundles)
- 🔒 Transparent **CRC-16/CCITT** checksum handling
- 🪶 **Zero-dependency**, tiny footprint

---

## Installation

```sh
# Bun
bun add @brokenc0de/qris

# npm / pnpm / yarn
npm install @brokenc0de/qris
```

> The package ships with ESM _and_ CJS builds & ships its own `.d.ts` typings.

---

## Quick Start

```ts
import { parseQris, validateQris, generateQris } from "@brokenc0de/qris";

const raw = "00020101021226590016A011010000000000027053030310580204...C49E";

// 1️⃣ Parse → AST
const ast = parseQris(raw);

// 2️⃣ Validate (structure + CRC)
const { valid, errors } = validateQris(raw);

// 3️⃣ Manipulate and (optionally) regenerate
ast.find((f) => f.id === "54")!.value = "50000.00"; // change amount
const updated = generateQris(ast); // CRC is appended automatically
```

---

## API

### `parseQris(raw: string): QrisObject`

Converts a QRIS string into a recursive array of `QrisField` objects. Throws on malformed input.

### `generateQris(obj: QrisObject, options?)`

Serialises the AST back to a QRIS string.

• `includeCRC` (default `true`) — append CRC-16/CCITT checksum.

### `validateQris(rawOrObj)`

Returns `{ valid: boolean, errors: ValidationError[] }` after:

- Structural checks (mandatory tags, min/max length)
- Checksum verification

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

Run commands straight from your terminal — no project setup needed.

### Usage

```sh
# One-off (recommended)
bunx @brokenc0de/qris <command> "<qris>"

# Or install globally
bun add -g @brokenc0de/qris          # Bun
npm  i  -g @brokenc0de/qris          # npm / pnpm / yarn

qris-utils <command> "<qris>"
```

### Available commands

| Command           | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `parse <qris>`    | Pretty-prints the AST as JSON                                             |
| `validate <qris>` | Validates structure + CRC, prints result and exits with code 1 on failure |

Example:

```sh
bunx qris-utils validate "000201010212265900..."   # ✔ QRIS string is valid.
bunx qris-utils parse "000201010212265900..."      # → JSON AST
```

More commands (e.g. `generate`) will land in future releases.

---

## Development

1. `bun install`
