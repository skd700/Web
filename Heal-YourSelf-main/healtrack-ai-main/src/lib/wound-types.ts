export interface WoundPhoto {
  id: string;
  caseId: string;
  dataUrl: string;
  timestamp: Date;
  analysis?: WoundAnalysis;
}

export interface WoundAnalysis {
  rednessScore: number;    // 0-100
  swellingScore: number;   // 0-100
  overallRisk: 'low' | 'medium' | 'high';
  healingScore: number;    // 0-100 (100 = fully healed)
  notes: string;
}

export interface WoundCase {
  id: string;
  patientName: string;
  surgeryType: string;
  woundLocation: string;
  surgeryDate: string;
  photos: WoundPhoto[];
  createdAt: Date;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
