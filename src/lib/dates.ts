/**
 * Helpers d'affichage des dates du CV.
 * Les dates vivent dans src/data/resume.ts au format ISO `YYYY-MM`
 * (`null` pour un poste en cours).
 */

/** "2013-11" → 2013 */
export function year(iso: string): number {
  return Number(iso.slice(0, 4));
}

/** "2013-11" → nombre de mois depuis l'an 0, pour comparer / soustraire. */
function months(iso: string): number {
  const [y, m] = iso.split('-').map(Number);
  return y * 12 + (m ?? 1) - 1;
}

/** Durée en années pleines entre deux dates ISO. */
export function years(start: string, end: string): number {
  return Math.floor((months(end) - months(start)) / 12);
}

/**
 * Libellé de la colonne de gauche d'une expérience.
 * - poste en cours      → "2022 — aujourd'hui"
 * - poste long terminé  → "2013 — 2021 · 8 ans"
 * - poste court         → "2006 — 2006"
 */
export function range(start: string, end: string | null): string {
  if (!end) return `${year(start)} — aujourd'hui`;

  const label = `${year(start)} — ${year(end)}`;
  const n = years(start, end);
  return n >= 2 ? `${label} · ${n} ans` : label;
}

/** Bornes d'un groupe d'expériences : "2005 — 2007". */
export function spanOf(items: { start: string; end: string | null }[]): string {
  const starts = items.map((i) => year(i.start));
  const ends = items.map((i) => (i.end ? year(i.end) : new Date().getFullYear()));
  return `${Math.min(...starts)} — ${Math.max(...ends)}`;
}

/** Tri par date de début décroissante (le plus récent d'abord). */
export function byStartDesc<T extends { start: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => months(b.start) - months(a.start));
}
