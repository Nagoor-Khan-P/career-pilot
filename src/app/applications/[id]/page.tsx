
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { JobApplication, InterviewEvent, EventType, ApplicationStatus } from '@/lib/types';
import { getApplicationById, updateApplication } from '@/lib/storage-utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Briefcase, Calendar, Plus, ChevronLeft, 
  Clock, FileText, Trash2, Edit3, Sparkles, Loader2 
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getInterviewPreparationTips } from '@/ai/flows/interview-preparation-tips';
import { getCurrentUser } from '@/lib/auth-utils';

export default function ApplicationDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAIToolOpen, setIsAIToolOpen] = useState(false);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState<Omit<InterviewEvent, 'id' | 'applicationId'>>({
    type: 'Technical Interview',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (id) {
      const app = getApplicationById(id as string);
      if (app) {
        setApplication(app);
      } else {
        router.push('/dashboard');
      }
    }
  }, [id, router]);

  if (!application) return null;

  const handleUpdateStatus = (newStatus: ApplicationStatus) => {
    const updated = { ...application, status: newStatus };
    updateApplication(updated);
    setApplication(updated);
  };

  const handleAddEvent = () => {
    const event: InterviewEvent = {
      ...newEvent,
      id: crypto.randomUUID(),
      applicationId: application.id,
    };
    const updated = {
      ...application,
      events: [...application.events, event].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    };
    updateApplication(updated);
    setApplication(updated);
    setIsEventDialogOpen(false);
    setNewEvent({ type: 'Technical Interview', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Delete this event?')) {
      const updated = {
        ...application,
        events: application.events.filter(e => e.id !== eventId),
      };
      updateApplication(updated);
      setApplication(updated);
    }
  };

  const generateAiTips = async () => {
    setIsAiLoading(true);
    setAiTips(null);
    try {
      const result = await getInterviewPreparationTips({
        companyName: application.companyName,
        role: application.role,
        interviewStage: application.status,
      });
      setAiTips(result.tips);
    } catch (error) {
      setAiTips("Failed to generate tips. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Interviewing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Offer': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2" 
          onClick={() => router.push('/dashboard')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-headline">{application.companyName}</h1>
              <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
            </div>
            <p className="text-xl text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {application.role}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Submitted: {new Date(application.submissionDate).toLocaleDateString()}</span>
              {application.location && <span className="flex items-center gap-1">📍 {application.location}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Select value={application.status} onValueChange={(val) => handleUpdateStatus(val as ApplicationStatus)}>
              <SelectTrigger className="w-full md:w-48 bg-background">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="OA">Online Assessment</SelectItem>
                <SelectItem value="Interviewing">Interviewing</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Ghosted">Ghosted</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAIToolOpen} onOpenChange={setIsAIToolOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full flex items-center gap-2 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                  <Sparkles className="h-4 w-4" />
                  Interview Prep Tips
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5 text-accent" />
                    AI Interview Preparation Tool
                  </DialogTitle>
                  <DialogDescription>
                    Tailored advice for {application.role} at {application.companyName}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {!aiTips && !isAiLoading && (
                    <div className="text-center py-8">
                      <p className="mb-4 text-muted-foreground">Get specialized tips based on your current application status.</p>
                      <Button onClick={generateAiTips}>Generate Preparation Tips</Button>
                    </div>
                  )}
                  {isAiLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Analyzing company and role requirements...</p>
                    </div>
                  )}
                  {aiTips && (
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-accent/5 p-6 rounded-lg border border-accent/10">
                      <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
                        {aiTips}
                      </div>
                    </div>
                  )}
                </div>
                {aiTips && (
                  <DialogFooter>
                    <Button onClick={generateAiTips} variant="outline" size="sm">Regenerate</Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Timeline & Events
            </h2>
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Log Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Interview Event</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select 
                      value={newEvent.type} 
                      onValueChange={(val) => setNewEvent({...newEvent, type: val as EventType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online Assessment">Online Assessment</SelectItem>
                        <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                        <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                        <SelectItem value="Behavioral Interview">Behavioral Interview</SelectItem>
                        <SelectItem value="Final Interview">Final Interview</SelectItem>
                        <SelectItem value="Offer Received">Offer Received</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Notes">Notes/Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eventDate">Date</Label>
                    <Input 
                      id="eventDate" 
                      type="date" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eventNotes">Notes</Label>
                    <Textarea 
                      id="eventNotes" 
                      placeholder="Summarize the discussion, questions asked, or next steps..." 
                      className="min-h-[120px]"
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEvent}>Add to Timeline</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent before:to-muted">
            {application.events.map((event, idx) => (
              <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Clock className="h-5 w-5" />
                </div>
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-accent uppercase tracking-wider">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {event.type}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {event.notes || "No notes provided."}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
