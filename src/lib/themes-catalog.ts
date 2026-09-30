// src/lib/themes-catalog.ts
// 240+ Canlı ve Renkli Kişiselleştirilmiş Öğrenci Temaları
// Her öğrencinin kendi çalışma sürecini renklendirmesi için 8 ana kategori, 240 özel palet

export interface StudentTheme {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  previewColors: string[];
}

export const THEME_CATEGORIES = [
  "Tümü",
  "Gökkuşağı & Spektrum",
  "Siberpunk & Neon Gece",
  "Doğa & Okyanus",
  "Günbatımı & Gökyüzü",
  "Değerli Mücevherler",
  "Pastel & Şekerleme",
  "Kozmik Galaksi & Uzay",
  "Akademik & Dünya Prestij",
] as const;

export const THEMES_CATALOG: StudentTheme[] = [
  {
    "id": "rainbow-1",
    "name": "Prizma Gökkuşağı",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF334B",
    "secondary": "#FF7A00",
    "accent": "#10B981",
    "gradient": "linear-gradient(135deg, #FF334B 0%, #FF7A00 50%, #10B981 100%)",
    "previewColors": [
      "#FF334B",
      "#FF7A00",
      "#10B981",
      "#2563EB",
      "#8B5CF6"
    ]
  },
  {
    "id": "rainbow-2",
    "name": "Canlı Neon Spektrum",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF0055",
    "secondary": "#FF5500",
    "accent": "#00FF88",
    "gradient": "linear-gradient(135deg, #FF0055 0%, #FF5500 50%, #00FF88 100%)",
    "previewColors": [
      "#FF0055",
      "#FF5500",
      "#00FF88",
      "#00CCFF",
      "#BB00FF"
    ]
  },
  {
    "id": "rainbow-3",
    "name": "Pastel Gökkuşağı",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FFAAA6",
    "secondary": "#FFD3B6",
    "accent": "#DCEDC1",
    "gradient": "linear-gradient(135deg, #FFAAA6 0%, #FFD3B6 50%, #DCEDC1 100%)",
    "previewColors": [
      "#FFAAA6",
      "#FFD3B6",
      "#DCEDC1",
      "#A8E6CF",
      "#DED2F9"
    ]
  },
  {
    "id": "rainbow-4",
    "name": "Yedi Renk Masalı",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#E11D48",
    "secondary": "#EA580C",
    "accent": "#CA8A04",
    "gradient": "linear-gradient(135deg, #E11D48 0%, #EA580C 50%, #CA8A04 100%)",
    "previewColors": [
      "#E11D48",
      "#EA580C",
      "#CA8A04",
      "#16A34A",
      "#2563EB"
    ]
  },
  {
    "id": "rainbow-5",
    "name": "Güneş Patlaması",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF4500",
    "secondary": "#FF8C00",
    "accent": "#FFD700",
    "gradient": "linear-gradient(135deg, #FF4500 0%, #FF8C00 50%, #FFD700 100%)",
    "previewColors": [
      "#FF4500",
      "#FF8C00",
      "#FFD700",
      "#32CD32",
      "#1E90FF"
    ]
  },
  {
    "id": "rainbow-6",
    "name": "Gökkuşağı Parıltısı",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF1493",
    "secondary": "#FF69B4",
    "accent": "#00CED1",
    "gradient": "linear-gradient(135deg, #FF1493 0%, #FF69B4 50%, #00CED1 100%)",
    "previewColors": [
      "#FF1493",
      "#FF69B4",
      "#00CED1",
      "#7B68EE",
      "#32CD32"
    ]
  },
  {
    "id": "rainbow-7",
    "name": "Tropik Spektrum",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF007F",
    "secondary": "#FF7F00",
    "accent": "#7FFF00",
    "gradient": "linear-gradient(135deg, #FF007F 0%, #FF7F00 50%, #7FFF00 100%)",
    "previewColors": [
      "#FF007F",
      "#FF7F00",
      "#7FFF00",
      "#00FF7F",
      "#007FFF"
    ]
  },
  {
    "id": "rainbow-8",
    "name": "Optik Dalga",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#D90429",
    "secondary": "#EF233C",
    "accent": "#2B2D42",
    "gradient": "linear-gradient(135deg, #D90429 0%, #EF233C 50%, #2B2D42 100%)",
    "previewColors": [
      "#D90429",
      "#EF233C",
      "#2B2D42",
      "#8D99AE",
      "#EDF2F4"
    ]
  },
  {
    "id": "rainbow-9",
    "name": "Renkli Pikseller",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF0055",
    "secondary": "#00E5FF",
    "accent": "#76FF03",
    "gradient": "linear-gradient(135deg, #FF0055 0%, #00E5FF 50%, #76FF03 100%)",
    "previewColors": [
      "#FF0055",
      "#00E5FF",
      "#76FF03",
      "#FFD600",
      "#D500F9"
    ]
  },
  {
    "id": "rainbow-10",
    "name": "Kristal Işık Kırılması",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#F72585",
    "secondary": "#7209B7",
    "accent": "#3A0CA3",
    "gradient": "linear-gradient(135deg, #F72585 0%, #7209B7 50%, #3A0CA3 100%)",
    "previewColors": [
      "#F72585",
      "#7209B7",
      "#3A0CA3",
      "#4361EE",
      "#4CC9F0"
    ]
  },
  {
    "id": "rainbow-11",
    "name": "Prizma Gökkuşağı · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF7A00",
    "secondary": "#10B981",
    "accent": "#2563EB",
    "gradient": "linear-gradient(135deg, #FF7A00 0%, #10B981 50%, #2563EB 100%)",
    "previewColors": [
      "#FF7A00",
      "#10B981",
      "#2563EB",
      "#8B5CF6",
      "#FF334B"
    ]
  },
  {
    "id": "rainbow-12",
    "name": "Canlı Neon Spektrum · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF5500",
    "secondary": "#00FF88",
    "accent": "#00CCFF",
    "gradient": "linear-gradient(135deg, #FF5500 0%, #00FF88 50%, #00CCFF 100%)",
    "previewColors": [
      "#FF5500",
      "#00FF88",
      "#00CCFF",
      "#BB00FF",
      "#FF0055"
    ]
  },
  {
    "id": "rainbow-13",
    "name": "Pastel Gökkuşağı · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FFD3B6",
    "secondary": "#DCEDC1",
    "accent": "#A8E6CF",
    "gradient": "linear-gradient(135deg, #FFD3B6 0%, #DCEDC1 50%, #A8E6CF 100%)",
    "previewColors": [
      "#FFD3B6",
      "#DCEDC1",
      "#A8E6CF",
      "#DED2F9",
      "#FFAAA6"
    ]
  },
  {
    "id": "rainbow-14",
    "name": "Yedi Renk Masalı · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#EA580C",
    "secondary": "#CA8A04",
    "accent": "#16A34A",
    "gradient": "linear-gradient(135deg, #EA580C 0%, #CA8A04 50%, #16A34A 100%)",
    "previewColors": [
      "#EA580C",
      "#CA8A04",
      "#16A34A",
      "#2563EB",
      "#E11D48"
    ]
  },
  {
    "id": "rainbow-15",
    "name": "Güneş Patlaması · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF8C00",
    "secondary": "#FFD700",
    "accent": "#32CD32",
    "gradient": "linear-gradient(135deg, #FF8C00 0%, #FFD700 50%, #32CD32 100%)",
    "previewColors": [
      "#FF8C00",
      "#FFD700",
      "#32CD32",
      "#1E90FF",
      "#FF4500"
    ]
  },
  {
    "id": "rainbow-16",
    "name": "Gökkuşağı Parıltısı · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF69B4",
    "secondary": "#00CED1",
    "accent": "#7B68EE",
    "gradient": "linear-gradient(135deg, #FF69B4 0%, #00CED1 50%, #7B68EE 100%)",
    "previewColors": [
      "#FF69B4",
      "#00CED1",
      "#7B68EE",
      "#32CD32",
      "#FF1493"
    ]
  },
  {
    "id": "rainbow-17",
    "name": "Tropik Spektrum · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FF7F00",
    "secondary": "#7FFF00",
    "accent": "#00FF7F",
    "gradient": "linear-gradient(135deg, #FF7F00 0%, #7FFF00 50%, #00FF7F 100%)",
    "previewColors": [
      "#FF7F00",
      "#7FFF00",
      "#00FF7F",
      "#007FFF",
      "#FF007F"
    ]
  },
  {
    "id": "rainbow-18",
    "name": "Optik Dalga · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#EF233C",
    "secondary": "#2B2D42",
    "accent": "#8D99AE",
    "gradient": "linear-gradient(135deg, #EF233C 0%, #2B2D42 50%, #8D99AE 100%)",
    "previewColors": [
      "#EF233C",
      "#2B2D42",
      "#8D99AE",
      "#EDF2F4",
      "#D90429"
    ]
  },
  {
    "id": "rainbow-19",
    "name": "Renkli Pikseller · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#00E5FF",
    "secondary": "#76FF03",
    "accent": "#FFD600",
    "gradient": "linear-gradient(135deg, #00E5FF 0%, #76FF03 50%, #FFD600 100%)",
    "previewColors": [
      "#00E5FF",
      "#76FF03",
      "#FFD600",
      "#D500F9",
      "#FF0055"
    ]
  },
  {
    "id": "rainbow-20",
    "name": "Kristal Işık Kırılması · Kademe 2",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#7209B7",
    "secondary": "#3A0CA3",
    "accent": "#4361EE",
    "gradient": "linear-gradient(135deg, #7209B7 0%, #3A0CA3 50%, #4361EE 100%)",
    "previewColors": [
      "#7209B7",
      "#3A0CA3",
      "#4361EE",
      "#4CC9F0",
      "#F72585"
    ]
  },
  {
    "id": "rainbow-21",
    "name": "Prizma Gökkuşağı · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#10B981",
    "secondary": "#2563EB",
    "accent": "#8B5CF6",
    "gradient": "linear-gradient(135deg, #10B981 0%, #2563EB 50%, #8B5CF6 100%)",
    "previewColors": [
      "#10B981",
      "#2563EB",
      "#8B5CF6",
      "#FF334B",
      "#FF7A00"
    ]
  },
  {
    "id": "rainbow-22",
    "name": "Canlı Neon Spektrum · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#00FF88",
    "secondary": "#00CCFF",
    "accent": "#BB00FF",
    "gradient": "linear-gradient(135deg, #00FF88 0%, #00CCFF 50%, #BB00FF 100%)",
    "previewColors": [
      "#00FF88",
      "#00CCFF",
      "#BB00FF",
      "#FF0055",
      "#FF5500"
    ]
  },
  {
    "id": "rainbow-23",
    "name": "Pastel Gökkuşağı · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#DCEDC1",
    "secondary": "#A8E6CF",
    "accent": "#DED2F9",
    "gradient": "linear-gradient(135deg, #DCEDC1 0%, #A8E6CF 50%, #DED2F9 100%)",
    "previewColors": [
      "#DCEDC1",
      "#A8E6CF",
      "#DED2F9",
      "#FFAAA6",
      "#FFD3B6"
    ]
  },
  {
    "id": "rainbow-24",
    "name": "Yedi Renk Masalı · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#CA8A04",
    "secondary": "#16A34A",
    "accent": "#2563EB",
    "gradient": "linear-gradient(135deg, #CA8A04 0%, #16A34A 50%, #2563EB 100%)",
    "previewColors": [
      "#CA8A04",
      "#16A34A",
      "#2563EB",
      "#E11D48",
      "#EA580C"
    ]
  },
  {
    "id": "rainbow-25",
    "name": "Güneş Patlaması · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#FFD700",
    "secondary": "#32CD32",
    "accent": "#1E90FF",
    "gradient": "linear-gradient(135deg, #FFD700 0%, #32CD32 50%, #1E90FF 100%)",
    "previewColors": [
      "#FFD700",
      "#32CD32",
      "#1E90FF",
      "#FF4500",
      "#FF8C00"
    ]
  },
  {
    "id": "rainbow-26",
    "name": "Gökkuşağı Parıltısı · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#00CED1",
    "secondary": "#7B68EE",
    "accent": "#32CD32",
    "gradient": "linear-gradient(135deg, #00CED1 0%, #7B68EE 50%, #32CD32 100%)",
    "previewColors": [
      "#00CED1",
      "#7B68EE",
      "#32CD32",
      "#FF1493",
      "#FF69B4"
    ]
  },
  {
    "id": "rainbow-27",
    "name": "Tropik Spektrum · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#7FFF00",
    "secondary": "#00FF7F",
    "accent": "#007FFF",
    "gradient": "linear-gradient(135deg, #7FFF00 0%, #00FF7F 50%, #007FFF 100%)",
    "previewColors": [
      "#7FFF00",
      "#00FF7F",
      "#007FFF",
      "#FF007F",
      "#FF7F00"
    ]
  },
  {
    "id": "rainbow-28",
    "name": "Optik Dalga · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#2B2D42",
    "secondary": "#8D99AE",
    "accent": "#EDF2F4",
    "gradient": "linear-gradient(135deg, #2B2D42 0%, #8D99AE 50%, #EDF2F4 100%)",
    "previewColors": [
      "#2B2D42",
      "#8D99AE",
      "#EDF2F4",
      "#D90429",
      "#EF233C"
    ]
  },
  {
    "id": "rainbow-29",
    "name": "Renkli Pikseller · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#76FF03",
    "secondary": "#FFD600",
    "accent": "#D500F9",
    "gradient": "linear-gradient(135deg, #76FF03 0%, #FFD600 50%, #D500F9 100%)",
    "previewColors": [
      "#76FF03",
      "#FFD600",
      "#D500F9",
      "#FF0055",
      "#00E5FF"
    ]
  },
  {
    "id": "rainbow-30",
    "name": "Kristal Işık Kırılması · Kademe 3",
    "category": "Gökkuşağı & Spektrum",
    "primary": "#3A0CA3",
    "secondary": "#4361EE",
    "accent": "#4CC9F0",
    "gradient": "linear-gradient(135deg, #3A0CA3 0%, #4361EE 50%, #4CC9F0 100%)",
    "previewColors": [
      "#3A0CA3",
      "#4361EE",
      "#4CC9F0",
      "#F72585",
      "#7209B7"
    ]
  },
  {
    "id": "cyber-1",
    "name": "Tokyo Cyber 2077",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00F0FF",
    "secondary": "#FF003C",
    "accent": "#FFE600",
    "gradient": "linear-gradient(135deg, #00F0FF 0%, #FF003C 50%, #FFE600 100%)",
    "previewColors": [
      "#00F0FF",
      "#FF003C",
      "#FFE600",
      "#001BFF",
      "#7122FA"
    ]
  },
  {
    "id": "cyber-2",
    "name": "Neon Sentetik Dalga",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF007F",
    "secondary": "#00F5D4",
    "accent": "#7B2CBF",
    "gradient": "linear-gradient(135deg, #FF007F 0%, #00F5D4 50%, #7B2CBF 100%)",
    "previewColors": [
      "#FF007F",
      "#00F5D4",
      "#7B2CBF",
      "#F72585",
      "#4CC9F0"
    ]
  },
  {
    "id": "cyber-3",
    "name": "Matrix Zümrüdü",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00FF66",
    "secondary": "#00CC44",
    "accent": "#008822",
    "gradient": "linear-gradient(135deg, #00FF66 0%, #00CC44 50%, #008822 100%)",
    "previewColors": [
      "#00FF66",
      "#00CC44",
      "#008822",
      "#003311",
      "#CCFFCC"
    ]
  },
  {
    "id": "cyber-4",
    "name": "Blade Runner Gecesi",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF5E00",
    "secondary": "#00B4D8",
    "accent": "#03045E",
    "gradient": "linear-gradient(135deg, #FF5E00 0%, #00B4D8 50%, #03045E 100%)",
    "previewColors": [
      "#FF5E00",
      "#00B4D8",
      "#03045E",
      "#90E0EF",
      "#CAF0F8"
    ]
  },
  {
    "id": "cyber-5",
    "name": "Elektrik Moru",
    "category": "Siberpunk & Neon Gece",
    "primary": "#9D4EDD",
    "secondary": "#C77DFF",
    "accent": "#E0AAFF",
    "gradient": "linear-gradient(135deg, #9D4EDD 0%, #C77DFF 50%, #E0AAFF 100%)",
    "previewColors": [
      "#9D4EDD",
      "#C77DFF",
      "#E0AAFF",
      "#5A189A",
      "#3C096C"
    ]
  },
  {
    "id": "cyber-6",
    "name": "Siber Lazer",
    "category": "Siberpunk & Neon Gece",
    "primary": "#39FF14",
    "secondary": "#FF073A",
    "accent": "#0FF0FC",
    "gradient": "linear-gradient(135deg, #39FF14 0%, #FF073A 50%, #0FF0FC 100%)",
    "previewColors": [
      "#39FF14",
      "#FF073A",
      "#0FF0FC",
      "#BC13FE",
      "#FFE600"
    ]
  },
  {
    "id": "cyber-7",
    "name": "Retro Gece Lambası",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF2A6D",
    "secondary": "#05D9E8",
    "accent": "#005678",
    "gradient": "linear-gradient(135deg, #FF2A6D 0%, #05D9E8 50%, #005678 100%)",
    "previewColors": [
      "#FF2A6D",
      "#05D9E8",
      "#005678",
      "#01012B",
      "#D1F7FF"
    ]
  },
  {
    "id": "cyber-8",
    "name": "Dijital Hayalet",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00FFFF",
    "secondary": "#FF00FF",
    "accent": "#8A2BE2",
    "gradient": "linear-gradient(135deg, #00FFFF 0%, #FF00FF 50%, #8A2BE2 100%)",
    "previewColors": [
      "#00FFFF",
      "#FF00FF",
      "#8A2BE2",
      "#4B0082",
      "#7FFF00"
    ]
  },
  {
    "id": "cyber-9",
    "name": "Asit Yağmuru Neonu",
    "category": "Siberpunk & Neon Gece",
    "primary": "#CCFF00",
    "secondary": "#10E7E2",
    "accent": "#FF007F",
    "gradient": "linear-gradient(135deg, #CCFF00 0%, #10E7E2 50%, #FF007F 100%)",
    "previewColors": [
      "#CCFF00",
      "#10E7E2",
      "#FF007F",
      "#7B00FF",
      "#00FF66"
    ]
  },
  {
    "id": "cyber-10",
    "name": "Hacker Terminali",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00FF41",
    "secondary": "#008F11",
    "accent": "#003B00",
    "gradient": "linear-gradient(135deg, #00FF41 0%, #008F11 50%, #003B00 100%)",
    "previewColors": [
      "#00FF41",
      "#008F11",
      "#003B00",
      "#66FF66",
      "#0D0208"
    ]
  },
  {
    "id": "cyber-11",
    "name": "Tokyo Cyber 2077 · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF003C",
    "secondary": "#FFE600",
    "accent": "#001BFF",
    "gradient": "linear-gradient(135deg, #FF003C 0%, #FFE600 50%, #001BFF 100%)",
    "previewColors": [
      "#FF003C",
      "#FFE600",
      "#001BFF",
      "#7122FA",
      "#00F0FF"
    ]
  },
  {
    "id": "cyber-12",
    "name": "Neon Sentetik Dalga · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00F5D4",
    "secondary": "#7B2CBF",
    "accent": "#F72585",
    "gradient": "linear-gradient(135deg, #00F5D4 0%, #7B2CBF 50%, #F72585 100%)",
    "previewColors": [
      "#00F5D4",
      "#7B2CBF",
      "#F72585",
      "#4CC9F0",
      "#FF007F"
    ]
  },
  {
    "id": "cyber-13",
    "name": "Matrix Zümrüdü · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00CC44",
    "secondary": "#008822",
    "accent": "#003311",
    "gradient": "linear-gradient(135deg, #00CC44 0%, #008822 50%, #003311 100%)",
    "previewColors": [
      "#00CC44",
      "#008822",
      "#003311",
      "#CCFFCC",
      "#00FF66"
    ]
  },
  {
    "id": "cyber-14",
    "name": "Blade Runner Gecesi · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#00B4D8",
    "secondary": "#03045E",
    "accent": "#90E0EF",
    "gradient": "linear-gradient(135deg, #00B4D8 0%, #03045E 50%, #90E0EF 100%)",
    "previewColors": [
      "#00B4D8",
      "#03045E",
      "#90E0EF",
      "#CAF0F8",
      "#FF5E00"
    ]
  },
  {
    "id": "cyber-15",
    "name": "Elektrik Moru · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#C77DFF",
    "secondary": "#E0AAFF",
    "accent": "#5A189A",
    "gradient": "linear-gradient(135deg, #C77DFF 0%, #E0AAFF 50%, #5A189A 100%)",
    "previewColors": [
      "#C77DFF",
      "#E0AAFF",
      "#5A189A",
      "#3C096C",
      "#9D4EDD"
    ]
  },
  {
    "id": "cyber-16",
    "name": "Siber Lazer · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF073A",
    "secondary": "#0FF0FC",
    "accent": "#BC13FE",
    "gradient": "linear-gradient(135deg, #FF073A 0%, #0FF0FC 50%, #BC13FE 100%)",
    "previewColors": [
      "#FF073A",
      "#0FF0FC",
      "#BC13FE",
      "#FFE600",
      "#39FF14"
    ]
  },
  {
    "id": "cyber-17",
    "name": "Retro Gece Lambası · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#05D9E8",
    "secondary": "#005678",
    "accent": "#01012B",
    "gradient": "linear-gradient(135deg, #05D9E8 0%, #005678 50%, #01012B 100%)",
    "previewColors": [
      "#05D9E8",
      "#005678",
      "#01012B",
      "#D1F7FF",
      "#FF2A6D"
    ]
  },
  {
    "id": "cyber-18",
    "name": "Dijital Hayalet · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF00FF",
    "secondary": "#8A2BE2",
    "accent": "#4B0082",
    "gradient": "linear-gradient(135deg, #FF00FF 0%, #8A2BE2 50%, #4B0082 100%)",
    "previewColors": [
      "#FF00FF",
      "#8A2BE2",
      "#4B0082",
      "#7FFF00",
      "#00FFFF"
    ]
  },
  {
    "id": "cyber-19",
    "name": "Asit Yağmuru Neonu · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#10E7E2",
    "secondary": "#FF007F",
    "accent": "#7B00FF",
    "gradient": "linear-gradient(135deg, #10E7E2 0%, #FF007F 50%, #7B00FF 100%)",
    "previewColors": [
      "#10E7E2",
      "#FF007F",
      "#7B00FF",
      "#00FF66",
      "#CCFF00"
    ]
  },
  {
    "id": "cyber-20",
    "name": "Hacker Terminali · Kademe 2",
    "category": "Siberpunk & Neon Gece",
    "primary": "#008F11",
    "secondary": "#003B00",
    "accent": "#66FF66",
    "gradient": "linear-gradient(135deg, #008F11 0%, #003B00 50%, #66FF66 100%)",
    "previewColors": [
      "#008F11",
      "#003B00",
      "#66FF66",
      "#0D0208",
      "#00FF41"
    ]
  },
  {
    "id": "cyber-21",
    "name": "Tokyo Cyber 2077 · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FFE600",
    "secondary": "#001BFF",
    "accent": "#7122FA",
    "gradient": "linear-gradient(135deg, #FFE600 0%, #001BFF 50%, #7122FA 100%)",
    "previewColors": [
      "#FFE600",
      "#001BFF",
      "#7122FA",
      "#00F0FF",
      "#FF003C"
    ]
  },
  {
    "id": "cyber-22",
    "name": "Neon Sentetik Dalga · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#7B2CBF",
    "secondary": "#F72585",
    "accent": "#4CC9F0",
    "gradient": "linear-gradient(135deg, #7B2CBF 0%, #F72585 50%, #4CC9F0 100%)",
    "previewColors": [
      "#7B2CBF",
      "#F72585",
      "#4CC9F0",
      "#FF007F",
      "#00F5D4"
    ]
  },
  {
    "id": "cyber-23",
    "name": "Matrix Zümrüdü · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#008822",
    "secondary": "#003311",
    "accent": "#CCFFCC",
    "gradient": "linear-gradient(135deg, #008822 0%, #003311 50%, #CCFFCC 100%)",
    "previewColors": [
      "#008822",
      "#003311",
      "#CCFFCC",
      "#00FF66",
      "#00CC44"
    ]
  },
  {
    "id": "cyber-24",
    "name": "Blade Runner Gecesi · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#03045E",
    "secondary": "#90E0EF",
    "accent": "#CAF0F8",
    "gradient": "linear-gradient(135deg, #03045E 0%, #90E0EF 50%, #CAF0F8 100%)",
    "previewColors": [
      "#03045E",
      "#90E0EF",
      "#CAF0F8",
      "#FF5E00",
      "#00B4D8"
    ]
  },
  {
    "id": "cyber-25",
    "name": "Elektrik Moru · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#E0AAFF",
    "secondary": "#5A189A",
    "accent": "#3C096C",
    "gradient": "linear-gradient(135deg, #E0AAFF 0%, #5A189A 50%, #3C096C 100%)",
    "previewColors": [
      "#E0AAFF",
      "#5A189A",
      "#3C096C",
      "#9D4EDD",
      "#C77DFF"
    ]
  },
  {
    "id": "cyber-26",
    "name": "Siber Lazer · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#0FF0FC",
    "secondary": "#BC13FE",
    "accent": "#FFE600",
    "gradient": "linear-gradient(135deg, #0FF0FC 0%, #BC13FE 50%, #FFE600 100%)",
    "previewColors": [
      "#0FF0FC",
      "#BC13FE",
      "#FFE600",
      "#39FF14",
      "#FF073A"
    ]
  },
  {
    "id": "cyber-27",
    "name": "Retro Gece Lambası · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#005678",
    "secondary": "#01012B",
    "accent": "#D1F7FF",
    "gradient": "linear-gradient(135deg, #005678 0%, #01012B 50%, #D1F7FF 100%)",
    "previewColors": [
      "#005678",
      "#01012B",
      "#D1F7FF",
      "#FF2A6D",
      "#05D9E8"
    ]
  },
  {
    "id": "cyber-28",
    "name": "Dijital Hayalet · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#8A2BE2",
    "secondary": "#4B0082",
    "accent": "#7FFF00",
    "gradient": "linear-gradient(135deg, #8A2BE2 0%, #4B0082 50%, #7FFF00 100%)",
    "previewColors": [
      "#8A2BE2",
      "#4B0082",
      "#7FFF00",
      "#00FFFF",
      "#FF00FF"
    ]
  },
  {
    "id": "cyber-29",
    "name": "Asit Yağmuru Neonu · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#FF007F",
    "secondary": "#7B00FF",
    "accent": "#00FF66",
    "gradient": "linear-gradient(135deg, #FF007F 0%, #7B00FF 50%, #00FF66 100%)",
    "previewColors": [
      "#FF007F",
      "#7B00FF",
      "#00FF66",
      "#CCFF00",
      "#10E7E2"
    ]
  },
  {
    "id": "cyber-30",
    "name": "Hacker Terminali · Kademe 3",
    "category": "Siberpunk & Neon Gece",
    "primary": "#003B00",
    "secondary": "#66FF66",
    "accent": "#0D0208",
    "gradient": "linear-gradient(135deg, #003B00 0%, #66FF66 50%, #0D0208 100%)",
    "previewColors": [
      "#003B00",
      "#66FF66",
      "#0D0208",
      "#00FF41",
      "#008F11"
    ]
  },
  {
    "id": "nature-1",
    "name": "Mariana Çukuru Derin Mavi",
    "category": "Doğa & Okyanus",
    "primary": "#001845",
    "secondary": "#002855",
    "accent": "#023E7D",
    "gradient": "linear-gradient(135deg, #001845 0%, #002855 50%, #023E7D 100%)",
    "previewColors": [
      "#001845",
      "#002855",
      "#023E7D",
      "#0353A4",
      "#0466C8"
    ]
  },
  {
    "id": "nature-2",
    "name": "Zümrüt Yağmur Ormanı",
    "category": "Doğa & Okyanus",
    "primary": "#007F5F",
    "secondary": "#2B9348",
    "accent": "#55A630",
    "gradient": "linear-gradient(135deg, #007F5F 0%, #2B9348 50%, #55A630 100%)",
    "previewColors": [
      "#007F5F",
      "#2B9348",
      "#55A630",
      "#80B918",
      "#AACC00"
    ]
  },
  {
    "id": "nature-3",
    "name": "Mercan Resifi",
    "category": "Doğa & Okyanus",
    "primary": "#FF6B6B",
    "secondary": "#4ECDC4",
    "accent": "#45B7D1",
    "gradient": "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #45B7D1 100%)",
    "previewColors": [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#F7D794",
      "#786FA6"
    ]
  },
  {
    "id": "nature-4",
    "name": "Turkuaz Lagün",
    "category": "Doğa & Okyanus",
    "primary": "#06B6D4",
    "secondary": "#0891B2",
    "accent": "#0E7490",
    "gradient": "linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)",
    "previewColors": [
      "#06B6D4",
      "#0891B2",
      "#0E7490",
      "#22D3EE",
      "#67E8F9"
    ]
  },
  {
    "id": "nature-5",
    "name": "Bambu Korusu",
    "category": "Doğa & Okyanus",
    "primary": "#2D6A4F",
    "secondary": "#40916C",
    "accent": "#52B788",
    "gradient": "linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)",
    "previewColors": [
      "#2D6A4F",
      "#40916C",
      "#52B788",
      "#74C69D",
      "#95D5B2"
    ]
  },
  {
    "id": "nature-6",
    "name": "Ege Kıyıları",
    "category": "Doğa & Okyanus",
    "primary": "#0077B6",
    "secondary": "#0096C7",
    "accent": "#00B4D8",
    "gradient": "linear-gradient(135deg, #0077B6 0%, #0096C7 50%, #00B4D8 100%)",
    "previewColors": [
      "#0077B6",
      "#0096C7",
      "#00B4D8",
      "#48CAE4",
      "#90E0EF"
    ]
  },
  {
    "id": "nature-7",
    "name": "İsviçre Alpleri Çamı",
    "category": "Doğa & Okyanus",
    "primary": "#1B4332",
    "secondary": "#2D6A4F",
    "accent": "#40916C",
    "gradient": "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)",
    "previewColors": [
      "#1B4332",
      "#2D6A4F",
      "#40916C",
      "#74C69D",
      "#D8F3DC"
    ]
  },
  {
    "id": "nature-8",
    "name": "Derin Deniz Mercanı",
    "category": "Doğa & Okyanus",
    "primary": "#FF5964",
    "secondary": "#35A7FF",
    "accent": "#FFE74C",
    "gradient": "linear-gradient(135deg, #FF5964 0%, #35A7FF 50%, #FFE74C 100%)",
    "previewColors": [
      "#FF5964",
      "#35A7FF",
      "#FFE74C",
      "#386150",
      "#EEF5DB"
    ]
  },
  {
    "id": "nature-9",
    "name": "Akdeniz Meltemi",
    "category": "Doğa & Okyanus",
    "primary": "#1D3557",
    "secondary": "#457B9D",
    "accent": "#A8DADC",
    "gradient": "linear-gradient(135deg, #1D3557 0%, #457B9D 50%, #A8DADC 100%)",
    "previewColors": [
      "#1D3557",
      "#457B9D",
      "#A8DADC",
      "#F1FAEE",
      "#E63946"
    ]
  },
  {
    "id": "nature-10",
    "name": "Tropikal Palmiye",
    "category": "Doğa & Okyanus",
    "primary": "#05668D",
    "secondary": "#028090",
    "accent": "#00A896",
    "gradient": "linear-gradient(135deg, #05668D 0%, #028090 50%, #00A896 100%)",
    "previewColors": [
      "#05668D",
      "#028090",
      "#00A896",
      "#02C39A",
      "#F0F3BD"
    ]
  },
  {
    "id": "nature-11",
    "name": "Mariana Çukuru Derin Mavi · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#002855",
    "secondary": "#023E7D",
    "accent": "#0353A4",
    "gradient": "linear-gradient(135deg, #002855 0%, #023E7D 50%, #0353A4 100%)",
    "previewColors": [
      "#002855",
      "#023E7D",
      "#0353A4",
      "#0466C8",
      "#001845"
    ]
  },
  {
    "id": "nature-12",
    "name": "Zümrüt Yağmur Ormanı · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#2B9348",
    "secondary": "#55A630",
    "accent": "#80B918",
    "gradient": "linear-gradient(135deg, #2B9348 0%, #55A630 50%, #80B918 100%)",
    "previewColors": [
      "#2B9348",
      "#55A630",
      "#80B918",
      "#AACC00",
      "#007F5F"
    ]
  },
  {
    "id": "nature-13",
    "name": "Mercan Resifi · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#4ECDC4",
    "secondary": "#45B7D1",
    "accent": "#F7D794",
    "gradient": "linear-gradient(135deg, #4ECDC4 0%, #45B7D1 50%, #F7D794 100%)",
    "previewColors": [
      "#4ECDC4",
      "#45B7D1",
      "#F7D794",
      "#786FA6",
      "#FF6B6B"
    ]
  },
  {
    "id": "nature-14",
    "name": "Turkuaz Lagün · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#0891B2",
    "secondary": "#0E7490",
    "accent": "#22D3EE",
    "gradient": "linear-gradient(135deg, #0891B2 0%, #0E7490 50%, #22D3EE 100%)",
    "previewColors": [
      "#0891B2",
      "#0E7490",
      "#22D3EE",
      "#67E8F9",
      "#06B6D4"
    ]
  },
  {
    "id": "nature-15",
    "name": "Bambu Korusu · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#40916C",
    "secondary": "#52B788",
    "accent": "#74C69D",
    "gradient": "linear-gradient(135deg, #40916C 0%, #52B788 50%, #74C69D 100%)",
    "previewColors": [
      "#40916C",
      "#52B788",
      "#74C69D",
      "#95D5B2",
      "#2D6A4F"
    ]
  },
  {
    "id": "nature-16",
    "name": "Ege Kıyıları · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#0096C7",
    "secondary": "#00B4D8",
    "accent": "#48CAE4",
    "gradient": "linear-gradient(135deg, #0096C7 0%, #00B4D8 50%, #48CAE4 100%)",
    "previewColors": [
      "#0096C7",
      "#00B4D8",
      "#48CAE4",
      "#90E0EF",
      "#0077B6"
    ]
  },
  {
    "id": "nature-17",
    "name": "İsviçre Alpleri Çamı · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#2D6A4F",
    "secondary": "#40916C",
    "accent": "#74C69D",
    "gradient": "linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #74C69D 100%)",
    "previewColors": [
      "#2D6A4F",
      "#40916C",
      "#74C69D",
      "#D8F3DC",
      "#1B4332"
    ]
  },
  {
    "id": "nature-18",
    "name": "Derin Deniz Mercanı · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#35A7FF",
    "secondary": "#FFE74C",
    "accent": "#386150",
    "gradient": "linear-gradient(135deg, #35A7FF 0%, #FFE74C 50%, #386150 100%)",
    "previewColors": [
      "#35A7FF",
      "#FFE74C",
      "#386150",
      "#EEF5DB",
      "#FF5964"
    ]
  },
  {
    "id": "nature-19",
    "name": "Akdeniz Meltemi · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#457B9D",
    "secondary": "#A8DADC",
    "accent": "#F1FAEE",
    "gradient": "linear-gradient(135deg, #457B9D 0%, #A8DADC 50%, #F1FAEE 100%)",
    "previewColors": [
      "#457B9D",
      "#A8DADC",
      "#F1FAEE",
      "#E63946",
      "#1D3557"
    ]
  },
  {
    "id": "nature-20",
    "name": "Tropikal Palmiye · Kademe 2",
    "category": "Doğa & Okyanus",
    "primary": "#028090",
    "secondary": "#00A896",
    "accent": "#02C39A",
    "gradient": "linear-gradient(135deg, #028090 0%, #00A896 50%, #02C39A 100%)",
    "previewColors": [
      "#028090",
      "#00A896",
      "#02C39A",
      "#F0F3BD",
      "#05668D"
    ]
  },
  {
    "id": "nature-21",
    "name": "Mariana Çukuru Derin Mavi · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#023E7D",
    "secondary": "#0353A4",
    "accent": "#0466C8",
    "gradient": "linear-gradient(135deg, #023E7D 0%, #0353A4 50%, #0466C8 100%)",
    "previewColors": [
      "#023E7D",
      "#0353A4",
      "#0466C8",
      "#001845",
      "#002855"
    ]
  },
  {
    "id": "nature-22",
    "name": "Zümrüt Yağmur Ormanı · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#55A630",
    "secondary": "#80B918",
    "accent": "#AACC00",
    "gradient": "linear-gradient(135deg, #55A630 0%, #80B918 50%, #AACC00 100%)",
    "previewColors": [
      "#55A630",
      "#80B918",
      "#AACC00",
      "#007F5F",
      "#2B9348"
    ]
  },
  {
    "id": "nature-23",
    "name": "Mercan Resifi · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#45B7D1",
    "secondary": "#F7D794",
    "accent": "#786FA6",
    "gradient": "linear-gradient(135deg, #45B7D1 0%, #F7D794 50%, #786FA6 100%)",
    "previewColors": [
      "#45B7D1",
      "#F7D794",
      "#786FA6",
      "#FF6B6B",
      "#4ECDC4"
    ]
  },
  {
    "id": "nature-24",
    "name": "Turkuaz Lagün · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#0E7490",
    "secondary": "#22D3EE",
    "accent": "#67E8F9",
    "gradient": "linear-gradient(135deg, #0E7490 0%, #22D3EE 50%, #67E8F9 100%)",
    "previewColors": [
      "#0E7490",
      "#22D3EE",
      "#67E8F9",
      "#06B6D4",
      "#0891B2"
    ]
  },
  {
    "id": "nature-25",
    "name": "Bambu Korusu · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#52B788",
    "secondary": "#74C69D",
    "accent": "#95D5B2",
    "gradient": "linear-gradient(135deg, #52B788 0%, #74C69D 50%, #95D5B2 100%)",
    "previewColors": [
      "#52B788",
      "#74C69D",
      "#95D5B2",
      "#2D6A4F",
      "#40916C"
    ]
  },
  {
    "id": "nature-26",
    "name": "Ege Kıyıları · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#00B4D8",
    "secondary": "#48CAE4",
    "accent": "#90E0EF",
    "gradient": "linear-gradient(135deg, #00B4D8 0%, #48CAE4 50%, #90E0EF 100%)",
    "previewColors": [
      "#00B4D8",
      "#48CAE4",
      "#90E0EF",
      "#0077B6",
      "#0096C7"
    ]
  },
  {
    "id": "nature-27",
    "name": "İsviçre Alpleri Çamı · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#40916C",
    "secondary": "#74C69D",
    "accent": "#D8F3DC",
    "gradient": "linear-gradient(135deg, #40916C 0%, #74C69D 50%, #D8F3DC 100%)",
    "previewColors": [
      "#40916C",
      "#74C69D",
      "#D8F3DC",
      "#1B4332",
      "#2D6A4F"
    ]
  },
  {
    "id": "nature-28",
    "name": "Derin Deniz Mercanı · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#FFE74C",
    "secondary": "#386150",
    "accent": "#EEF5DB",
    "gradient": "linear-gradient(135deg, #FFE74C 0%, #386150 50%, #EEF5DB 100%)",
    "previewColors": [
      "#FFE74C",
      "#386150",
      "#EEF5DB",
      "#FF5964",
      "#35A7FF"
    ]
  },
  {
    "id": "nature-29",
    "name": "Akdeniz Meltemi · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#A8DADC",
    "secondary": "#F1FAEE",
    "accent": "#E63946",
    "gradient": "linear-gradient(135deg, #A8DADC 0%, #F1FAEE 50%, #E63946 100%)",
    "previewColors": [
      "#A8DADC",
      "#F1FAEE",
      "#E63946",
      "#1D3557",
      "#457B9D"
    ]
  },
  {
    "id": "nature-30",
    "name": "Tropikal Palmiye · Kademe 3",
    "category": "Doğa & Okyanus",
    "primary": "#00A896",
    "secondary": "#02C39A",
    "accent": "#F0F3BD",
    "gradient": "linear-gradient(135deg, #00A896 0%, #02C39A 50%, #F0F3BD 100%)",
    "previewColors": [
      "#00A896",
      "#02C39A",
      "#F0F3BD",
      "#05668D",
      "#028090"
    ]
  },
  {
    "id": "sky-1",
    "name": "Kuzey Işıkları (Aurora)",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#05FFA1",
    "secondary": "#00E5FF",
    "accent": "#B900FF",
    "gradient": "linear-gradient(135deg, #05FFA1 0%, #00E5FF 50%, #B900FF 100%)",
    "previewColors": [
      "#05FFA1",
      "#00E5FF",
      "#B900FF",
      "#FF0099",
      "#3A86FF"
    ]
  },
  {
    "id": "sky-2",
    "name": "Ege Günbatımı",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FF595E",
    "secondary": "#FFCA3A",
    "accent": "#8AC926",
    "gradient": "linear-gradient(135deg, #FF595E 0%, #FFCA3A 50%, #8AC926 100%)",
    "previewColors": [
      "#FF595E",
      "#FFCA3A",
      "#8AC926",
      "#1982C4",
      "#6A4C93"
    ]
  },
  {
    "id": "sky-3",
    "name": "Altın Saat (Golden Hour)",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FF9E00",
    "secondary": "#FF6000",
    "accent": "#FF0054",
    "gradient": "linear-gradient(135deg, #FF9E00 0%, #FF6000 50%, #FF0054 100%)",
    "previewColors": [
      "#FF9E00",
      "#FF6000",
      "#FF0054",
      "#9E0059",
      "#390099"
    ]
  },
  {
    "id": "sky-4",
    "name": "Akşam Alacakaranlığı",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#5c4d7d",
    "secondary": "#925e78",
    "accent": "#bd6a6b",
    "gradient": "linear-gradient(135deg, #5c4d7d 0%, #925e78 50%, #bd6a6b 100%)",
    "previewColors": [
      "#5c4d7d",
      "#925e78",
      "#bd6a6b",
      "#e08d79",
      "#f1b590"
    ]
  },
  {
    "id": "sky-5",
    "name": "Tropikal Şafak",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#F72585",
    "secondary": "#B5179E",
    "accent": "#7209B7",
    "gradient": "linear-gradient(135deg, #F72585 0%, #B5179E 50%, #7209B7 100%)",
    "previewColors": [
      "#F72585",
      "#B5179E",
      "#7209B7",
      "#480CA8",
      "#3F37C9"
    ]
  },
  {
    "id": "sky-6",
    "name": "Çöl Akşamı",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#E76F51",
    "secondary": "#F4A261",
    "accent": "#E9C46A",
    "gradient": "linear-gradient(135deg, #E76F51 0%, #F4A261 50%, #E9C46A 100%)",
    "previewColors": [
      "#E76F51",
      "#F4A261",
      "#E9C46A",
      "#2A9D8F",
      "#264653"
    ]
  },
  {
    "id": "sky-7",
    "name": "Volkanik Ateş",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#D00000",
    "secondary": "#DC2F02",
    "accent": "#E85D04",
    "gradient": "linear-gradient(135deg, #D00000 0%, #DC2F02 50%, #E85D04 100%)",
    "previewColors": [
      "#D00000",
      "#DC2F02",
      "#E85D04",
      "#F48C06",
      "#FAA307"
    ]
  },
  {
    "id": "sky-8",
    "name": "Gökdelen Silüeti",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#2B2D42",
    "secondary": "#8D99AE",
    "accent": "#EF233C",
    "gradient": "linear-gradient(135deg, #2B2D42 0%, #8D99AE 50%, #EF233C 100%)",
    "previewColors": [
      "#2B2D42",
      "#8D99AE",
      "#EF233C",
      "#D90429",
      "#FFBA08"
    ]
  },
  {
    "id": "sky-9",
    "name": "Pembe Bulutlar",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FFB703",
    "secondary": "#FB8500",
    "accent": "#023047",
    "gradient": "linear-gradient(135deg, #FFB703 0%, #FB8500 50%, #023047 100%)",
    "previewColors": [
      "#FFB703",
      "#FB8500",
      "#023047",
      "#219EBC",
      "#8ECAE6"
    ]
  },
  {
    "id": "sky-10",
    "name": "Lavanta Gökyüzü",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#7209B7",
    "secondary": "#560BAD",
    "accent": "#480CA8",
    "gradient": "linear-gradient(135deg, #7209B7 0%, #560BAD 50%, #480CA8 100%)",
    "previewColors": [
      "#7209B7",
      "#560BAD",
      "#480CA8",
      "#3A0CA3",
      "#3F37C9"
    ]
  },
  {
    "id": "sky-11",
    "name": "Kuzey Işıkları (Aurora) · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#00E5FF",
    "secondary": "#B900FF",
    "accent": "#FF0099",
    "gradient": "linear-gradient(135deg, #00E5FF 0%, #B900FF 50%, #FF0099 100%)",
    "previewColors": [
      "#00E5FF",
      "#B900FF",
      "#FF0099",
      "#3A86FF",
      "#05FFA1"
    ]
  },
  {
    "id": "sky-12",
    "name": "Ege Günbatımı · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FFCA3A",
    "secondary": "#8AC926",
    "accent": "#1982C4",
    "gradient": "linear-gradient(135deg, #FFCA3A 0%, #8AC926 50%, #1982C4 100%)",
    "previewColors": [
      "#FFCA3A",
      "#8AC926",
      "#1982C4",
      "#6A4C93",
      "#FF595E"
    ]
  },
  {
    "id": "sky-13",
    "name": "Altın Saat (Golden Hour) · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FF6000",
    "secondary": "#FF0054",
    "accent": "#9E0059",
    "gradient": "linear-gradient(135deg, #FF6000 0%, #FF0054 50%, #9E0059 100%)",
    "previewColors": [
      "#FF6000",
      "#FF0054",
      "#9E0059",
      "#390099",
      "#FF9E00"
    ]
  },
  {
    "id": "sky-14",
    "name": "Akşam Alacakaranlığı · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#925e78",
    "secondary": "#bd6a6b",
    "accent": "#e08d79",
    "gradient": "linear-gradient(135deg, #925e78 0%, #bd6a6b 50%, #e08d79 100%)",
    "previewColors": [
      "#925e78",
      "#bd6a6b",
      "#e08d79",
      "#f1b590",
      "#5c4d7d"
    ]
  },
  {
    "id": "sky-15",
    "name": "Tropikal Şafak · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#B5179E",
    "secondary": "#7209B7",
    "accent": "#480CA8",
    "gradient": "linear-gradient(135deg, #B5179E 0%, #7209B7 50%, #480CA8 100%)",
    "previewColors": [
      "#B5179E",
      "#7209B7",
      "#480CA8",
      "#3F37C9",
      "#F72585"
    ]
  },
  {
    "id": "sky-16",
    "name": "Çöl Akşamı · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#F4A261",
    "secondary": "#E9C46A",
    "accent": "#2A9D8F",
    "gradient": "linear-gradient(135deg, #F4A261 0%, #E9C46A 50%, #2A9D8F 100%)",
    "previewColors": [
      "#F4A261",
      "#E9C46A",
      "#2A9D8F",
      "#264653",
      "#E76F51"
    ]
  },
  {
    "id": "sky-17",
    "name": "Volkanik Ateş · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#DC2F02",
    "secondary": "#E85D04",
    "accent": "#F48C06",
    "gradient": "linear-gradient(135deg, #DC2F02 0%, #E85D04 50%, #F48C06 100%)",
    "previewColors": [
      "#DC2F02",
      "#E85D04",
      "#F48C06",
      "#FAA307",
      "#D00000"
    ]
  },
  {
    "id": "sky-18",
    "name": "Gökdelen Silüeti · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#8D99AE",
    "secondary": "#EF233C",
    "accent": "#D90429",
    "gradient": "linear-gradient(135deg, #8D99AE 0%, #EF233C 50%, #D90429 100%)",
    "previewColors": [
      "#8D99AE",
      "#EF233C",
      "#D90429",
      "#FFBA08",
      "#2B2D42"
    ]
  },
  {
    "id": "sky-19",
    "name": "Pembe Bulutlar · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FB8500",
    "secondary": "#023047",
    "accent": "#219EBC",
    "gradient": "linear-gradient(135deg, #FB8500 0%, #023047 50%, #219EBC 100%)",
    "previewColors": [
      "#FB8500",
      "#023047",
      "#219EBC",
      "#8ECAE6",
      "#FFB703"
    ]
  },
  {
    "id": "sky-20",
    "name": "Lavanta Gökyüzü · Kademe 2",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#560BAD",
    "secondary": "#480CA8",
    "accent": "#3A0CA3",
    "gradient": "linear-gradient(135deg, #560BAD 0%, #480CA8 50%, #3A0CA3 100%)",
    "previewColors": [
      "#560BAD",
      "#480CA8",
      "#3A0CA3",
      "#3F37C9",
      "#7209B7"
    ]
  },
  {
    "id": "sky-21",
    "name": "Kuzey Işıkları (Aurora) · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#B900FF",
    "secondary": "#FF0099",
    "accent": "#3A86FF",
    "gradient": "linear-gradient(135deg, #B900FF 0%, #FF0099 50%, #3A86FF 100%)",
    "previewColors": [
      "#B900FF",
      "#FF0099",
      "#3A86FF",
      "#05FFA1",
      "#00E5FF"
    ]
  },
  {
    "id": "sky-22",
    "name": "Ege Günbatımı · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#8AC926",
    "secondary": "#1982C4",
    "accent": "#6A4C93",
    "gradient": "linear-gradient(135deg, #8AC926 0%, #1982C4 50%, #6A4C93 100%)",
    "previewColors": [
      "#8AC926",
      "#1982C4",
      "#6A4C93",
      "#FF595E",
      "#FFCA3A"
    ]
  },
  {
    "id": "sky-23",
    "name": "Altın Saat (Golden Hour) · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#FF0054",
    "secondary": "#9E0059",
    "accent": "#390099",
    "gradient": "linear-gradient(135deg, #FF0054 0%, #9E0059 50%, #390099 100%)",
    "previewColors": [
      "#FF0054",
      "#9E0059",
      "#390099",
      "#FF9E00",
      "#FF6000"
    ]
  },
  {
    "id": "sky-24",
    "name": "Akşam Alacakaranlığı · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#bd6a6b",
    "secondary": "#e08d79",
    "accent": "#f1b590",
    "gradient": "linear-gradient(135deg, #bd6a6b 0%, #e08d79 50%, #f1b590 100%)",
    "previewColors": [
      "#bd6a6b",
      "#e08d79",
      "#f1b590",
      "#5c4d7d",
      "#925e78"
    ]
  },
  {
    "id": "sky-25",
    "name": "Tropikal Şafak · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#7209B7",
    "secondary": "#480CA8",
    "accent": "#3F37C9",
    "gradient": "linear-gradient(135deg, #7209B7 0%, #480CA8 50%, #3F37C9 100%)",
    "previewColors": [
      "#7209B7",
      "#480CA8",
      "#3F37C9",
      "#F72585",
      "#B5179E"
    ]
  },
  {
    "id": "sky-26",
    "name": "Çöl Akşamı · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#E9C46A",
    "secondary": "#2A9D8F",
    "accent": "#264653",
    "gradient": "linear-gradient(135deg, #E9C46A 0%, #2A9D8F 50%, #264653 100%)",
    "previewColors": [
      "#E9C46A",
      "#2A9D8F",
      "#264653",
      "#E76F51",
      "#F4A261"
    ]
  },
  {
    "id": "sky-27",
    "name": "Volkanik Ateş · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#E85D04",
    "secondary": "#F48C06",
    "accent": "#FAA307",
    "gradient": "linear-gradient(135deg, #E85D04 0%, #F48C06 50%, #FAA307 100%)",
    "previewColors": [
      "#E85D04",
      "#F48C06",
      "#FAA307",
      "#D00000",
      "#DC2F02"
    ]
  },
  {
    "id": "sky-28",
    "name": "Gökdelen Silüeti · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#EF233C",
    "secondary": "#D90429",
    "accent": "#FFBA08",
    "gradient": "linear-gradient(135deg, #EF233C 0%, #D90429 50%, #FFBA08 100%)",
    "previewColors": [
      "#EF233C",
      "#D90429",
      "#FFBA08",
      "#2B2D42",
      "#8D99AE"
    ]
  },
  {
    "id": "sky-29",
    "name": "Pembe Bulutlar · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#023047",
    "secondary": "#219EBC",
    "accent": "#8ECAE6",
    "gradient": "linear-gradient(135deg, #023047 0%, #219EBC 50%, #8ECAE6 100%)",
    "previewColors": [
      "#023047",
      "#219EBC",
      "#8ECAE6",
      "#FFB703",
      "#FB8500"
    ]
  },
  {
    "id": "sky-30",
    "name": "Lavanta Gökyüzü · Kademe 3",
    "category": "Günbatımı & Gökyüzü",
    "primary": "#480CA8",
    "secondary": "#3A0CA3",
    "accent": "#3F37C9",
    "gradient": "linear-gradient(135deg, #480CA8 0%, #3A0CA3 50%, #3F37C9 100%)",
    "previewColors": [
      "#480CA8",
      "#3A0CA3",
      "#3F37C9",
      "#7209B7",
      "#560BAD"
    ]
  },
  {
    "id": "gem-1",
    "name": "Kraliyet Yakutu",
    "category": "Değerli Mücevherler",
    "primary": "#9B111E",
    "secondary": "#C70039",
    "accent": "#E83A59",
    "gradient": "linear-gradient(135deg, #9B111E 0%, #C70039 50%, #E83A59 100%)",
    "previewColors": [
      "#9B111E",
      "#C70039",
      "#E83A59",
      "#FF5733",
      "#FFC300"
    ]
  },
  {
    "id": "gem-2",
    "name": "Kraliyet Safiri",
    "category": "Değerli Mücevherler",
    "primary": "#0F52BA",
    "secondary": "#002366",
    "accent": "#1E3F66",
    "gradient": "linear-gradient(135deg, #0F52BA 0%, #002366 50%, #1E3F66 100%)",
    "previewColors": [
      "#0F52BA",
      "#002366",
      "#1E3F66",
      "#5271FF",
      "#89CFF0"
    ]
  },
  {
    "id": "gem-3",
    "name": "Zümrüt Zarafeti",
    "category": "Değerli Mücevherler",
    "primary": "#50C878",
    "secondary": "#00A86B",
    "accent": "#2E8B57",
    "gradient": "linear-gradient(135deg, #50C878 0%, #00A86B 50%, #2E8B57 100%)",
    "previewColors": [
      "#50C878",
      "#00A86B",
      "#2E8B57",
      "#3CB371",
      "#98FB98"
    ]
  },
  {
    "id": "gem-4",
    "name": "Ametist Büyüsü",
    "category": "Değerli Mücevherler",
    "primary": "#9966CC",
    "secondary": "#8A2BE2",
    "accent": "#6A0DAD",
    "gradient": "linear-gradient(135deg, #9966CC 0%, #8A2BE2 50%, #6A0DAD 100%)",
    "previewColors": [
      "#9966CC",
      "#8A2BE2",
      "#6A0DAD",
      "#4B0082",
      "#BA55D3"
    ]
  },
  {
    "id": "gem-5",
    "name": "Kehribar Işığı",
    "category": "Değerli Mücevherler",
    "primary": "#FFBF00",
    "secondary": "#FF7E00",
    "accent": "#FF4500",
    "gradient": "linear-gradient(135deg, #FFBF00 0%, #FF7E00 50%, #FF4500 100%)",
    "previewColors": [
      "#FFBF00",
      "#FF7E00",
      "#FF4500",
      "#DAA520",
      "#B8860B"
    ]
  },
  {
    "id": "gem-6",
    "name": "Akuamarin Berraklığı",
    "category": "Değerli Mücevherler",
    "primary": "#7FFFD4",
    "secondary": "#00CED1",
    "accent": "#48D1CC",
    "gradient": "linear-gradient(135deg, #7FFFD4 0%, #00CED1 50%, #48D1CC 100%)",
    "previewColors": [
      "#7FFFD4",
      "#00CED1",
      "#48D1CC",
      "#40E0D0",
      "#20B2AA"
    ]
  },
  {
    "id": "gem-7",
    "name": "Garnet Kırmızısı",
    "category": "Değerli Mücevherler",
    "primary": "#780000",
    "secondary": "#C1121F",
    "accent": "#FDF0D5",
    "gradient": "linear-gradient(135deg, #780000 0%, #C1121F 50%, #FDF0D5 100%)",
    "previewColors": [
      "#780000",
      "#C1121F",
      "#FDF0D5",
      "#003049",
      "#669BBC"
    ]
  },
  {
    "id": "gem-8",
    "name": "Tanzanit Asaleti",
    "category": "Değerli Mücevherler",
    "primary": "#4D52BA",
    "secondary": "#6B5B95",
    "accent": "#8E7CC3",
    "gradient": "linear-gradient(135deg, #4D52BA 0%, #6B5B95 50%, #8E7CC3 100%)",
    "previewColors": [
      "#4D52BA",
      "#6B5B95",
      "#8E7CC3",
      "#3D2B56",
      "#20124D"
    ]
  },
  {
    "id": "gem-9",
    "name": "Aytaşı Parıltısı",
    "category": "Değerli Mücevherler",
    "primary": "#E0E1DD",
    "secondary": "#778DA9",
    "accent": "#415A77",
    "gradient": "linear-gradient(135deg, #E0E1DD 0%, #778DA9 50%, #415A77 100%)",
    "previewColors": [
      "#E0E1DD",
      "#778DA9",
      "#415A77",
      "#1B263B",
      "#0D1B2A"
    ]
  },
  {
    "id": "gem-10",
    "name": "Platin & Elmas",
    "category": "Değerli Mücevherler",
    "primary": "#E5E5E5",
    "secondary": "#B0BEC5",
    "accent": "#78909C",
    "gradient": "linear-gradient(135deg, #E5E5E5 0%, #B0BEC5 50%, #78909C 100%)",
    "previewColors": [
      "#E5E5E5",
      "#B0BEC5",
      "#78909C",
      "#37474F",
      "#263238"
    ]
  },
  {
    "id": "gem-11",
    "name": "Kraliyet Yakutu · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#C70039",
    "secondary": "#E83A59",
    "accent": "#FF5733",
    "gradient": "linear-gradient(135deg, #C70039 0%, #E83A59 50%, #FF5733 100%)",
    "previewColors": [
      "#C70039",
      "#E83A59",
      "#FF5733",
      "#FFC300",
      "#9B111E"
    ]
  },
  {
    "id": "gem-12",
    "name": "Kraliyet Safiri · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#002366",
    "secondary": "#1E3F66",
    "accent": "#5271FF",
    "gradient": "linear-gradient(135deg, #002366 0%, #1E3F66 50%, #5271FF 100%)",
    "previewColors": [
      "#002366",
      "#1E3F66",
      "#5271FF",
      "#89CFF0",
      "#0F52BA"
    ]
  },
  {
    "id": "gem-13",
    "name": "Zümrüt Zarafeti · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#00A86B",
    "secondary": "#2E8B57",
    "accent": "#3CB371",
    "gradient": "linear-gradient(135deg, #00A86B 0%, #2E8B57 50%, #3CB371 100%)",
    "previewColors": [
      "#00A86B",
      "#2E8B57",
      "#3CB371",
      "#98FB98",
      "#50C878"
    ]
  },
  {
    "id": "gem-14",
    "name": "Ametist Büyüsü · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#8A2BE2",
    "secondary": "#6A0DAD",
    "accent": "#4B0082",
    "gradient": "linear-gradient(135deg, #8A2BE2 0%, #6A0DAD 50%, #4B0082 100%)",
    "previewColors": [
      "#8A2BE2",
      "#6A0DAD",
      "#4B0082",
      "#BA55D3",
      "#9966CC"
    ]
  },
  {
    "id": "gem-15",
    "name": "Kehribar Işığı · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#FF7E00",
    "secondary": "#FF4500",
    "accent": "#DAA520",
    "gradient": "linear-gradient(135deg, #FF7E00 0%, #FF4500 50%, #DAA520 100%)",
    "previewColors": [
      "#FF7E00",
      "#FF4500",
      "#DAA520",
      "#B8860B",
      "#FFBF00"
    ]
  },
  {
    "id": "gem-16",
    "name": "Akuamarin Berraklığı · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#00CED1",
    "secondary": "#48D1CC",
    "accent": "#40E0D0",
    "gradient": "linear-gradient(135deg, #00CED1 0%, #48D1CC 50%, #40E0D0 100%)",
    "previewColors": [
      "#00CED1",
      "#48D1CC",
      "#40E0D0",
      "#20B2AA",
      "#7FFFD4"
    ]
  },
  {
    "id": "gem-17",
    "name": "Garnet Kırmızısı · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#C1121F",
    "secondary": "#FDF0D5",
    "accent": "#003049",
    "gradient": "linear-gradient(135deg, #C1121F 0%, #FDF0D5 50%, #003049 100%)",
    "previewColors": [
      "#C1121F",
      "#FDF0D5",
      "#003049",
      "#669BBC",
      "#780000"
    ]
  },
  {
    "id": "gem-18",
    "name": "Tanzanit Asaleti · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#6B5B95",
    "secondary": "#8E7CC3",
    "accent": "#3D2B56",
    "gradient": "linear-gradient(135deg, #6B5B95 0%, #8E7CC3 50%, #3D2B56 100%)",
    "previewColors": [
      "#6B5B95",
      "#8E7CC3",
      "#3D2B56",
      "#20124D",
      "#4D52BA"
    ]
  },
  {
    "id": "gem-19",
    "name": "Aytaşı Parıltısı · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#778DA9",
    "secondary": "#415A77",
    "accent": "#1B263B",
    "gradient": "linear-gradient(135deg, #778DA9 0%, #415A77 50%, #1B263B 100%)",
    "previewColors": [
      "#778DA9",
      "#415A77",
      "#1B263B",
      "#0D1B2A",
      "#E0E1DD"
    ]
  },
  {
    "id": "gem-20",
    "name": "Platin & Elmas · Kademe 2",
    "category": "Değerli Mücevherler",
    "primary": "#B0BEC5",
    "secondary": "#78909C",
    "accent": "#37474F",
    "gradient": "linear-gradient(135deg, #B0BEC5 0%, #78909C 50%, #37474F 100%)",
    "previewColors": [
      "#B0BEC5",
      "#78909C",
      "#37474F",
      "#263238",
      "#E5E5E5"
    ]
  },
  {
    "id": "gem-21",
    "name": "Kraliyet Yakutu · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#E83A59",
    "secondary": "#FF5733",
    "accent": "#FFC300",
    "gradient": "linear-gradient(135deg, #E83A59 0%, #FF5733 50%, #FFC300 100%)",
    "previewColors": [
      "#E83A59",
      "#FF5733",
      "#FFC300",
      "#9B111E",
      "#C70039"
    ]
  },
  {
    "id": "gem-22",
    "name": "Kraliyet Safiri · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#1E3F66",
    "secondary": "#5271FF",
    "accent": "#89CFF0",
    "gradient": "linear-gradient(135deg, #1E3F66 0%, #5271FF 50%, #89CFF0 100%)",
    "previewColors": [
      "#1E3F66",
      "#5271FF",
      "#89CFF0",
      "#0F52BA",
      "#002366"
    ]
  },
  {
    "id": "gem-23",
    "name": "Zümrüt Zarafeti · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#2E8B57",
    "secondary": "#3CB371",
    "accent": "#98FB98",
    "gradient": "linear-gradient(135deg, #2E8B57 0%, #3CB371 50%, #98FB98 100%)",
    "previewColors": [
      "#2E8B57",
      "#3CB371",
      "#98FB98",
      "#50C878",
      "#00A86B"
    ]
  },
  {
    "id": "gem-24",
    "name": "Ametist Büyüsü · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#6A0DAD",
    "secondary": "#4B0082",
    "accent": "#BA55D3",
    "gradient": "linear-gradient(135deg, #6A0DAD 0%, #4B0082 50%, #BA55D3 100%)",
    "previewColors": [
      "#6A0DAD",
      "#4B0082",
      "#BA55D3",
      "#9966CC",
      "#8A2BE2"
    ]
  },
  {
    "id": "gem-25",
    "name": "Kehribar Işığı · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#FF4500",
    "secondary": "#DAA520",
    "accent": "#B8860B",
    "gradient": "linear-gradient(135deg, #FF4500 0%, #DAA520 50%, #B8860B 100%)",
    "previewColors": [
      "#FF4500",
      "#DAA520",
      "#B8860B",
      "#FFBF00",
      "#FF7E00"
    ]
  },
  {
    "id": "gem-26",
    "name": "Akuamarin Berraklığı · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#48D1CC",
    "secondary": "#40E0D0",
    "accent": "#20B2AA",
    "gradient": "linear-gradient(135deg, #48D1CC 0%, #40E0D0 50%, #20B2AA 100%)",
    "previewColors": [
      "#48D1CC",
      "#40E0D0",
      "#20B2AA",
      "#7FFFD4",
      "#00CED1"
    ]
  },
  {
    "id": "gem-27",
    "name": "Garnet Kırmızısı · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#FDF0D5",
    "secondary": "#003049",
    "accent": "#669BBC",
    "gradient": "linear-gradient(135deg, #FDF0D5 0%, #003049 50%, #669BBC 100%)",
    "previewColors": [
      "#FDF0D5",
      "#003049",
      "#669BBC",
      "#780000",
      "#C1121F"
    ]
  },
  {
    "id": "gem-28",
    "name": "Tanzanit Asaleti · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#8E7CC3",
    "secondary": "#3D2B56",
    "accent": "#20124D",
    "gradient": "linear-gradient(135deg, #8E7CC3 0%, #3D2B56 50%, #20124D 100%)",
    "previewColors": [
      "#8E7CC3",
      "#3D2B56",
      "#20124D",
      "#4D52BA",
      "#6B5B95"
    ]
  },
  {
    "id": "gem-29",
    "name": "Aytaşı Parıltısı · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#415A77",
    "secondary": "#1B263B",
    "accent": "#0D1B2A",
    "gradient": "linear-gradient(135deg, #415A77 0%, #1B263B 50%, #0D1B2A 100%)",
    "previewColors": [
      "#415A77",
      "#1B263B",
      "#0D1B2A",
      "#E0E1DD",
      "#778DA9"
    ]
  },
  {
    "id": "gem-30",
    "name": "Platin & Elmas · Kademe 3",
    "category": "Değerli Mücevherler",
    "primary": "#78909C",
    "secondary": "#37474F",
    "accent": "#263238",
    "gradient": "linear-gradient(135deg, #78909C 0%, #37474F 50%, #263238 100%)",
    "previewColors": [
      "#78909C",
      "#37474F",
      "#263238",
      "#E5E5E5",
      "#B0BEC5"
    ]
  },
  {
    "id": "candy-1",
    "name": "Pamuk Şeker",
    "category": "Pastel & Şekerleme",
    "primary": "#FFB3BA",
    "secondary": "#FFDFBA",
    "accent": "#FFFFBA",
    "gradient": "linear-gradient(135deg, #FFB3BA 0%, #FFDFBA 50%, #FFFFBA 100%)",
    "previewColors": [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF"
    ]
  },
  {
    "id": "candy-2",
    "name": "Nane & Makaron",
    "category": "Pastel & Şekerleme",
    "primary": "#A8E6CF",
    "secondary": "#DCEDC1",
    "accent": "#FFD3B6",
    "gradient": "linear-gradient(135deg, #A8E6CF 0%, #DCEDC1 50%, #FFD3B6 100%)",
    "previewColors": [
      "#A8E6CF",
      "#DCEDC1",
      "#FFD3B6",
      "#FFAAA6",
      "#FF8B94"
    ]
  },
  {
    "id": "candy-3",
    "name": "Lavanta Rüyası",
    "category": "Pastel & Şekerleme",
    "primary": "#E6E6FA",
    "secondary": "#D8BFD8",
    "accent": "#DDA0DD",
    "gradient": "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 50%, #DDA0DD 100%)",
    "previewColors": [
      "#E6E6FA",
      "#D8BFD8",
      "#DDA0DD",
      "#EE82EE",
      "#DA70D6"
    ]
  },
  {
    "id": "candy-4",
    "name": "Şeftali Çiçeği",
    "category": "Pastel & Şekerleme",
    "primary": "#FFCBA4",
    "secondary": "#F4A460",
    "accent": "#E9967A",
    "gradient": "linear-gradient(135deg, #FFCBA4 0%, #F4A460 50%, #E9967A 100%)",
    "previewColors": [
      "#FFCBA4",
      "#F4A460",
      "#E9967A",
      "#FA8072",
      "#FFA07A"
    ]
  },
  {
    "id": "candy-5",
    "name": "Böğürtlenli Dondurma",
    "category": "Pastel & Şekerleme",
    "primary": "#CDB4DB",
    "secondary": "#FFC8DD",
    "accent": "#FFAFCC",
    "gradient": "linear-gradient(135deg, #CDB4DB 0%, #FFC8DD 50%, #FFAFCC 100%)",
    "previewColors": [
      "#CDB4DB",
      "#FFC8DD",
      "#FFAFCC",
      "#BDE0FE",
      "#A2D2FF"
    ]
  },
  {
    "id": "candy-6",
    "name": "Çilekli Süt",
    "category": "Pastel & Şekerleme",
    "primary": "#FAD2E1",
    "secondary": "#C5DEDD",
    "accent": "#DBE7E4",
    "gradient": "linear-gradient(135deg, #FAD2E1 0%, #C5DEDD 50%, #DBE7E4 100%)",
    "previewColors": [
      "#FAD2E1",
      "#C5DEDD",
      "#DBE7E4",
      "#F0E6EF",
      "#BCD4E6"
    ]
  },
  {
    "id": "candy-7",
    "name": "Limon & Fesleğen",
    "category": "Pastel & Şekerleme",
    "primary": "#F4F1DE",
    "secondary": "#E07A5F",
    "accent": "#3D405B",
    "gradient": "linear-gradient(135deg, #F4F1DE 0%, #E07A5F 50%, #3D405B 100%)",
    "previewColors": [
      "#F4F1DE",
      "#E07A5F",
      "#3D405B",
      "#81B29A",
      "#F2CC8F"
    ]
  },
  {
    "id": "candy-8",
    "name": "Vanilya & Karamel",
    "category": "Pastel & Şekerleme",
    "primary": "#EDE0D4",
    "secondary": "#E6CCB2",
    "accent": "#DDB892",
    "gradient": "linear-gradient(135deg, #EDE0D4 0%, #E6CCB2 50%, #DDB892 100%)",
    "previewColors": [
      "#EDE0D4",
      "#E6CCB2",
      "#DDB892",
      "#B08968",
      "#7F5539"
    ]
  },
  {
    "id": "candy-9",
    "name": "Marshmallow Bulutu",
    "category": "Pastel & Şekerleme",
    "primary": "#F3C4FB",
    "secondary": "#D4AC0D",
    "accent": "#A3E4D7",
    "gradient": "linear-gradient(135deg, #F3C4FB 0%, #D4AC0D 50%, #A3E4D7 100%)",
    "previewColors": [
      "#F3C4FB",
      "#D4AC0D",
      "#A3E4D7",
      "#F9E79F",
      "#FADBD8"
    ]
  },
  {
    "id": "candy-10",
    "name": "Yaban Mersini Cupcake",
    "category": "Pastel & Şekerleme",
    "primary": "#B8B8FF",
    "secondary": "#9381FF",
    "accent": "#FFEEDD",
    "gradient": "linear-gradient(135deg, #B8B8FF 0%, #9381FF 50%, #FFEEDD 100%)",
    "previewColors": [
      "#B8B8FF",
      "#9381FF",
      "#FFEEDD",
      "#FFD8BE",
      "#F7ECE1"
    ]
  },
  {
    "id": "candy-11",
    "name": "Pamuk Şeker · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#FFDFBA",
    "secondary": "#FFFFBA",
    "accent": "#BAFFC9",
    "gradient": "linear-gradient(135deg, #FFDFBA 0%, #FFFFBA 50%, #BAFFC9 100%)",
    "previewColors": [
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#FFB3BA"
    ]
  },
  {
    "id": "candy-12",
    "name": "Nane & Makaron · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#DCEDC1",
    "secondary": "#FFD3B6",
    "accent": "#FFAAA6",
    "gradient": "linear-gradient(135deg, #DCEDC1 0%, #FFD3B6 50%, #FFAAA6 100%)",
    "previewColors": [
      "#DCEDC1",
      "#FFD3B6",
      "#FFAAA6",
      "#FF8B94",
      "#A8E6CF"
    ]
  },
  {
    "id": "candy-13",
    "name": "Lavanta Rüyası · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#D8BFD8",
    "secondary": "#DDA0DD",
    "accent": "#EE82EE",
    "gradient": "linear-gradient(135deg, #D8BFD8 0%, #DDA0DD 50%, #EE82EE 100%)",
    "previewColors": [
      "#D8BFD8",
      "#DDA0DD",
      "#EE82EE",
      "#DA70D6",
      "#E6E6FA"
    ]
  },
  {
    "id": "candy-14",
    "name": "Şeftali Çiçeği · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#F4A460",
    "secondary": "#E9967A",
    "accent": "#FA8072",
    "gradient": "linear-gradient(135deg, #F4A460 0%, #E9967A 50%, #FA8072 100%)",
    "previewColors": [
      "#F4A460",
      "#E9967A",
      "#FA8072",
      "#FFA07A",
      "#FFCBA4"
    ]
  },
  {
    "id": "candy-15",
    "name": "Böğürtlenli Dondurma · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#FFC8DD",
    "secondary": "#FFAFCC",
    "accent": "#BDE0FE",
    "gradient": "linear-gradient(135deg, #FFC8DD 0%, #FFAFCC 50%, #BDE0FE 100%)",
    "previewColors": [
      "#FFC8DD",
      "#FFAFCC",
      "#BDE0FE",
      "#A2D2FF",
      "#CDB4DB"
    ]
  },
  {
    "id": "candy-16",
    "name": "Çilekli Süt · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#C5DEDD",
    "secondary": "#DBE7E4",
    "accent": "#F0E6EF",
    "gradient": "linear-gradient(135deg, #C5DEDD 0%, #DBE7E4 50%, #F0E6EF 100%)",
    "previewColors": [
      "#C5DEDD",
      "#DBE7E4",
      "#F0E6EF",
      "#BCD4E6",
      "#FAD2E1"
    ]
  },
  {
    "id": "candy-17",
    "name": "Limon & Fesleğen · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#E07A5F",
    "secondary": "#3D405B",
    "accent": "#81B29A",
    "gradient": "linear-gradient(135deg, #E07A5F 0%, #3D405B 50%, #81B29A 100%)",
    "previewColors": [
      "#E07A5F",
      "#3D405B",
      "#81B29A",
      "#F2CC8F",
      "#F4F1DE"
    ]
  },
  {
    "id": "candy-18",
    "name": "Vanilya & Karamel · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#E6CCB2",
    "secondary": "#DDB892",
    "accent": "#B08968",
    "gradient": "linear-gradient(135deg, #E6CCB2 0%, #DDB892 50%, #B08968 100%)",
    "previewColors": [
      "#E6CCB2",
      "#DDB892",
      "#B08968",
      "#7F5539",
      "#EDE0D4"
    ]
  },
  {
    "id": "candy-19",
    "name": "Marshmallow Bulutu · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#D4AC0D",
    "secondary": "#A3E4D7",
    "accent": "#F9E79F",
    "gradient": "linear-gradient(135deg, #D4AC0D 0%, #A3E4D7 50%, #F9E79F 100%)",
    "previewColors": [
      "#D4AC0D",
      "#A3E4D7",
      "#F9E79F",
      "#FADBD8",
      "#F3C4FB"
    ]
  },
  {
    "id": "candy-20",
    "name": "Yaban Mersini Cupcake · Kademe 2",
    "category": "Pastel & Şekerleme",
    "primary": "#9381FF",
    "secondary": "#FFEEDD",
    "accent": "#FFD8BE",
    "gradient": "linear-gradient(135deg, #9381FF 0%, #FFEEDD 50%, #FFD8BE 100%)",
    "previewColors": [
      "#9381FF",
      "#FFEEDD",
      "#FFD8BE",
      "#F7ECE1",
      "#B8B8FF"
    ]
  },
  {
    "id": "candy-21",
    "name": "Pamuk Şeker · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#FFFFBA",
    "secondary": "#BAFFC9",
    "accent": "#BAE1FF",
    "gradient": "linear-gradient(135deg, #FFFFBA 0%, #BAFFC9 50%, #BAE1FF 100%)",
    "previewColors": [
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#FFB3BA",
      "#FFDFBA"
    ]
  },
  {
    "id": "candy-22",
    "name": "Nane & Makaron · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#FFD3B6",
    "secondary": "#FFAAA6",
    "accent": "#FF8B94",
    "gradient": "linear-gradient(135deg, #FFD3B6 0%, #FFAAA6 50%, #FF8B94 100%)",
    "previewColors": [
      "#FFD3B6",
      "#FFAAA6",
      "#FF8B94",
      "#A8E6CF",
      "#DCEDC1"
    ]
  },
  {
    "id": "candy-23",
    "name": "Lavanta Rüyası · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#DDA0DD",
    "secondary": "#EE82EE",
    "accent": "#DA70D6",
    "gradient": "linear-gradient(135deg, #DDA0DD 0%, #EE82EE 50%, #DA70D6 100%)",
    "previewColors": [
      "#DDA0DD",
      "#EE82EE",
      "#DA70D6",
      "#E6E6FA",
      "#D8BFD8"
    ]
  },
  {
    "id": "candy-24",
    "name": "Şeftali Çiçeği · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#E9967A",
    "secondary": "#FA8072",
    "accent": "#FFA07A",
    "gradient": "linear-gradient(135deg, #E9967A 0%, #FA8072 50%, #FFA07A 100%)",
    "previewColors": [
      "#E9967A",
      "#FA8072",
      "#FFA07A",
      "#FFCBA4",
      "#F4A460"
    ]
  },
  {
    "id": "candy-25",
    "name": "Böğürtlenli Dondurma · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#FFAFCC",
    "secondary": "#BDE0FE",
    "accent": "#A2D2FF",
    "gradient": "linear-gradient(135deg, #FFAFCC 0%, #BDE0FE 50%, #A2D2FF 100%)",
    "previewColors": [
      "#FFAFCC",
      "#BDE0FE",
      "#A2D2FF",
      "#CDB4DB",
      "#FFC8DD"
    ]
  },
  {
    "id": "candy-26",
    "name": "Çilekli Süt · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#DBE7E4",
    "secondary": "#F0E6EF",
    "accent": "#BCD4E6",
    "gradient": "linear-gradient(135deg, #DBE7E4 0%, #F0E6EF 50%, #BCD4E6 100%)",
    "previewColors": [
      "#DBE7E4",
      "#F0E6EF",
      "#BCD4E6",
      "#FAD2E1",
      "#C5DEDD"
    ]
  },
  {
    "id": "candy-27",
    "name": "Limon & Fesleğen · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#3D405B",
    "secondary": "#81B29A",
    "accent": "#F2CC8F",
    "gradient": "linear-gradient(135deg, #3D405B 0%, #81B29A 50%, #F2CC8F 100%)",
    "previewColors": [
      "#3D405B",
      "#81B29A",
      "#F2CC8F",
      "#F4F1DE",
      "#E07A5F"
    ]
  },
  {
    "id": "candy-28",
    "name": "Vanilya & Karamel · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#DDB892",
    "secondary": "#B08968",
    "accent": "#7F5539",
    "gradient": "linear-gradient(135deg, #DDB892 0%, #B08968 50%, #7F5539 100%)",
    "previewColors": [
      "#DDB892",
      "#B08968",
      "#7F5539",
      "#EDE0D4",
      "#E6CCB2"
    ]
  },
  {
    "id": "candy-29",
    "name": "Marshmallow Bulutu · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#A3E4D7",
    "secondary": "#F9E79F",
    "accent": "#FADBD8",
    "gradient": "linear-gradient(135deg, #A3E4D7 0%, #F9E79F 50%, #FADBD8 100%)",
    "previewColors": [
      "#A3E4D7",
      "#F9E79F",
      "#FADBD8",
      "#F3C4FB",
      "#D4AC0D"
    ]
  },
  {
    "id": "candy-30",
    "name": "Yaban Mersini Cupcake · Kademe 3",
    "category": "Pastel & Şekerleme",
    "primary": "#FFEEDD",
    "secondary": "#FFD8BE",
    "accent": "#F7ECE1",
    "gradient": "linear-gradient(135deg, #FFEEDD 0%, #FFD8BE 50%, #F7ECE1 100%)",
    "previewColors": [
      "#FFEEDD",
      "#FFD8BE",
      "#F7ECE1",
      "#B8B8FF",
      "#9381FF"
    ]
  },
  {
    "id": "galaxy-1",
    "name": "Andromeda Nebulası",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#240046",
    "secondary": "#3C096C",
    "accent": "#5A189A",
    "gradient": "linear-gradient(135deg, #240046 0%, #3C096C 50%, #5A189A 100%)",
    "previewColors": [
      "#240046",
      "#3C096C",
      "#5A189A",
      "#7B2CBF",
      "#9D4EDD"
    ]
  },
  {
    "id": "galaxy-2",
    "name": "Süpernova Patlaması",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#FF5400",
    "secondary": "#FF0054",
    "accent": "#9E0059",
    "gradient": "linear-gradient(135deg, #FF5400 0%, #FF0054 50%, #9E0059 100%)",
    "previewColors": [
      "#FF5400",
      "#FF0054",
      "#9E0059",
      "#FFBD00",
      "#390099"
    ]
  },
  {
    "id": "galaxy-3",
    "name": "Karanlık Madde",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#0B090A",
    "secondary": "#161A1D",
    "accent": "#660708",
    "gradient": "linear-gradient(135deg, #0B090A 0%, #161A1D 50%, #660708 100%)",
    "previewColors": [
      "#0B090A",
      "#161A1D",
      "#660708",
      "#A4161A",
      "#BA181B"
    ]
  },
  {
    "id": "galaxy-4",
    "name": "Kozmik Toz Bulutu",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#4A0E4E",
    "secondary": "#81007F",
    "accent": "#B4009E",
    "gradient": "linear-gradient(135deg, #4A0E4E 0%, #81007F 50%, #B4009E 100%)",
    "previewColors": [
      "#4A0E4E",
      "#81007F",
      "#B4009E",
      "#E300B4",
      "#FF00AA"
    ]
  },
  {
    "id": "galaxy-5",
    "name": "Yıldızlararası Seyahat",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#03071E",
    "secondary": "#370617",
    "accent": "#6A040F",
    "gradient": "linear-gradient(135deg, #03071E 0%, #370617 50%, #6A040F 100%)",
    "previewColors": [
      "#03071E",
      "#370617",
      "#6A040F",
      "#9D0208",
      "#D00000"
    ]
  },
  {
    "id": "galaxy-6",
    "name": "Orion Kuşağı",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#000814",
    "secondary": "#001D3D",
    "accent": "#003566",
    "gradient": "linear-gradient(135deg, #000814 0%, #001D3D 50%, #003566 100%)",
    "previewColors": [
      "#000814",
      "#001D3D",
      "#003566",
      "#FFC300",
      "#FFD60A"
    ]
  },
  {
    "id": "galaxy-7",
    "name": "Ay Krateri",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#1E1E24",
    "secondary": "#92140C",
    "accent": "#FFF8F0",
    "gradient": "linear-gradient(135deg, #1E1E24 0%, #92140C 50%, #FFF8F0 100%)",
    "previewColors": [
      "#1E1E24",
      "#92140C",
      "#FFF8F0",
      "#FFCF99",
      "#111111"
    ]
  },
  {
    "id": "galaxy-8",
    "name": "Derin Boşluk Pulsarı",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#480CA8",
    "secondary": "#3A0CA3",
    "accent": "#3F37C9",
    "gradient": "linear-gradient(135deg, #480CA8 0%, #3A0CA3 50%, #3F37C9 100%)",
    "previewColors": [
      "#480CA8",
      "#3A0CA3",
      "#3F37C9",
      "#4361EE",
      "#4CC9F0"
    ]
  },
  {
    "id": "galaxy-9",
    "name": "Güneş Rüzgarı",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#E63946",
    "secondary": "#F1FAEE",
    "accent": "#A8DADC",
    "gradient": "linear-gradient(135deg, #E63946 0%, #F1FAEE 50%, #A8DADC 100%)",
    "previewColors": [
      "#E63946",
      "#F1FAEE",
      "#A8DADC",
      "#457B9D",
      "#1D3557"
    ]
  },
  {
    "id": "galaxy-10",
    "name": "Gama Işını Fışkırması",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#7209B7",
    "secondary": "#F72585",
    "accent": "#4CC9F0",
    "gradient": "linear-gradient(135deg, #7209B7 0%, #F72585 50%, #4CC9F0 100%)",
    "previewColors": [
      "#7209B7",
      "#F72585",
      "#4CC9F0",
      "#3F37C9",
      "#4895EF"
    ]
  },
  {
    "id": "galaxy-11",
    "name": "Andromeda Nebulası · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#3C096C",
    "secondary": "#5A189A",
    "accent": "#7B2CBF",
    "gradient": "linear-gradient(135deg, #3C096C 0%, #5A189A 50%, #7B2CBF 100%)",
    "previewColors": [
      "#3C096C",
      "#5A189A",
      "#7B2CBF",
      "#9D4EDD",
      "#240046"
    ]
  },
  {
    "id": "galaxy-12",
    "name": "Süpernova Patlaması · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#FF0054",
    "secondary": "#9E0059",
    "accent": "#FFBD00",
    "gradient": "linear-gradient(135deg, #FF0054 0%, #9E0059 50%, #FFBD00 100%)",
    "previewColors": [
      "#FF0054",
      "#9E0059",
      "#FFBD00",
      "#390099",
      "#FF5400"
    ]
  },
  {
    "id": "galaxy-13",
    "name": "Karanlık Madde · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#161A1D",
    "secondary": "#660708",
    "accent": "#A4161A",
    "gradient": "linear-gradient(135deg, #161A1D 0%, #660708 50%, #A4161A 100%)",
    "previewColors": [
      "#161A1D",
      "#660708",
      "#A4161A",
      "#BA181B",
      "#0B090A"
    ]
  },
  {
    "id": "galaxy-14",
    "name": "Kozmik Toz Bulutu · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#81007F",
    "secondary": "#B4009E",
    "accent": "#E300B4",
    "gradient": "linear-gradient(135deg, #81007F 0%, #B4009E 50%, #E300B4 100%)",
    "previewColors": [
      "#81007F",
      "#B4009E",
      "#E300B4",
      "#FF00AA",
      "#4A0E4E"
    ]
  },
  {
    "id": "galaxy-15",
    "name": "Yıldızlararası Seyahat · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#370617",
    "secondary": "#6A040F",
    "accent": "#9D0208",
    "gradient": "linear-gradient(135deg, #370617 0%, #6A040F 50%, #9D0208 100%)",
    "previewColors": [
      "#370617",
      "#6A040F",
      "#9D0208",
      "#D00000",
      "#03071E"
    ]
  },
  {
    "id": "galaxy-16",
    "name": "Orion Kuşağı · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#001D3D",
    "secondary": "#003566",
    "accent": "#FFC300",
    "gradient": "linear-gradient(135deg, #001D3D 0%, #003566 50%, #FFC300 100%)",
    "previewColors": [
      "#001D3D",
      "#003566",
      "#FFC300",
      "#FFD60A",
      "#000814"
    ]
  },
  {
    "id": "galaxy-17",
    "name": "Ay Krateri · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#92140C",
    "secondary": "#FFF8F0",
    "accent": "#FFCF99",
    "gradient": "linear-gradient(135deg, #92140C 0%, #FFF8F0 50%, #FFCF99 100%)",
    "previewColors": [
      "#92140C",
      "#FFF8F0",
      "#FFCF99",
      "#111111",
      "#1E1E24"
    ]
  },
  {
    "id": "galaxy-18",
    "name": "Derin Boşluk Pulsarı · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#3A0CA3",
    "secondary": "#3F37C9",
    "accent": "#4361EE",
    "gradient": "linear-gradient(135deg, #3A0CA3 0%, #3F37C9 50%, #4361EE 100%)",
    "previewColors": [
      "#3A0CA3",
      "#3F37C9",
      "#4361EE",
      "#4CC9F0",
      "#480CA8"
    ]
  },
  {
    "id": "galaxy-19",
    "name": "Güneş Rüzgarı · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#F1FAEE",
    "secondary": "#A8DADC",
    "accent": "#457B9D",
    "gradient": "linear-gradient(135deg, #F1FAEE 0%, #A8DADC 50%, #457B9D 100%)",
    "previewColors": [
      "#F1FAEE",
      "#A8DADC",
      "#457B9D",
      "#1D3557",
      "#E63946"
    ]
  },
  {
    "id": "galaxy-20",
    "name": "Gama Işını Fışkırması · Kademe 2",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#F72585",
    "secondary": "#4CC9F0",
    "accent": "#3F37C9",
    "gradient": "linear-gradient(135deg, #F72585 0%, #4CC9F0 50%, #3F37C9 100%)",
    "previewColors": [
      "#F72585",
      "#4CC9F0",
      "#3F37C9",
      "#4895EF",
      "#7209B7"
    ]
  },
  {
    "id": "galaxy-21",
    "name": "Andromeda Nebulası · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#5A189A",
    "secondary": "#7B2CBF",
    "accent": "#9D4EDD",
    "gradient": "linear-gradient(135deg, #5A189A 0%, #7B2CBF 50%, #9D4EDD 100%)",
    "previewColors": [
      "#5A189A",
      "#7B2CBF",
      "#9D4EDD",
      "#240046",
      "#3C096C"
    ]
  },
  {
    "id": "galaxy-22",
    "name": "Süpernova Patlaması · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#9E0059",
    "secondary": "#FFBD00",
    "accent": "#390099",
    "gradient": "linear-gradient(135deg, #9E0059 0%, #FFBD00 50%, #390099 100%)",
    "previewColors": [
      "#9E0059",
      "#FFBD00",
      "#390099",
      "#FF5400",
      "#FF0054"
    ]
  },
  {
    "id": "galaxy-23",
    "name": "Karanlık Madde · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#660708",
    "secondary": "#A4161A",
    "accent": "#BA181B",
    "gradient": "linear-gradient(135deg, #660708 0%, #A4161A 50%, #BA181B 100%)",
    "previewColors": [
      "#660708",
      "#A4161A",
      "#BA181B",
      "#0B090A",
      "#161A1D"
    ]
  },
  {
    "id": "galaxy-24",
    "name": "Kozmik Toz Bulutu · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#B4009E",
    "secondary": "#E300B4",
    "accent": "#FF00AA",
    "gradient": "linear-gradient(135deg, #B4009E 0%, #E300B4 50%, #FF00AA 100%)",
    "previewColors": [
      "#B4009E",
      "#E300B4",
      "#FF00AA",
      "#4A0E4E",
      "#81007F"
    ]
  },
  {
    "id": "galaxy-25",
    "name": "Yıldızlararası Seyahat · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#6A040F",
    "secondary": "#9D0208",
    "accent": "#D00000",
    "gradient": "linear-gradient(135deg, #6A040F 0%, #9D0208 50%, #D00000 100%)",
    "previewColors": [
      "#6A040F",
      "#9D0208",
      "#D00000",
      "#03071E",
      "#370617"
    ]
  },
  {
    "id": "galaxy-26",
    "name": "Orion Kuşağı · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#003566",
    "secondary": "#FFC300",
    "accent": "#FFD60A",
    "gradient": "linear-gradient(135deg, #003566 0%, #FFC300 50%, #FFD60A 100%)",
    "previewColors": [
      "#003566",
      "#FFC300",
      "#FFD60A",
      "#000814",
      "#001D3D"
    ]
  },
  {
    "id": "galaxy-27",
    "name": "Ay Krateri · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#FFF8F0",
    "secondary": "#FFCF99",
    "accent": "#111111",
    "gradient": "linear-gradient(135deg, #FFF8F0 0%, #FFCF99 50%, #111111 100%)",
    "previewColors": [
      "#FFF8F0",
      "#FFCF99",
      "#111111",
      "#1E1E24",
      "#92140C"
    ]
  },
  {
    "id": "galaxy-28",
    "name": "Derin Boşluk Pulsarı · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#3F37C9",
    "secondary": "#4361EE",
    "accent": "#4CC9F0",
    "gradient": "linear-gradient(135deg, #3F37C9 0%, #4361EE 50%, #4CC9F0 100%)",
    "previewColors": [
      "#3F37C9",
      "#4361EE",
      "#4CC9F0",
      "#480CA8",
      "#3A0CA3"
    ]
  },
  {
    "id": "galaxy-29",
    "name": "Güneş Rüzgarı · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#A8DADC",
    "secondary": "#457B9D",
    "accent": "#1D3557",
    "gradient": "linear-gradient(135deg, #A8DADC 0%, #457B9D 50%, #1D3557 100%)",
    "previewColors": [
      "#A8DADC",
      "#457B9D",
      "#1D3557",
      "#E63946",
      "#F1FAEE"
    ]
  },
  {
    "id": "galaxy-30",
    "name": "Gama Işını Fışkırması · Kademe 3",
    "category": "Kozmik Galaksi & Uzay",
    "primary": "#4CC9F0",
    "secondary": "#3F37C9",
    "accent": "#4895EF",
    "gradient": "linear-gradient(135deg, #4CC9F0 0%, #3F37C9 50%, #4895EF 100%)",
    "previewColors": [
      "#4CC9F0",
      "#3F37C9",
      "#4895EF",
      "#7209B7",
      "#F72585"
    ]
  },
  {
    "id": "uni-1",
    "name": "Oxford Lacivert & Altın",
    "category": "Akademik & Dünya Prestij",
    "primary": "#002147",
    "secondary": "#FFD700",
    "accent": "#1E3F66",
    "gradient": "linear-gradient(135deg, #002147 0%, #FFD700 50%, #1E3F66 100%)",
    "previewColors": [
      "#002147",
      "#FFD700",
      "#1E3F66",
      "#F5F5F5",
      "#C5A059"
    ]
  },
  {
    "id": "uni-2",
    "name": "Cambridge Kızıl & Fildişi",
    "category": "Akademik & Dünya Prestij",
    "primary": "#A3C1AD",
    "secondary": "#A51C30",
    "accent": "#003057",
    "gradient": "linear-gradient(135deg, #A3C1AD 0%, #A51C30 50%, #003057 100%)",
    "previewColors": [
      "#A3C1AD",
      "#A51C30",
      "#003057",
      "#E4D9C5",
      "#2C3E50"
    ]
  },
  {
    "id": "uni-3",
    "name": "Harvard Koyu Kızıl",
    "category": "Akademik & Dünya Prestij",
    "primary": "#A51C30",
    "secondary": "#293352",
    "accent": "#C6B79B",
    "gradient": "linear-gradient(135deg, #A51C30 0%, #293352 50%, #C6B79B 100%)",
    "previewColors": [
      "#A51C30",
      "#293352",
      "#C6B79B",
      "#F3F3F1",
      "#1E1E1E"
    ]
  },
  {
    "id": "uni-4",
    "name": "Stanford Kardinal & Kırmızı",
    "category": "Akademik & Dünya Prestij",
    "primary": "#8C1515",
    "secondary": "#4D4F53",
    "accent": "#B1B3B3",
    "gradient": "linear-gradient(135deg, #8C1515 0%, #4D4F53 50%, #B1B3B3 100%)",
    "previewColors": [
      "#8C1515",
      "#4D4F53",
      "#B1B3B3",
      "#007C92",
      "#000000"
    ]
  },
  {
    "id": "uni-5",
    "name": "MIT Çelik & Kırmızı",
    "category": "Akademik & Dünya Prestij",
    "primary": "#A31F34",
    "secondary": "#8A8B8C",
    "accent": "#C2C0BF",
    "gradient": "linear-gradient(135deg, #A31F34 0%, #8A8B8C 50%, #C2C0BF 100%)",
    "previewColors": [
      "#A31F34",
      "#8A8B8C",
      "#C2C0BF",
      "#000000",
      "#FFFFFF"
    ]
  },
  {
    "id": "uni-6",
    "name": "Yale Kraliyet Mavisi",
    "category": "Akademik & Dünya Prestij",
    "primary": "#00356B",
    "secondary": "#286DC0",
    "accent": "#63A0D0",
    "gradient": "linear-gradient(135deg, #00356B 0%, #286DC0 50%, #63A0D0 100%)",
    "previewColors": [
      "#00356B",
      "#286DC0",
      "#63A0D0",
      "#98C6EA",
      "#BDD6EE"
    ]
  },
  {
    "id": "uni-7",
    "name": "Princeton Siyah & Turuncu",
    "category": "Akademik & Dünya Prestij",
    "primary": "#FF671F",
    "secondary": "#000000",
    "accent": "#707372",
    "gradient": "linear-gradient(135deg, #FF671F 0%, #000000 50%, #707372 100%)",
    "previewColors": [
      "#FF671F",
      "#000000",
      "#707372",
      "#C6C6C6",
      "#FFFFFF"
    ]
  },
  {
    "id": "uni-8",
    "name": "Sorbonne Zarafeti",
    "category": "Akademik & Dünya Prestij",
    "primary": "#1D3557",
    "secondary": "#C99700",
    "accent": "#8E1616",
    "gradient": "linear-gradient(135deg, #1D3557 0%, #C99700 50%, #8E1616 100%)",
    "previewColors": [
      "#1D3557",
      "#C99700",
      "#8E1616",
      "#F4F1DE",
      "#3D405B"
    ]
  },
  {
    "id": "uni-9",
    "name": "Imperial College Çivit",
    "category": "Akademik & Dünya Prestij",
    "primary": "#002E65",
    "secondary": "#EB690B",
    "accent": "#006E90",
    "gradient": "linear-gradient(135deg, #002E65 0%, #EB690B 50%, #006E90 100%)",
    "previewColors": [
      "#002E65",
      "#EB690B",
      "#006E90",
      "#F4F4F4",
      "#2B2D42"
    ]
  },
  {
    "id": "uni-10",
    "name": "Boğaziçi Boğaz Mavisi",
    "category": "Akademik & Dünya Prestij",
    "primary": "#003366",
    "secondary": "#006699",
    "accent": "#3399CC",
    "gradient": "linear-gradient(135deg, #003366 0%, #006699 50%, #3399CC 100%)",
    "previewColors": [
      "#003366",
      "#006699",
      "#3399CC",
      "#99CCFF",
      "#FFCC00"
    ]
  },
  {
    "id": "uni-11",
    "name": "Oxford Lacivert & Altın · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#FFD700",
    "secondary": "#1E3F66",
    "accent": "#F5F5F5",
    "gradient": "linear-gradient(135deg, #FFD700 0%, #1E3F66 50%, #F5F5F5 100%)",
    "previewColors": [
      "#FFD700",
      "#1E3F66",
      "#F5F5F5",
      "#C5A059",
      "#002147"
    ]
  },
  {
    "id": "uni-12",
    "name": "Cambridge Kızıl & Fildişi · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#A51C30",
    "secondary": "#003057",
    "accent": "#E4D9C5",
    "gradient": "linear-gradient(135deg, #A51C30 0%, #003057 50%, #E4D9C5 100%)",
    "previewColors": [
      "#A51C30",
      "#003057",
      "#E4D9C5",
      "#2C3E50",
      "#A3C1AD"
    ]
  },
  {
    "id": "uni-13",
    "name": "Harvard Koyu Kızıl · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#293352",
    "secondary": "#C6B79B",
    "accent": "#F3F3F1",
    "gradient": "linear-gradient(135deg, #293352 0%, #C6B79B 50%, #F3F3F1 100%)",
    "previewColors": [
      "#293352",
      "#C6B79B",
      "#F3F3F1",
      "#1E1E1E",
      "#A51C30"
    ]
  },
  {
    "id": "uni-14",
    "name": "Stanford Kardinal & Kırmızı · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#4D4F53",
    "secondary": "#B1B3B3",
    "accent": "#007C92",
    "gradient": "linear-gradient(135deg, #4D4F53 0%, #B1B3B3 50%, #007C92 100%)",
    "previewColors": [
      "#4D4F53",
      "#B1B3B3",
      "#007C92",
      "#000000",
      "#8C1515"
    ]
  },
  {
    "id": "uni-15",
    "name": "MIT Çelik & Kırmızı · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#8A8B8C",
    "secondary": "#C2C0BF",
    "accent": "#000000",
    "gradient": "linear-gradient(135deg, #8A8B8C 0%, #C2C0BF 50%, #000000 100%)",
    "previewColors": [
      "#8A8B8C",
      "#C2C0BF",
      "#000000",
      "#FFFFFF",
      "#A31F34"
    ]
  },
  {
    "id": "uni-16",
    "name": "Yale Kraliyet Mavisi · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#286DC0",
    "secondary": "#63A0D0",
    "accent": "#98C6EA",
    "gradient": "linear-gradient(135deg, #286DC0 0%, #63A0D0 50%, #98C6EA 100%)",
    "previewColors": [
      "#286DC0",
      "#63A0D0",
      "#98C6EA",
      "#BDD6EE",
      "#00356B"
    ]
  },
  {
    "id": "uni-17",
    "name": "Princeton Siyah & Turuncu · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#000000",
    "secondary": "#707372",
    "accent": "#C6C6C6",
    "gradient": "linear-gradient(135deg, #000000 0%, #707372 50%, #C6C6C6 100%)",
    "previewColors": [
      "#000000",
      "#707372",
      "#C6C6C6",
      "#FFFFFF",
      "#FF671F"
    ]
  },
  {
    "id": "uni-18",
    "name": "Sorbonne Zarafeti · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#C99700",
    "secondary": "#8E1616",
    "accent": "#F4F1DE",
    "gradient": "linear-gradient(135deg, #C99700 0%, #8E1616 50%, #F4F1DE 100%)",
    "previewColors": [
      "#C99700",
      "#8E1616",
      "#F4F1DE",
      "#3D405B",
      "#1D3557"
    ]
  },
  {
    "id": "uni-19",
    "name": "Imperial College Çivit · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#EB690B",
    "secondary": "#006E90",
    "accent": "#F4F4F4",
    "gradient": "linear-gradient(135deg, #EB690B 0%, #006E90 50%, #F4F4F4 100%)",
    "previewColors": [
      "#EB690B",
      "#006E90",
      "#F4F4F4",
      "#2B2D42",
      "#002E65"
    ]
  },
  {
    "id": "uni-20",
    "name": "Boğaziçi Boğaz Mavisi · Kademe 2",
    "category": "Akademik & Dünya Prestij",
    "primary": "#006699",
    "secondary": "#3399CC",
    "accent": "#99CCFF",
    "gradient": "linear-gradient(135deg, #006699 0%, #3399CC 50%, #99CCFF 100%)",
    "previewColors": [
      "#006699",
      "#3399CC",
      "#99CCFF",
      "#FFCC00",
      "#003366"
    ]
  },
  {
    "id": "uni-21",
    "name": "Oxford Lacivert & Altın · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#1E3F66",
    "secondary": "#F5F5F5",
    "accent": "#C5A059",
    "gradient": "linear-gradient(135deg, #1E3F66 0%, #F5F5F5 50%, #C5A059 100%)",
    "previewColors": [
      "#1E3F66",
      "#F5F5F5",
      "#C5A059",
      "#002147",
      "#FFD700"
    ]
  },
  {
    "id": "uni-22",
    "name": "Cambridge Kızıl & Fildişi · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#003057",
    "secondary": "#E4D9C5",
    "accent": "#2C3E50",
    "gradient": "linear-gradient(135deg, #003057 0%, #E4D9C5 50%, #2C3E50 100%)",
    "previewColors": [
      "#003057",
      "#E4D9C5",
      "#2C3E50",
      "#A3C1AD",
      "#A51C30"
    ]
  },
  {
    "id": "uni-23",
    "name": "Harvard Koyu Kızıl · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#C6B79B",
    "secondary": "#F3F3F1",
    "accent": "#1E1E1E",
    "gradient": "linear-gradient(135deg, #C6B79B 0%, #F3F3F1 50%, #1E1E1E 100%)",
    "previewColors": [
      "#C6B79B",
      "#F3F3F1",
      "#1E1E1E",
      "#A51C30",
      "#293352"
    ]
  },
  {
    "id": "uni-24",
    "name": "Stanford Kardinal & Kırmızı · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#B1B3B3",
    "secondary": "#007C92",
    "accent": "#000000",
    "gradient": "linear-gradient(135deg, #B1B3B3 0%, #007C92 50%, #000000 100%)",
    "previewColors": [
      "#B1B3B3",
      "#007C92",
      "#000000",
      "#8C1515",
      "#4D4F53"
    ]
  },
  {
    "id": "uni-25",
    "name": "MIT Çelik & Kırmızı · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#C2C0BF",
    "secondary": "#000000",
    "accent": "#FFFFFF",
    "gradient": "linear-gradient(135deg, #C2C0BF 0%, #000000 50%, #FFFFFF 100%)",
    "previewColors": [
      "#C2C0BF",
      "#000000",
      "#FFFFFF",
      "#A31F34",
      "#8A8B8C"
    ]
  },
  {
    "id": "uni-26",
    "name": "Yale Kraliyet Mavisi · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#63A0D0",
    "secondary": "#98C6EA",
    "accent": "#BDD6EE",
    "gradient": "linear-gradient(135deg, #63A0D0 0%, #98C6EA 50%, #BDD6EE 100%)",
    "previewColors": [
      "#63A0D0",
      "#98C6EA",
      "#BDD6EE",
      "#00356B",
      "#286DC0"
    ]
  },
  {
    "id": "uni-27",
    "name": "Princeton Siyah & Turuncu · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#707372",
    "secondary": "#C6C6C6",
    "accent": "#FFFFFF",
    "gradient": "linear-gradient(135deg, #707372 0%, #C6C6C6 50%, #FFFFFF 100%)",
    "previewColors": [
      "#707372",
      "#C6C6C6",
      "#FFFFFF",
      "#FF671F",
      "#000000"
    ]
  },
  {
    "id": "uni-28",
    "name": "Sorbonne Zarafeti · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#8E1616",
    "secondary": "#F4F1DE",
    "accent": "#3D405B",
    "gradient": "linear-gradient(135deg, #8E1616 0%, #F4F1DE 50%, #3D405B 100%)",
    "previewColors": [
      "#8E1616",
      "#F4F1DE",
      "#3D405B",
      "#1D3557",
      "#C99700"
    ]
  },
  {
    "id": "uni-29",
    "name": "Imperial College Çivit · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#006E90",
    "secondary": "#F4F4F4",
    "accent": "#2B2D42",
    "gradient": "linear-gradient(135deg, #006E90 0%, #F4F4F4 50%, #2B2D42 100%)",
    "previewColors": [
      "#006E90",
      "#F4F4F4",
      "#2B2D42",
      "#002E65",
      "#EB690B"
    ]
  },
  {
    "id": "uni-30",
    "name": "Boğaziçi Boğaz Mavisi · Kademe 3",
    "category": "Akademik & Dünya Prestij",
    "primary": "#3399CC",
    "secondary": "#99CCFF",
    "accent": "#FFCC00",
    "gradient": "linear-gradient(135deg, #3399CC 0%, #99CCFF 50%, #FFCC00 100%)",
    "previewColors": [
      "#3399CC",
      "#99CCFF",
      "#FFCC00",
      "#003366",
      "#006699"
    ]
  }
];

