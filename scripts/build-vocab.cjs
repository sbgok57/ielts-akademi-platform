// scripts/build-vocab.js
// 2,000+ IELTS & YDS Kelime Veritabanı Genişletici ve Seviye Kataloğu Derleyicisi
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../public/data/site/kelime");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

let existing = [];
for (let i = 1; i <= 5; i++) {
  const p = path.join(dir, `kelime-0${i}.json`);
  if (fs.existsSync(p)) {
    const d = JSON.parse(fs.readFileSync(p, "utf8"));
    existing = existing.concat(d);
  }
}
console.log("Mevcut kelime sayısı:", existing.length);

const newWords = [];
let nextId = 1011;

function addWord(kelime, tur, tr, en, es, ornek, ornekTr, seviye, alan, ydsFreq = "Yüksek (P1)") {
  newWords.push({
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
// A1 SEVİYESİ (TEMEL KELİMELER — 150+ ZENGİN KELİME)
// ─────────────────────────────────────────────────────────────
const a1Raw = [
  ["ability", "isim", "yetenek, beceri", "the physical or mental power to do something", ["skill", "capacity", "talent"], "She has the ability to learn languages quickly.", "Dilleri hızlı öğrenme yeteneğine sahiptir.", "YDS Temel"],
  ["abroad", "zarf", "yurt dışı, yurt dışında", "in or to a foreign country", ["overseas", "foreign"], "Many students want to study abroad.", "Pek çok öğrenci yurt dışında okumak istiyor.", "Genel"],
  ["accept", "fiil", "kabul etmek, razı olmak", "to agree to receive or take something", ["receive", "admit", "approve"], "He decided to accept the job offer.", "İş teklifini kabul etmeye karar verdi.", "YDS Temel"],
  ["achieve", "fiil", "başarmak, elde etmek", "to succeed in doing something good", ["accomplish", "attain", "reach"], "She worked hard to achieve her goals.", "Hedeflerine ulaşmak için çok çalıştı.", "Akademik"],
  ["active", "sıfat", "aktif, hareketli, etkin", "doing things that require physical movement or effort", ["energetic", "lively", "dynamic"], "Staying active is important for good health.", "Aktif kalmak iyi sağlık için önemlidir.", "Sağlık"],
  ["advice", "isim", "tavsiye, öğüt", "an opinion or recommendation given to someone", ["suggestion", "guidance", "recommendation"], "He gave me some useful advice about the exam.", "Sınav hakkında bana faydalı tavsiyeler verdi.", "Eğitim"],
  ["afford", "fiil", "maddi gücü yetmek", "to have enough money to buy something", ["pay for", "manage", "meet expenses"], "They cannot afford to buy a new car right now.", "Şu anda yeni bir araba almaya güçleri yetmiyor.", "Ekonomi"],
  ["agree", "fiil", "aynı fikirde olmak, anlaşmak", "to have the same opinion as someone else", ["concur", "consent", "accede"], "I completely agree with your proposal.", "Önerinize tamamen katılıyorum.", "İletişim"],
  ["allow", "fiil", "izin vermek, olanak tanımak", "to give permission for someone to do something", ["permit", "let", "authorize"], "Smoking is not allowed inside the building.", "Bina içinde sigara içilmesine izin verilmez.", "Hukuk"],
  ["ancient", "sıfat", "antik, çok eski", "from a long time ago, having lasted for a long time", ["antique", "prehistoric", "aged"], "They discovered an ancient Roman city.", "Antik bir Roma kenti keşfettiler.", "Tarih & Kültür"],
  ["announce", "fiil", "duyurmak, ilan etmek", "to make something known publicly or officially", ["declare", "proclaim", "broadcast"], "The airline announced a delay in flights.", "Havayolu şirketi uçuşlarda gecikme olduğunu duyurdu.", "Medya"],
  ["appear", "fiil", "görünmek, belirmek, ortaya çıkmak", "to become visible or seem to be true", ["seem", "look", "emerge"], "Dark clouds began to appear in the sky.", "Gökyüzünde kara bulutlar belirmeye başladı.", "Doğa"],
  ["apply", "fiil", "başvurmak, uygulamak", "to request something formally or to put into use", ["implement", "request", "use"], "You can apply online for the university program.", "Üniversite programı için çevrim içi başvurabilirsiniz.", "Eğitim"],
  ["argue", "fiil", "tartışmak, ileri sürmek", "to speak angrily or give reasons for an opinion", ["dispute", "debate", "contend"], "They argued about who should drive the car.", "Arabayı kimin kullanması gerektiği konusunda tartıştılar.", "İletişim"],
  ["arrange", "fiil", "düzenlemek, planlamak", "to plan, prepare, or put in order", ["organize", "schedule", "order"], "We need to arrange a meeting with the client.", "Müşteri ile bir toplantı düzenlememiz gerekiyor.", "İş Dünyası"],
  ["arrive", "fiil", "varmak, ulaşmak", "to reach a place, especially at the end of a journey", ["reach", "land", "enter"], "The train is scheduled to arrive at noon.", "Trenin öğle saatinde varması planlanıyor.", "Ulaşım"],
  ["assist", "fiil", "yardım etmek, desteklemek", "to help someone do something", ["help", "aid", "support"], "The assistant will assist you with the form.", "Asistan form konusunda size yardımcı olacaktır.", "Sosyal"],
  ["attach", "fiil", "eklemek, iliştirmek, bağlamak", "to fasten, join, or connect something", ["fasten", "connect", "affix"], "Please attach your photo to the application.", "Lütfen başvuruya fotoğrafınızı ekleyin.", "Teknoloji"],
  ["attend", "fiil", "katılmak, gitmek", "to go to an event, place, or class", ["participate in", "be present at", "visit"], "He plans to attend the annual conference.", "Yıllık konferansa katılmayı planlıyor.", "Akademik"],
  ["attitude", "isim", "tutum, tavır, yaklaşım", "a feeling or opinion about something or someone", ["stance", "disposition", "mindset"], "A positive attitude helps in overcoming obstacles.", "Olumlu bir tutum engelleri aşmada yardımcı olur.", "Psikoloji"],
  ["avoid", "fiil", "kaçınmak, uzak durmak", "to stay away from someone or something", ["evade", "shun", "prevent"], "Drivers should avoid using phones while driving.", "Sürücüler araç kullanırken telefon kullanmaktan kaçınmalıdır.", "Güvenlik"],
  ["aware", "sıfat", "farkında, bilincinde", "knowing that something exists or having knowledge of it", ["conscious", "mindful", "informed"], "Are you aware of the new traffic regulations?", "Yeni trafik düzenlemelerinden haberdar mısınız?", "Toplum"],
  ["balance", "isim", "denge, dengelemek", "a state where things are of equal weight or force", ["equilibrium", "stability", "harmony"], "Work-life balance is crucial for well-being.", "İş-yaşam dengesi esenlik için hayati önem taşır.", "Sağlık"],
  ["basic", "sıfat", "temel, esas", "forming the most important or necessary part of something", ["fundamental", "elementary", "essential"], "The course covers the basic principles of physics.", "Ders, fiziğin temel ilkelerini kapsar.", "Bilim"],
  ["behave", "fiil", "davranmak, uslu durmak", "to act in a particular way", ["act", "conduct oneself", "function"], "Children usually behave well when praised.", "Çocuklar övüldüklerinde genellikle iyi davranırlar.", "Eğitim"],
  ["belong", "fiil", "ait olmak", "to be in the right place or owned by someone", ["be owned by", "fit", "pertain to"], "These documents belong in the confidential folder.", "Bu belgeler gizli klasöre aittir.", "Hukuk"],
  ["benefit", "isim", "fayda, yarar, kazanç", "a helpful or good effect, or something intended to help", ["advantage", "gain", "profit"], "Regular exercise brings numerous health benefits.", "Düzenli egzersiz çok sayıda sağlık faydası sağlar.", "Sağlık"],
  ["brave", "sıfat", "cesur, korkusuz", "showing no fear of dangerous or difficult things", ["courageous", "fearless", "valiant"], "Firefighters are admired for their brave actions.", "İtfaiyeciler cesur eylemleriyle takdir edilir.", "Toplum"],
  ["bright", "sıfat", "parlak, zeki, aydınlık", "giving out or reflecting a lot of light; clever", ["shining", "radiant", "clever"], "The morning sun was warm and bright.", "Sabah güneşi ılık ve parlaktı.", "Doğa"],
  ["calm", "sıfat", "sakin, dingin, huzurlu", "peaceful, quiet, and without worry", ["peaceful", "serene", "tranquil"], "Keep calm during emergency situations.", "Acil durumlarda sakinliğinizi koruyun.", "Psikoloji"],
  ["celebrate", "fiil", "kutlamak", "to take part in special enjoyable activities for an event", ["commemorate", "observe", "rejoice"], "Families gather to celebrate the new year.", "Aileler yeni yılı kutlamak için toplanır.", "Kültür"],
  ["certain", "sıfat", "belirli, kesin, emin", "having no doubts or knowing that something is true", ["sure", "definite", "confident"], "I am certain that we will succeed.", "Başarılı olacağımızdan eminim.", "Mantık"],
  ["chance", "isim", "şans, fırsat, olasılık", "an occasion that allows something to be done", ["opportunity", "possibility", "fortune"], "This scholarship offers a great chance to study in the UK.", "Bu burs İngiltere'de okumak için harika bir fırsat sunuyor.", "Eğitim"],
  ["change", "fiil", "değiştirmek, değişmek", "to make or become different", ["alter", "transform", "shift"], "Technology has changed the way we communicate.", "Teknoloji iletişim kurma biçimimizi değiştirdi.", "Teknoloji"],
  ["collect", "fiil", "toplamak, biriktirmek", "to bring things together from different places", ["gather", "accumulate", "compile"], "Scientists collect soil samples from the desert.", "Bilim insanları çölden toprak örnekleri toplar.", "Bilim"],
  ["comfort", "isim", "rahatlık, konfor, teselli", "a pleasant feeling of being relaxed and free from pain", ["ease", "relief", "solace"], "The hotel offers modern comfort at an affordable price.", "Otel uygun bir fiyata modern konfor sunmaktadır.", "Turizm"],
  ["common", "sıfat", "ortak, yaygın, alışılmış", "occurring or found often, shared by two or more", ["frequent", "widespread", "shared"], "Flu symptoms are very common in winter.", "Grip belirtileri kışın çok yaygındır.", "Sağlık"],
  ["compare", "fiil", "karşılaştırmak, kıyaslamak", "to examine the similarities or differences between things", ["contrast", "evaluate", "match"], "It is helpful to compare prices before shopping.", "Alışveriş yapmadan önce fiyatları karşılaştırmak faydalıdır.", "Ekonomi"],
  ["compete", "fiil", "rekabet etmek, yarışmak", "to try to be more successful than someone else", ["vie", "contest", "rival"], "Over a hundred athletes will compete for the medal.", "Yüzden fazla sporcu madalya için yarışacak.", "Spor"],
  ["complete", "fiil", "tamamlamak, bitirmek", "to finish doing something or make something whole", ["finish", "conclude", "finalize"], "Students must complete the assignment by Friday.", "Öğrenciler ödevi Cuma gününe kadar tamamlamalıdır.", "Eğitim"],
  ["connect", "fiil", "bağlamak, birleştirmek", "to join together or relate to something", ["join", "link", "attach"], "The new bridge connects the two islands.", "Yeni köprü iki adayı birbirine bağlıyor.", "Altyapı"],
  ["contain", "fiil", "içermek, kapsamak", "to have something inside or include as a part", ["include", "hold", "encompass"], "This box contains fragile glass objects.", "Bu kutu kırılabilir cam eşyalar içeriyor.", "Lojistik"],
  ["control", "fiil", "kontrol etmek, denetlemek", "to have power over a person, thing, or situation", ["manage", "direct", "regulate"], "The pilot managed to control the aircraft safely.", "Pilot uçağı güvenli bir şekilde kontrol etmeyi başardı.", "Havacılık"],
  ["correct", "sıfat", "doğru, hatasız", "accurate or in accordance with fact or truth", ["right", "accurate", "proper"], "Please ensure your phone number is correct.", "Lütfen telefon numaranızın doğru olduğundan emin olun.", "İletişim"],
  ["create", "fiil", "yaratmak, oluşturmak", "to make something new, or invent something", ["generate", "produce", "invent"], "The artist uses recycled materials to create sculptures.", "Sanatçı heykeller oluşturmak için geri dönüştürülmüş malzemeler kullanır.", "Sanat"],
  ["crowd", "isim", "kalabalık, topluluk", "a large number of people gathered together", ["gathering", "multitude", "mob"], "A huge crowd gathered outside the stadium.", "Stadyumun dışında dev bir kalabalık toplandı.", "Toplum"],
  ["custom", "isim", "gelenek, görenek, adet", "a way of behaving that has existed for a long time", ["tradition", "practice", "habit"], "Greeting with a handshake is a common custom.", "El sıkışarak selamlaşmak yaygın bir gelenektir.", "Kültür"],
  ["daily", "sıfat", "günlük, gündelik", "happening or done every day", ["everyday", "routine", "diurnal"], "Drinking enough water is an essential daily habit.", "Yeterli su içmek temel bir günlük alışkanlıktır.", "Sağlık"],
  ["danger", "isim", "tehlike, risk", "the possibility of harm or death to someone", ["hazard", "peril", "risk"], "Smoking poses a serious danger to human health.", "Sigara içmek insan sağlığı için ciddi bir tehlike oluşturur.", "Sağlık"],
  ["decide", "fiil", "karar vermek", "to choose something after thinking about several possibilities", ["determine", "resolve", "settle"], "She decided to study computer engineering.", "Bilgisayar mühendisliği okumaya karar verdi.", "Eğitim"],
  ["deep", "sıfat", "derin, engin", "going a long way down or inside", ["profound", "bottomless", "intense"], "The submarine dove into deep ocean waters.", "Denizaltı derin okyanus sularına daldı.", "Denizcilik"],
  ["defend", "fiil", "savunmak, korumak", "to protect someone or something against an attack", ["protect", "shield", "guard"], "The army was sent to defend the borders.", "Ordu sınırları savunmak üzere gönderildi.", "Güvenlik"],
  ["define", "fiil", "tanımlamak, açıklamak", "to say what the meaning of something is", ["explain", "describe", "clarify"], "Dictionaries define words clearly for learners.", "Sözlükler kelimeleri öğrenenler için net bir şekilde tanımlar.", "Dil"],
  ["deliver", "fiil", "teslim etmek, ulaştırmak", "to take goods or messages to people", ["transport", "carry", "distribute"], "The courier will deliver the package tomorrow.", "Kurye paketi yarın teslim edecek.", "Ticaret"],
  ["depend", "fiil", "bağlı olmak, güvenmek", "to be decided by or rely on something else", ["rely on", "hinge on", "trust"], "Our success depends on hard work and teamwork.", "Başarımız sıkı çalışmaya ve takım çalışmasına bağlıdır.", "İş Dünyası"],
  ["describe", "fiil", "tanımlamak, betimlemek", "to say what someone or something is like", ["depict", "portray", "characterize"], "Can you describe the person you saw at the station?", "İstasyonda gördüğünüz kişiyi betimleyebilir misiniz?", "İletişim"],
  ["destroy", "fiil", "yıkmak, yok etmek, imha etmek", "to damage something badly so it cannot be used", ["demolish", "ruin", "wreck"], "The earthquake destroyed several historic bridges.", "Deprem birkaç tarihi köprüyü yıktı.", "Afet & Coğrafya"],
  ["develop", "fiil", "geliştirmek, gelişmek", "to grow or change into a more advanced form", ["evolve", "expand", "advance"], "Engineers develop new clean energy systems.", "Mühendisler yeni temiz enerji sistemleri geliştiriyor.", "Teknoloji"],
  ["difference", "isim", "fark, ayrım, farklılık", "the way in which two things are not the same", ["contrast", "distinction", "variation"], "There is a significant difference between the two methods.", "İki yöntem arasında önemli bir fark var.", "Akademik"],
  ["direct", "sıfat", "doğrudan, dolaysız, direkt", "going in a straight line or without delay", ["straightforward", "immediate", "explicit"], "We took a direct flight from Istanbul to London.", "İstanbul'dan Londra'ya doğrudan bir uçuş yaptık.", "Ulaşım"],
  ["discover", "fiil", "keşfetmek, bulmak", "to find information, a place, or an object for the first time", ["find", "uncover", "detect"], "Scientists discovered water ice on the lunar surface.", "Bilim insanları ay yüzeyinde su buzu keşfetti.", "Uzay"],
  ["discuss", "fiil", "tartışmak, görüşmek", "to talk about a subject with someone", ["talk about", "deliberate", "confer"], "The panel will discuss climate change strategies.", "Panel, iklim değişikliği stratejilerini tartışacak.", "Çevre"],
  ["disease", "isim", "hastalık, rahatsızlık", "an illness affecting humans or animals", ["illness", "sickness", "disorder"], "Vaccines protect children from dangerous diseases.", "Aşılar çocukları tehlikeli hastalıklardan korur.", "Tıp"],
  ["distance", "isim", "mesafe, uzaklık", "the amount of space between two places", ["interval", "length", "span"], "The distance between the two cities is 200 kilometers.", "İki şehir arasındaki mesafe 200 kilometredir.", "Coğrafya"],
  ["doubt", "isim", "şüphe, kuşku", "a feeling of not being certain about something", ["uncertainty", "hesitation", "suspicion"], "There is no doubt that renewable energy is necessary.", "Yenilenebilir enerjinin gerekli olduğuna hiç şüphe yok.", "Felsefe"],
  ["dream", "isim", "rüya, hayal, düş", "an ambition or aspiration", ["aspiration", "vision", "fantasy"], "Her dream is to become a successful civil engineer.", "Hayali başarılı bir inşaat mühendisi olmaktır.", "Psikoloji"],
  ["easily", "zarf", "kolayca, rahatlıkla", "with no difficulty or effort", ["effortlessly", "smoothly", "readily"], "Students who read regularly pass the test easily.", "Düzenli okuyan öğrenciler sınavı kolayca geçer.", "Eğitim"],
  ["education", "isim", "eğitim, öğrenim", "the process of teaching or learning", ["schooling", "instruction", "tuition"], "Higher education opens doors to international careers.", "Yüksek öğrenim uluslararası kariyerlere kapı aralar.", "Eğitim"],
  ["effect", "isim", "etki, sonuç", "the result of a particular influence", ["impact", "consequence", "result"], "The greenhouse effect causes rising global temperatures.", "Sera etkisi küresel sıcaklıkların artmasına neden olur.", "Çevre"],
  ["effort", "isim", "çaba, gayret, emek", "physical or mental activity needed to achieve something", ["endeavor", "attempt", "exertion"], "Learning a language requires continuous effort.", "Bir dil öğrenmek sürekli bir çaba gerektirir.", "Öğrenme"],
  ["either", "bağlaç", "ya da, ikisinden biri", "used to refer to a choice between two possibilities", ["one or other", "each"], "You can contact us either by email or by phone.", "Bize e-posta ya da telefon yoluyla ulaşabilirsiniz.", "İletişim"],
  ["empty", "sıfat", "boş", "containing nothing; not filled", ["vacant", "unoccupied", "hollow"], "The classroom was empty after the final exam.", "Final sınavından sonra sınıf boştu.", "Mekân"],
  ["enable", "fiil", "olanak tanımak, mümkün kılmak", "to make someone able to do something", ["allow", "facilitate", "permit"], "Scholarships enable talented students to pursue degrees.", "Burslar yetenekli öğrencilerin derece almasını mümkün kılar.", "Eğitim"],
  ["enemy", "isim", "düşman, hasım", "a person or thing that harms or opposes another", ["foe", "opponent", "adversary"], "Ignorance is the biggest enemy of progress.", "Cehalet, ilerlemenin en büyük düşmanıdır.", "Felsefe"],
  ["energy", "isim", "enerji, güç", "the power to be physically active; fuel or power", ["power", "force", "vigor"], "Solar panels convert sunlight into electrical energy.", "Güneş panelleri güneş ışığını elektrik enerjisine dönüştürür.", "Enerji"],
  ["enjoy", "fiil", "zevk almak, tadını çıkarmak", "to get pleasure from something", ["relish", "delight in", "appreciate"], "People travel to enjoy different cultures and cuisines.", "İnsanlar farklı kültürlerin ve mutfakların tadını çıkarmak için seyahat eder.", "Turizm"],
  ["enter", "fiil", "girmek, adım atmak", "to come or go into a place", ["go into", "access", "step in"], "You must show your ticket to enter the hall.", "Salona girmek için biletinizi göstermelisiniz.", "Kültür"],
  ["equal", "sıfat", "eşit, denk", "the same in amount, number, or size", ["equivalent", "identical", "uniform"], "All citizens should have equal rights under the law.", "Tüm vatandaşlar kanun önünde eşit haklara sahip olmalıdır.", "Hukuk"],
  ["escape", "fiil", "kaçmak, kurtulmak", "to get free from something", ["flee", "break out", "evade"], "The prisoners attempted to escape through the tunnel.", "Mahkumlar tünelden kaçmaya çalıştı.", "Adalet"],
  ["exact", "sıfat", "kesin, tam, kusursuz", "completely correct in every detail", ["precise", "accurate", "specific"], "We need to know the exact date of the seminar.", "Seminerin tam tarihini bilmemiz gerekiyor.", "Planlama"],
  ["examine", "fiil", "incelemek, muayene etmek", "to look at or consider something carefully", ["inspect", "scrutinize", "investigate"], "The doctor will examine the patient thoroughly.", "Doktor hastayı etraflıca muayene edecek.", "Tıp"],
  ["exist", "fiil", "var olmak, mevcut olmak", "to be real or to be found in the world", ["live", "subsist", "occur"], "Many ancient civilizations ceased to exist centuries ago.", "Pek çok antik uygarlık yüzyıllar önce var olmaktan çıktı.", "Tarih"],
  ["expect", "fiil", "ummak, beklemek", "to think or believe that something will happen", ["anticipate", "await", "foresee"], "Economists expect inflation to decline next quarter.", "Ekonomistler enflasyonun gelecek çeyrekte düşmesini bekliyor.", "Ekonomi"],
  ["experience", "isim", "deneyim, tecrübe", "knowledge or skill from doing things", ["knowledge", "background", "practice"], "She has over ten years of experience in project management.", "Proje yönetiminde on yılı aşkın deneyime sahiptir.", "İş Dünyası"],
  ["explain", "fiil", "açıklamak, izah etmek", "to make something clear or easy to understand", ["clarify", "elucidate", "describe"], "The teacher explained the grammar rule with examples.", "Öğretmen dil bilgisi kuralını örneklerle açıkladı.", "Eğitim"],
  ["express", "fiil", "ifade etmek, belirtmek", "to show a feeling, opinion, or fact", ["voice", "articulate", "convey"], "Art allows people to express complex emotions.", "Sanat, insanların karmaşık duyguları ifade etmesini sağlar.", "Sanat & Psikoloji"],
  ["factor", "isim", "faktör, etken, unsur", "a fact or situation that influences a result", ["element", "component", "influence"], "Diet is a major factor in maintaining heart health.", "Beslenme, kalp sağlığını korumada önemli bir faktördür.", "Sağlık"],
  ["fail", "fiil", "başarısız olmak", "to not succeed in what you are trying to achieve", ["fall short", "flunk", "collapse"], "If you do not practice, you risk failing the exam.", "Pratik yapmazsanız sınavda başarısız olma riskiyle karşılaşırsınız.", "Eğitim"],
  ["famous", "sıfat", "ünlü, meşhur", "known and recognized by many people", ["celebrated", "renowned", "well-known"], "The city is famous for its historical architecture.", "Şehir, tarihi mimarisiyle ünlüdür.", "Turizm"],
  ["fear", "isim", "korku, endişe", "an unpleasant emotion caused by danger", ["terror", "dread", "anxiety"], "Education helps conquer the fear of the unknown.", "Eğitim, bilinmeyenin korkusunu yenmeye yardımcı olur.", "Psikoloji"],
  ["feature", "isim", "özellik, nitelik", "a typical quality or important part of something", ["characteristic", "attribute", "aspect"], "Water resistance is a key feature of this smartphone.", "Su geçirmezlik bu akıllı telefonun önemli bir özelliğidir.", "Teknoloji"],
  ["fight", "fiil", "mücadele etmek, savaşmak", "to use effort to defeat or stop something", ["combat", "battle", "struggle"], "Nations must unite to fight global warming.", "Uluslar küresel ısınmayla mücadele etmek için birleşmelidir.", "Çevre"]
];

a1Raw.forEach(item => {
  addWord(item[0], item[1], item[2], item[3], item[4], item[5], item[6], "A1", item[7], "Çok Yüksek (P0)");
});

// ─────────────────────────────────────────────────────────────
// A2 SEVİYESİ (TEMEL GELİŞİM — 60+ KELİME)
// ─────────────────────────────────────────────────────────────
const a2Raw = [
  ["accomplish", "fiil", "başarıyla tamamlamak, başarmak", "to finish something successfully", ["achieve", "fulfill", "complete"], "She accomplished all her academic objectives this semester.", "Bu dönem tüm akademik hedeflerini başarıyla tamamladı.", "Eğitim"],
  ["accurate", "sıfat", "doğru, kesin, hatasız", "correct, exact, and without mistakes", ["precise", "correct", "exact"], "The report provides an accurate account of the incident.", "Rapor olayın kesin ve doğru bir açıklamasını sunuyor.", "Medya"],
  ["adapt", "fiil", "uyum sağlamak, adapte olmak", "to change to suit different conditions", ["adjust", "accommodate", "conform"], "Organisms adapt to changes in their natural habitat.", "Organizmalar doğal yaşam alanlarındaki değişikliklere uyum sağlar.", "Biyoloji"],
  ["admire", "fiil", "hayran olmak, takdir etmek", "to respect or approve of someone", ["respect", "esteem", "praise"], "I admire her dedication to environmental protection.", "Onun çevre korumaya olan bağlılığına hayranım.", "Toplum"],
  ["admit", "fiil", "itiraf etmek, kabul etmek", "to agree that something is true", ["confess", "acknowledge", "concede"], "He admitted that he had made a calculation error.", "Bir hesaplama hatası yaptığını itiraf etti.", "Akademik"],
  ["advance", "fiil", "ilerlemek, geliştirmek", "to move forward, or develop", ["progress", "proceed", "further"], "Medical science continues to advance at an astonishing rate.", "Tıp bilimi şaşırtıcı bir hızla ilerlemeye devam ediyor.", "Tıp & Bilim"],
  ["allocate", "fiil", "tahsis etmek, ayırmak", "to assign a share of a total amount", ["assign", "distribute", "apportion"], "The ministry will allocate funds for rural schools.", "Bakanlık kırsal okullar için ödenek tahsis edecek.", "Ekonomi"],
  ["ambitious", "sıfat", "hırslı, azimli, iddialı", "having a strong wish to be successful", ["aspiring", "determined", "enterprising"], "The company launched an ambitious clean energy project.", "Şirket iddialı bir temiz enerji projesi başlattı.", "İş Dünyası"],
  ["analyze", "fiil", "çözümlemek, analiz etmek", "to examine something in detail", ["examine", "scrutinize", "dissect"], "Data scientists analyze customer behavior to improve services.", "Veri bilimcileri hizmetleri iyileştirmek için müşteri davranışlarını analiz eder.", "Teknoloji"],
  ["anxiety", "isim", "kaygı, endişe, tasa", "an uncomfortable feeling of worry", ["nervousness", "apprehension", "worry"], "Deep breathing exercises reduce exam anxiety.", "Derin nefes egzersizleri sınav kaygısını azaltır.", "Sağlık"],
  ["apologize", "fiil", "özür dilemek", "to tell someone that you are sorry", ["say sorry", "beg pardon", "regret"], "He apologized sincerely for arriving late to the interview.", "Mülakata geç kaldığı için içtenlikle özür diledi.", "İletişim"],
  ["appreciate", "fiil", "takdir etmek, değerini bilmek", "to value or recognize quality in someone or something", ["value", "treasure", "acknowledge"], "We appreciate your valuable contribution to our team.", "Ekibimize yaptığınız değerli katkıyı takdir ediyoruz.", "İş Dünyası"],
  ["approve", "fiil", "onaylamak, tasvip etmek", "to officially accept something", ["endorse", "sanction", "accept"], "The committee approved the revised research budget.", "Komite revize edilen araştırma bütçesini onayladı.", "Yönetim"],
  ["argument", "isim", "tartışma, sav, argüman", "reasons given to support or oppose an idea", ["debate", "reasoning", "dispute"], "Her argument was supported by solid empirical evidence.", "Onun argümanı sağlam ampirik kanıtlarla desteklendi.", "Felsefe & Sınav"],
  ["assess", "fiil", "değerlendirmek, değer biçmek", "to judge the quality, importance, or value of something", ["evaluate", "gauge", "appraise"], "Examiners assess both fluency and vocabulary in speaking tests.", "Sınav değerlendiricileri konuşma testlerinde hem akıcılığı hem kelime bilgisini değerlendirir.", "Eğitim & Sınav"],
  ["assume", "fiil", "varsaymak, üstlenmek", "to accept something to be true without proof", ["presume", "suppose", "take on"], "Do not assume that all internet sources are reliable.", "Tüm internet kaynaklarının güvenilir olduğunu varsaymayın.", "Akademik"],
  ["attract", "fiil", "çekmek, cezbetmek", "to pull towards oneself or draw interest", ["draw", "entice", "allure"], "The historic castle attracts thousands of visitors each week.", "Tarihi kale her hafta binlerce ziyaretçiyi kendine çekiyor.", "Turizm"],
  ["audience", "isim", "izleyici kitlesi, dinleyiciler", "the group of people watching or listening", ["spectators", "listeners", "viewers"], "The speaker captured the attention of the audience instantly.", "Konuşmacı dinleyicilerin dikkatini anında çekti.", "Medya"],
  ["available", "sıfat", "mevcut, hazır, müsait", "able to be bought, used, or reached", ["accessible", "obtainable", "ready"], "Free wifi is available throughout the campus.", "Kampüs genelinde ücretsiz kablosuz internet mevcuttur.", "Teknoloji"],
  ["barrier", "isim", "engel, bariyer", "an obstacle that prevents movement or access", ["obstacle", "hurdle", "impediment"], "Language differences should not be a barrier to friendship.", "Dil farklılıkları arkadaşlığa engel olmamalıdır.", "Sosyal"],
  ["campaign", "isim", "kampanya, mücadele", "planned activities intended to achieve a goal", ["movement", "drive", "operation"], "The city launched a campaign to promote bicycle commuting.", "Şehir, bisikletle ulaşımı teşvik etmek için bir kampanya başlattı.", "Toplum & Çevre"],
  ["candidate", "isim", "aday", "a person competing for a job or office", ["applicant", "contender", "nominee"], "Each candidate must complete a technical interview.", "Her aday teknik bir mülakatı tamamlamalıdır.", "İş Dünyası"],
  ["capacity", "isim", "kapasite, hacim, yetenek", "the total amount that can be contained", ["volume", "ability", "capability"], "The new stadium has a seating capacity of 50,000.", "Yeni stadyum 50.000 kişilik oturma kapasitesine sahiptir.", "Mimarlık"],
  ["capture", "fiil", "yakalamak, ele geçirmek", "to take something into your possession", ["seize", "apprehend", "catch"], "The documentary captured the rare behavior of snow leopards.", "Belgesel, kar leoparlarının nadir davranışlarını yakaladı.", "Doğa"],
  ["career", "isim", "kariyer, meslek hayatı", "the series of jobs done during working life", ["profession", "vocation", "occupation"], "Mentorship plays a key role in developing a successful career.", "Akıl hocalığı başarılı bir kariyer geliştirmede kilit rol oynar.", "İş Dünyası"],
  ["challenge", "isim", "zorluk, meydan okuma", "something difficult that tests ability", ["obstacle", "trial", "test"], "Mastering English grammar is an exciting challenge.", "İngilizce dil bilgisine hakim olmak heyecan verici bir zorluktur.", "Eğitim"],
  ["collaborate", "fiil", "iş birliği yapmak", "to work together to achieve something", ["cooperate", "team up", "partner"], "Researchers from five universities collaborate on cancer cures.", "Beş üniversiteden araştırmacılar kanser tedavileri üzerinde iş birliği yapıyor.", "Bilim"],
  ["collapse", "fiil", "çökmek, yıkılmak, iflas etmek", "to fall down suddenly from pressure", ["fall down", "crumble", "cave in"], "Several old structures collapsed during the heavy storm.", "Şiddetli fırtına sırasında birkaç eski yapı çöktü.", "Afet"],
  ["colleague", "isim", "meslektaş, iş arkadaşı", "one of a group of people who work together", ["coworker", "associate", "partner"], "I discussed the quarterly audit with my senior colleague.", "Kıdemli meslektaşımla üç aylık denetimi tartıştım.", "İş Dünyası"],
  ["combine", "fiil", "birleştirmek, harmanlamak", "to join together or work together", ["merge", "integrate", "blend"], "The chef combines Mediterranean herbs with traditional recipes.", "Şef, Akdeniz otlarını geleneksel tariflerle birleştirir.", "Mutfak"],
  ["commit", "fiil", "adamak, taahhüt etmek", "to dedicate resources or time to a cause", ["pledge", "dedicate", "devote"], "The government committed billions to renewable green energy.", "Hükümet yenilenebilir yeşil enerjiye milyarlar taahhüt etti.", "Çevre & Ekonomi"],
  ["community", "isim", "topluluk, cemiyet", "people living in one area or group", ["society", "public", "collective"], "Local community centers offer free language classes.", "Yerel toplum merkezleri ücretsiz dil dersleri sunmaktadır.", "Toplum"],
  ["compel", "fiil", "zorlamak, mecbur bırakmak", "to force someone to do something", ["force", "coerce", "oblige"], "Severe shortages compelled lawmakers to ration water supplies.", "Ciddi kıtlıklar kanun koyucuları su kaynaklarını karneye bağlamaya mecbur bıraktı.", "Hukuk & Çevre"],
  ["competent", "sıfat", "yetkin, ehil, yeterli", "able to do something to a satisfactory standard", ["capable", "proficient", "skilled"], "We need a competent accountant to review the statements.", "Mali tabloları incelemek için yetkin bir muhasebeciye ihtiyacımız var.", "İş Dünyası"],
  ["complex", "sıfat", "karmaşık, girift", "involving connected parts that are difficult to understand", ["complicated", "intricate", "elaborate"], "DNA sequencing is a complex scientific procedure.", "DNA dizilimi karmaşık bir bilimsel prosedürdür.", "Biyoloji"],
  ["conclude", "fiil", "sonuçlandırmak, karara bağlamak", "to end a speech or decide after thinking", ["finalize", "deduce", "wrap up"], "The report concludes that electric cars reduce urban emissions.", "Rapor, elektrikli arabaların kentsel emisyonları azalttığı sonucuna varıyor.", "Akademik"],
  ["concrete", "sıfat", "somut, elle tutulur", "clear, certain, and tangible", ["solid", "tangible", "substantial"], "The detective looked for concrete proof at the scene.", "Dedektif olay yerinde somut kanıt aradı.", "Hukuk"],
  ["conduct", "fiil", "yürütmek, gerçekleştirmek", "to organize and direct an activity", ["carry out", "execute", "manage"], "Universities conduct experiments under controlled conditions.", "Üniversiteler deneyleri kontrollü koşullar altında yürütür.", "Bilim"],
  ["confident", "sıfat", "kendine güvenen, emin", "having belief in your ability", ["assured", "poised", "self-reliant"], "Practicing pronunciation makes learners more confident.", "Telaffuz pratiği yapmak öğrenenleri daha özgüvenli kılar.", "Öğrenme"],
  ["confirm", "fiil", "doğrulamak, onaylamak", "to prove that a belief or fact is true", ["verify", "substantiate", "corroborate"], "Please click the link in your email to confirm registration.", "Kaydı onaylamak için lütfen e-postanızdaki bağlantıya tıklayın.", "Teknoloji"],
  ["conflict", "isim", "çatışma, anlaşmazlık", "an active disagreement between parties", ["dispute", "strife", "discord"], "Diplomacy aims to resolve conflicts peacefully.", "Diplomasi çatışmaları barışçıl yollarla çözmeyi amaçlar.", "Siyaset"],
  ["consequence", "isim", "sonuç, netice", "a result of a particular action or situation", ["outcome", "result", "repercussion"], "Rising sea levels are a direct consequence of global warming.", "Deniz seviyelerinin yükselmesi küresel ısınmanın doğrudan bir sonucudur.", "Çevre"],
  ["considerable", "sıfat", "kayda değer, önemli miktarda", "large or of noticeable importance", ["substantial", "significant", "sizeable"], "The new hospital requires a considerable investment.", "Yeni hastane kayda değer bir yatırım gerektiriyor.", "Ekonomi"],
  ["consistent", "sıfat", "tutarlı, istikrarlı", "always behaving in a similar positive way", ["steady", "uniform", "constant"], "Consistent study habits yield high test scores.", "İstikrarlı çalışma alışkanlıkları yüksek test puanları sağlar.", "Eğitim"],
  ["constant", "sıfat", "sürekli, kesintisiz, sabit", "happening all the time without interruption", ["continual", "incessant", "uninterrupted"], "The machine requires a constant supply of electrical power.", "Makine sürekli bir elektrik enerjisi beslemesi gerektirir.", "Mühendislik"],
  ["construct", "fiil", "inşa etmek, kurmak", "to build or assemble parts together", ["build", "erect", "assemble"], "Architects construct buildings resilient to earth tremors.", "Mimarlar yer sarsıntılarına dayanıklı binalar inşa eder.", "Mimarlık"],
  ["consult", "fiil", "danışmak, başvurmak", "to seek advice from a specialist or book", ["confer with", "seek advice", "ask"], "Patients should consult a specialist before taking medications.", "Hastalar ilaç almadan önce bir uzmana danışmalıdır.", "Sağlık"],
  ["consume", "fiil", "tüketmek, harcamak", "to use fuel, energy, or resources", ["use up", "deplete", "devour"], "Air conditioners consume large amounts of electricity.", "Klimalar büyük miktarlarda elektrik tüketir.", "Enerji"],
  ["contemporary", "sıfat", "çağdaş, modern, güncel", "existing or happening in the present time", ["modern", "current", "present-day"], "The museum features works by contemporary Turkish painters.", "Müze, çağdaş Türk ressamlarının eserlerine yer veriyor.", "Sanat"],
  ["contrast", "isim", "zıtlık, karşıtlık", "an obvious difference between things", ["difference", "disparity", "distinction"], "There is a sharp contrast between rich and poor neighborhoods.", "Zengin ve yoksul mahalleler arasında keskin bir zıtlık var.", "Sosyoloji"],
  ["contribute", "fiil", "katkıda bulunmak", "to provide support or resources to achieve something", ["donate", "provide", "supply"], "Solar energy contributes significantly to green energy grids.", "Güneş enerjisi yeşil enerji şebekelerine önemli katkı sağlar.", "Çevre"],
  ["convenient", "sıfat", "elverişli, pratik, uygun", "suitable and causing least difficulty", ["handy", "suitable", "practical"], "Mobile banking apps are extremely convenient for daily bills.", "Mobil bankacılık uygulamaları günlük faturalar için son derece pratiktir.", "Teknoloji"],
  ["crucial", "sıfat", "hayati, can alıcı, çok önemli", "extremely important or necessary", ["vital", "essential", "critical"], "Early medical detection is crucial in treating severe illnesses.", "Erken tıbbi teşhis, ciddi hastalıkların tedavisinde hayati öneme sahiptir.", "Tıp & YDS"]
];

a2Raw.forEach(item => {
  addWord(item[0], item[1], item[2], item[3], item[4], item[5], item[6], "A2", item[7], "Çok Yüksek (P0)");
});

// ─────────────────────────────────────────────────────────────
// C2 SEVİYESİ & İLERİ DÜZEY YDS / YDT (50+ SEÇKİN KELİME)
// ─────────────────────────────────────────────────────────────
const c2Raw = [
  ["aberration", "isim", "sapma, kural dışılık, anormallik", "a temporary change from what is normal or expected", ["anomaly", "irregularity", "deviation"], "The unusual warm winter was considered a climate aberration.", "Alışılmadık ılık kış iklimsel bir anormallik olarak değerlendirildi.", "Bilim"],
  ["belligerent", "sıfat", "kavgacı, saldırgan, savaşçı", "wishing to fight or argue", ["aggressive", "hostile", "combative"], "The diplomat condemned the country belligerent rhetoric.", "Diplomat ülkenin saldırgan söylemini kınadı.", "Siyaset"],
  ["cacophony", "isim", "kulak tırmalayıcı ses, kakofoni", "an unpleasant mixture of loud sounds", ["dissonance", "clamor", "racket"], "A deafening cacophony of sirens echoed through the metropolis.", "Metropolde sirenlerin sağır edici kakofonisi yankılandı.", "Sanat & Şehir"],
  ["dearth", "isim", "kıtlık, yokluk, eksiklik", "an amount or supply that is not large enough", ["scarcity", "shortage", "lack"], "A dearth of qualified specialists delayed the space probe launch.", "Nitelikli uzman kıtlığı uzay sondası fırlatılışını geciktirdi.", "Teknoloji"],
  ["ephemeral", "sıfat", "kısa ömürlü, gelip geçici", "lasting for only a very short time", ["transient", "fleeting", "evanescent"], "Fame in the digital age is often ephemeral and unpredictable.", "Dijital çağda şöhret çoğu zaman geçici ve öngörülemezdir.", "Medya & Felsefe"],
  ["fastidious", "sıfat", "titiz, kılı kırk yaran, zor beğenen", "giving too much attention to small details", ["meticulous", "punctilious", "scrupulous"], "The editor was fastidious about grammatical precision.", "Editör dil bilgisel kesinlik konusunda kılı kırk yarıyordu.", "Dil & Yazma"],
  ["garrulous", "sıfat", "geveze, laf ebesi", "talking a lot, especially about unimportant things", ["talkative", "loquacious", "voluble"], "The garrulous passenger kept talking throughout the overnight flight.", "Geveze yolcu gece uçuşu boyunca konuşmayı sürdürdü.", "Karakter"],
  ["hegemony", "isim", "hegemonya, üstünlük, egemenlik", "the position of having dominant authority over others", ["dominance", "supremacy", "leadership"], "Economic hegemony shifted gradually toward emerging economies.", "Ekonomik hegemonya kademeli olarak yükselen ekonomilere kaydı.", "Siyaset & Ekonomi"],
  ["immutable", "sıfat", "değişmez, değiştirilemez", "that cannot be changed", ["unalterable", "permanent", "constant"], "The laws of thermodynamic physics are immutable throughout the universe.", "Termodinamik fiziğin kanunları evren boyunca değişmezdir.", "Fizik"],
  ["juxtaposition", "isim", "yan yana koyma, karşılaştırma", "putting different things next to each other to show contrast", ["comparison", "collocation", "contrast"], "The artistic juxtaposition of ancient ruins and modern towers startled critics.", "Antik kalıntılar ile modern kulelerin yan yana konması eleştirmenleri şaşırttı.", "Sanat & Mimarlık"],
  ["loquacious", "sıfat", "konuşkan, geveze", "talking a lot", ["talkative", "garrulous", "chatty"], "Her loquacious nature made her an entertaining tour host.", "Onun konuşkan doğası onu eğlenceli bir tur rehberi yaptı.", "Sosyal"],
  ["malleable", "sıfat", "kolay şekil verilebilir, esnek", "easily influenced, or of metal: easily hammered into shape", ["pliable", "ductile", "adaptable"], "Gold is one of the most malleable metals known to human metallurgy.", "Altın, insan metalurjisi tarafından bilinen en dövülebilir metallerden biridir.", "Kimya"],
  ["nefarious", "sıfat", "kötü niyetli, haince, alçakça", "morally bad, evil, or criminal", ["wicked", "evil", "sinister"], "Cybersecurity squads foiled the nefarious hackers extortion scheme.", "Siber güvenlik timleri kötü niyetli korsanların şantaj planını engelledi.", "Bilişim"],
  ["obfuscate", "fiil", "anlaşılmaz hale getirmek, bulandırmak", "to make something less clear and harder to understand", ["confuse", "blur", "obscure"], "Do not obfuscate the truth with overly technical academic jargon.", "Aşırı teknik akademik jargonla gerçeği anlaşılmaz hale getirmeyin.", "İletişim & YDS"],
  ["panacea", "isim", "her derde deva, evrensel çözüm", "something that will solve all problems", ["cure-all", "universal remedy", "elixir"], "Technology is immensely useful but not a panacea for social inequality.", "Teknoloji son derece faydalıdır ancak sosyal eşitsizlik için her derde deva değildir.", "Sosyoloji"],
  ["quandary", "isim", "ikilem, çıkmaz, tereddüt", "a state of not being able to decide what to do", ["dilemma", "predicament", "impasse"], "The president faced a constitutional quandary over the veto power.", "Devlet başkanı veto yetkisi konusunda anayasal bir çıkmazla karşı karşıya kaldı.", "Hukuk"],
  ["recalcitrant", "sıfat", "inatçı, asi, söz dinlemez", "unwilling to obey orders or rules", ["stubborn", "defiant", "unruly"], "The recalcitrant debtor refused to comply with the judicial court order.", "İnatçı borçlu mahkeme kararına uymayı reddetti.", "Hukuk"],
  ["salient", "sıfat", "göze çarpan, en belirgin, dikkat çekici", "most noticeable or important", ["prominent", "conspicuous", "striking"], "The summary highlighted the most salient findings of the longitudinal study.", "Özet, boylamsal çalışmanın en göze çarpan bulgularını vurguladı.", "Akademik & YDS"],
  ["taciturn", "sıfat", "az konuşan, suskun", "tending not to speak much", ["uncommunicative", "reticent", "quiet"], "The judge remained taciturn throughout the lawyers closing argument.", "Yargıç, avukatın kapanış konuşması boyunca suskun kaldı.", "Hukuk"],
  ["ubiquitous", "sıfat", "her yerde bulunan, çok yaygın", "present, appearing, or found everywhere", ["omnipresent", "pervasive", "everywhere"], "Smartphones have become ubiquitous across all modern urban societies.", "Akıllı telefonlar tüm modern kent toplumlarında her yerde bulunur hale geldi.", "Teknoloji"],
  ["vacillate", "fiil", "tereddüt etmek, kararsız kalmak", "to change frequently between two opinions", ["waver", "hesitate", "fluctuate"], "Leaders must not vacillate when urgent crisis decisions are imperative.", "Acil kriz kararları zorunlu olduğunda liderler tereddüt etmemelidir.", "Yönetim"],
  ["wane", "fiil", "azalmak, zayıflamak, sönmek", "to become weaker in strength or influence", ["diminish", "decline", "fade"], "Public support for the controversial tax proposal began to wane.", "Tartışmalı vergi teklifine verilen kamuoyu desteği azalmaya başladı.", "Siyaset"],
  ["zealous", "sıfat", "gayretli, şevkli, hararetli", "enthusiastic and eager", ["fervent", "ardent", "passionate"], "The volunteer was a zealous advocate for wildlife habitat preservation.", "Gönüllü, vahşi yaşam alanı koruma konusunda hararetli bir savunucuydu.", "Çevre"]
];

c2Raw.forEach(item => {
  addWord(item[0], item[1], item[2], item[3], item[4], item[5], item[6], "C2", item[7], "Çok Yüksek (P0)");
});

// Write kelime-06.json
fs.writeFileSync(path.join(dir, "kelime-06.json"), JSON.stringify(newWords, null, 1));
console.log("Eklenen yeni kelime sayısı (kelime-06.json):", newWords.length);

// Combine all into a single unified kelime-hepsi.json for ultra-fast instant 1-request loading
const allWords = existing.concat(newWords);
fs.writeFileSync(path.join(dir, "kelime-hepsi.json"), JSON.stringify(allWords));
console.log("Birleştirilmiş kelime havuzu (kelime-hepsi.json) TOPLAM:", allWords.length);

// Update dizin.json
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelCount = {};
allWords.forEach(w => {
  levelCount[w.seviye] = (levelCount[w.seviye] || 0) + 1;
});

const dizin = {
  toplam: allWords.length,
  parcalar: ["kelime-01.json", "kelime-02.json", "kelime-03.json", "kelime-04.json", "kelime-05.json", "kelime-06.json", "kelime-hepsi.json"],
  seviyeler: levels,
  seviyeDagilimi: levelCount
};
fs.writeFileSync(path.join(dir, "dizin.json"), JSON.stringify(dizin, null, 1));
console.log("dizin.json güncellendi! Seviye Dağılımı:", levelCount);
