import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';
import ComparisonView from './ComparisonView';
import ReportView from './ReportView';
import MedicationCard from './MedicationCard';
import RiskBadge from './RiskBadge';
import type { WoundCase, WoundPhoto } from '@/lib/wound-types';
import { ArrowLeft, Camera, GitCompare, FileText, ImageIcon, Pill } from 'lucide-react';

interface Props {
  woundCase: WoundCase;
  onUpdate: (updated: WoundCase) => void;
  onBack: () => void;
}

export default function CaseDashboard({ woundCase, onUpdate, onBack }: Props) {
  const sorted = [...woundCase.photos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const latest = sorted[0]?.analysis;

  const handlePhotoAdded = (photo: WoundPhoto) => {
    onUpdate({ ...woundCase, photos: [...woundCase.photos, photo] });
  };

  return (
    <div className="space-y-6">
      {/* Case header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-heading text-2xl font-bold text-foreground">{woundCase.patientName}</h2>
            {latest && <RiskBadge risk={latest.overallRisk} />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {woundCase.surgeryType} · {woundCase.woundLocation || 'Location N/A'} · {woundCase.photos.length} photo{woundCase.photos.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats cards */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-heading text-foreground">{latest.healingScore}</p>
              <p className="text-xs text-muted-foreground">Healing Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-heading text-destructive">{latest.rednessScore}%</p>
              <p className="text-xs text-muted-foreground">Redness</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-heading text-warning">{latest.swellingScore}%</p>
              <p className="text-xs text-muted-foreground">Swelling</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold font-heading text-foreground">{woundCase.photos.length}</p>
              <p className="text-xs text-muted-foreground">Total Photos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="upload" className="gap-1.5"><Camera className="h-4 w-4" /><span className="hidden sm:inline">Upload</span></TabsTrigger>
          <TabsTrigger value="gallery" className="gap-1.5"><ImageIcon className="h-4 w-4" /><span className="hidden sm:inline">Gallery</span></TabsTrigger>
          <TabsTrigger value="compare" className="gap-1.5"><GitCompare className="h-4 w-4" /><span className="hidden sm:inline">Compare</span></TabsTrigger>
          <TabsTrigger value="meds" className="gap-1.5"><Pill className="h-4 w-4" /><span className="hidden sm:inline">Meds</span></TabsTrigger>
          <TabsTrigger value="report" className="gap-1.5"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Report</span></TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-6">
          <PhotoUpload caseId={woundCase.id} onPhotoAdded={handlePhotoAdded} />
          {sorted.length > 0 && (
            <div className="mt-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">Recent Uploads</h3>
              <PhotoGallery photos={sorted.slice(0, 4)} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="gallery" className="mt-6">
          <PhotoGallery photos={woundCase.photos} />
        </TabsContent>
        <TabsContent value="compare" className="mt-6">
          <ComparisonView photos={woundCase.photos} />
        </TabsContent>
        <TabsContent value="meds" className="mt-6">
          {latest ? (
            <MedicationCard analysis={latest} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-heading font-medium">No analysis available</p>
              <p className="text-sm mt-1">Upload a wound photo first to get medication suggestions.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="report" className="mt-6">
          <ReportView woundCase={woundCase} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
