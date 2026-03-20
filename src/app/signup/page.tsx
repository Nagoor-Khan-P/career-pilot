
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signup } from '@/lib/auth-utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signup(formData.email, formData.name);
      toast({
        title: "Account created!",
        description: "Welcome to CareerPilot. Redirecting...",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-20 flex justify-center">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline font-bold">Create Account</CardTitle>
            <CardDescription>Start tracking your path to success</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Jane Doe" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full py-6 text-lg">Create Account</Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
