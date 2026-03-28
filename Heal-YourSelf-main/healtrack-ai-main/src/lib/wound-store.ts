import type { WoundCase } from './wound-types';

const STORAGE_KEY = 'wound-care-cases';

export function loadCases(): WoundCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const cases = JSON.parse(raw) as WoundCase[];
    return cases.map(c => ({
      ...c,
      createdAt: new Date(c.createdAt),
      photos: c.photos.map(p => ({ ...p, timestamp: new Date(p.timestamp) })),
    }));
  } catch {
    return [];
  }
}

export function saveCases(cases: WoundCase[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}
