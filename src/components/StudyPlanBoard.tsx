'use client';
// src/components/StudyPlanBoard.tsx — haftalik program tahtasi + dogal dil ile program guncelleme.
import { useState } from 'react';

export interface PlanItem { id: string; date: string; dayOfWeek: number; type: string; titleTr: string; minutes: number; skill?: string; }
export interface StudyPlanBoardProps { items: PlanItem[]; onSubmitRequest?: (text: string) => Promise<void>; }

const DAY_TR = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
const TYPE_STYLE: Record<string, string> = {
  lesson: 'border-l-4 border-indigo-500',
  exercise: 'border-l-4 border-emerald-500',
  review: 'border-l-4 border-amber-500',
  exam_section: 'border-l-4 border-rose-500',
  break: 'border-l-4 border-slate-400 opacity-70',
};

export default function StudyPlanBoard({ items, onSubmitRequest }: StudyPlanBoardProps) {
  const [request, setRequest] = useState('');
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);

  const byDay = items.reduce<Record<number, PlanItem[]>>((acc, it) => {
    (acc[it.dayOfWeek] ||= []).push(it);
    return acc;
  }, {});

  async function submit() {
    if (!request.trim() || !onSubmitRequest) return;
    setBusy(true);
    try { await onSubmitRequest(request); setRequest(''); setWarn(null); }
    catch (e) { setWarn(e instanceof Error ? e.message : 'Program guncellenemedi.'); }
    finally { setBusy(false); }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-4 dark:border-indigo-500/30 dark:from-slate-900 dark:to-slate-800">
        <label htmlFor="plan-request" className="block text-sm font-bold text-slate-800 dark:text-slate-100">
          Programini kendi cumlelerinle degistir
        </label>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Ornek: &ldquo;Persembe gunu 20 dakikam var, konusma agirlikli olsun&rdquo; veya &ldquo;Sinava 12 gun kaldi, yuk artir.&rdquo;
        </p>
        <div className="mt-2 flex gap-2">
          <input
            id="plan-request"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            placeholder="Nasil calismak istiyorsun?"
          />
          <button onClick={submit} disabled={busy} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
            {busy ? 'Yaziliyor...' : 'Uygula'}
          </button>
        </div>
        {warn && <p className="mt-2 text-sm font-semibold text-rose-600">{warn}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 0].map((dow) => (
          <article key={dow} className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900/70">
            <h3 className="mb-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">{DAY_TR[dow]}</h3>
            <ul className="space-y-2">
              {(byDay[dow] ?? []).map((it) => (
                <li key={it.id} className={'rounded-xl bg-slate-50 px-2 py-1.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200 ' + (TYPE_STYLE[it.type] ?? '')}>
                  <span className="font-semibold">{it.titleTr}</span>
                  <span className="ml-1 text-slate-500 dark:text-slate-400">{it.minutes} dk</span>
                </li>
              ))}
              {(byDay[dow] ?? []).length === 0 && <li className="text-xs text-slate-400">Dinlenme</li>}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
