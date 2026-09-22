// src/lib/types.ts
// Platform geneli ortak tip tanımları

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'MIXED';

export type SkillType =
  | 'GRAMMAR'
  | 'READING'
  | 'LISTENING'
  | 'SPEAKING'
  | 'WRITING'
  | 'VOCABULARY'
  | 'SCIENCE'
  | 'EXAM'
  | 'ARCHIVE'
  | 'TACTIC';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';

export type Accent = 'en-GB' | 'en-US' | 'en-CA' | 'en-AU' | 'en-NZ' | 'en-IN';

export interface BadgeDefinition {
  code: string;
  family: string;
  metric: string;
  threshold: number;
  tier: BadgeTier;
  rarity: string;
  nameTr: string;
  nameEn: string;
  descriptionTr: string;
  descriptionEn: string;
  iconSrc: string;
  gifSrc?: string | null;
  xpReward: number;
  isSecret?: boolean;
  condition: Record<string, unknown>;
}

export interface QuoteDefinition {
  id: string;
  tr: string;
  en: string;
  category: string;
  mood: string;
  author: string | null;
  source: string | null;
  isOriginal: boolean;
  visual?: Record<string, unknown>;
}
