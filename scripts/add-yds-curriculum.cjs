// scripts/add-yds-curriculum.cjs
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../public/data/site/kelime");
const allPath = path.join(dir, "kelime-hepsi.json");
const currentAll = JSON.parse(fs.readFileSync(allPath, "utf8"));

let nextId = currentAll.length + 1;

const extra = [];
function addW(kelime, tur, tr, en, es, ornek, ornekTr, seviye, alan, ydsFreq = "Çok Yüksek (P0)") {
  extra.push({
    id: "w" + String(nextId++).padStart(4, "0"),
    kelime,
    tur,
    tr,
    en,
    es: Array.isArray(es) ? es : es.split(",").map(s => s.trim()),
    ornek,
    ornekTr,
    seviye,
    alan,
    ydsFrequency: ydsFreq
  });
}

// ─────────────────────────────────────────────────────────────
// 1. YDS & YDT EN ÇOK ÇIKAN PHRASAL VERBS (50 Adet)
// ─────────────────────────────────────────────────────────────
const phrasals = [
  ["account for", "phrasal verb", "açıklamak, -den sorumlu olmak, oluşturmak (oran)", "to explain the reason for or form a total of", ["explain", "constitute", "represent"], "Renewable sources account for 30% of total electricity production.", "Yenilenebilir kaynaklar toplam elektrik üretiminin %30'unu oluşturmaktadır.", "B2", "YDS Sık Çıkan"],
  ["bring about", "phrasal verb", "neden olmak, yol açmak, beraberinde getirmek", "to cause something to happen", ["cause", "lead to", "trigger"], "Technological advances brought about drastic social changes.", "Teknolojik gelişmeler köklü sosyal değişikliklere yol açtı.", "B2", "YDS Sık Çıkan"],
  ["call off", "phrasal verb", "iptal etmek, sonlandırmak", "to cancel an event or agreement", ["cancel", "abandon", "abort"], "The committee decided to call off the international symposium.", "Komite uluslararası sempozyumu iptal etmeye karar verdi.", "B1", "YDS Sık Çıkan"],
  ["carry out", "phrasal verb", "yürütmek, icra etmek, uygulamak", "to perform or complete an activity", ["conduct", "execute", "perform"], "Scientists will carry out clinical trials on the new vaccine.", "Bilim insanları yeni aşı üzerinde klinik denemeler yürütecek.", "B2", "YDS Sık Çıkan"],
  ["come up with", "phrasal verb", "ortaya atmak, bulmak, ileri sürmek (fikir/çözüm)", "to suggest or think of an idea or plan", ["propose", "devise", "invent"], "Engineers came up with an ingenious water purification method.", "Mühendisler dahice bir su arıtma yöntemi geliştirdiler.", "B2", "YDS Sık Çıkan"],
  ["cope with", "phrasal verb", "başa çıkmak, üstesinden gelmek", "to deal successfully with a difficult situation", ["manage", "handle", "deal with"], "Healthcare workers struggled to cope with the influx of patients.", "Sağlık çalışanları hasta akınıyla başa çıkmak için mücadele etti.", "B2", "YDS Sık Çıkan"],
  ["cut down on", "phrasal verb", "kısmak, azaltmak", "to reduce the amount or consumption of something", ["reduce", "curtail", "lessen"], "Doctors urge citizens to cut down on sugar and processed salt.", "Doktorlar vatandaşları şeker ve işlenmiş tuzu azaltmaya çağırıyor.", "B1", "YDS Sık Çıkan"],
  ["deal with", "phrasal verb", "ele almak, ilgilenmek, başa çıkmak", "to take action to solve a problem", ["handle", "manage", "tackle"], "The new legislation aims to deal with youth unemployment.", "Yeni mevzuat genç işsizliğiyle ilgilenmeyi amaçlamaktadır.", "B1", "YDS Sık Çıkan"],
  ["figure out", "phrasal verb", "anlamak, çözmek, kavramak", "to understand or solve something", ["understand", "solve", "decipher"], "Researchers are trying to figure out how the virus mutates.", "Araştırmacılar virüsün nasıl mutasyona uğradığını anlamaya çalışıyor.", "B1", "YDS Sık Çıkan"],
  ["give up", "phrasal verb", "vazgeçmek, bırakmak, pes etmek", "to stop doing or trying something", ["abandon", "quit", "surrender"], "Never give up when preparing for challenging exams.", "Zorlu sınavlara hazırlanırken asla pes etmeyin.", "A2", "YDS Sık Çıkan"],
  ["keep up with", "phrasal verb", "ayak uydurmak, hızına yetişmek", "to move or progress at the same rate as someone or something", ["match", "keep pace with", "follow"], "Traditional retail struggles to keep up with e-commerce trends.", "Geleneksel perakende e-ticaret trendlerine ayak uydurmakta zorlanıyor.", "B2", "YDS Sık Çıkan"],
  ["look forward to", "phrasal verb", "dört gözle beklemek", "to feel pleased and excited about something that is going to happen", ["anticipate", "await eagerly", "hope for"], "We look forward to welcoming the keynote speakers.", "Açılış konuşmacılarını ağırlamayı dört gözle bekliyoruz.", "B1", "YDS Sık Çıkan"],
  ["look into", "phrasal verb", "incelemek, araştırmak", "to examine the facts about a problem or situation", ["investigate", "examine", "explore"], "Authorities promised to look into the allegations of fraud.", "Yetkililer dolandırıcılık iddialarını araştırmaya söz verdi.", "B2", "YDS Sık Çıkan"],
  ["make up for", "phrasal verb", "telafi etmek, açığı kapatmak", "to compensate for something bad with something good", ["compensate for", "offset", "remedy"], "Extra tutoring helped him make up for lost classroom time.", "Ekstra özel ders, kaybettiği sınıf zamanını telafi etmesine yardımcı oldu.", "B2", "YDS Sık Çıkan"],
  ["put off", "phrasal verb", "ertelemek, geciktirmek", "to decide or arrange to do something at a later time", ["postpone", "delay", "defer"], "Do not put off studying until the last week before the exam.", "Ders çalışmayı sınavdan önceki son haftaya kadar ertelemeyin.", "B1", "YDS Sık Çıkan"],
  ["put up with", "phrasal verb", "katlanmak, tahammül etmek", "to tolerate or accept an unpleasant situation without complaining", ["tolerate", "endure", "bear"], "Residents will not put up with continuous airport noise.", "Mahalle sakinleri sürekli havalimanı gürültüsüne katlanmayacak.", "B2", "YDS Sık Çıkan"],
  ["rely on", "phrasal verb", "güvenmek, bel bağlamak, bağımlı olmak", "to depend on or trust someone or something", ["depend on", "count on", "trust"], "Developing economies rely heavily on agricultural exports.", "Gelişmekte olan ekonomiler büyük ölçüde tarımsal ihracata güvenmektedir.", "B1", "YDS Sık Çıkan"],
  ["run out of", "phrasal verb", "tükenmek, bitmek", "to finish a supply of something", ["exhaust", "deplete", "consume"], "Many island nations are running out of freshwater reserves.", "Pek çok ada ülkesinin tatlı su rezervleri tükeniyor.", "B1", "YDS Sık Çıkan"],
  ["take over", "phrasal verb", "devralmak, kontrolü ele geçirmek", "to begin to have control of something", ["assume control", "command", "seize"], "The multinational corporation plans to take over the local firm.", "Çok uluslu şirket yerel firmayı devralmayı planlıyor.", "B2", "YDS Sık Çıkan"],
  ["turn down", "phrasal verb", "reddetmek, geri çevirmek", "to refuse an offer, a proposal, or request", ["reject", "refuse", "decline"], "The author turned down several lucrative publishing contracts.", "Yazar birkaç kazançlı yayıncılık sözleşmesini geri çevirdi.", "B2", "YDS Sık Çıkan"],
  ["break down", "phrasal verb", "bozulmak, çökmek, parçalara ayırmak", "to stop working; to separate into smaller parts", ["malfunction", "decompose", "collapse"], "The analytical model breaks down data into demographic subsets.", "Analitik model verileri demografik alt kümelere ayırır.", "B1", "YDS Sık Çıkan"],
  ["bring up", "phrasal verb", "yetiştirmek (çocuk), gündeme getirmek", "to raise a child; to mention a topic in discussion", ["raise", "mention", "introduce"], "She brought up the issue of gender pay disparity in the meeting.", "Toplantıda cinsiyete dayalı ücret eşitsizliği konusunu gündeme getirdi.", "B1", "YDS Sık Çıkan"],
  ["catch up with", "phrasal verb", "yakalamak, aynı düzeye gelmek", "to reach the same quality or standard as someone", ["reach", "overtake", "draw level"], "Developing nations strive to catch up with industrial leaders.", "Gelişmekte olan ülkeler sanayi liderlerini yakalamak için çabalıyor.", "B2", "YDS Sık Çıkan"],
  ["cut off", "phrasal verb", "kesmek, bağlantısını koparmak, tecrit etmek", "to stop the supply of something or isolate", ["disconnect", "isolate", "sever"], "The blizzard cut off power to hundreds of remote villages.", "Kar fırtınası yüzlerce uzak köyün elektriğini kesti.", "B1", "YDS Sık Çıkan"],
  ["fall apart", "phrasal verb", "dağılmak, parçalanmak, çökmek", "to break into pieces or become disorganized", ["disintegrate", "crumble", "decay"], "Peace negotiations fell apart due to territorial disputes.", "Barış müzakereleri toprak anlaşmazlıkları nedeniyle dağıldı.", "B2", "YDS Sık Çıkan"],
  ["get along with", "phrasal verb", "biriyle iyi geçinmek, anlaşmak", "to have a good relationship with someone", ["be friendly with", "harmonize", "agree"], "Successful managers get along with diverse team members.", "Başarılı yöneticiler farklı ekip üyeleriyle iyi geçinir.", "B1", "YDS Sık Çıkan"],
  ["give off", "phrasal verb", "salmak, yaymak (koku/gaz/ısı)", "to produce heat, light, a smell, or a gas", ["emit", "release", "radiate"], "Decaying vegetation gives off significant methane gas.", "Çürüyen bitki örtüsü önemli miktarda metan gazı yayar.", "B2", "YDS Sık Çıkan"],
  ["hand over", "phrasal verb", "teslim etmek, devretmek", "to pass control or possession of something to another", ["surrender", "transfer", "relinquish"], "The governor handed over authority to the newly elected mayor.", "Vali yetkiyi yeni seçilen belediye başkanına devretti.", "B2", "YDS Sık Çıkan"],
  ["look down on", "phrasal verb", "hor görmek, tepeden bakmak, küçümsemek", "to think that someone is inferior or unimportant", ["scorn", "disdain", "despise"], "Educated societies do not look down on manual labor.", "Eğitimli toplumlar beden işçiliğini hor görmez.", "B2", "YDS Sık Çıkan"],
  ["look up to", "phrasal verb", "hayranlık duymak, saygı duymak, örnek almak", "to admire and respect someone", ["admire", "respect", "revere"], "Young scholars look up to pioneering Nobel laureates.", "Genç akademisyenler öncü Nobel ödüllü bilim insanlarını örnek alır.", "B1", "YDS Sık Çıkan"],
  ["make out", "phrasal verb", "seçmek, fark etmek, anlamak", "to see, hear, or understand something with difficulty", ["discern", "distinguish", "perceive"], "The captain could barely make out the lighthouse in the dense fog.", "Kaptan yoğun siste deniz fenerini güçlükle seçebildi.", "B2", "YDS Sık Çıkan"],
  ["pass away", "phrasal verb", "vefat etmek, hayatını kaybetmek", "polite expression for to die", ["die", "perish", "expire"], "The legendary astrophysicist passed away peacefully at age 85.", "Efsanevi astrofizikçi 85 yaşında huzur içinde vefat etti.", "B1", "YDS Sık Çıkan"],
  ["pull through", "phrasal verb", "iyileşmek, tehlikeyi atlatmak, paçayı kurtarmak", "to recover from a serious illness or difficulty", ["recover", "survive", "rally"], "Thanks to swift surgery, the critically injured patient pulled through.", "Hızlı ameliyat sayesinde ağır yaralı hasta tehlikeyi atlattı.", "B2", "YDS Sık Çıkan"],
  ["put forward", "phrasal verb", "ileri sürmek, teklif etmek (öneri/hipotez)", "to state an idea or opinion for consideration", ["propose", "suggest", "advance"], "The biologist put forward a hypothesis regarding coral bleaching.", "Biyolog mercan ağarmasına ilişkin bir hipotez ileri sürdü.", "B2", "YDS Sık Çıkan"],
  ["rule out", "phrasal verb", "elemek, hariç tutmak, ihtimal dışı bırakmak", "to exclude something as a possibility", ["exclude", "dismiss", "eliminate"], "Investigators ruled out mechanical failure as the crash cause.", "Müfettişler kaza nedeni olarak mekanik arızayı ihtimal dışı bıraktı.", "B2", "YDS Sık Çıkan"],
  ["set off", "phrasal verb", "yola çıkmak; tetiklemek, başlatmak", "to start a journey; to cause a process to start", ["depart", "trigger", "initiate"], "The tariff announcements set off turbulence across global markets.", "Tarife açıklamaları küresel piyasalarda çalkantıyı tetikledi.", "B1", "YDS Sık Çıkan"],
  ["stand for", "phrasal verb", "anlamına gelmek, temsil etmek; hoşgörmek", "to represent an idea or word; to tolerate", ["represent", "symbolize", "advocate"], "The acronym UNESCO stands for Educational, Scientific, Cultural Organization.", "UNESCO kısaltması Eğitim, Bilim ve Kültür Örgütü anlamına gelir.", "B1", "YDS Sık Çıkan"],
  ["take after", "phrasal verb", "benzemek, çekmek (anne/babaya)", "to resemble an older relative in appearance or character", ["resemble", "look like", "favor"], "The young prodigy takes after her mother in mathematical aptitude.", "Genç dahi, matematik yeteneğinde annesine çekmiş.", "B1", "YDS Sık Çıkan"],
  ["wipe out", "phrasal verb", "kökünü kazımak, tamamen yok etmek", "to destroy something completely", ["eradicate", "destroy", "annihilate"], "The catastrophic meteorite impact wiped out the non-avian dinosaurs.", "Felaket boyutundaki göktaşı çarpması kuş olmayan dinozorları yok etti.", "B2", "YDS Sık Çıkan"]
];

