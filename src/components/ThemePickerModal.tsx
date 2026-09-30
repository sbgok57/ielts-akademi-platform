"use client";

// src/components/ThemePickerModal.tsx
// Öğrenciler için 200'den fazla (240 Adet) Renkli Kişiselleştirme Teması
// Canlı önizleme, anında CSS değişkeni atama ve kalıcı kayıt

import React, { useState, useEffect } from "react";
import {
  Palette,
  X,
  Check,
  Search,
  Sparkles,
  RotateCcw,
  Sliders,
} from "lucide-react";
import {
  THEMES_CATALOG,
  THEME_CATEGORIES,
  StudentTheme,
  applyStudentTheme,
  removeStudentTheme,
  loadSavedStudentTheme,
} from "@/lib/themes-catalog";

interface ThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemePickerModal({ isOpen, onClose }: ThemePickerModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeThemeId, setActiveThemeId] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSavedStudentTheme();
    if (saved) {
      setActiveThemeId(saved.id);
      applyStudentTheme(saved);
    }
  }, []);

  if (!isOpen) return null;

  const filteredThemes = THEMES_CATALOG.filter((theme) => {
    const matchesCat =
      selectedCategory === "Tümü" || theme.category === selectedCategory;
    const matchesSearch =
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectTheme = (theme: StudentTheme) => {
    setActiveThemeId(theme.id);
    applyStudentTheme(theme);
    setAppliedNotice(`✨ "${theme.name}" teması uygulandı! Arka plan, kartlar ve butonlar hem aydınlık hem karanlık modda güncellendi.`);
    setTimeout(() => setAppliedNotice(null), 4000);
  };

  const handleResetDefault = () => {
    setActiveThemeId(null);
    removeStudentTheme();
    setAppliedNotice("🌈 Varsayılan gökkuşağı temasına dönüldü!");
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-md animate-fadeIn">
      <div className="flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0c0c0c] overflow-hidden">
        
        {/* Üst Bar: Başlık, İstatistik ve Kapat Butonu */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-6 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Kişisel Renk Teması Seçici
                </h2>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-black text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                  240 Canlı Tema
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seçtiğiniz renk paleti sitenin arka planına, kartlarına ve tüm butonlarına hem aydınlık hem karanlık modda yansır.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefault}
              title="Varsayılan Temaya Dön"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Sıfırla</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-white transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {appliedNotice && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2.5 text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-fadeIn">
            <span>{appliedNotice}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Arka plan, başlıklar ve butonlar güncellendi</span>
          </div>
        )}

        {/* Filtre ve Arama Alanı */}
        <div className="space-y-3 border-b border-slate-100 p-4 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#121212]/50">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="240 tema içinde ara (örn: Neon, Kuzey Işıkları, Oxford, Zümrüt)..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-black dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleResetDefault}
              className="sm:hidden w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Varsayılan Renge Sıfırla</span>
            </button>
          </div>

          {/* Kategori Butonları (Yatay Kaydırılabilir) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {THEME_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-xl px-3 py-1.5 font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-[#181818] dark:text-slate-300 dark:hover:bg-[#222]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 240 Renk Teması Kartları Izgarası */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredThemes.map((theme) => {
              const isSelected = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 text-left transition-all hover:scale-[1.02] shadow-sm ${
                    isSelected
                      ? "border-purple-500 bg-purple-50/70 ring-2 ring-purple-500/20 dark:bg-purple-950/20"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#121212] dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {theme.category}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                        {theme.name}
                      </h4>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Renk Paleti Noktaları ve Degrade Şeridi */}
                  <div className="mt-3 space-y-1.5">
                    <div
                      className="h-2 w-full rounded-full"
                      style={{ background: theme.gradient }}
                    />
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {theme.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="h-4 w-4 rounded-full border border-black/10 dark:border-white/10 shadow-xs"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredThemes.length === 0 && (
            <div className="flex h-40 flex-col items-center justify-center text-center text-xs text-slate-400">
              <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
              <span>Aramanızla eşleşen tema bulunamadı.</span>
            </div>
          )}
        </div>

        {/* Alt Bilgi */}
        <div className="flex items-center justify-between border-t border-slate-100 p-3 sm:p-4 text-xs text-slate-400 dark:border-slate-800/80 bg-white dark:bg-[#0c0c0c]">
          <span>
            {filteredThemes.length} / {THEMES_CATALOG.length} tema gösteriliyor
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-purple-600 px-5 py-2 font-black text-white hover:bg-purple-700 shadow-sm transition"
          >
            Tamamla & Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
