import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        streams: { select: { stream: true } },
        exams: { select: { exam: true } },
        courses: {
          orderBy: [{ level: 'asc' }, { annualFees: 'desc' }],
        },
        placements: {
          orderBy: { year: 'desc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        cutoffs: {
          orderBy: [{ year: 'desc' }, { closeRank: 'asc' }],
          take: 15,
        },
      },
    });

    if (!college) {
      return NextResponse.json(
        { success: false, error: 'College not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error('Error fetching college detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve college details' },
      { status: 500 }
    );
  }
}