phrasals.forEach(p => {
  addW(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], "Çok Yüksek (P0)");
});

// ─────────────────────────────────────────────────────────────
// 2. YDS BAĞLAÇLARI VE GEÇİŞ SÖZCÜKLERİ (30 Adet)
// ─────────────────────────────────────────────────────────────
const conjunctions = [
  ["although", "bağlaç", "rağmen, -e karşın", "despite the fact that", ["even though", "though", "while"], "Although the exam was challenging, many students attained high marks.", "Sınav zorlu olmasına rağmen pek çok öğrenci yüksek notlar aldı.", "B1", "YDS Sık Çıkan"],
  ["whereas", "bağlaç", "oysaki, halbuki, buna karşın", "compared with the fact that; but in contrast", ["while", "whilst", "on the other hand"], "Some countries invest in solar grids, whereas others prioritize hydro power.", "Bazı ülkeler güneş enerjisine yatırım yaparken, diğerleri hidroelektriğe öncelik verir.", "B2", "YDS Sık Çıkan"],
  ["furthermore", "zarf", "dahası, ayrıca, üstelik", "in addition; more importantly", ["moreover", "in addition", "besides"], "The study is comprehensive; furthermore, its findings are peer-reviewed.", "Çalışma kapsamlıdır; dahası, bulguları hakem denetiminden geçmiştir.", "B2", "Akademik"],
  ["nevertheless", "zarf", "yine de, buna rağmen, bununla birlikte", "in spite of that; however", ["nonetheless", "however", "still"], "The weather was stormy; nevertheless, the rescue team set sail.", "Hava fırtınalıydı; yine de kurtarma ekibi denize açıldı.", "B2", "YDS Sık Çıkan"],
  ["consequently", "zarf", "sonuç olarak, bu nedenle", "as a result; therefore", ["as a result", "therefore", "thus"], "The drought destroyed key crops; consequently, food costs surged.", "Kuraklık temel mahsulleri mahvetti; sonuç olarak gıda fiyatları fırladı.", "B2", "Akademik"],
  ["in spite of", "edat", "-e rağmen, karşın", "without being prevented by", ["despite", "regardless of", "notwithstanding"], "In spite of intense pressure, the diplomat remained calm.", "Yoğun baskıya rağmen diplomat sakinliğini korudu.", "B1", "YDS Sık Çıkan"],
  ["on the contrary", "bağlaç kalıbı", "aksine, tam tersine", "used to show that you think the exact opposite is true", ["conversely", "quite the reverse", "rather"], "The reforms did not weaken the economy; on the contrary, they spurred growth.", "Reformlar ekonomiyi zayıflatmadı; aksine büyümeyi tetikledi.", "B2", "YDS Sık Çıkan"],
  ["in terms of", "edat kalıbı", "bakımından, açısından", "used to describe which particular area of a subject you are discussing", ["regarding", "with respect to", "concerning"], "The city is ranked number one in terms of quality of life.", "Şehir, yaşam kalitesi açısından birinci sırada yer alıyor.", "B2", "Akademik"],
  ["with respect to", "edat kalıbı", "-e ilişkin olarak, hususunda", "in connection with or regarding", ["concerning", "regarding", "as regards"], "Regulations are clear with respect to occupational safety.", "İş güvenliği hususunda yönetmelikler nettir.", "B2", "Hukuk"],
  ["prior to", "edat kalıbı", "-den önce", "before a particular time or event", ["before", "ahead of", "preceding"], "Passengers must undergo security clearance prior to boarding.", "Yolcular uçağa binmeden önce güvenlik kontrolünden geçmelidir.", "B2", "YDS Sık Çıkan"],
  ["owing to", "edat kalıbı", "-den dolayı, yüzünden", "because of", ["due to", "because of", "on account of"], "The match was postponed owing to torrential monsoon rains.", "Maç şiddetli muson yağmurları yüzünden ertelendi.", "B2", "YDS Sık Çıkan"],
  ["as long as", "bağlaç", "-dığı sürece, şartıyla", "only if, or provided that", ["provided that", "so long as", "if"], "You may borrow the equipment as long as you return it clean.", "Temiz bir şekilde geri getirdiğiniz sürece ekipmanı ödünç alabilirsiniz.", "B1", "YDS Sık Çıkan"],
  ["in case", "bağlaç", "olur da ... diye, ihtimaline karşı", "to be prepared for a possible future event", ["lest", "in the event that", "if"], "Take an umbrella in case it rains during the excursion.", "Gezi sırasında yağmur yağar diye yanınıza bir şemsiye alın.", "B1", "YDS Sık Çıkan"],
  ["unless", "bağlaç", "-medikçe, -mezse", "except if; if not", ["if not", "except when"], "You cannot sit for the bar examination unless you graduate from law school.", "Hukuk fakültesinden mezun olmadıkça baro sınavına giremezsiniz.", "B1", "Hukuk"],
  ["provided that", "bağlaç", "şartıyla, koşuluyla", "only if a particular condition is met", ["on condition that", "as long as", "if"], "Travelers can enter the country provided that they hold valid visas.", "Yolcular geçerli vizeye sahip olmaları şartıyla ülkeye girebilirler.", "B2", "Hukuk & Sınav"],
  ["so that", "bağlaç", "-sin diye, amacıyla", "in order that something may happen", ["in order that", "to the end that"], "He studied vocabulary diligently so that he could pass IELTS with band 8.", "IELTS'i band 8 ile geçebilsin diye özenle kelime çalıştı.", "B1", "Eğitim"],
  ["in order to", "edat kalıbı", "-mek amacıyla, için", "with the purpose of achieving something", ["so as to", "to", "with a view to"], "The clinic hired additional nurses in order to shorten wait times.", "Klinik bekleme sürelerini kısaltmak amacıyla ek hemşireler istihdam etti.", "B1", "Sağlık"],
  ["regardless of", "edat kalıbı", "-e bakılmaksızın, gözetmeksizin", "without being influenced by", ["irrespective of", "despite", "without regard to"], "All students receive equal support regardless of socioeconomic background.", "Sosyoekonomik geçmişe bakılmaksızın tüm öğrenciler eşit destek alır.", "B2", "Toplum"],
  ["by means of", "edat kalıbı", "vasıtasıyla, aracılığıyla", "with the help of or by using", ["via", "through", "using"], "Scientists tracked marine migration by means of satellite telemetry.", "Bilim insanları uydu telemetrisi vasıtasıyla deniz göçünü izledi.", "B2", "Bilim"],
  ["notwithstanding", "edat", "-e rağmen, karşın", "despite the fact or existence of", ["despite", "in spite of", "regardless of"], "Notwithstanding the economic crisis, the tech sector expanded.", "Ekonomik krize rağmen teknoloji sektörü büyüdü.", "C1", "Ekonomi & YDS"]
];

