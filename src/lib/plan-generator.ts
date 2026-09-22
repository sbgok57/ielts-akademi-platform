// src/lib/plan-generator.ts
// Adaptif çalışma programı, R1-R8 kuralları, TR doğal dil ayrıştırıcı ve ICS üretici

export interface PlanConstraints {
  userId: string;
  cefrLevel: string;
  dailyMinutes: number;
  availableDays: number[];
  liveLessonDays?: number[];
  weakSkills?: string[];
  focusSkills?: string[];
  examDate?: Date;
  startDate?: Date;
  srsDueCount?: number;
  assignments?: { dueAt: Date; title: string; minutes?: number; contentId: string }[];
}

export interface PlanItem {
  date: string;
  dayOfWeek: number;
  blockIndex: number;
  type: string;
  skill?: string;
  titleTr: string;
  minutes: number;
  source?: string;
  isLiveLesson?: boolean;
  contentHint?: string;
}

export interface PlanIssue {
  code: string;
  severity: "error" | "warning";
  messageTr: string;
}

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export function daysUntilExam(examDate?: Date, from = new Date()): number | null {
  if (!examDate) return null;
  return Math.ceil((startOfDay(examDate).getTime() - startOfDay(from).getTime()) / 86400000);
}

export function generateWeeklyPlan(c: PlanConstraints): PlanItem[] {
  const start = startOfDay(c.startDate ?? new Date());
  const items: PlanItem[] = [];
  const openDays = [...c.availableDays].sort((a, b) => a - b);
  const mockDay = openDays.includes(6) ? 6 : openDays[openDays.length - 1] ?? 6;

  for (let d = 0; d < 7; d++) {
    const date = addDays(start, d);
    const dow = date.getDay();
    if (!c.availableDays.includes(dow)) continue;

    const base = { date: ymd(date), dayOfWeek: dow };
    let blockIndex = 0;

    // 1. Isınma / SRS
    items.push({
      ...base,
      blockIndex: blockIndex++,
      type: "srs",
      minutes: 5,
      titleTr: "🔥 Isınma: vadesi gelen kelime ve gramer kartların",
      source: "system",
    });

    // 2. Ana Blok / Deneme
    if (dow === mockDay) {
      items.push({
        ...base,
        blockIndex: blockIndex++,
        type: "exam_section",
        skill: "reading",
        minutes: Math.max(15, c.dailyMinutes),
        titleTr: "🎯 Haftalık Deneme: Süre tutarak okuma bölümü çöz",
        source: "system",
      });
    } else {
      items.push({
        ...base,
        blockIndex: blockIndex++,
        type: "lesson",
        skill: "grammar",
        minutes: Math.max(10, c.dailyMinutes - 10),
        titleTr: `🎯 Günün çalışması (${c.cefrLevel} seviyesi)`,
        source: "system",
      });
    }

    // 3. Gün Sonu Kapanış
    items.push({
      ...base,
      blockIndex: blockIndex++,
      type: "review",
      minutes: 5,
      titleTr: "🧠 Günün mini özeti ve yarının önizlemesi",
      source: "system",
    });
  }

  return items;
}

export function validatePlan(items: PlanItem[], c: PlanConstraints): PlanIssue[] {
  const issues: PlanIssue[] = [];
  const byDate = new Map<string, PlanItem[]>();
  for (const it of items) {
    if (!byDate.has(it.date)) byDate.set(it.date, []);
    byDate.get(it.date)!.push(it);
  }

  for (const [date, dayItems] of byDate) {
    const total = dayItems.reduce((s, i) => s + i.minutes, 0);
    const cap = c.dailyMinutes + 30;
    if (total > cap) {
      issues.push({
        code: "R2_DAY_TOO_LONG",
        severity: "error",
        messageTr: `${date}: günlük yük ${total} dk, sınır ${cap} dk.`,
      });
    }
    if (!dayItems.some((i) => i.type === "srs")) {
      issues.push({
        code: "R1_NO_SRS",
        severity: "error",
        messageTr: `${date}: gün SRS tekrarı ile başlamıyor (R1).`,
      });
    }
  }

  if (!items.some((i) => i.type === "exam_section")) {
    issues.push({
      code: "R5_NO_EXAM",
      severity: "error",
      messageTr: "Haftada en az 1 deneme bölümü olmalıdır (R5).",
    });
  }

  return issues;
}

export function parseNaturalLanguageConstraints(
  text: string,
  base: PlanConstraints
): { constraints: PlanConstraints; notes: string[] } {
  const notes: string[] = [];
  const c = { ...base };
  const t = String(text).toLocaleLowerCase("tr-TR");

  const m = t.match(/(\d{1,3})\s*(dk|dakika|min|minute)/);
  if (m && m[1]) {
    const minutes = Number(m[1]);
    if (minutes >= 5 && minutes <= 240) {
      c.dailyMinutes = minutes;
      notes.push(`Günlük süre ${minutes} dakikaya ayarlandı.`);
    }
  }

  return { constraints: c, notes };
}

export function planToIcs(items: PlanItem[], appName = "IELTS Akademi"): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${appName}//TR`,
    "CALSCALE:GREGORIAN",
  ];
  const fmt = (dt: Date) => dt.toISOString().replace(/[-:]|\.\d{3}/g, "");
  for (const it of items) {
    if (it.type === "break") continue;
    const parts = it.date.split("-").map(Number);
    const y = parts[0] ?? 2026;
    const mo = parts[1] ?? 1;
    const d = parts[2] ?? 1;
    const start = new Date(y, mo - 1, d, 18, 0);
    const end = new Date(start.getTime() + it.minutes * 60000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${it.date}-${it.blockIndex}@ielts-akademi`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${it.titleTr.replace(/,/g, "\\,")}`,
      `DESCRIPTION:${appName} kişisel çalışma programı · ${it.minutes} dakika`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
