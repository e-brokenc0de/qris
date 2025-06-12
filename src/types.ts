// Core type definition for AST nodes
export interface QrisField {
  /** Two-digit numeric identifier ("00"-"99") */
  id: string;
  /** Value or recursively nested fields for template IDs */
  value: string | QrisField[];
  /** Human-friendly tag description */
  name?: string;
}

export type QrisObject = QrisField[];