/**
 * Seçilen tema için sitenin her köşesini dönüştüren özel CSS üretir
 */
export function generateThemeCss(theme: StudentTheme): string {
  const p1 = theme.primary;
  const p2 = theme.secondary;
  const p3 = theme.accent;
  const p4 = theme.previewColors[3] || theme.secondary;
  const p5 = theme.previewColors[4] || theme.primary;
  const grad = theme.gradient;
  const gradH = `linear-gradient(90deg, ${p1} 0%, ${p2} 25%, ${p3} 50%, ${p4} 75%, ${p5} 100%)`;

  return `
    :root, .dark {
      --coral: ${p1} !important;
      --teal: ${p2} !important;
      --sun: ${p3} !important;
      --indigo: ${p4} !important;
      --brand-1: ${p1} !important;
      --brand-2: ${p2} !important;
      --brand-3: ${p3} !important;
      --brand-4: ${p4} !important;
      --rainbow-gradient-dynamic: ${grad} !important;
      --rainbow-gradient-dynamic-h: ${gradH} !important;
      --theme-active-p1: ${p1} !important;
      --theme-active-p2: ${p2} !important;
    }

    /* 1. Üst Gökkuşağı Şeridi — Tüm site boyunca üst bar */
    .rainbow-gradient-h {
      background: ${gradH} !important;
    }

    /* 2. Gökkuşağı Degrade Paneller */
    .rainbow-gradient, .gradient-progress {
      background: ${grad} !important;
    }

    /* 3. Başlıklar ve Vurgulu Metinler */
    .rainbow-text, .rainbow-text-bright, .gradient-text-brand {
      background: ${grad} !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }

    /* 4. Sayfa Üstü Atmosferik Parıltı (Kullanıcının Seçtiği Tema Rengiyle Yıkanır) */
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 480px;
      background: radial-gradient(ellipse 90% 55% at 50% 0%, ${p1}30 0%, ${p2}18 50%, transparent 80%) !important;
      pointer-events: none;
      z-index: 1;
    }

    /* 5. Vurgulu Eylem Butonları */
    .bg-gradient-to-r.from-rose-500,
    .bg-gradient-to-r.from-emerald-600,
    .bg-gradient-to-r.from-blue-600,
    .bg-gradient-to-r.from-purple-600,
    .bg-gradient-to-r.from-emerald-500 {
      background-image: ${grad} !important;
    }

    /* 6. Çerçeveler ve Parlamalar */
    .rainbow-border-wrap {
      background: ${gradH} !important;
    }

    .rainbow-glow {
      box-shadow: 0 0 35px -5px ${p1}66, 0 0 25px -5px ${p2}66 !important;
    }

    .dark .rainbow-glow {
      box-shadow: 0 0 45px -5px ${p1}88, 0 0 35px -5px ${p2}88 !important;
    }
  `;
}

