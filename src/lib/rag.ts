// src/lib/rag.ts
// Lumi RAG bilgi tabanı erişim katmanı

export interface KnowledgeItem {
  id: string;
  source: string;
  titleTr: string;
  text: string;
  score?: number;
}

export async function retrieveKnowledge(
  query: string,
  limit = 3
): Promise<KnowledgeItem[]> {
  // P0'da statik doğrulanmış kural enjeksiyonu
  void query;
  return [
    {
      id: "rule-1",
      source: "IELTS Exam Rules 2026",
      titleTr: "IELTS Genel Sınav Kuralları",
      text: "IELTS Academic ve General Training dinleme sınavları 4 bölümden oluşur. 2026 bilgisayar tabanlı sınavda aktarma süresi 2 dakikadır.",
      score: 0.95,
    },
  ].slice(0, limit);
}