conjunctions.forEach(c => {
  addW(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], "Çok Yüksek (P0)");
});

// ─────────────────────────────────────────────────────────────
// 3. YDS / YDT ÇOK ÇIKAN AKADEMİK SIFAT VE ZARFLAR (50 Adet)
// ─────────────────────────────────────────────────────────────
const academicModifiers = [
  ["abundant", "sıfat", "bol, bereketli, çok sayıda", "existing or available in large quantities", ["plentiful", "copious", "ample"], "The tropical rainforest is home to abundant plant and animal species.", "Tropikal yağmur ormanı bol miktarda bitki ve hayvan türüne ev sahipliği yapar.", "B2", "Biyoloji"],
  ["ambiguous", "sıfat", "belirsiz, muğlak, iki anlamlı", "having more than one possible meaning; not clear", ["vague", "equivocal", "obscure"], "The contract language was ambiguous, leading to a legal dispute.", "Sözleşme dili muğlaktı ve bu da yasal bir anlaşmazlığa yol açtı.", "B2", "Hukuk"],
  ["coherent", "sıfat", "tutarlı, ahenkli, mantıklı", "clear and carefully considered, with each part fitting well", ["logical", "consistent", "lucid"], "Her essay presented a coherent argument backed by statistics.", "Makalesi istatistiklerle desteklenen tutarlı bir argüman sundu.", "B2", "Akademik"],
  ["comprehensive", "sıfat", "kapsamlı, etraflı", "complete and including everything that is necessary", ["thorough", "exhaustive", "all-inclusive"], "The ministry published a comprehensive report on national literacy.", "Bakanlık ulusal okuryazarlık üzerine kapsamlı bir rapor yayınladı.", "B2", "Eğitim"],
  ["detrimental", "sıfat", "zararlı, hasar veren", "causing harm or damage", ["harmful", "damaging", "injurious"], "Excessive screen exposure can be detrimental to sleep cycles.", "Aşırı ekrana maruz kalma uyku döngülerine zararlı olabilir.", "B2", "Sağlık & YDS"],
  ["drastic", "sıfat", "köklü, sert, şiddetli", "severe and sudden or having very noticeable effects", ["extreme", "radical", "severe"], "Cities took drastic measures to combat air pollution.", "Şehirler hava kirliliğiyle mücadele etmek için köklü tedbirler aldı.", "B2", "Çevre"],
  ["elaborate", "sıfat", "ayrıntılı, detaylı, özenle işlenmiş", "containing a lot of careful detail or many detailed parts", ["detailed", "intricate", "complex"], "Archaeologists uncovered an elaborate mosaic on the villa floor.", "Arkeologlar villa zemininde ayrıntılı bir mozaik ortaya çıkardılar.", "B2", "Tarih"],
  ["feasible", "sıfat", "uygulanabilir, yapılabilir, olası", "able to be made, done, or achieved", ["viable", "practicable", "workable"], "Engineers concluded that building a subsea tunnel was economically feasible.", "Mühendisler bir denizaltı tüneli inşa etmenin ekonomik olarak uygulanabilir olduğu sonucuna vardı.", "B2", "Mühendislik & YDS"],
  ["hostile", "sıfat", "düşmanca, elverişsiz, sert", "unfriendly and not liking something; difficult to live in", ["unfriendly", "antagonistic", "adverse"], "Deserts have hostile climatic conditions for most fauna.", "Çöller çoğu hayvan türü için elverişsiz iklim koşullarına sahiptir.", "B2", "Coğrafya"],
  ["indispensable", "sıfat", "vazgeçilmez, olmazsa olmaz", "so good or important that you could not manage without it", ["essential", "crucial", "vital"], "Clean drinking water is indispensable for all forms of life.", "Temiz içme suyu tüm yaşam formları için vazgeçilmezdir.", "B2", "Sağlık & YDS"],
  ["inevitable", "sıfat", "kaçınılmaz, çaresiz", "certain to happen and unable to be avoided or prevented", ["unavoidable", "inescapable", "certain"], "With population growth, urbanization became inevitable.", "Nüfus artışıyla birlikte kentleşme kaçınılmaz hale geldi.", "B2", "Sosyoloji & YDS"],
  ["inherent", "sıfat", "doğasında olan, içkin", "existing as a natural or basic part of something", ["intrinsic", "innate", "inborn"], "Risk is an inherent characteristic of venture capital investments.", "Risk, girişim sermayesi yatırımlarının doğasında olan bir özelliktir.", "C1", "Ekonomi"],
  ["intricate", "sıfat", "karmaşık, ince işlenmiş, çapraşık", "having a lot of small parts or details that fit together", ["complex", "elaborate", "detailed"], "The watchmaker assembled the intricate mechanical gears.", "Saat ustası karmaşık mekanik dişlileri birleştirdi.", "B2", "Zanaat & Bilim"],
  ["lucrative", "sıfat", "kazançlı, karlı, gelir getiren", "producing a lot of money or a large profit", ["profitable", "rewarding", "gainful"], "Renewable technology has evolved into a lucrative global industry.", "Yenilenebilir teknoloji kazançlı bir küresel sektöre dönüştü.", "B2", "Ekonomi & YDS"],
  ["negligible", "sıfat", "önemsiz, göz ardı edilebilir", "too slight or small in amount to be of importance", ["trivial", "minor", "insignificant"], "The side effects of the medication were clinically negligible.", "İlacın yan etkileri klinik olarak göz ardı edilebilir düzeydeydi.", "B2", "Tıp & YDS"],
  ["notable", "sıfat", "dikkate değer, göze çarpan, ünlü", "important and deserving attention, because of being very good", ["remarkable", "significant", "distinguished"], "There was a notable improvement in student test percentiles.", "Öğrenci sınav yüzdeliklerinde dikkate değer bir iyileşme vardı.", "B2", "Eğitim"],
  ["plausible", "sıfat", "makul, akla yatkın, inandırıcı", "seeming likely to be true, or able to be believed", ["credible", "believable", "reasonable"], "The detective offered a plausible explanation for the disappearance.", "Dedektif kaybolma vakası için akla yatkın bir açıklama sundu.", "B2", "Mantık & YDS"],
  ["profound", "sıfat", "derin, köklü, etkileyici", "felt or experienced very strongly or in an extreme way", ["deep", "intense", "far-reaching"], "The invention of printing had a profound effect on human knowledge.", "Matbaanın icadı insan bilgisi üzerinde derin bir etki yarattı.", "B2", "Tarih & YDS"],
  ["reluctant", "sıfat", "isteksiz, tereddütlü, gönülsüz", "not wanting to do something and therefore slow to do it", ["unwilling", "hesitant", "loath"], "Lenders were reluctant to grant loans without collateral.", "Borç verenler teminatsız kredi vermekte isteksizdi.", "B2", "Finans & YDS"],
  ["scarcity", "isim", "kıtlık, azlık, yetersizlik", "a situation in which something is not easy to find or get", ["shortage", "dearth", "lack"], "Water scarcity threatens millions of people across arid zones.", "Su kıtlığı kurak bölgelerdeki milyonlarca insanı tehdit ediyor.", "B2", "Çevre & YDS"]
];

