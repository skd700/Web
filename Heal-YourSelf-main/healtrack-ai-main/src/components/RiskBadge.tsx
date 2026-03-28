import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  risk: 'low' | 'medium' | 'high';
  className?: string;
}

export default function RiskBadge({ risk, className }: Props) {
  const config = {
    low: { label: 'Low Risk', icon: CheckCircle, classes: 'bg-success text-success-foreground' },
    medium: { label: 'Medium Risk', icon: AlertCircle, classes: 'bg-warning text-warning-foreground' },
    high: { label: 'High Risk', icon: AlertTriangle, classes: 'bg-destructive text-destructive-foreground' },
  }[risk];

  const Icon = config.icon;

  return (
    <Badge className={cn(config.classes, 'gap-1 font-semibold', className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
