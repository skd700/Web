import { useEffect, useState } from 'react';
import { Activity, Shield, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/auth-store';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function AppHeader({ user, onLogout }: Props) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-3 px-4">
        <div className="flex items-center gap-2 medical-gradient rounded-lg p-2">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-heading text-lg font-bold leading-tight tracking-tight text-foreground">
            Heal YourSelf 🧑‍⚕️
          </h1>
          <span className="text-xs text-muted-foreground">AI Based Wound Monitoring</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            AI Based Wound Analysis & Medication Suggestions
          </div>
          <div className="flex items-center gap-2 border-l pl-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground hover:text-primary" aria-label="Toggle theme">
              {mounted && currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-1.5 text-sm">
              <div className="rounded-full bg-primary/10 p-1.5">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="hidden sm:inline text-foreground font-medium text-xs">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
