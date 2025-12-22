import React from 'react';

/**
 * Highlights search terms in text
 */
export function highlightText(text: string, searchQuery: string): React.ReactNode {
  if (!searchQuery || !text) {
    return text;
  }

  const query = searchQuery.trim();
  if (query.length === 0) {
    return text;
  }

  // Escape special regex characters
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Extracts all unique tags from SOPs
 */
export function extractAllTags(sops: Array<{ tags?: string[] }>): string[] {
  const tagSet = new Set<string>();
  sops.forEach((sop) => {
    if (sop.tags && Array.isArray(sop.tags)) {
      sop.tags.forEach((tag) => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}


