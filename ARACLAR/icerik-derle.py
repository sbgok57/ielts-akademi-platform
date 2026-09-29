#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IELTS AKADEMİ — İÇERİK DERLEYİCİ
=================================
1) Sözlük verisini doğrular, temizler ve siteye JSON olarak yazar (kelime/*.json + dizin.json)
2) 210 video mesajından DİNLEME (podcast) bölümleri üretir: her bölüm için
     - TR anlatım metni  - EN anlatım metni  - seslendirme kaydı için dosya adı/aksan matrisi
     - deşifre (VTT) dosyaları
3) SESLENDİRME KİTİ yazar: hangi metnin hangi aksan + cinsiyetle kaydedileceğini söyler.
   (Sitede yalnızca GERÇEK insan kayıtları çalınır; kayıt yoksa sayfa bunu açıkça söyler.)
"""
import json, os, re, sys, unicodedata
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
ARAC = KOK / "ARACLAR"
CIKTI = KOK / "ONARIM/01-canli-site-demo/data/site"

AKSANLAR = [
    ("GB", "İngiliz İngilizcesi (British)"),
    ("US", "Amerikan İngilizcesi (American)"),
    ("CA", "Kanada İngilizcesi (Canadian)"),
    ("AU", "Avustralya İngilizcesi (Australian)"),
    ("NZ", "Yeni Zelanda İngilizcesi (New Zealand)"),
    ("IN", "Hint İngilizcesi (Indian)"),
]
CINSIYET = ["K (kadın)", "E (erkek)"]


# ----------------------------------------------------------------------
# 1) SÖZLÜK
# ----------------------------------------------------------------------
def sozluk_oku():
    kayitlar, hatalar, uyarilar = [], [], []
    gorulen = {}
    for dosya in sorted(ARAC.glob("kelime-*.txt")):
        for i, satir in enumerate(dosya.read_text(encoding="utf-8").split("\n"), 1):
            s = satir.strip()
            if not s or s.startswith("#"):
                continue
            p = [x.strip() for x in s.split("|")]
            if len(p) != 9:
                hatalar.append(f"{dosya.name}:{i} → {len(p)} alan (9 olmalı)")
                continue
            kelime, tur, tr, en, es, ornek, ornek_tr, seviye, alan = p
            if not kelime or not tr or not en or not ornek or not ornek_tr:
                hatalar.append(f"{dosya.name}:{i} → zorunlu alan boş ({kelime!r})")
                continue
            if seviye not in ("A1", "A2", "B1", "B2", "C1", "C2"):
                uyarilar.append(f"{dosya.name}:{i} → seviye {seviye!r} (A1–C2 dışı), B1 yapıldı")
                seviye = "B1"
            anahtar = kelime.lower()
            if anahtar in gorulen:
                uyarilar.append(f"Yinelenen kelime atlandı: {kelime} ({dosya.name}:{i})")
                continue
            gorulen[anahtar] = True
            kayitlar.append({
                "id": f"w{len(kayitlar)+1:04d}", "kelime": kelime, "tur": tur.strip().lower(),
                "tr": tr, "en": en, "es": [x.strip() for x in re.split(r"[,;]", es) if x.strip()],
                "ornek": ornek, "ornekTr": ornek_tr, "seviye": seviye, "alan": alan or "Genel",
            })
    return kayitlar, hatalar, uyarilar


def sozluk_yaz(kayitlar):
    d = CIKTI / "kelime"
    d.mkdir(parents=True, exist_ok=True)
    boyut = 250
    dosyalar = []
    for i in range(0, len(kayitlar), boyut):
        parca = kayitlar[i:i + boyut]
        ad = f"kelime-{i//boyut+1:02d}.json"
        (d / ad).write_text(json.dumps(parca, ensure_ascii=False, indent=1), encoding="utf-8")
        dosyalar.append(ad)
    alanlar = sorted({k["alan"] for k in kayitlar})
    seviyeler = sorted({k["seviye"] for k in kayitlar})
    (d / "dizin.json").write_text(json.dumps({
        "toplam": len(kayitlar), "parcalar": dosyalar, "alanlar": alanlar, "seviyeler": seviyeler,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    return dosyalar


# ----------------------------------------------------------------------
# 2) PODCAST / DİNLEME BÖLÜMLERİ
# ----------------------------------------------------------------------
def videolari_oku():
    yol = CIKTI / "medya" / "videolar.json"
    return json.loads(yol.read_text(encoding="utf-8")) if yol.exists() else []


def podcast_uret(videolar):
    """Her 10 mesajı bir dinleme bölümü yapar (mesaj 8 sn → ~80 sn bölüm)."""
    bolumler = []
    grup = 10
    for b in range(0, len(videolar), grup):
        parca = videolar[b:b + grup]
        if not parca:
            continue
        no = b // grup + 1
        aksan, aksan_ad = AKSANLAR[no % len(AKSANLAR)]
        cins = CINSIYET[no % 2]
        tr_satir = " ".join(f"{p['tr']}." for p in parca)
        en_satir = " ".join(f"{p['en']}." for p in parca)
        bolumler.append({
            "id": f"p{no:03d}",
            "baslik": f"Bölüm {no} · {parca[0]['kategori']}",
            "kategoriler": sorted({p["kategori"] for p in parca}),
            "sure": len(parca) * 8,
            "parcaSayisi": len(parca),
            "videoIdleri": [p["id"] for p in parca],
            "anlatimTr": tr_satir, "anlatimEn": en_satir,
            "seslendirme": {
                "aksan": aksan, "aksanAdi": aksan_ad, "cinsiyet": cins,
                "trDosya": f"medya/ses/p{no:03d}.tr.{aksan}.{cins.split()[0]}.mp3",
                "enDosya": f"medya/ses/p{no:03d}.en.{aksan}.{cins.split()[0]}.mp3",
                "durum": "kayit-bekliyor",
            },
        })
    return bolumler


def altyazi_yaz(bolumler):
    d = CIKTI / "medya" / "vtt"
    d.mkdir(parents=True, exist_ok=True)
    for bo in bolumler:
        for dil, metin in (("tr", bo["anlatimTr"]), ("en", bo["anlatimEn"])):
            satirlar = re.findall(r".{1,80}(?:\s|$)", metin)
            parcalar, t = [], 0.0
            for i, s in enumerate([x.strip() for x in satirlar if x.strip()]):
                parcalar.append(f"{ts(t)} --> {ts(t+7.5)}\n{s}\n")
                t += 8.0
            (d / f"{bo['id']}.{dil}.vtt").write_text("WEBVTT\n\n" + "\n".join(parcalar), encoding="utf-8")


def ts(sn):
    s = int(sn); ms = int((sn - s) * 1000)
    return f"{s//3600:02d}:{(s%3600)//60:02d}:{s%60:02d}.{ms:03d}"


# ----------------------------------------------------------------------
# 3) SESLENDİRME KİTİ
# ----------------------------------------------------------------------
def seslendirme_kiti(bolumler):
    d = KOK / "ONARIM/09-seslendirme"
    d.mkdir(parents=True, exist_ok=True)
    satir = ["# 🎙️ SESLENDİRME KİTİ — dinleme bölümleri ve okuma metinleri",
             "",
             "Bu dosya, **gerçek insan sesleriyle** kaydedilecek metinlerin listesidir.",
             "Sitede yalnızca bu kurallara göre kaydedilmiş GERÇEK insan kayıtları çalınır.",
             "Sentetik (yapay) ses hiçbir yerde insan kaydı diye sunulmaz.",
             "",
             "## Kurallar",
             "- 6 aksan: GB (İngiliz), US (Amerikan), CA (Kanada), AU (Avustralya), NZ (Yeni Zelanda), IN (Hint)",
             "- Her bölüm hem KADIN hem ERKEK sesle kaydedilir (iki versiyon).",
             "- Dosya adı: `<bolumId>.<dil>.<aksan>.<K|E>.mp3`  → örn: `p001.tr.GB.K.mp3`",
             "- Çözünürlük: 44.1 kHz, mono, 96–128 kbps mp3. Süre ±%10 tolerans.",
             "- Kayıt sonrası dosyalar: `ONARIM/01-canli-site-demo/data/site/medya/ses/` klasörüne konur.",
             "- Site, dosya yoksa '🎙️ İnsan kaydı bekleniyor' notunu gösterir; sahte ses çalıştırmaz.",
             ""]
    for bo in bolumler:
        satir += [
            f"## {bo['id']} — {bo['baslik']}  ({bo['sure']} sn)",
            f"- **Hedef aksan:** {bo['seslendirme']['aksanAdi']}  ·  **Ses:** {bo['seslendirme']['cinsiyet']}",
            f"- **Dosyalar:** `{bo['id']}.tr.{bo['seslendirme']['aksan']}.{bo['seslendirme']['cinsiyet'].split()[0]}.mp3` (Türkçe anlatım) · `{bo['id']}.en.{bo['seslendirme']['aksan']}.{bo['seslendirme']['cinsiyet'].split()[0]}.mp3` (İngilizce anlatım)",
            "",
            "**Türkçe metin:**",
            "> " + bo["anlatimTr"],
            "",
            "**İngilizce metin:**",
            "> " + bo["anlatimEn"],
            "",
        ]
    (d / "KAYIT-TALIMATI.md").write_text("\n".join(satir), encoding="utf-8")

    matris = [{"bolum": b["id"], "baslik": b["baslik"],
               "hedefAksan": b["seslendirme"]["aksanAdi"],
               "hedefCinsiyet": b["seslendirme"]["cinsiyet"],
               "trDosya": b["id"] + ".tr." + b["seslendirme"]["aksan"] + "." + b["seslendirme"]["cinsiyet"].split()[0] + ".mp3",
               "enDosya": b["id"] + ".en." + b["seslendirme"]["aksan"] + "." + b["seslendirme"]["cinsiyet"].split()[0] + ".mp3",
               "kayitli": False} for b in bolumler]
    (d / "ses-matrisi.json").write_text(json.dumps(matris, ensure_ascii=False, indent=1), encoding="utf-8")
    return d


# ----------------------------------------------------------------------
def main():
    print("📚 İÇERİK DERLENİYOR")
    kayitlar, hatalar, uyarilar = sozluk_oku()
    print(f"   sözlük: {len(kayitlar)} kelime")
    for h in hatalar[:10]:
        print("   ✗", h)
    for u in uyarilar[:10]:
        print("   ⚠", u)
    if len(kayitlar) < 1000:
        print(f"   ⚠ HEDEF: 1000+ kelime — şu an {len(kayitlar)}")
    dosyalar = sozluk_yaz(kayitlar)
    print(f"   → kelime/{dosyalar[0]} ... ({len(dosyalar)} parça + dizin.json)")

    videolar = videolari_oku()
    bolumler = podcast_uret(videolar)
    (CIKTI / "medya").mkdir(parents=True, exist_ok=True)
    (CIKTI / "medya" / "bolumler.json").write_text(json.dumps(bolumler, ensure_ascii=False, indent=1), encoding="utf-8")
    altyazi_yaz(bolumler)
    print(f"   podcast: {len(bolumler)} dinleme bölümü + VTT altyazılar")
    kit = seslendirme_kiti(bolumler)
    print(f"   seslendirme kiti: {kit}")
    return 0 if not hatalar and len(kayitlar) >= 1000 else 1


if __name__ == "__main__":
    sys.exit(main())
