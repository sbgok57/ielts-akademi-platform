#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IELTS AKADEMİ — MEDYA ÜRETİCİ (video + poster + altyazı + tema + kelime)
=========================================================================
Ne üretir?
  1) 210 gerçek MP4 video (H.264, animasyonlu renkli arka plan + Pillow ile çizilmiş
     metin katmanı), her biri için:
        - poster.jpg  (kütüphane kartı görseli)
        - <id>.tr.vtt + <id>.en.vtt  (Türkçe + İngilizce altyazı, WebVTT)
  2) 100 tema (50 aydınlık + 50 karanlık) → temalar.json  (rengarenk, canlı paletler)
  3) video kataloğu → videolar.json

Gereksinim: python3 + Pillow + numpy + ffmpeg (imageio-ffmpeg ile de bulunabilir)
Çalıştırma:  python3 ARACLAR/medya-uret.py [--out ONARIM/08-medya] [--limit 210] [--isci 6]
"""
import argparse, json, os, subprocess, sys, textwrap, colorsys, random
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow gerekli:  pip install pillow")

try:
    import numpy as np
except ImportError:
    np = None


def ffmpeg_exe():
    """ffmpeg'i bul: PATH → imageio-ffmpeg → hata."""
    from shutil import which
    w = which("ffmpeg")
    if w:
        return w
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("ffmpeg bulunamadı. 'pip install imageio-ffmpeg' çalıştır veya ffmpeg kur.")


FF = ffmpeg_exe()
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

W, H, FPS, SURE = 640, 360, 24, 8.0

