import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    include: { events: true },
  });

  if (!application || application.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...application,
    submissionDate: application.submissionDate.toISOString(),
    events: application.events.map((event: any) => ({
      ...event,
      date: event.date.toISOString(),
    })),
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await req.json();
  const { status, location, salary, jobDescriptionUrl, submissionDate, events } = payload;

  const existing = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    include: { events: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updateData: any = {
    status,
    location,
    salary,
    jobDescriptionUrl,
    submissionDate: submissionDate ? new Date(submissionDate) : undefined,
  };

  if (events) {
    updateData.events = {
      deleteMany: { applicationId: params.id },
      create: events.map((event: any) => ({
        id: event.id,
        type: event.type,
        date: new Date(event.date),
        notes: event.notes,
      })),
    };
  }

  const updated = await prisma.jobApplication.update({
    where: { id: params.id },
    data: updateData,
    include: { events: true },
  });

  return NextResponse.json({
    ...updated,
    submissionDate: updated.submissionDate.toISOString(),
    events: updated.events.map((event: any) => ({
      ...event,
      date: event.date.toISOString(),
    })),
  });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.jobApplication.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
