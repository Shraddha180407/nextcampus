import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compareSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = compareSchema.safeParse(searchParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || 'Invalid comparison query',
        },
        { status: 400 }
      );
    }

    const slugs = parseResult.data.ids;

    const colleges = await prisma.college.findMany({
      where: {
        slug: { in: slugs },
      },
      include: {
        streams: { select: { stream: true } },
        exams: { select: { exam: true } },
        courses: {
          orderBy: { annualFees: 'asc' },
        },
        placements: {
          orderBy: { year: 'desc' },
          take: 1,
        },
        _count: {
          select: { reviews: true, courses: true },
        },
      },
    });

    if (colleges.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not find enough matching colleges for comparison',
        },
        { status: 404 }
      );
    }

    // Preserve the request ordering of colleges
    const orderedColleges = slugs
      .map((slug) => colleges.find((c) => c.slug === slug))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      data: orderedColleges,
    });
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve comparison matrix' },
      { status: 500 }
    );
  }
}