/**
 * Seçilen temayı anında DOM üzerinde CSS değişkenlerine ve dinamik style etiketine uygular
 */
export function applyStudentTheme(theme: StudentTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  
  root.style.setProperty("--coral", theme.primary);
  root.style.setProperty("--teal", theme.secondary);
  root.style.setProperty("--sun", theme.accent);
  root.style.setProperty("--indigo", theme.previewColors[3] || theme.primary);
  
  root.style.setProperty("--brand-1", theme.primary);
  root.style.setProperty("--brand-2", theme.secondary);
  root.style.setProperty("--brand-3", theme.accent);
  root.style.setProperty("--brand-4", theme.previewColors[3] || theme.secondary);
  
  root.style.setProperty("--rainbow-gradient-dynamic", theme.gradient);
  
  // Kesin çözüm: Sitenin her köşesine anında etki eden global style etiketini enjekte et
  let styleEl = document.getElementById("ielts-active-theme-styles");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "ielts-active-theme-styles";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = generateThemeCss(theme);
  
  try {
    localStorage.setItem("ielts_student_theme", JSON.stringify(theme));
  } catch {}
}

/**
 * Özel temayı kaldırıp sitenin varsayılan gökkuşağı rengine döndürür
 */
export function removeStudentTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.removeProperty("--coral");
  root.style.removeProperty("--teal");
  root.style.removeProperty("--sun");
  root.style.removeProperty("--indigo");
  root.style.removeProperty("--brand-1");
  root.style.removeProperty("--brand-2");
  root.style.removeProperty("--brand-3");
  root.style.removeProperty("--brand-4");
  root.style.removeProperty("--rainbow-gradient-dynamic");
  root.style.removeProperty("--rainbow-gradient-dynamic-h");

  const styleEl = document.getElementById("ielts-active-theme-styles");
  if (styleEl && styleEl.parentNode) {
    styleEl.parentNode.removeChild(styleEl);
  }

  try {
    localStorage.removeItem("ielts_student_theme");
  } catch {}
}

/**
 * Kayıtlı temayı geri yükler
 */
export function loadSavedStudentTheme(): StudentTheme | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ielts_student_theme");
    if (!raw) return null;
    return JSON.parse(raw) as StudentTheme;
  } catch {
    return null;
  }
}
