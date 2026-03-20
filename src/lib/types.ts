export type ApplicationStatus = 'Applied' | 'OA' | 'Interviewing' | 'Offer' | 'Rejected' | 'Ghosted';

export type EventType = 'Application Submitted' | 'Online Assessment' | 'Phone Screen' | 'Technical Interview' | 'Behavioral Interview' | 'Final Interview' | 'Offer Received' | 'Rejected' | 'Notes';

export interface InterviewEvent {
  id: string;
  applicationId: string;
  type: EventType;
  date: string;
  notes: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  submissionDate: string;
  status: ApplicationStatus;
  salary?: string;
  location?: string;
  jobDescriptionUrl?: string;
  events: InterviewEvent[];
}