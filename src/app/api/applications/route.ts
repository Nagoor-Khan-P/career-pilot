import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId: session.user.id },
      include: { 
        events: {
          select: {
            id: true,
            type: true,
            date: true,
            applicationId: true,
          }
        }
      },
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
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { companyName, role, submissionDate, status, applicationSource, location, salary, jobDescriptionUrl } = payload;

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
        ...(applicationSource && { applicationSource }),
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
        events: (application as any).events?.map((event: any) => ({
          ...event,
          date: event.date.toISOString(),
        })) || [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
