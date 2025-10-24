import { Plane } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur-xl bg-background/60 border-b border-border/50 shadow-sm" style={{ height: 'var(--header-height)' }}>
      <div className="flex items-center space-x-2">
        <Plane className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">FlightScope</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
