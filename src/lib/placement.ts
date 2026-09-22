// src/lib/placement.ts
// Yerlestirme sinavi: madde havuzu, puanlama, CEFR ve band tahmini, ilk hafta plani.
import { matchChoice } from './answer-matcher';
import { cefrToBandRange } from './band-converter';

export interface PlacementItem { id: string; section: 'grammar' | 'vocabulary' | 'reading' | 'listening'; level: string; stem: string; options: string[]; answer: string; skill: string; }

export const PLACEMENT_BLUEPRINT = {
  total: 40,
  sections: [
    { id: 'grammar', nameTr: 'Gramer', count: 16, minutes: 12 },
    { id: 'vocabulary', nameTr: 'Kelime', count: 8, minutes: 6 },
    { id: 'reading', nameTr: 'Kisa okuma', count: 8, minutes: 10 },
    { id: 'listening', nameTr: 'Kisa dinleme', count: 8, minutes: 8 },
  ],
} as const;

export function scorePlacement(items: PlacementItem[], answers: Record<string, string>) {
  const bySection: Record<string, { correct: number; total: number }> = {};
  const levelCorrect: Record<string, { correct: number; total: number }> = {};
  for (const item of items) {
    const ok = answers[item.id] != null && matchChoice(answers[item.id], item.answer).correct;
    const sec = (bySection[item.section] ||= { correct: 0, total: 0 });
    const lvl = (levelCorrect[item.level] ||= { correct: 0, total: 0 });
    sec.total++;
    lvl.total++;
    if (ok) { sec.correct++; lvl.correct++; }
  }
  const ladder = ['A1', 'A2', 'B1', 'B2', 'C1'];
  let cefr = 'A1';
  for (const lv of ladder) {
    const s = levelCorrect[lv];
    if (s && s.total > 0 && s.correct / s.total >= 0.6) cefr = lv;
  }
  const range = cefrToBandRange(cefr as never);
  return { cefrLevel: cefr, estimatedBand: Math.round(((range[0] + range[1]) / 2) * 2) / 2, bySection, levelCorrect };
}
