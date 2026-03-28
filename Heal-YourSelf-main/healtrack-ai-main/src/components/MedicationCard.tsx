import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Droplets, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WoundAnalysis } from '@/lib/wound-types';
import { getMedicationSuggestions, type MedicationSuggestion } from '@/lib/medication-suggestions';

interface Props {
  analysis: WoundAnalysis;
}

function TypeIcon({ type }: { type: MedicationSuggestion['type'] }) {
  switch (type) {
    case 'oral': return <Pill className="h-4 w-4" />;
    case 'topical': return <Droplets className="h-4 w-4" />;
    case 'care': return <HeartPulse className="h-4 w-4" />;
  }
}

const priorityStyles = {
  essential: 'bg-destructive/10 text-destructive border-destructive/20',
  recommended: 'bg-warning/10 text-warning-foreground border-warning/20',
  optional: 'bg-muted text-muted-foreground border-border',
};

const typeLabels = { oral: 'Oral', topical: 'Topical', care: 'Wound Care' };

export default function MedicationCard({ analysis }: Props) {
  const meds = getMedicationSuggestions(analysis);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Suggested Medications
          </CardTitle>
          <Badge variant="outline" className="text-xs">AI-Generated</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Based on wound analysis scores. Always consult a healthcare provider before taking any medication.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {meds.map((med, i) => (
          <div key={i} className={cn('rounded-lg border p-3 space-y-1.5', priorityStyles[med.priority])}>
            <div className="flex items-center gap-2">
              <TypeIcon type={med.type} />
              <span className="font-heading font-semibold text-sm text-foreground">{med.name}</span>
              <Badge variant="outline" className="ml-auto text-[10px] uppercase tracking-wider">{typeLabels[med.type]}</Badge>
            </div>
            <p className="text-xs font-medium text-foreground/80">{med.dosage}</p>
            <p className="text-xs text-muted-foreground">{med.reason}</p>
          </div>
        ))}

        <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border mt-4">
          <p className="font-semibold text-foreground">⚠️ Important Disclaimer</p>
          <p className="mt-1">These suggestions are AI-generated based on image analysis and are for informational purposes only. 
          They are NOT prescriptions. Always consult your doctor or pharmacist before starting any medication.</p>
        </div>
      </CardContent>
    </Card>
  );
}