# ==========================================================================
#  1) MESAJLAR — 210 video metni (kategori | TR | EN)
#     MOT motivasyon · TAK soru taktiği · GRM gramer · KEL kelime ·
#     SIN sınav günü · BEC beceri (dinleme/okuma/konuşma/yazma)
# ==========================================================================
MESAJLAR_HAM = """
MOT|Bir gün değil, her gün. Bugün 10 dakika, yarın 20.|Not one day, but every day. Ten minutes today, twenty tomorrow.
MOT|Band 7 bir yetenek değil, bir alışkanlıktır.|Band 7 is not a talent, it is a habit.
MOT|Mükemmel olmayı bekleme; düzenli ol.|Do not wait to be perfect; be consistent.
MOT|Hata yapmak öğrendiğinin kanıtıdır.|Making mistakes is proof that you are learning.
MOT|Küçük adımlar, büyük band farkı yaratır.|Small steps create a big band difference.
MOT|Bugün zor gelen, yarın otomatik olur.|What feels hard today becomes automatic tomorrow.
MOT|İngilizce öğrenmiyorsun, İngilizce yaşıyorsun.|You are not studying English, you are living it.
MOT|Motivasyon değil, program kazandırır.|Not motivation, a schedule wins.
MOT|Her yanlış cevap, doğru stratejinin ipucudur.|Every wrong answer is a clue to the right strategy.
MOT|Sınav seni değil, hazırlığını ölçer.|The exam measures your preparation, not your worth.
MOT|Yavaş ilerlemek, hiç ilerlememek değildir.|Going slowly is not the same as standing still.
MOT|Bugünün 20 dakikası, yarının 2 saatinden değerlidir.|Today's twenty minutes beat tomorrow's two hours.
MOT|Kıyaslama yok. Kendi rekorunla yarış.|No comparison. Race your own record.
MOT|Dinlenmek de programın bir parçasıdır.|Resting is part of the programme.
MOT|Ustalık, sıkıcı tekrarın içinde saklıdır.|Mastery hides inside boring repetition.
MOT|Kelimeler seni bekliyor; git ve al.|Words are waiting for you; go and take them.
MOT|Panik yok: her soru bir tanedir.|No panic: each question is just one question.
MOT|Bugün kelime, yarın cümle, sonra özgürlük.|Words today, sentences tomorrow, freedom after.
MOT|Seviyen değil, hızın değişir; gideceğin yer aynı.|Only your speed changes, never the destination.
MOT|Zorlandığın yerde büyüyorsun.|You grow exactly where it is hard.
MOT|Konuşma pratiği cesaret ister, önce fısılda.|Speaking needs courage — start by whispering.
MOT|Bugün çalıştın mı? O zaman bugün kazandın.|Did you study today? Then today you won.
MOT|Sınav tarihin bir düşman değil, bir takvimdir.|Your exam date is a calendar, not an enemy.
MOT|Her gün bir cümle, yılda 365 cümle.|One sentence a day is three hundred and sixty-five a year.
MOT|Kelime defterin en sadık arkadaşın.|Your vocabulary notebook is your most loyal friend.
MOT|Başarı, ertelediğin şeyi bugün yapmaktır.|Success is doing today what you kept postponing.
MOT|Hedefin band değil, kendini aşmak olsun.|Let your goal be beating yourself, not a band score.
MOT|Zor günlerde en kısa çalışma bile sayılır.|On hard days even the shortest study still counts.
MOT|Kulaklığını tak; dünya biraz İngilizce olsun.|Put on your headphones; let the world be English for a while.
MOT|Kusursuz aksan değil, anlaşılır konuşma hedefle.|Aim for clear speech, not a perfect accent.
MOT|Her metin, bir sınav provasıdır.|Every text is a rehearsal for the exam.
MOT|Bugünün hedefi dünkü hedefini geçsin.|Today's goal should beat yesterday's.
MOT|Sabır, hızın en akıllı hâlidir.|Patience is the smartest form of speed.
MOT|Denemeyi ertelediğin her gün, seni erteliyorsun.|Every day you delay the mock test, you delay yourself.
MOT|Sen bir öğrencisin, bir puan değil.|You are a learner, not a number.
MOT|İyi bir plan, iyi bir niyetten güçlüdür.|A good plan is stronger than a good intention.
MOT|Küçük bir gelişme kaydet; kayıt motivasyon doğurur.|Record a small gain; records create motivation.
MOT|Bugün en zayıf becerine bir iyilik yap.|Do your weakest skill a favour today.
MOT|Dili hata yaparak öğrenirsin, bekleyerek değil.|You learn a language by erring, not by waiting.
MOT|Zor metin, güçlü beyin demektir.|A hard text means a strong brain.
MOT|Sınav günü senin günün; sahne hazır.|Exam day is your day; the stage is set.
MOT|Kendine nazik ol, programa sadık kal.|Be kind to yourself, loyal to the plan.
MOT|Bir kelimeyi 7 kez gör, artık senin.|See a word seven times and it is yours.
MOT|Dinlemek bir beceridir; kulak da kas gibi çalışır.|Listening is a skill; your ear is a muscle too.
MOT|Not almak, hatırlamanın en ucuz yoludur.|Note-taking is the cheapest way to remember.
MOT|Bugün 1 metin bitti. Bu bir zaferdir.|You finished one text today. That is a victory.
MOT|Hedefe giden yol, otobüs beklerken de geçer.|The road to your goal passes through bus stops too.
MOT|Yorgunsan dinle, ama bırakma.|If you are tired, listen — but do not quit.
MOT|Tekrar, unutmanın panzehiridir.|Review is the antidote to forgetting.
MOT|Başarı sessiz çalışmanın yüksek sesidir.|Success is the loud sound of quiet work.
MOT|Bugünkü 5 kelime, yarın 5 puan olabilir.|Five words today can be five points tomorrow.
MOT|Acele etme; netlik hızdan önce gelir.|Do not rush; clarity comes before speed.
MOT|Kendi hızında, kendi yönünde, kendi hedefinde.|At your own pace, in your own direction.
MOT|Sınav bir kapıdır, duvar değil.|The exam is a door, not a wall.
MOT|Her gün aynı saatte çalış; beynin saatini kurar.|Study at the same hour; your brain sets its clock.
MOT|İngilizce bir ders değil, bir alışkanlıktır.|English is not a subject, it is a habit.
MOT|Bugün öğrendiğin bir kalıp, yarın bir cümle kurtarır.|One pattern learned today saves a sentence tomorrow.
MOT|Sabırlı öğrenci, hızlı öğrenciyi geçer.|The patient learner overtakes the fast one.
MOT|Kimse doğuştan Band 8 değildir.|Nobody was born with Band 8.
MOT|Tek bir doğru cevap bile ilerlemedir.|Even a single correct answer is progress.
MOT|Bugün kendine bir iyilik yap: 10 soru çöz.|Do yourself a favour today: solve ten questions.
TAK|TFNG'de metinde olmayan bilgiyi kafandan doldurma: NOT GIVEN.|In TFNG, do not fill gaps from your own knowledge: that is NOT GIVEN.
TAK|Doğru cevabı bulmadan önce soruyu anahtar kelimeyle işaretle.|Before answering, mark the keyword in the question.
TAK|Matching Headings'te ilk cümleye değil, paragrafın bütününe bak.|In Matching Headings, read the whole paragraph, not just the first line.
TAK|Boşluk doldurmada kelime türünü (isim/fiil/sıfat) önce belirle.|In gap fill, decide the word type first: noun, verb or adjective.
TAK|True/False/Not Given'da kesinlik sözcüklerini tuzak olarak gör.|In TFNG, treat absolute words as traps.
TAK|Multiple choice'ta yanlışları eleyerek git, tahmin etme.|In multiple choice, eliminate distractors instead of guessing.
TAK|Zaman kaybetme: bir soruya 90 saniyeden fazla verme.|Do not over-invest: never spend more than ninety seconds on a question.
TAK|Önce kolay soruları çöz, zorları sona bırak.|Answer easy questions first and leave hard ones for last.
TAK|Kelime eşleştirmede eş anlamlıları ve zıt anlamlıları ara.|In word matching, hunt for synonyms and antonyms.
TAK|Başlık eşleştirmede örnek cümleleri ipucu olarak kullan.|Use example sentences as hints in matching tasks.
TAK|Reading'de paragraf başlarını önce oku; harita çıkar.|Read paragraph openings first and build a map.
TAK|True/False'ta metnin tam yerini bulmadan karar verme.|Do not decide True or False until you find the exact line.
TAK|İlk bakışta tanıdık gelen cevap çoğu zaman tuzaktır.|The answer that looks too familiar is often the trap.
TAK|Bir boşluğu atladıysan işaretle ve devam et.|If you skip a gap, mark it and move on.
TAK|Tabloyu doldururken başlık satırını önce oku.|Read the header row before filling a table.
TAK|Eşleştirmede aynı kelimenin geçtiği cümle genelde yanlış yönlendirmedir.|In matching, the sentence repeating the same word is usually a distractor.
TAK|True/False/Not Given'da en az 2 dakika ayır ve acele etme.|Give TFNG a calm two minutes instead of rushing.
TAK|Dinlemede soru kökünü anahtarla ve sesi bekle.|In listening, underline the keywords and wait for the audio.
TAK|Dinlemede büyük harf girişlerini işaretleme zamanı kaybetme.|Do not waste time switching caps in listening answers.
TAK|Rakam ve hecelemede dikkat: harf harf söylenir.|Pay attention to numbers and spelled names — they are said letter by letter.
TAK|Sesli dinlemede yönlendiricileri yakala: but, however, actually.|Catch the signposts: but, however, actually.
TAK|Cevap 40 kelimelik sınırı aşıyorsa iki cümleyi birleştir.|If your answer exceeds the word limit, combine two sentences.
TAK|Yazma Task 1'de trendleri çeşitli fiille anlat.|In Task 1, describe trends with varied verbs.
TAK|Task 1'de yorum değil, rapor yaz.|In Task 1 write a report, not an opinion.
TAK|Task 2'de pozisyonunu ilk paragrafta net söyle.|State your position clearly in the first body paragraph.
TAK|Task 2'de iki fikir + iki örnek yeterli, üçe zorlamа.|In Task 2, two ideas with two examples are enough.
TAK|Konuşmada sessizlik olursa basit bir cümleyle devam et.|If silence falls in Speaking, continue with a simple sentence.
TAK|Part 2'de 1 dakika hazırlık yap, not al, kelime kartı kullan.|In Part 2 take the full minute, jot notes and use word cards.
TAK|Konuşmada ezber cevap kullanma; kalıp kullan.|Do not memorise answers in Speaking; use patterns instead.
TAK|Part 3'te görüş belirtirken nedenle bağla.|In Part 3, link every opinion to a reason.
TAK|Yazmada kelime sayısını son 5 dakikada kontrol et.|Check your word count in the last five minutes of writing.
TAK|Yazma sınavında önce plan, sonra yaz, en son düzelt.|In writing: plan first, draft second, edit last.
TAK|Listening'de cevabı soru sırasına göre ara, metin sıralı ilerler.|In Listening, answers follow the question order.
TAK|Genel fikri kaçırdıysan detaya takılma, devam et.|If you miss the big idea, do not cling to details — move on.
TAK|Ses kaydında 1 kez dinletilir; ikinci dinleme yoktur.|In the real exam the recording plays once only.
TAK|Yazım hatası band kaybettirir: common misspellings listesi tut.|Spelling loses bands: keep a common-misspellings list.
TAK|Sınavda bilmediğin kelimeyi bağlamdan tahmin et.|In the exam, guess unknown words from context.
TAK|Reading'de 20 dakika kuralı: her metne eşit zaman.|Apply the twenty-minute rule to each Reading passage.
TAK|Cevap anahtarını metne bağla: kanıt cümlesini işaretle.|Anchor every answer to evidence in the text.
TAK|Denemede saat kullan; süre hissi bandı yükseltir.|Use a clock in mock tests; time sense raises bands.
TAK|Yanlışlarını analiz et: hangi soru tipi kaybettiriyor?|Analyse errors: which question type costs you most?
TAK|Sayı-sıra-derece sorularında birimlere dikkat et.|Watch the units in data and ranking questions.
TAK|Paragrafın ilk ve son cümlesi çoğu zaman ana fikirdir.|The first and last sentences of a paragraph often carry the main idea.
TAK|Şüphede kaldığında en kısa ve net seçeneği seç.|When in doubt, choose the shortest, clearest option.
GRM|Article kuralı: tekil sayılabilir isim yalnız başına yaşayamaz.|The article rule: a singular countable noun never stands alone.
GRM|Present Perfect, geçmişin bugüne etkisini anlatır.|Present Perfect links the past to the present result.
GRM|If + present, will: birinci koşul gerçek olasılıktır.|If plus present, then will: the first conditional is a real possibility.
GRM|If + past, would: ikinci koşul hayalîdir.|If plus past, then would: the second conditional is unreal.
GRM|Pasif yapıda işi yapan değil, işin kendisi öne çıkar.|In passive voice the action, not the doer, takes the spotlight.
GRM|Relative clause ile iki cümleyi zarifçe birleştir.|Merge two sentences elegantly with a relative clause.
GRM|Bağlaçlar band yükseltir: however, therefore, whereas.|Linking words raise bands: however, therefore, whereas.
GRM|Karşılaştırmada than'den sonra nesne hâli gelir.|After than, use the object form.
GRM|Countable ve uncountable ayrımı makale hatasını önler.|The countable-uncountable contrast prevents article errors.
GRM|Used to, geçmiş alışkanlıkları anlatır.|Used to describes past habits.
GRM|Would rather ve prefer kalıplarını karıştırma.|Do not mix up would rather and prefer.
GRM|Gerund ve infinitive fiile göre değişir; listeyi ezberle.|Gerunds and infinitives depend on the verb; memorise the lists.
GRM|Reported speech'te zaman bir adım geriye gider.|Reported speech shifts the tense one step back.
GRM|Modallar olasılık derecesi taşır: may, might, could.|Modals carry degrees of possibility: may, might, could.
GRM|Zaman uyumu: ana cümle geçmişse yan cümle de uyumlu olur.|Tense agreement: if the main clause is past, the rest aligns.
GRM|A few sayılabilir, a little sayılamaz isimle kullanılır.|A few goes with countables, a little with uncountables.
GRM|Ne kadar ve ne kadar çok farklı: how many ve how much.|How many and how much are not interchangeable.
GRM|Sıfat sırası: görüş, boyut, yaş, şekil, renk, köken.|Adjective order: opinion, size, age, shape, colour, origin.
GRM|Edatlar bağlama göre değişir: in, on, at, by.|Prepositions shift with context: in, on, at, by.
GRM|Both, either, neither ikili yapıları karıştırma.|Do not confuse the pair structures both, either and neither.
GRM|So ve such vurgu farkı yaratır.|So and such create different emphasis.
GRM|Cleft cümleler vurgu için: it is ... that.|Cleft sentences add emphasis: it is ... that.
GRM|Inversion resmî ve güçlü bir vurgudur: never have I.|Inversion is formal and strong: never have I.
GRM|Participle clause ile cümleyi kısalt.|Shorten a sentence with a participle clause.
GRM|Denemede noktalı virgül iki bağımsız cümleyi birleştirir.|In writing, a semicolon joins two independent clauses.
GRM|Paralel yapı: and ile birleşen ögeler aynı biçimde olur.|Parallel structure: items joined by and share the same form.
GRM|Subject-verb agreement tekil-çoğul uyumudur.|Subject-verb agreement keeps singular and plural in step.
GRM|Nested cümleler yazma; kısa ve net cümle daha çok puan alır.|Avoid nested syntax; short clear sentences score higher.
GRM|Academic tone: get değil, obtain kullan.|Academic tone prefers obtain over get.
GRM|Says yerine states, argues, claims ile çeşitlendir.|Vary reporting verbs: states, argues, claims.
GRM|Zaman zarfları yerini bulmalı: henüz, çoktan, zaten.|Time adverbs need the right slot: yet, already, still.
GRM|Koşul cümlesinde Unless, if not anlamına gelir.|Unless means if not in conditional sentences.
GRM|Possessive yapıda sahiplik s ve of ile kurulur.|Possession is built with apostrophe s or the word of.
GRM|Bazı fiiller iki nesne alır: give, offer, send.|Some verbs take two objects: give, offer, send.
GRM|Little ile few olumsuz, a little ile a few olumlu tondadır.|Little and few sound negative; a little and a few sound positive.
GRM|Ton tutarlılığı: aynı paragrafta aynı kişi ve zaman.|Keep tone consistent: same person and tense in one paragraph.
KEL|Substantial: önemli ölçüde büyük. Significant ile eş anlamlı.|Substantial means large in amount; a synonym is significant.
KEL|Mitigate: hafifletmek. Reduce ve lessen ile eş anlamlı.|Mitigate means to make less severe; synonyms are reduce and lessen.
KEL|Phenomenon: olgu. Occasion ile karıştırma.|A phenomenon is an observable fact, not an occasion.
KEL|Detrimental: zararlı. Harmful ile eş anlamlı.|Detrimental means harmful; a synonym is damaging.
KEL|Prevalent: yaygın. Widespread ve common eş anlamlıdır.|Prevalent means widespread; synonyms are common and rife.
KEL|Scrutiny: dikkatli inceleme.|Scrutiny is close, critical examination.
KEL|Robust: sağlam ve dayanıklı.|Robust means strong and hard to break down.
KEL|Viable: uygulanabilir. Feasible eş anlamlısıdır.|Viable means workable; a synonym is feasible.
KEL|Compelling: ikna edici ve sürükleyici.|Compelling means convincing and hard to ignore.
KEL|Alleviate: azaltmak. Ease ve relieve eş anlamlıdır.|Alleviate means to ease; synonyms are relieve and soothe.
KEL|Pivotal: kilit önemde. Crucial eş anlamlısıdır.|Pivotal means critically important; a synonym is crucial.
KEL|Inherent: doğasında olan.|Inherent means built into the nature of something.
KEL|Ambiguous: belirsiz, iki anlama gelebilir.|Ambiguous means open to more than one meaning.
KEL|Coherent: tutarlı ve anlaşılır.|Coherent means logical and easy to follow.
KEL|Discrepancy: tutarsızlık, uyuşmazlık.|A discrepancy is a mismatch between two things.
KEL|Innovative: yenilikçi. Novel eş anlamlısıdır.|Innovative means new in approach; a synonym is novel.
KEL|Controversial: tartışmalı.|Controversial means causing strong disagreement.
KEL|Sustainable: sürdürülebilir.|Sustainable means able to continue without harm.
KEL|Inevitable: kaçınılmaz.|Inevitable means certain to happen.
KEL|Insightful: içgörülü, derin kavrayışlı.|Insightful means showing deep understanding.
KEL|Negligible: ihmal edilebilir kadar az.|Negligible means too small to matter.
KEL|Deteriorate: kötüleşmek.|Deteriorate means to get worse.
KEL|Flourish: gelişmek, serpilmek. Thrive eş anlamlısıdır.|Flourish means to grow well; a synonym is thrive.
KEL|Resilient: dayanıklı, toparlanabilen.|Resilient means able to recover quickly.
KEL|Diverse: çeşitli. Varied eş anlamlısıdır.|Diverse means showing variety; a synonym is varied.
KEL|Prominent: öne çıkan, göze çarpan.|Prominent means easily noticed or important.
KEL|Accumulate: birikmek, toplamak.|Accumulate means to gather over time.
KEL|Deplete: tüketmek, azaltmak.|Deplete means to use up a resource.
KEL|Undermine: zayıflatmak, sarsmak.|Undermine means to weaken gradually.
KEL|Feasible: yapılabilir, olanaklı.|Feasible means possible to do in practice.
BEC|Dinlerken yalnız anahtar kelimeye odaklan, her kelimeyi yakalamaya çalışma.|While listening, focus on keywords rather than every single word.
BEC|Okuma hızını 200 kelimeye çıkar: parmakla takip etme.|Push your reading speed to two hundred words a minute without pointing.
BEC|Konuşma kaydını dinle ve yalnız 1 düzeltme seç.|Record yourself and choose just one thing to fix.
BEC|Yazarken her paragrafın tek bir işi olsun.|Give every paragraph one single job.
BEC|Dikte çalışması dinlemeyi en hızlı geliştiren yöntemdir.|Dictation is the fastest way to improve listening.
BEC|Gölgeleme: sesi 1 saniye geriden taklit et.|Shadowing: imitate the audio one second behind.
BEC|Kelime kartlarını sesli oku; kulak da ezberler.|Read your word cards aloud; your ear memorises too.
BEC|Özet yazma: her metni 3 cümleyle anlat.|Write summaries: retell every text in three sentences.
BEC|Transkriptle dinleme, telaffuzu düzeltir.|Listening with the transcript fixes pronunciation.
BEC|Sesli okuma, konuşma akıcılığını artırır.|Reading aloud improves speaking fluency.
BEC|Haftada bir kez 40 soruluk tam okuma denemesi yap.|Do one full forty-question Reading test every week.
BEC|Her gün 10 dakika İngilizce podcast dinle.|Listen to ten minutes of an English podcast daily.
BEC|Sınavda dinleme başlamadan önce soruları mutlaka oku.|Always read the questions before the audio starts.
BEC|Yazma planı 5 dakika, taslak 25 dakika, kontrol 5 dakika.|Writing: five minutes planning, twenty-five drafting, five checking.
BEC|Konuşurken düşünmek için bir kalıp cümle kullan.|Use one filler pattern to buy thinking time while speaking.
BEC|Telaffuzda kelime vurgusu, tek seslerden önemlidir.|Word stress matters more than individual sounds.
BEC|Okurken bilmediğin kelimeyi işaretle, sonra sözlüğe bak.|While reading, mark unknown words and check them later.
BEC|Dinlediğin metni kendi cümlelerinle yeniden anlat.|Retell what you heard in your own words.
BEC|Kelime öğrenirken eşdizimleri de öğren.|Learn collocations together with new words.
BEC|Okuma ve dinlemeyi aynı gün yapma; beceri günlerini ayır.|Do not train reading and listening on the same day; split skill days.
SIN|Sınavdan önce sınav merkezini ve yolunu önceden planla.|Plan your route and test centre in advance.
SIN|Gece uykunu bölme; uyku, hafızayı sabitler.|Protect your sleep; sleep consolidates memory.
SIN|Sınav sabahı ağır yemek yeme; hafif ve tanıdık ye.|Avoid heavy food on exam day; eat light and familiar.
SIN|Kimlik belgeni ve onay numaranı önceden hazırla.|Prepare your ID and confirmation number in advance.
SIN|Sınavda saat kontrolü için gözünü kapıya değil ekrana ver.|Watch the screen clock, not the door.
SIN|İlk soru zor gelirse panikleme; kolay soruları tara.|If the first question feels hard, scan for easier ones.
SIN|Dinleme sırasında cevabı yazıp sonra düzeltme zamanın var mı, bil.|Know whether you may edit answers after each section.
SIN|Bilgisayarda sınav: yazım denetimi yok, dikkatli yaz.|On computer-based tests there is no spell-check: type carefully.
SIN|Sınav molasında su iç ve 30 saniye gözünü kapat.|During breaks drink water and close your eyes for thirty seconds.
SIN|Konuşma sınavında gülümse; ton da puanlanır.|Smile in the Speaking test; tone is also assessed.
SIN|Konuşma kaydında hız değil, netlik önemlidir.|In Speaking, clarity beats speed.
SIN|Sınavda son 10 dakikada tüm boşlukları doldur.|Fill every blank in the last ten minutes of the exam.
SIN|Cevabı yazarken iki kez oku: soru tipi tuzakları olabilir.|Read each answer twice; question types hide traps.
SIN|Sınav günü yeni bir strateji denemeyin; bildiğinizi uygulayın.|Never try a new strategy on exam day; apply what you know.
SIN|Kulaklığın ses ayarını başlamadan test et.|Test your headphone volume before the audio begins.
SIN|Kaç soru işaretlediğini say; sonunda geri dön.|Count the questions you flagged so you can return to them.
SIN|Deneme sınavlarını hep aynı saatte yap; beden saatini eğit.|Take mocks at the same hour to train your body clock.
SIN|Heyecan normaldir; 3 derin nefes ritmi düşürür.|Nerves are normal; three deep breaths slow your rhythm.
SIN|Sınavdan sonra cevap tartışıp enerjini harcama.|Do not burn energy debating answers after the exam.
SIN|Sınav gününü bir hedef değil, bir kutlama olarak gör.|See exam day as a celebration, not a threat.
"""


