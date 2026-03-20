import { JobApplication } from './types';

const STORAGE_KEY = 'careerpilot_applications';

export const getApplications = (): JobApplication[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveApplications = (apps: JobApplication[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
};

export const addApplication = (app: Omit<JobApplication, 'id' | 'events'>) => {
  const apps = getApplications();
  const newApp: JobApplication = {
    ...app,
    id: crypto.randomUUID(),
    events: [
      {
        id: crypto.randomUUID(),
        applicationId: '', // Filled in below if needed, but logic usually handles it
        type: 'Application Submitted',
        date: app.submissionDate,
        notes: 'Initial application submitted.',
      }
    ],
  };
  newApp.events[0].applicationId = newApp.id;
  const updated = [newApp, ...apps];
  saveApplications(updated);
  return newApp;
};

export const updateApplication = (updatedApp: JobApplication) => {
  const apps = getApplications();
  const updated = apps.map(app => app.id === updatedApp.id ? updatedApp : app);
  saveApplications(updated);
};

export const deleteApplication = (id: string) => {
  const apps = getApplications();
  const updated = apps.filter(app => app.id !== id);
  saveApplications(updated);
};

export const getApplicationById = (id: string): JobApplication | undefined => {
  return getApplications().find(app => app.id === id);
};