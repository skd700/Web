import { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import LoginPage from '@/components/LoginPage';
import NewCaseDialog from '@/components/NewCaseDialog';
import CaseDashboard from '@/components/CaseDashboard';
import RiskBadge from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loadCases, saveCases } from '@/lib/wound-store';
import { getSession, logout, type User } from '@/lib/auth-store';
import type { WoundCase } from '@/lib/wound-types';
import { Plus, FolderOpen, Activity, Trash2 } from 'lucide-react';

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<WoundCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [newCaseOpen, setNewCaseOpen] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  useEffect(() => {
    if (user) setCases(loadCases());
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCases([]);
    setSelectedCaseId(null);
  };

  const persist = (updated: WoundCase[]) => {
    setCases(updated);
    saveCases(updated);
  };

  const handleCreateCase = (newCase: WoundCase) => {
    const updated = [newCase, ...cases];
    persist(updated);
    setSelectedCaseId(newCase.id);
  };

  const handleUpdateCase = (updatedCase: WoundCase) => {
    persist(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this case and all its photos?')) {
      persist(cases.filter(c => c.id !== id));
    }
  };

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <main className="container max-w-5xl px-4 py-8">
        {selectedCase ? (
          <CaseDashboard
            woundCase={selectedCase}
            onUpdate={handleUpdateCase}
            onBack={() => setSelectedCaseId(null)}
          />
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Patient Cases</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track wound healing progress with AI-assisted analysis
                </p>
              </div>
              <Button onClick={() => setNewCaseOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Case
              </Button>
            </div>

            {cases.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Activity className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">No cases yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    Create your first patient case to begin uploading wound photos and tracking healing progress.
                  </p>
                  <Button className="mt-6 gap-2" onClick={() => setNewCaseOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create First Case
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {cases.map(c => {
                  const latest = c.photos.length > 0
                    ? [...c.photos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
                    : null;
                  return (
                    <Card
                      key={c.id}
                      className="cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all group"
                      onClick={() => setSelectedCaseId(c.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-heading truncate">{c.patientName}</CardTitle>
                            <CardDescription className="truncate">{c.surgeryType} · {c.woundLocation || 'N/A'}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={(e) => handleDeleteCase(c.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FolderOpen className="h-4 w-4" />
                          {c.photos.length} photo{c.photos.length !== 1 ? 's' : ''}
                        </div>
                        {latest?.analysis && <RiskBadge risk={latest.analysis.overallRisk} />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <NewCaseDialog open={newCaseOpen} onOpenChange={setNewCaseOpen} onCreateCase={handleCreateCase} />
          </div>
        )}
      </main>
    </div>
  );
}
