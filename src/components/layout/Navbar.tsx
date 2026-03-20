import Link from 'next/link';
import { LayoutDashboard, Rocket } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline font-bold text-2xl text-primary">
          <Rocket className="h-6 w-6 text-accent" />
          <span>CareerPilot</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}