// prisma/seed.mjs — 1000 rozet + 1000 soz + demo icerik seed'i (deterministik, tekrar calistirilabilir)
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';

const prisma = new PrismaClient();
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));

async function main() {
  const badges = read('./seed-data/badges.json');
  const quotes = read('./seed-data/quotes.json');

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { code: b.code },
      create: { code: b.code, titleTr: b.titleTr, titleEn: b.titleEn, descriptionTr: b.descriptionTr, family: b.family, tier: b.tier, condition: b.condition, xpReward: b.xpReward, rarity: b.rarity, iconSymbol: b.iconSymbol },
      update: { titleTr: b.titleTr, descriptionTr: b.descriptionTr, condition: b.condition },
    });
  }

  for (const q of quotes) {
    await prisma.quote.upsert({
      where: { code: q.code },
      create: { code: q.code, textTr: q.textTr, textEn: q.textEn, category: q.category, mood: q.mood, emoji: q.emoji },
      update: { textTr: q.textTr, textEn: q.textEn },
    });
  }

  console.log('Seed tamam: ' + badges.length + ' rozet, ' + quotes.length + ' soz.');
}

main().finally(() => prisma.$disconnect());
