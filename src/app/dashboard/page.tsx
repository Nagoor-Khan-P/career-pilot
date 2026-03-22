
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { JobApplication, ApplicationStatus } from '@/lib/types';
import { getApplications, addApplication, deleteApplication } from '@/lib/storage-utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Briefcase, Calendar, ChevronRight, Trash2, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser } from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const COMMON_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "TCS", 
  "Infosys", "Wipro", "Zomato", "Swiggy", "Flipkart", 
  "Paytm", "CRED", "Ola", "Freshworks", "Reliance Jio"
];

const COMMON_LOCATIONS = [
  "Remote", 
  "Bengaluru, KA", 
  "Hyderabad, TS", 
  "Pune, MH", 
  "Mumbai, MH", 
  "Chennai, TN", 
  "Gurgaon, HR", 
  "Noida, UP", 
  "New Delhi, DL", 
  "Kolkata, WB", 
  "Ahmedabad, GJ", 
  "Kochi, KL",
  "Chandigarh, CH"
];

export default function Dashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // New Application Form State
  const [newApp, setNewApp] = useState({
    companyName: '',
    role: '',
    submissionDate: new Date().toISOString().split('T')[0],
    status: 'Applied' as ApplicationStatus,
    location: '',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setApplications(getApplications());
  }, [router]);

  const handleAddApplication = () => {
    if (!newApp.companyName || !newApp.role) return;
    addApplication(newApp);
    setApplications(getApplications());
    setIsAddDialogOpen(false);
    setNewApp({
      companyName: '',
      role: '',
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      location: '',
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApplication(id);
      setApplications(getApplications());
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Interviewing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Offer': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Ghosted': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Filtering suggestions for inputs
  const companySuggestions = useMemo(() => {
    if (!newApp.companyName || newApp.companyName.length === 0) return [];
    return COMMON_COMPANIES.filter(c => 
      c.toLowerCase().includes(newApp.companyName.toLowerCase()) && 
      c.toLowerCase() !== newApp.companyName.toLowerCase()
    );
  }, [newApp.companyName]);

  const locationSuggestions = useMemo(() => {
    if (!newApp.location || newApp.location.length === 0) return [];
    return COMMON_LOCATIONS.filter(l => 
      l.toLowerCase().includes(newApp.location.toLowerCase()) && 
      l.toLowerCase() !== newApp.location.toLowerCase()
    );
  }, [newApp.location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Job Applications</h1>
            <p className="text-muted-foreground mt-1">Track and manage your journey to your next dream role.</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Add Application</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Job Application</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2 relative">
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company" 
                    placeholder="e.g. Google or type custom" 
                    value={newApp.companyName}
                    autoComplete="off"
                    onChange={(e) => setNewApp({...newApp, companyName: e.target.value})}
                  />
                  {companySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full z-50 bg-popover border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {companySuggestions.map(suggestion => (
                        <div 
                          key={suggestion}
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => setNewApp({...newApp, companyName: suggestion})}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Job Role</Label>
                  <Input 
                    id="role" 
                    placeholder="e.g. Senior Frontend Engineer" 
                    value={newApp.role}
                    onChange={(e) => setNewApp({...newApp, role: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Submission Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={newApp.submissionDate}
                      onChange={(e) => setNewApp({...newApp, submissionDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Initial Status</Label>
                    <Select 
                      value={newApp.status} 
                      onValueChange={(val) => setNewApp({...newApp, status: val as ApplicationStatus})}
                    >
                      <SelectTrigger id="status" className="cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied" className="cursor-pointer">Applied</SelectItem>
                        <SelectItem value="OA" className="cursor-pointer">Online Assessment</SelectItem>
                        <SelectItem value="Interviewing" className="cursor-pointer">Interviewing</SelectItem>
                        <SelectItem value="Offer" className="cursor-pointer">Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2 relative">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input 
                    id="location" 
                    placeholder="e.g. Bengaluru, KA or type custom" 
                    value={newApp.location}
                    autoComplete="off"
                    onChange={(e) => setNewApp({...newApp, location: e.target.value})}
                  />
                  {locationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full z-50 bg-popover border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                      {locationSuggestions.map(suggestion => (
                        <div 
                          key={suggestion}
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => setNewApp({...newApp, location: suggestion})}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="cursor-pointer">Cancel</Button>
                <Button onClick={handleAddApplication} className="cursor-pointer">Save Application</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <section className="bg-card rounded-lg shadow-sm border p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search companies or roles..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex items-center gap-2 cursor-pointer">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                <SelectItem value="Applied" className="cursor-pointer">Applied</SelectItem>
                <SelectItem value="OA" className="cursor-pointer">Online Assessment</SelectItem>
                <SelectItem value="Interviewing" className="cursor-pointer">Interviewing</SelectItem>
                <SelectItem value="Offer" className="cursor-pointer">Offer</SelectItem>
                <SelectItem value="Rejected" className="cursor-pointer">Rejected</SelectItem>
                <SelectItem value="Ghosted" className="cursor-pointer">Ghosted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-dashed border-muted-foreground/50">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-muted-foreground">No applications found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              Start tracking your job search by adding your first application above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <Link key={app.id} href={`/applications/${app.id}`}>
                <Card className="hover:shadow-md transition-all duration-200 group h-full flex flex-col cursor-pointer border-transparent hover:border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(app.status)} variant="outline">
                        {app.status}
                      </Badge>
                      <button 
                        onClick={(e) => handleDelete(app.id, e)}
                        className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-accent" />
                      {app.companyName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium text-foreground/80">
                      <Briefcase className="h-4 w-4" />
                      {app.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date(app.submissionDate).toLocaleDateString()}</span>
                    </div>
                    {app.location && (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-4 text-center">📍</span>
                        <span>{app.location}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <div className="w-full flex justify-between items-center text-xs font-semibold text-primary/80">
                      <span>{app.events.length} Events Logged</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
