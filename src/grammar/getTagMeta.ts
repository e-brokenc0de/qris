import { TAGS, SUB_TAGS, TagMeta } from "./tags";

/**
 * Resolve metadata for a tag ID taking into account its parent template.
 * Returns undefined for children of template 62 (free-form Additional Data Field Template).
 */
export function getTagMeta(id: string, parentId?: string): TagMeta | undefined {
  // Children of Additional Data Field Template are free-form – ignore
  if (parentId === "62") {
    return undefined;
  }

  if (parentId && SUB_TAGS[parentId]) {
    return SUB_TAGS[parentId][id] ?? undefined;
  }

  return TAGS[id] ?? undefined;
}
