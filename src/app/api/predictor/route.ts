import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictorSchema } from '@/lib/validations';
import { Category } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = predictorSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.issues[0]?.message || 'Invalid predictor inputs',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { exam, rank, percentile, score, category } = parseResult.data;

    // Query cutoffs matching exam, category, and year (or most recent year available)
    const cutoffs = await prisma.collegeCutoff.findMany({
      where: {
        exam,
        category: category || Category.GENERAL,
      },
      include: {
        college: {
          select: {
            id: true,
            slug: true,
            name: true,
            shortName: true,
            city: true,
            state: true,
            nirfRank: true,
            overallRating: true,
            type: true,
            courses: {
              take: 2,
              select: { name: true, annualFees: true },
            },
            placements: {
              take: 1,
              orderBy: { year: 'desc' },
              select: { averagePackageLpa: true, highestPackageLpa: true },
            },
          },
        },
        course: {
          select: { id: true, name: true, shortName: true, annualFees: true },
        },
      },
      orderBy: { closeRank: 'asc' },
    });

    const strongMatch: any[] = [];
    const possible: any[] = [];
    const reach: any[] = [];

    // Fallback: If no direct category cutoffs match, query General category for estimation
    let evaluatedCutoffs = cutoffs;
    if (evaluatedCutoffs.length === 0 && category !== Category.GENERAL) {
      evaluatedCutoffs = await prisma.collegeCutoff.findMany({
        where: { exam, category: Category.GENERAL },
        include: {
          college: {
            select: {
              id: true,
              slug: true,
              name: true,
              shortName: true,
              city: true,
              state: true,
              nirfRank: true,
              overallRating: true,
              type: true,
              courses: {
                take: 2,
                select: { name: true, annualFees: true },
              },
              placements: {
                take: 1,
                orderBy: { year: 'desc' },
                select: { averagePackageLpa: true, highestPackageLpa: true },
              },
            },
          },
          course: {
            select: { id: true, name: true, shortName: true, annualFees: true },
          },
        },
      });
    }

    // Process each cutoff
    const processedCollegeIds = new Set<string>();

    for (const item of evaluatedCutoffs) {
      if (processedCollegeIds.has(item.collegeId)) continue;

      if (rank && item.closeRank) {
        const cutoff = item.closeRank;
        if (rank <= cutoff * 0.85) {
          strongMatch.push({ ...item, matchScore: 92 });
          processedCollegeIds.add(item.collegeId);
        } else if (rank <= cutoff * 1.15) {
          possible.push({ ...item, matchScore: 70 });
          processedCollegeIds.add(item.collegeId);
        } else if (rank <= cutoff * 1.45) {
          reach.push({ ...item, matchScore: 45 });
          processedCollegeIds.add(item.collegeId);
        }
      } else if (percentile && item.percentile) {
        const diff = percentile - item.percentile;
        if (diff >= 0) {
          strongMatch.push({ ...item, matchScore: 90 });
          processedCollegeIds.add(item.collegeId);
        } else if (diff >= -1.5) {
          possible.push({ ...item, matchScore: 68 });
          processedCollegeIds.add(item.collegeId);
        } else if (diff >= -3.5) {
          reach.push({ ...item, matchScore: 40 });
          processedCollegeIds.add(item.collegeId);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        exam,
        userInput: { rank, percentile, score, category },
        strongMatch,
        possible,
        reach,
        totalRecommendations: strongMatch.length + possible.length + reach.length,
        disclaimer:
          'Demo dataset: Admission cutoffs are historical estimates for guidance purposes and do not represent an admission guarantee. Actual cutoffs fluctuate annually based on seat matrix and applicant pools.',
      },
    });
  } catch (error) {
    console.error('Error running admission predictor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate admission predictions' },
      { status: 500 }
    );
  }
}
