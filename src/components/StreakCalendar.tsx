'use client';
// src/components/StreakCalendar.tsx — seri takvimi / isi haritasi (365 gun).
import { useMemo } from 'react';

export interface StreakCalendarProps {
  activeDates: string[];
  year?: number;
  language?: 'tr' | 'en';
}

const MONTHS_TR = ['Oca', 'Sub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Agu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_TR = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function StreakCalendar({ activeDates, year = new Date().getFullYear(), language = 'tr' }: StreakCalendarProps) {
  const months = language === 'tr' ? MONTHS_TR : MONTHS_EN;
  const grid = useMemo(() => {
    const active = new Set(activeDates);
    const cells: Array<{ iso: string; active: boolean; week: number; dow: number }> = [];
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year, 11, 31));
    const cursor = new Date(start);
    while (cursor <= end) {
      const iso = cursor.toISOString().slice(0, 10);
      const dow = (cursor.getUTCDay() + 6) % 7;
      const week = Math.floor((cursor.getTime() - start.getTime()) / (7 * 86400000));
      cells.push({ iso, active: active.has(iso), week, dow });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return cells;
  }, [activeDates, year]);

  const totalWeeks = Math.ceil(grid.length / 7);
  const activeCount = grid.filter((c) => c.active).length;

  return (
    <section className="rounded-3xl border border-violet-200/60 bg-white/80 p-5 shadow-lg dark:border-violet-500/30 dark:bg-slate-900/70" aria-label="Seri takvimi">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{year} calisma haritasi</h3>
        <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">{activeCount} aktif gun</p>
      </header>
      <div className="overflow-x-auto">
        <div className="inline-grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 12px)' }}>
          {grid.map((c) => (
            <div
              key={c.iso}
              title={c.iso + (c.active ? ' — calistin' : ' — bos')}
              style={{ gridColumn: c.week + 2, gridRow: c.dow + 1, width: 12, height: 12 }}
              className={
                'rounded-[3px] transition-transform hover:scale-125 ' +
                (c.active ? 'bg-gradient-to-br from-emerald-400 to-teal-600' : 'bg-slate-200 dark:bg-slate-700/60')
              }
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {months.map((m, i) => (
          <span key={m} style={{ marginLeft: i === 0 ? 0 : 0 }}>{m}</span>
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{DAYS_TR.join(' · ')}</p>
    </section>
  );
}