def mesajlari_yukle():
    kategoriler = {"MOT": "Motivasyon", "TAK": "Soru Taktikleri", "GRM": "IELTS Gramer",
                   "KEL": "Kelime", "SIN": "Sınav Günü", "BEC": "Beceri Antrenmanı"}
    out = []
    for i, satir in enumerate(MESAJLAR_HAM.strip().split("\n")):
        satir = satir.strip()
        if not satir:
            continue
        kod, tr, en = satir.split("|", 2)
        out.append({"kod": kategoriler[kod], "tr": tr.strip(), "en": en.strip()})
    return out


# ==========================================================================
#  2) PALETLER — capcanlı, rengarenk (her videoya farklı kombinasyon)
# ==========================================================================
PALETLER = [
    ("#7C3AED", "#EC4899", "#F59E0B", "#06B6D4"), ("#2563EB", "#22D3EE", "#A855F7", "#F472B6"),
    ("#F97316", "#FACC15", "#EF4444", "#8B5CF6"), ("#10B981", "#34D399", "#06B6D4", "#3B82F6"),
    ("#DB2777", "#F472B6", "#FBBF24", "#7C3AED"), ("#0EA5E9", "#6366F1", "#D946EF", "#F43F5E"),
    ("#14B8A6", "#A3E635", "#FACC15", "#F97316"), ("#8B5CF6", "#3B82F6", "#06B6D4", "#34D399"),
    ("#EF4444", "#F97316", "#FBBF24", "#22C55E"), ("#6D28D9", "#DB2777", "#F59E0B", "#0EA5E9"),
    ("#0891B2", "#7C3AED", "#EC4899", "#FACC15"), ("#16A34A", "#84CC16", "#FDE047", "#FB923C"),
]


