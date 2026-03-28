import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnalysisCard from './AnalysisCard';
import RiskBadge from './RiskBadge';
import type { WoundPhoto } from '@/lib/wound-types';
import { format } from 'date-fns';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  photos: WoundPhoto[];
}

export default function ComparisonView({ photos }: Props) {
  const sorted = [...photos].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const [leftId, setLeftId] = useState<string>(sorted[0]?.id || '');
  const [rightId, setRightId] = useState<string>(sorted[sorted.length - 1]?.id || '');

  if (photos.length < 2) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-heading font-medium">Need at least 2 photos</p>
        <p className="text-sm mt-1">Upload more wound photos to compare healing progress.</p>
      </div>
    );
  }

  const leftPhoto = sorted.find(p => p.id === leftId) || sorted[0];
  const rightPhoto = sorted.find(p => p.id === rightId) || sorted[sorted.length - 1];

  const healingDelta = (rightPhoto.analysis?.healingScore ?? 0) - (leftPhoto.analysis?.healingScore ?? 0);

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Earlier Photo</label>
          <Select value={leftId} onValueChange={setLeftId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sorted.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {format(new Date(p.timestamp), 'MMM d, yyyy · h:mm a')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Later Photo</label>
          <Select value={rightId} onValueChange={setRightId}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sorted.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {format(new Date(p.timestamp), 'MMM d, yyyy · h:mm a')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Delta summary */}
      <Card className={cn(
        healingDelta > 0 ? 'border-success/40 risk-glow-low' :
        healingDelta < 0 ? 'border-destructive/40 risk-glow-high' :
        'border-border'
      )}>
        <CardContent className="p-4 flex items-center gap-3">
          {healingDelta > 0 ? <TrendingUp className="h-6 w-6 text-success" /> :
           healingDelta < 0 ? <TrendingDown className="h-6 w-6 text-destructive" /> :
           <Minus className="h-6 w-6 text-muted-foreground" />}
          <div>
            <p className="font-heading font-semibold text-foreground">
              Healing Score {healingDelta > 0 ? '+' : ''}{healingDelta} points
            </p>
            <p className="text-sm text-muted-foreground">
              {healingDelta > 0 ? 'Wound is improving' : healingDelta < 0 ? 'Condition may be worsening' : 'No significant change'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Side by side */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <img src={leftPhoto.dataUrl} alt="Earlier" className="w-full rounded-lg border aspect-square object-cover" />
          <p className="text-sm text-center text-muted-foreground">{format(new Date(leftPhoto.timestamp), 'MMM d, yyyy · h:mm a')}</p>
          {leftPhoto.analysis && <AnalysisCard analysis={leftPhoto.analysis} />}
        </div>
        <div className="space-y-4">
          <img src={rightPhoto.dataUrl} alt="Later" className="w-full rounded-lg border aspect-square object-cover" />
          <p className="text-sm text-center text-muted-foreground">{format(new Date(rightPhoto.timestamp), 'MMM d, yyyy · h:mm a')}</p>
          {rightPhoto.analysis && <AnalysisCard analysis={rightPhoto.analysis} />}
        </div>
      </div>
    </div>
  );
}
