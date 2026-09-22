// src/lib/answer-matcher.ts
// Akıllı cevap kontrolü ve eşleştirici (IELTS kuralları)

const BRITISH_AMERICAN: [string, string][] = [
  ["colour", "color"],
  ["favourite", "favorite"],
  ["neighbour", "neighbor"],
  ["centre", "center"],
  ["theatre", "theater"],
  ["organisation", "organization"],
  ["realise", "realize"],
  ["analyse", "analyze"],
  ["programme", "program"],
  ["travelling", "traveling"],
  ["travelled", "traveled"],
  ["cancelled", "canceled"],
  ["licence", "license"],
  ["practise", "practice"],
  ["enrol", "enroll"],
  ["cheque", "check"],
];

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
};

const ORDINAL_TO_CARDINAL: Record<string, string> = {
  first: "1", second: "2", third: "3", fourth: "4", fifth: "5", sixth: "6", seventh: "7",
  eighth: "8", ninth: "9", tenth: "10", eleventh: "11", twelfth: "12", thirteenth: "13", fourteenth: "14", fifteenth: "15",
  sixteenth: "16", seventeenth: "17", eighteenth: "18", nineteenth: "19", twentieth: "20", "twenty-first": "21",
  "twenty-second": "22", "twenty-third": "23", "twenty-fourth": "24", "twenty-fifth": "25", thirtieth: "30", "thirty-first": "31",
};

export interface SpellingRules {
  ignoreCase?: boolean;
  ignoreExtraSpaces?: boolean;
  ignorePunctuation?: boolean;
  acceptBritishAndAmerican?: boolean;
  ignorePluralForms?: boolean;
  numericVariants?: boolean;
  allowOneTypoIfLetters?: number;
  reject?: string[];
}

export interface MatchContext {
  wordLimit?: string;
  type?: string;
  spellingRules?: SpellingRules;
}

export function normalizeAnswer(input: unknown, rules: SpellingRules = {}): string {
  let s = String(input ?? "").normalize("NFKC").trim();
  if (rules.ignorePunctuation !== false) s = s.replace(/[.,;:!?"'`´'”“()[\]{}]/g, " ");
  s = s.replace(/[–—]/g, "-");
  if (rules.ignoreExtraSpaces !== false) s = s.replace(/\s+/g, " ").trim();
  if (rules.ignoreCase !== false) s = s.toLocaleLowerCase("en-GB");
  return s;
}

export function wordLimitToNumber(limit?: string | null): number | null {
  if (!limit) return null;
  const l = String(limit).toUpperCase();
  if (l.includes("NUMBER")) return 1;
  const map: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4 };
  const m = l.match(/NO MORE THAN (ONE|TWO|THREE|FOUR) WORDS?/);
  if (m && m[1]) return map[m[1]] ?? null;
  const m2 = l.match(/\b(ONE|TWO|THREE|FOUR) WORDS?\b/);
  if (m2 && m2[1]) return map[m2[1]] ?? null;
  return null;
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j]! + 1, curr[j - 1]! + 1, prev[j - 1]! + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n]!;
}

export function matchChoice(given: unknown, answer: string, multi = false) {
  const n = (s: unknown) => normalizeAnswer(s, { ignorePunctuation: true });
  if (multi) {
    const g = (Array.isArray(given) ? given : [given]).map(n).sort();
    const a = String(answer).split("|").map(n).sort();
    const correct = g.length === a.length && g.every((v, i) => v === a[i]);
    return { correct, normalized: g.join(" | "), reasonTr: correct ? undefined : "Birden fazla doğru seçenek var; eksik veya fazla seçim yapılmış." };
  }
  const g = n(Array.isArray(given) ? given[0] ?? "" : given);
  const correct = g === n(answer);
  return { correct, normalized: g, reasonTr: correct ? undefined : "Seçimin doğru cevapla örtüşmüyor; kanıt cümlesini kontrol et." };
}

export function matchTfng(given: unknown, answer: string) {
  const aliases: Record<string, string> = {
    T: "TRUE", TRUE: "TRUE", DOGRU: "TRUE", DOĞRU: "TRUE",
    F: "FALSE", FALSE: "FALSE", YANLIS: "FALSE", YANLIŞ: "FALSE",
    NG: "NOT GIVEN", "NOT GIVEN": "NOT GIVEN", NOTGIVEN: "NOT GIVEN",
    Y: "YES", YES: "YES", N: "NO", NO: "NO",
  };
  const gv = aliases[String(given ?? "").trim().toUpperCase()] ?? String(given ?? "").trim().toUpperCase();
  const expected = String(answer).trim().toUpperCase().replace(/\s+/g, " ");
  const correct = gv === expected;
  const explain: Record<string, string> = {
    "NOT GIVEN": "⚠️ DİKKAT: Metin bu bilgiyi ne doğruluyor ne çürütüyor → cevap NOT GIVEN.",
    FALSE: "Metin bu iddianın TERSİNİ söylüyorsa cevap FALSE olur (bilgi hiç yoksa NG'dir).",
    TRUE: "Metin bu iddiayı doğrudan destekliyor.",
    YES: "Yazarın görüşü bu iddiayı destekliyorsa cevap YES olur.",
    NO: "Yazarın görüşü bu iddiayı reddediyorsa cevap NO olur.",
  };
  return { correct, normalized: gv, reasonTr: correct ? undefined : explain[expected] ?? "Cevabı kanıt cümlesine göre yeniden değerlendir." };
}
