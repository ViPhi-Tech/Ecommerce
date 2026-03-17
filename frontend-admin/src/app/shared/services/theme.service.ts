import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { definePreset } from '@primeng/themes';
import { PrimeNG } from 'primeng/config';
import { Preset } from 'src/prime.theme';

export interface ThemeColor {
  name: string;
  label: string;
  shade500: string;
  palette: Record<string, string>;
}

export const THEME_COLORS: ThemeColor[] = [
  {
    name: 'indigo', label: 'Índigo', shade500: '#6366f1',
    palette: { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',950:'#1e1b4b' },
  },
  {
    name: 'violet', label: 'Violeta', shade500: '#8b5cf6',
    palette: { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95',950:'#2e1065' },
  },
  {
    name: 'purple', label: 'Roxo', shade500: '#a855f7',
    palette: { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87',950:'#3b0764' },
  },
  {
    name: 'blue', label: 'Azul', shade500: '#3b82f6',
    palette: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554' },
  },
  {
    name: 'sky', label: 'Céu', shade500: '#0ea5e9',
    palette: { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e',950:'#082f49' },
  },
  {
    name: 'cyan', label: 'Ciano', shade500: '#06b6d4',
    palette: { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63',950:'#083344' },
  },
  {
    name: 'teal', label: 'Teal', shade500: '#14b8a6',
    palette: { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a',950:'#042f2e' },
  },
  {
    name: 'emerald', label: 'Esmeralda', shade500: '#10b981',
    palette: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
  },
  {
    name: 'green', label: 'Verde', shade500: '#22c55e',
    palette: { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d',950:'#052e16' },
  },
  {
    name: 'amber', label: 'Âmbar', shade500: '#f59e0b',
    palette: { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f',950:'#451a03' },
  },
  {
    name: 'orange', label: 'Laranja', shade500: '#f97316',
    palette: { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12',950:'#431407' },
  },
  {
    name: 'red', label: 'Vermelho', shade500: '#ef4444',
    palette: { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d',950:'#450a0a' },
  },
  {
    name: 'rose', label: 'Rosa', shade500: '#f43f5e',
    palette: { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337',950:'#4c0519' },
  },
  {
    name: 'pink', label: 'Rosa Claro', shade500: '#ec4899',
    palette: { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843',950:'#500724' },
  },
];

const STORAGE_COLOR = 'fuse-theme-color';
const STORAGE_DARK  = 'fuse-theme-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly primeng = inject(PrimeNG);

  readonly darkMode      = signal(false);
  readonly primaryColor  = signal('indigo');

  init(): void {
    const savedDark  = localStorage.getItem(STORAGE_DARK) === 'true';
    const savedColor = localStorage.getItem(STORAGE_COLOR) ?? 'indigo';

    this.applyDark(savedDark);
    this.applyColor(savedColor);
  }

  toggleDarkMode(): void {
    this.applyDark(!this.darkMode());
  }

  setPrimaryColor(name: string): void {
    this.applyColor(name);
  }

  private applyDark(dark: boolean): void {
    this.darkMode.set(dark);
    this.doc.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(STORAGE_DARK, String(dark));
  }

  private applyColor(name: string): void {
    const color = THEME_COLORS.find(c => c.name === name);
    if (!color) return;
    this.primaryColor.set(name);
    const newPreset = definePreset(Preset, {
      semantic: { primary: color.palette },
    });
    this.primeng.theme.set({ preset: newPreset, options: { darkModeSelector: '.dark' } });
    localStorage.setItem(STORAGE_COLOR, name);
  }
}
