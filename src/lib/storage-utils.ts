import { JobApplication } from './types';

const API_BASE = '/api/applications';

const mapApplicationDates = (application: any): JobApplication => ({
  ...application,
  submissionDate: String(application.submissionDate),
  events: application.events?.map((event: any) => ({
    ...event,
    date: String(event.date),
  })) ?? [],
});

export const getApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(API_BASE, { 
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Unable to load applications');
  }
  const data = await response.json();
  return data.map(mapApplicationDates);
};

export const getApplicationById = async (id: string): Promise<JobApplication | undefined> => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    return undefined;
  }
  const data = await response.json();
  return mapApplicationDates(data);
};

export const addApplication = async (app: Omit<JobApplication, 'id' | 'events'>) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(app),
  });
  if (!response.ok) {
    throw new Error('Unable to add application');
  }
  const data = await response.json();
  return mapApplicationDates(data);
};

export const updateApplication = async (updatedApp: JobApplication) => {
  const response = await fetch(`${API_BASE}/${updatedApp.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedApp),
  });
  if (!response.ok) {
    throw new Error('Unable to update application');
  }
  const data = await response.json();
  return mapApplicationDates(data);
};

export const deleteApplication = async (id: string) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Unable to delete application');
  }
};
