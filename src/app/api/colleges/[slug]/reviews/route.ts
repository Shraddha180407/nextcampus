import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const parseResult = reviewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true, overallRating: true, ratingCount: true },
    });

    if (!college) {
      return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
    }

    const {
      reviewerName,
      graduationYear,
      course,
      overallRating,
      infrastructureRating,
      facultyRating,
      placementRating,
      hostelRating,
      reviewText,
      pros,
      cons,
    } = parseResult.data;

    // Create review and update aggregate ratings in a transaction
    const newReview = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          collegeId: college.id,
          reviewerName,
          graduationYear,
          course,
          overallRating,
          infrastructureRating,
          facultyRating,
          placementRating,
          hostelRating,
          reviewText,
          pros,
          cons,
        },
      });

      const currentCount = college.ratingCount || 0;
      const currentAvg = college.overallRating || 0;
      const newCount = currentCount + 1;
      const newAvg = parseFloat(((currentAvg * currentCount + overallRating) / newCount).toFixed(2));

      await tx.college.update({
        where: { id: college.id },
        data: {
          overallRating: newAvg,
          ratingCount: newCount,
        },
      });

      return review;
    });

    return NextResponse.json(
      {
        success: true,
        data: newReview,
        message: 'Review submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
