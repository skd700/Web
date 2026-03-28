import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RiskBadge from './RiskBadge';
import AnalysisCard from './AnalysisCard';
import type { WoundPhoto } from '@/lib/wound-types';
import { format } from 'date-fns';

interface Props {
  photos: WoundPhoto[];
}

export default function PhotoGallery({ photos }: Props) {
  const [selected, setSelected] = useState<WoundPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-heading font-medium">No photos yet</p>
        <p className="text-sm mt-1">Upload your first wound photo to begin tracking.</p>
      </div>
    );
  }

  const sorted = [...photos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sorted.map(photo => (
          <Card
            key={photo.id}
            className="cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all group"
            onClick={() => setSelected(photo)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.dataUrl}
                alt={`Wound photo ${format(new Date(photo.timestamp), 'MMM d, yyyy')}`}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-3 space-y-1.5">
              <p className="text-xs text-muted-foreground">{format(new Date(photo.timestamp), 'MMM d, yyyy · h:mm a')}</p>
              {photo.analysis && <RiskBadge risk={photo.analysis.overallRisk} />}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selected && format(new Date(selected.timestamp), 'MMMM d, yyyy · h:mm a')}
            </DialogTitle>
            <DialogDescription>Wound photo details and AI analysis results.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img
                src={selected.dataUrl}
                alt="Wound detail"
                className="w-full rounded-lg border"
              />
              {selected.analysis && <AnalysisCard analysis={selected.analysis} />}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
