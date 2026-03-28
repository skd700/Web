import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RiskBadge from './RiskBadge';
import { ChartContainer } from './ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import type { WoundCase } from '@/lib/wound-types';
import { format } from 'date-fns';
import { Printer, Pill } from 'lucide-react';
import { getMedicationSuggestions } from '@/lib/medication-suggestions';

interface Props {
  woundCase: WoundCase;
}

export default function ReportView({ woundCase }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const sorted = [...woundCase.photos].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const latestAnalysis = sorted[sorted.length - 1]?.analysis;

  const handlePrint = () => {
    window.print();
  };

  if (woundCase.photos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="font-heading font-medium">No data for report</p>
        <p className="text-sm mt-1">Upload wound photos to generate a shareable report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      <div ref={reportRef} className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="border-b pb-6">
          <h2 className="font-heading text-2xl font-bold text-foreground">Wound Care Progress Report</h2>
          <p className="text-sm text-muted-foreground mt-1">Generated {format(new Date(), 'MMMM d, yyyy · h:mm a')}</p>
        </div>

        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Patient Name</dt>
                <dd className="font-semibold text-foreground">{woundCase.patientName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Surgery Type</dt>
                <dd className="font-semibold text-foreground">{woundCase.surgeryType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Wound Location</dt>
                <dd className="font-semibold text-foreground">{woundCase.woundLocation || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Surgery Date</dt>
                <dd className="font-semibold text-foreground">
                  {woundCase.surgeryDate ? format(new Date(woundCase.surgeryDate), 'MMMM d, yyyy') : 'Not specified'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Current Status */}
        {latestAnalysis && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading">Current Status</CardTitle>
                <RiskBadge risk={latestAnalysis.overallRisk} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold font-heading text-foreground">{latestAnalysis.healingScore}</p>
                  <p className="text-sm text-muted-foreground">Healing Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-heading text-destructive">{latestAnalysis.rednessScore}%</p>
                  <p className="text-sm text-muted-foreground">Redness</p>
                </div>
                <div>
                  <p className="text-3xl font-bold font-heading text-warning">{latestAnalysis.swellingScore}%</p>
                  <p className="text-sm text-muted-foreground">Swelling</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground bg-muted rounded-lg p-3">{latestAnalysis.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Healing trend graph */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Healing Trend</CardTitle>
            <CardDescription>Graph of healing, redness and swelling across uploads.</CardDescription>
          </CardHeader>
          <CardContent>
            {sorted.filter((photo) => photo.analysis).length < 2 ? (
              <p className="text-sm text-muted-foreground">Upload at least two analyzed photos to view a trend graph.</p>
            ) : (
              <ChartContainer
                className="h-72"
                config={{
                  healingScore: { label: 'Healing', color: '#22c55e' },
                  rednessScore: { label: 'Redness', color: '#f97316' },
                  swellingScore: { label: 'Swelling', color: '#f43f5e' },
                }}
              >
                <LineChart
                  data={sorted.filter((photo) => photo.analysis).map((photo) => ({
                    date: format(new Date(photo.timestamp), 'MMM d'),
                    healingScore: photo.analysis?.healingScore ?? 0,
                    rednessScore: photo.analysis?.rednessScore ?? 0,
                    swellingScore: photo.analysis?.swellingScore ?? 0,
                  }))}
                  margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="healingScore" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="rednessScore" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="swellingScore" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading">Photo Timeline ({sorted.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sorted.map((photo, idx) => (
                <div key={photo.id} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border">
                    <img src={photo.dataUrl} alt={`Entry ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Entry {idx + 1} · {format(new Date(photo.timestamp), 'MMM d, yyyy · h:mm a')}
                    </p>
                    {photo.analysis && (
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <RiskBadge risk={photo.analysis.overallRisk} />
                        <span className="text-muted-foreground">Healing: {photo.analysis.healingScore} · Redness: {photo.analysis.rednessScore}% · Swelling: {photo.analysis.swellingScore}%</span>
                      </div>
                    )}
                    {photo.analysis && <p className="text-xs text-muted-foreground mt-1">{photo.analysis.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medication Suggestions */}
        {latestAnalysis && (() => {
          const meds = getMedicationSuggestions(latestAnalysis);
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Pill className="h-5 w-5 text-primary" />
                  Suggested Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meds.map((med, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading font-semibold text-sm text-foreground">{med.name}</span>
                        <Badge variant="outline" className="text-[10px] uppercase">{med.type}</Badge>
                      </div>
                      <p className="text-xs text-foreground/80">{med.dosage}</p>
                      <p className="text-xs text-muted-foreground">{med.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-4 border">
          <p className="font-semibold">Disclaimer</p>
          <p className="mt-1">This report is generated by client-side AI analysis and is intended for informational purposes only. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.</p>
        </div>
      </div>
    </div>
  );
}
