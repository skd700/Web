import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Shield, LogIn, UserPlus, Heart } from 'lucide-react';
import { login, register, type User } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const result = login(email, password);
      if (typeof result === 'string') {
        toast({ title: 'Login failed', description: result, variant: 'destructive' });
      } else {
        onLogin(result);
      }
    } else {
      const result = register(name, email, password, role);
      if (typeof result === 'string') {
        toast({ title: 'Registration failed', description: result, variant: 'destructive' });
      } else {
        toast({ title: 'Account created', description: 'Welcome to Heal YourSelf 🧑‍⚕️!' });
        onLogin(result);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center gap-3 px-4">
          <div className="flex items-center gap-2 medical-gradient rounded-lg p-2">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading text-lg font-bold leading-tight tracking-tight text-foreground">Heal YourSelf 🧑‍⚕️</h1>
            <span className="text-xs text-muted-foreground">AI Based Wound Monitoring</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            AI Based Wound Analysis & Medication Suggestions
          </div>
        </div>
      </header>

      {/* Hero + Login */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left: hero info */}
          <div className  ="hidden md:block space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Heart className="h-4 w-4" />
                AI-Powered Wound Analysis
              </div>
              <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
                Track Healing.<br />
                <span className="text-primary">Detect Anomalies.</span><br />
                Share Reports.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Upload wound photos, get instant AI analysis for redness and swelling, 
                compare progress over time, and generate shareable reports for your healthcare provider.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Client-Side AI', desc: 'Privacy-first analysis' },
                { label: 'Progress Tracking', desc: 'Visual comparisons' },
                { label: 'Smart Alerts', desc: 'Risk flagging system' },
              ].map(f => (
                <div key={f.label} className="rounded-xl bg-card border p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: login form */}
          <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 rounded-full medical-gradient p-3 w-fit">
                {mode === 'login' ? <LogIn className="h-6 w-6 text-primary-foreground" /> : <UserPlus className="h-6 w-6 text-primary-foreground" />}
              </div>
              <CardTitle className="font-heading text-xl">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {mode === 'login' ? 'Sign in to access your wound cases' : 'Register to start tracking wound healing'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jane Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="doctor">Doctor / Clinician</SelectItem>
                          <SelectItem value="caregiver">Caregiver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full gap-2">
                  {mode === 'login' ? <><LogIn className="h-4 w-4" /> Sign In</> : <><UserPlus className="h-4 w-4" /> Create Account</>}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Heal YourSelf 🧑‍⚕️ © {new Date().getFullYear()} · For informational purposes only · Not a substitute for medical advice
      </footer>
    </div>
  );
}
