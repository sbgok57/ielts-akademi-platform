"use client";

// src/components/ThemeInitializer.tsx
// Öğrencinin seçtiği 240+ temayı sayfa açılır açılmaz yükler ve uygular

import { useEffect } from "react";
import { loadSavedStudentTheme, applyStudentTheme } from "@/lib/themes-catalog";

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = loadSavedStudentTheme();
    if (saved) {
      applyStudentTheme(saved);
    }
  }, []);

  return null;
}
