import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RiskBadge from './RiskBadge';
import type { WoundAnalysis } from '@/lib/wound-types';
import { cn } from '@/lib/utils';

interface Props {
  analysis: WoundAnalysis;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisCard({ analysis }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-heading">AI Analysis</CardTitle>
          <RiskBadge risk={analysis.overallRisk} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScoreBar label="Redness" value={analysis.rednessScore} color="bg-destructive" />
        <ScoreBar label="Swelling" value={analysis.swellingScore} color="bg-warning" />
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Healing Score</span>
            <span className={cn(
              "text-2xl font-bold font-heading",
              analysis.healingScore > 70 ? 'text-success' :
              analysis.healingScore > 40 ? 'text-warning' : 'text-destructive'
            )}>
              {analysis.healingScore}
            </span>
          </div>
          <Progress value={analysis.healingScore} className="h-3" />
        </div>
        <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">{analysis.notes}</p>
      </CardContent>
    </Card>
  );
}
