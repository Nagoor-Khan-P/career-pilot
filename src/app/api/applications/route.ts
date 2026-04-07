import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    include: { events: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    applications.map((application: any) => ({
      ...application,
      submissionDate: application.submissionDate.toISOString(),
      events: application.events.map((event: any) => ({
        ...event,
        date: event.date.toISOString(),
      })),
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await req.json();
  const { companyName, role, submissionDate, status, location, salary, jobDescriptionUrl } = payload;

  if (!companyName || !role || !submissionDate || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const application = await prisma.jobApplication.create({
    data: {
      userId: session.user.id,
      companyName,
      role,
      submissionDate: new Date(submissionDate),
      status,
      location,
      salary,
      jobDescriptionUrl,
      events: {
        create: {
          type: 'Application Submitted',
          date: new Date(submissionDate),
          notes: 'Initial application submitted.',
        },
      },
    },
    include: { events: true },
  });

  return NextResponse.json(
    {
      ...application,
      submissionDate: application.submissionDate.toISOString(),
      events: application.events.map((event: any) => ({
        ...event,
        date: event.date.toISOString(),
      })),
    },
    { status: 201 }
  );
}