academicModifiers.forEach(m => {
  addW(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], "Çok Yüksek (P0)");
});

// Write to kelime-07.json
fs.writeFileSync(path.join(dir, "kelime-07.json"), JSON.stringify(extra, null, 1));
console.log("Eklenen yeni kelime sayısı (kelime-07.json):", extra.length);

// Merge all
const updatedAll = currentAll.concat(extra);
fs.writeFileSync(allPath, JSON.stringify(updatedAll));
console.log("GÜNCELLENMİŞ TOPLAM KELİME HAVUZU:", updatedAll.length);

// Level distribution
const count = {};
updatedAll.forEach(w => {
  count[w.seviye] = (count[w.seviye] || 0) + 1;
});
console.log("Nihai Seviye Dağılımı:", count);

// Update dizin.json
const dizin = {
  toplam: updatedAll.length,
  parcalar: [
    "kelime-01.json",
    "kelime-02.json",
    "kelime-03.json",
    "kelime-04.json",
    "kelime-05.json",
    "kelime-06.json",
    "kelime-07.json",
    "kelime-hepsi.json"
  ],
  seviyeler: ["A1", "A2", "B1", "B2", "C1", "C2"],
  seviyeDagilimi: count
};
fs.writeFileSync(path.join(dir, "dizin.json"), JSON.stringify(dizin, null, 1));
console.log("dizin.json güncellendi!");
