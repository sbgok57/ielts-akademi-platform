// src/lib/coverage.ts
// Baglayici icerik sayilarinin denetimi: hicbir sayi "yaklasik" kabul edilmez.
export const COVERAGE_TARGETS = {
  'grammar.topics': 280,
  'grammar.exerciseSets': 1000,
  'reading.exercises': 1000,
  'listening.exercises': 1000,
  'speaking.tasks': 1000,
  'writing.tasks': 500,
  'vocabulary.wordsFull': 1200,
  'vocabulary.wordsTarget': 5000,
  'exam.mockTests': 40,
  'archive.eraCards': 9,
  'science.texts': 600,
  'tactics.items': 150,
  badges: 1000,
  quotes: 1000,
  'audio.coreRecordings': 120,
  'audio.variants': 12,
} as const;

export type CoverageKey = keyof typeof COVERAGE_TARGETS;

export function coverageReport(produced: Partial<Record<CoverageKey, number>>) {
  const rows = (Object.keys(COVERAGE_TARGETS) as CoverageKey[]).map((key) => {
    const target = COVERAGE_TARGETS[key];
    const done = produced[key] ?? 0;
    return { key, target, produced: done, gap: Math.max(0, target - done), status: done >= target ? 'tamam' : done === 0 ? 'baslanmadi' : 'eksik' };
  });
  const pct = Math.round((rows.reduce((s, r) => s + Math.min(r.produced, r.target), 0) / rows.reduce((s, r) => s + r.target, 0)) * 1000) / 10;
  return { rows, overallPercent: pct, missing: rows.filter((r) => r.status !== 'tamam').map((r) => r.key + ': ' + r.gap + ' eksik') };
}
