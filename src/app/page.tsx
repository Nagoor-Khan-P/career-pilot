
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, BarChart3, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUser, User } from '@/lib/auth-utils';

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Job Hunting</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-foreground mb-6">
          Navigate Your Career with <span className="text-primary">Precision</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          CareerPilot is the ultimate companion for job seekers. Track applications, log interviews, and get AI-powered preparation tips to land your dream role.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full border-2">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Dashboard Preview Placeholder */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30"></div>
          <div className="bg-card border shadow-2xl rounded-2xl p-4 overflow-hidden max-w-5xl mx-auto">
            <img 
              src="https://picsum.photos/seed/dashboard/1200/600" 
              alt="Dashboard Preview" 
              className="rounded-xl border shadow-inner"
              data-ai-hint="dashboard analytics"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-headline font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground">Stop using spreadsheets and start using a cockpit built for your career.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Rocket className="h-8 w-8 text-accent" />}
              title="Application Tracker"
              description="Monitor every stage of your job hunt from initial application to final offer."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-primary" />}
              title="Interview Timeline"
              description="Keep detailed logs of every interaction, interview question, and feedback received."
            />
            <FeatureCard 
              icon={<Sparkles className="h-8 w-8 text-amber-500" />}
              title="AI Preparation"
              description="Get tailored interview tips and company insights generated specifically for your role."
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
            <ShieldCheck className="h-6 w-6" />
            <span>Secure & Private</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Take flight today.</h2>
          <Link href={user ? "/dashboard" : "/signup"}>
            <Button size="lg" className="rounded-full px-12">
              {user ? "Back to Dashboard" : "Get Started Free"}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} CareerPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
