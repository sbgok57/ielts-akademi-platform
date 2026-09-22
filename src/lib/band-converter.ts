// src/lib/band-converter.ts
// Ham puan → IELTS band dönüşümü ve sınav raporlayıcı

export const BAND_TABLES: Record<string, [number, number, number][]> = {
  listening: [[39,40,9],[37,38,8.5],[35,36,8],[32,34,7.5],[30,31,7],[26,29,6.5],[23,25,6],[18,22,5.5],[16,17,5],[13,15,4.5],[10,12,4],[8,9,3.5],[6,7,3],[4,5,2.5],[3,3,2],[1,2,1.5],[0,0,1]],
  academicReading: [[39,40,9],[37,38,8.5],[35,36,8],[33,34,7.5],[30,32,7],[27,29,6.5],[23,26,6],[19,22,5.5],[15,18,5],[13,14,4.5],[10,12,4],[8,9,3.5],[6,7,3],[4,5,2.5],[3,3,2],[2,2,1.5],[0,1,1]],
  generalReading: [[40,40,9],[39,39,8.5],[37,38,8],[36,36,7.5],[34,35,7],[32,33,6.5],[30,31,6],[27,29,5.5],[23,26,5],[19,22,4.5],[15,18,4],[12,14,3.5],[9,11,3],[6,8,2.5],[4,5,2],[2,3,1.5],[0,1,1]],
};

export const CEFR_TO_BAND: Record<string, [number, number]> = {
  A1: [1, 3], A2: [3, 4], B1: [4, 5.5], B2: [5.5, 6.5], C1: [6.5, 8], C2: [8, 9],
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function rawToBand(skill: string, raw: number): number {
  const table = BAND_TABLES[skill];
  if (!table) throw new Error(`Bilinmeyen beceri: ${skill}`);
  const r = clamp(Math.round(raw), 0, 40);
  for (const [min, max, band] of table) {
    if (r >= min && r <= max) return band;
  }
  return 0;
}

export function overallBand(bands: number[]): number {
  if (!bands.length) return 0;
  const avg = bands.reduce((a, b) => a + b, 0) / bands.length;
  const floor = Math.floor(avg);
  const frac = avg - floor;
  if (frac < 0.25) return floor;
  if (frac < 0.75) return floor + 0.5;
  return floor + 1;
}

export function cefrToBandRange(cefr: string): [number, number] {
  return CEFR_TO_BAND[String(cefr).toUpperCase()] ?? [1, 3];
}

export function gapToTarget(current: number, target: number) {
  const gap = Math.round((target - current) * 2) / 2;
  return {
    gap,
    reached: gap <= 0,
    messageTr:
      gap <= 0
        ? `🎉 Hedefini yakaladın (${current} ≥ ${target}). Şimdi istikrar zamanı!`
        : `Hedefe ${gap} band kaldı. Bu, okuma/dinlemede yaklaşık ${Math.round(gap * 4)} soru daha doğru demek.`,
  };
}
