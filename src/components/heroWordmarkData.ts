export type HeroTitleLines = readonly [string, string];

export const HERO_WORDMARK_SUPPORTED_LINES = ['Endrede', 'Sanseflater'] as const;

export function matchesHeroWordmark(lines: HeroTitleLines): boolean {
  return (
    lines[0] === HERO_WORDMARK_SUPPORTED_LINES[0] &&
    lines[1] === HERO_WORDMARK_SUPPORTED_LINES[1]
  );
}
