// src/lib/varlik.ts — görsel/GIF güvenli gösterim yardımcıları
import { existsSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join(process.cwd(), "public");

/** Varlık gerçekten var mı? Yoksa uyarı yerine sessizce yedeğe düşer (kırık görsel olmaz). */
export function varlikVarMi(yol: string): boolean {
  if (/^https?:\/\//.test(yol)) return false; // dış bağlantı kullanmıyoruz
  return existsSync(join(PUBLIC, yol.replace(/^\//, "")));
}

export function varlik(yol: string, yedek = "/img/bos-durum.svg"): string {
  return varlikVarMi(yol) ? yol : yedek;
}

export const ANIMASYON = {
  rozet: "/anim/rozet-havai-fisek.gif",
  seri: "/anim/seri-alev.gif",
  lumi: "/anim/lumi-maskot.gif",
  konfeti: "/anim/konfeti.gif",
  ilerleme: "/anim/ilerleme-halkasi.gif",
  basari: "/anim/basari.gif",
  zamanlayici: "/anim/sinav-zamanlayici.gif",
  dalga: "/anim/dinleme-dalgasi.gif",
  kelimeKarti: "/anim/kelime-karti.gif",
  yildiz: "/anim/yildiz-parlamasi.gif",
} as const;
