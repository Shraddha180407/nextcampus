import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { collegeFilterSchema } from '@/lib/validations';
import { Stream, Exam, CollegeType, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parseResult = collegeFilterSchema.safeParse(searchParams);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid filter parameters',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { q, stream, state, type, minFee, maxFee, minRating, exam, page, limit, sort, order } =
      parseResult.data;

    const where: Prisma.CollegeWhereInput = {};

    // 1. Text Search
    if (q && q.trim() !== '') {
      const query = q.trim();
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { shortName: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } },
      ];
    }

    // 2. Stream Filter
    if (stream) {
      const streamList = stream
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s): s is Stream => Object.values(Stream).includes(s as Stream));

      if (streamList.length > 0) {
        where.streams = {
          some: {
            stream: { in: streamList },
          },
        };
      }
    }

    // 3. State Filter
    if (state) {
      const stateList = state.split(',').map((s) => s.trim());
      where.state = { in: stateList, mode: 'insensitive' };
    }

    // 4. College Type
    if (type) {
      where.type = type;
    }

    // 5. Rating Filter
    if (minRating !== undefined) {
      where.overallRating = { gte: minRating };
    }

    // 6. Exam Filter
    if (exam) {
      const examList = exam
        .split(',')
        .map((e) => e.trim().toUpperCase())
        .filter((e): e is Exam => Object.values(Exam).includes(e as Exam));

      if (examList.length > 0) {
        where.exams = {
          some: {
            exam: { in: examList },
          },
        };
      }
    }

    // 7. Fee Filter
    if (minFee !== undefined || maxFee !== undefined) {
      where.courses = {
        some: {
          annualFees: {
            ...(minFee !== undefined ? { gte: minFee } : {}),
            ...(maxFee !== undefined ? { lte: maxFee } : {}),
          },
        },
      };
    }

    // Sorting definition
    let orderBy: Prisma.CollegeOrderByWithRelationInput = { overallRating: 'desc' };
    if (sort === 'nirfRank') {
      orderBy = { nirfRank: order === 'desc' ? 'desc' : 'asc' };
    } else if (sort === 'name') {
      orderBy = { name: order };
    } else if (sort === 'rating') {
      orderBy = { overallRating: order };
    }

    const skip = (page - 1) * limit;

    const [total, colleges] = await Promise.all([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          streams: { select: { stream: true } },
          exams: { select: { exam: true } },
          courses: {
            select: {
              id: true,
              name: true,
              shortName: true,
              level: true,
              stream: true,
              annualFees: true,
              totalFees: true,
              duration: true,
            },
            take: 3,
          },
          placements: {
            orderBy: { year: 'desc' },
            take: 1,
            select: {
              highestPackageLpa: true,
              averagePackageLpa: true,
              placementPercent: true,
              year: true,
            },
          },
          _count: {
            select: { reviews: true, courses: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve colleges from database' },
      { status: 500 }
    );
  }
}
