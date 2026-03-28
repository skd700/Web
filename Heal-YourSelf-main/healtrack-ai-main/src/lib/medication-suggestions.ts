import type { WoundAnalysis } from './wound-types';

export interface MedicationSuggestion {
  name: string;
  type: 'topical' | 'oral' | 'care';
  dosage: string;
  reason: string;
  priority: 'essential' | 'recommended' | 'optional';
}

export function getMedicationSuggestions(analysis: WoundAnalysis): MedicationSuggestion[] {
  const meds: MedicationSuggestion[] = [];

  // Always recommended wound care
  meds.push({
    name: 'Sterile Saline Solution',
    type: 'care',
    dosage: 'Clean wound 2-3 times daily',
    reason: 'Basic wound hygiene to prevent infection',
    priority: 'essential',
  });

  // Redness-based suggestions
  if (analysis.rednessScore > 60) {
    meds.push({
      name: 'Mupirocin Ointment (Bactroban)',
      type: 'topical',
      dosage: 'Apply thin layer 3 times daily',
      reason: 'Significant redness detected — topical antibiotic to prevent bacterial infection',
      priority: 'essential',
    });
    meds.push({
      name: 'Cephalexin 500mg',
      type: 'oral',
      dosage: '500mg every 6 hours for 7-10 days',
      reason: 'High redness indicates possible infection — oral antibiotic recommended',
      priority: 'essential',
    });
  } else if (analysis.rednessScore > 30) {
    meds.push({
      name: 'Bacitracin Ointment',
      type: 'topical',
      dosage: 'Apply thin layer 2 times daily',
      reason: 'Moderate redness — preventive topical antibiotic',
      priority: 'recommended',
    });
  }

  // Swelling-based suggestions
  if (analysis.swellingScore > 50) {
    meds.push({
      name: 'Ibuprofen 400mg',
      type: 'oral',
      dosage: '400mg every 6-8 hours with food',
      reason: 'Notable swelling — anti-inflammatory to reduce inflammation and pain',
      priority: 'essential',
    });
    meds.push({
      name: 'Cold Compress',
      type: 'care',
      dosage: 'Apply 15-20 min, 3-4 times daily',
      reason: 'Reduce swelling and provide pain relief',
      priority: 'recommended',
    });
  } else if (analysis.swellingScore > 25) {
    meds.push({
      name: 'Acetaminophen 500mg',
      type: 'oral',
      dosage: '500mg every 4-6 hours as needed',
      reason: 'Mild swelling — pain management',
      priority: 'recommended',
    });
  }

  // High risk additional
  if (analysis.overallRisk === 'high') {
    meds.push({
      name: 'Silver Sulfadiazine Cream',
      type: 'topical',
      dosage: 'Apply 1/16 inch layer 1-2 times daily',
      reason: 'High-risk wound — antimicrobial cream for infection prevention',
      priority: 'essential',
    });
    meds.push({
      name: 'Wound Dressing (Hydrocolloid)',
      type: 'care',
      dosage: 'Change every 3-5 days or when saturated',
      reason: 'Maintains moist healing environment for high-risk wounds',
      priority: 'essential',
    });
  }

  // Healing support
  if (analysis.healingScore < 50) {
    meds.push({
      name: 'Vitamin C 1000mg',
      type: 'oral',
      dosage: '1000mg daily with food',
      reason: 'Supports collagen synthesis and wound healing',
      priority: 'recommended',
    });
    meds.push({
      name: 'Zinc Supplement 50mg',
      type: 'oral',
      dosage: '50mg daily with food',
      reason: 'Essential mineral for tissue repair and immune function',
      priority: 'recommended',
    });
  }

  // General wound care
  meds.push({
    name: 'Petroleum Jelly (Vaseline)',
    type: 'topical',
    dosage: 'Apply thin layer after cleaning',
    reason: 'Keeps wound moist to promote optimal healing',
    priority: 'optional',
  });

  return meds;
}
