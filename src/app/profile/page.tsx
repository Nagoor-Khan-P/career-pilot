"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUser, User, logout } from '@/lib/auth-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Mail, Settings, LogOut, ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2" 
          onClick={() => router.push('/dashboard')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-lg border-2">
          <CardHeader className="text-center pb-8 border-b">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarFallback className="text-3xl bg-primary/5 text-primary">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-headline font-bold">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription className="text-lg">@{user.username}</CardDescription>
          </CardHeader>
          
          <CardContent className="py-8 space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Username</p>
                  <p className="font-semibold text-lg">{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-background border">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Account ID</p>
                  <p className="font-mono text-sm break-all">{user.id}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-widest">Account Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start gap-2" disabled>
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="destructive" className="justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-muted/50 p-6 flex justify-center text-sm text-muted-foreground border-t">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member since {new Date().getFullYear()}
            </span>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