def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def arka_plan_filtresi(i):
    """Hareketli (gerçek animasyonlu) arka plan — 8 görünüm.
    NOT: yalnızca 'gradients' ve 'testsrc2' kaynakları 'duration' seçeneğini destekler;
    mandelbrot/life/cellauto desteklemez → süre, çıktıdaki -t ile sınırlanır."""
    c = PALETLER[i % len(PALETLER)]
    a, b, d, e = c
    t = i % 8
    if t == 0:
        return f"gradients=s={W}x{H}:r={FPS}:c0={a}:c1={b}:c2={d}:c3={e}:nb_colors=4:x0=0:y0=0:x1={W}:y1={H}:speed=0.014:duration={SURE}"
    if t == 1:
        return f"gradients=s={W}x{H}:r={FPS}:c0={b}:c1={d}:c2={a}:nb_colors=3:x0={W}:y0=0:x1=0:y1={H}:speed=0.022:duration={SURE}"
    if t == 2:
        return f"gradients=s={W}x{H}:r={FPS}:c0={d}:c1={a}:c2={e}:c3={b}:nb_colors=4:type=radial:x0={W//2}:y0={H//2}:x1={W//2}:y1={H//2}:speed=0.03:duration={SURE}"
    if t == 3:
        return f"mandelbrot=s={W}x{H}:r={FPS}:maxiter=90:start_scale=2.6:end_scale=0.6"
    if t == 4:
        return f"life=s={W}x{H}:r={FPS}:mold=10:ratio=0.12:life_color={a}:death_color={d}:gen_color={b}:seed={i}"
    if t == 5:
        return f"cellauto=s={W}x{H}:r={FPS}:rule=110:scroll=1:seed={i},hue=h='40*t':s=1.6"
    if t == 6:
        return f"testsrc2=s={W}x{H}:r={FPS}:duration={SURE},gblur=sigma=22,hue=h='60*t':s=2.0"
    return f"gradients=s={W}x{H}:r={FPS}:c0={e}:c1={a}:c2={b}:nb_colors=3:type=spiral:speed=0.02:duration={SURE}"


