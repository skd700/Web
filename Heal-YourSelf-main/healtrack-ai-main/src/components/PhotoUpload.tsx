import { useRef, useState } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { analyzeWoundImage } from '@/lib/wound-analysis';
import type { WoundPhoto } from '@/lib/wound-types';
import { generateId } from '@/lib/wound-types';

interface Props {
  caseId: string;
  onPhotoAdded: (photo: WoundPhoto) => void;
}

export default function PhotoUpload({ caseId, onPhotoAdded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const analysis = await analyzeWoundImage(dataUrl);
      const photo: WoundPhoto = {
        id: generateId(),
        caseId,
        dataUrl,
        timestamp: new Date(),
        analysis,
      };
      onPhotoAdded(photo);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-secondary/30">
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center gap-4 text-center"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {analyzing ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Analyzing wound image…</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground">Upload Wound Photo</p>
                <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to select. AI analysis runs automatically.</p>
              </div>
              <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                  e.target.value = '';
                }}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