GUVENLI_ZINCIR = f"gradients=s={W}x{H}:r={FPS}:c0=#7C3AED:c1=#EC4899:c2=#06B6D4:c3=#F59E0B:nb_colors=4:type=spiral:speed=0.02:duration={SURE}"


def zincir_calisir_mi(zincir):
    """Filtre zincirini 1 karelik denemeyle doğrula (bozuk seçenekleri erkenden yakala)."""
    r = subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", zincir,
                        "-frames:v", "1", "-f", "null", "-"], capture_output=True, text=True)
    return r.returncode == 0


def vtt_kaydet(yol, metin):
    """WebVTT altyazı: 0.6s – 7.4s arası."""
    icerik = "WEBVTT\n\n00:00:00.600 --> 00:00:07.400\n" + metin + "\n"
    Path(yol).write_text(icerik, encoding="utf-8")


def metin_karti(tr, en, renk, kod, idx):
    """Pillow ile saydam metin katmanı (kart) çiz."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_baslik = ImageFont.truetype(FONT_B, 30)
    f_kucuk = ImageFont.truetype(FONT_R, 15)
    f_kod = ImageFont.truetype(FONT_B, 13)

    # Metni sar (Türkçe başlık ana metin, İngilizce alt satır)
    satirlar = textwrap.wrap(tr, width=30)[:4]
    en_satirlar = textwrap.wrap(en, width=48)[:2]

    yuk = 26 + len(satirlar) * 38 + (len(en_satirlar) * 24 if en_satirlar else 0)
    kart_y0 = (H - yuk) // 2
    x0, x1 = 40, W - 40
    # yarı saydam koyu kart + renkli çerçeve
    d.rounded_rectangle([x0 - 8, kart_y0 - 18, x1 + 8, kart_y0 + yuk + 6], radius=22,
                        fill=(12, 10, 32, 168), outline=hex2rgb(renk) + (235,), width=3)

    # kategori rozeti
    kod_gen = d.textlength(kod, font=f_kod)
    d.rounded_rectangle([x0 - 2, kart_y0 - 34, x0 + kod_gen + 22, kart_y0 - 6], radius=10,
                        fill=hex2rgb(renk) + (240,))
    d.text((x0 + 10, kart_y0 - 30), kod, font=f_kod, fill=(255, 255, 255, 255))

    y = kart_y0
    for s in satirlar:
        gen = d.textlength(s, font=f_baslik)
        d.text(((W - gen) / 2 + 1.5, y + 1.5), s, font=f_baslik, fill=(0, 0, 0, 170))
        d.text(((W - gen) / 2, y), s, font=f_baslik, fill=(255, 255, 255, 255))
        y += 38
    if en_satirlar:
        y += 4
        for s in en_satirlar:
            gen = d.textlength(s, font=f_kucuk)
            d.text(((W - gen) / 2, y), s, font=f_kucuk, fill=(232, 226, 255, 240))
            y += 24

    # alt köşe imzası
    d.text((x0 - 2, H - 30), "IELTS AKADEMİ · dinle-öğren", font=f_kucuk, fill=(255, 255, 255, 170))
    d.text((x1 - 120, H - 30), f"#{idx:03d}", font=f_kucuk, fill=(255, 255, 255, 130))
    return img


def video_uret(i, msg, out_dir, poster_dir, vtt_dir, tmp_dir, atla=False):
    vid = f"v{i + 1:03d}"
    mp4 = out_dir / f"{vid}.mp4"
    if atla and mp4.exists() and mp4.stat().st_size > 1000:
        return vid, mp4.stat().st_size
    png = tmp_dir / f"{vid}.png"
    renk = PALETLER[i % len(PALETLER)][1]
    metin_karti(msg["tr"], msg["en"], renk, msg["kod"], i + 1).save(png)

    bg = arka_plan_filtresi(i)
    # NOT: overlay ifadesindeki virgül (min(t/1.1,1)) tırnak içine alınmazsa filtre ayrıştırıcı bozulur.
    vf = ("[1:v]format=rgba,fade=t=in:st=0.35:d=0.8:alpha=1,fade=t=out:st=6.5:d=1.2:alpha=1[card];"
          "[0:v][card]overlay=x='(W-w)/2':y='(H-h)/2+30*(1-min(t/1.1,1))':format=auto,format=yuv420p[out]")
    cmd = [FF, "-y", "-hide_banner", "-loglevel", "error",
           "-f", "lavfi", "-i", bg, "-loop", "1", "-i", str(png),
           "-filter_complex", vf, "-map", "[out]", "-t", str(SURE), "-r", str(FPS),
           "-c:v", "libx264", "-preset", "veryfast", "-crf", "31", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", str(mp4)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        # Kaynak filtresi başarısız olduysa güvenli gradyan zincirine düş
        cmd[cmd.index(bg)] = GUVENLI_ZINCIR
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            raise RuntimeError(f"{vid}: ffmpeg hatası → {r.stderr.strip()[:200]}")

    # poster (2.5. saniyeden kare)
    subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error", "-ss", "2.5", "-i", str(mp4),
                    "-frames:v", "1", "-q:v", "6", "-vf", "scale=480:-2", str(poster_dir / f"{vid}.jpg")],
                   capture_output=True)
    vtt_kaydet(vtt_dir / f"{vid}.tr.vtt", msg["tr"])
    vtt_kaydet(vtt_dir / f"{vid}.en.vtt", msg["en"])
    png.unlink(missing_ok=True)
    return vid, mp4.stat().st_size


# ==========================================================================
#  3) 100 TEMA (50 aydınlık + 50 karanlık) — rengarenk, canlı
# ==========================================================================
SIFATLAR = ["Neon", "Zümrüt", "Kozmik", "Alev", "Okyanus", "Şafak", "Gökkuşağı", "Kristal",
            "Lavanta", "Kehribar", "Turkuaz", "Bordo", "Zeytin", "Karanfil", "Menekşe", "Mercan",
            "Yıldız", "Şimşek", "Bulut", "Kumsal", "Orman", "Buz", "Mangal", "Fıstık",
            "Nar", "Limon", "Çilek", "Yasemin", "Safir", "Kobalt"]
ISIMLER = ["Şafağı", "Gecesi", "Rüzgârı", "Bahçesi", "Denizi", "Mehtabı", "Köprüsü", "Yolculuğu",
           "Ateşi", "Bulutu", "Rüyası", "Saati", "Anahtarı", "Pençesi", "Kalbi", "Kıvılcımı",
           "Dalgaları", "Zirvesi", "Vadisi", "Feneri"]


def hsl_hex(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h % 1.0, max(0, min(1, l)), max(0, min(1, s)))
    return "#%02X%02X%02X" % (int(r * 255), int(g * 255), int(b * 255))


def tema_uret():
    temalar = []
    n_light = 50
    for i in range(100):
        aydinlik = i < n_light
        hue = (i * 0.61803398875) % 1.0            # altın oran ile dağıtılmış tonlar
        h2 = (hue + 0.33) % 1.0
        h3 = (hue + 0.66) % 1.0
        if aydinlik:
            bg = "#FFFFFF"
            panel = hsl_hex(hue, 0.85, 0.975)
            ink = hsl_hex(hue, 0.65, 0.12)
            muted = hsl_hex(hue, 0.35, 0.42)
            marka = hsl_hex(hue, 0.92, 0.42)
            marka2 = hsl_hex(h2, 0.92, 0.45)
            vurgu3 = hsl_hex(h3, 0.95, 0.44)
        else:
            bg = "#000000"
            panel = hsl_hex(hue, 0.55, 0.075)
            ink = hsl_hex(hue, 0.25, 0.965)
            muted = hsl_hex(hue, 0.28, 0.68)
            marka = hsl_hex(hue, 0.95, 0.63)
            marka2 = hsl_hex(h2, 0.95, 0.66)
            vurgu3 = hsl_hex(h3, 0.95, 0.64)
        ad = f"{SIFATLAR[i % len(SIFATLAR)]} {ISIMLER[(i * 7) % len(ISIMLER)]}"
        temalar.append({
            "id": f"t{i + 1:03d}", "ad": f"{ad} {'☀' if aydinlik else '☾'}",
            "mod": "light" if aydinlik else "dark", "bg": bg, "panel": panel, "ink": ink,
            "muted": muted, "line": hsl_hex(hue, 0.30, 0.82 if aydinlik else 0.22),
            "marka": marka, "marka2": marka2, "vurgu3": vurgu3,
            "ok": hsl_hex(0.38, 0.80, 0.35 if aydinlik else 0.60),
            "warn": hsl_hex(0.10, 0.92, 0.42 if aydinlik else 0.62),
            "err": hsl_hex(0.005, 0.80, 0.45 if aydinlik else 0.63),
        })
    return temalar


# ==========================================================================
#  ANA AKIŞ
# ==========================================================================
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="ONARIM/08-medya")
    ap.add_argument("--json", default="ONARIM/01-canli-site-demo/data/site")
    ap.add_argument("--limit", type=int, default=0, help="0 = hepsi")
    ap.add_argument("--isci", type=int, default=6)
    ap.add_argument("--only-missing", action="store_true", help="var olan videoları yeniden üretme")
    a = ap.parse_args()

    kok = Path(__file__).resolve().parent.parent
    out = (kok / a.out).resolve()
    jdir = (kok / a.json).resolve()
    vdir, pdir, tdir, tmp = out / "video", out / "poster", out / "vtt", out / ".tmp"
    for d in (vdir, pdir, tdir, tmp, jdir / "medya"):
        d.mkdir(parents=True, exist_ok=True)

    msgs = mesajlari_yukle()
    if a.limit:
        msgs = msgs[:a.limit]
    print(f"🎬 VİDEO ÜRETİMİ — {len(msgs)} video · ffmpeg: {FF}")

    # Filtre zincirlerini önceden sına: çalışmayanı güvenli zincirle değiştir
    bozuk = []
    for t in range(8):
        if not zincir_calisir_mi(arka_plan_filtresi(t)):
            bozuk.append(t)
    if bozuk:
        print(f"   ⚠ {len(bozuk)} arka plan tipi bu ffmpeg sürümünde çalışmıyor, güvenli zincire düşülecek: {bozuk}")

    kayit, hata = [], []
    with ThreadPoolExecutor(max_workers=a.isci) as ex:
        gec = {ex.submit(video_uret, i, m, vdir, pdir, tdir, tmp, a.only_missing): i for i, m in enumerate(msgs)}
        for n, f in enumerate(as_completed(gec), 1):
            i = gec[f]
            try:
                vid, boyut = f.result()
                kayit.append((i, vid, boyut))
                if n % 20 == 0 or n == len(msgs):
                    print(f"   ... {n}/{len(msgs)} video hazır")
            except Exception as ex_:
                hata.append(str(ex_))
                print("   ✗", ex_)

    kayit.sort()
    katalog = []
    for i, vid, boyut in kayit:
        m = msgs[i]
        katalog.append({
            "id": vid, "kategori": m["kod"], "tr": m["tr"], "en": m["en"],
            "video": f"medya/video/{vid}.mp4", "poster": f"medya/poster/{vid}.jpg",
            "vttTr": f"medya/vtt/{vid}.tr.vtt", "vttEn": f"medya/vtt/{vid}.en.vtt",
            "sure": SURE, "renk": PALETLER[i % len(PALETLER)][1], "boyut": boyut,
        })
    (jdir / "medya" / "videolar.json").write_text(json.dumps(katalog, ensure_ascii=False, indent=1), encoding="utf-8")

    temalar = tema_uret()
    (jdir / "medya" / "temalar.json").write_text(json.dumps(temalar, ensure_ascii=False, indent=1), encoding="utf-8")

    toplam = sum(k["boyut"] for k in katalog)
    print(f"\n✅ {len(katalog)} video · {len(temalar)} tema · toplam video boyutu {toplam/1048576:.1f} MB")
    print(f"   katalog: {jdir/'medya'/'videolar.json'}")
    print(f"   temalar: {jdir/'medya'/'temalar.json'}")
    if hata:
        print(f"   ⚠ {len(hata)} video üretilemedi")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
