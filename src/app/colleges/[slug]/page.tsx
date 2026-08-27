import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CollegeDetailClient from './CollegeDetailClient';

export const revalidate = 30; // ISR 30s

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = await prisma.college.findUnique({
    where: { slug },
    select: { name: true, city: true, state: true, description: true },
  });

  if (!college) return { title: 'College Not Found — NextCampus' };

  return {
    title: `${college.name} (${college.city}) — Fees, Placements, Cutoffs & Reviews | NextCampus`,
    description: college.description.slice(0, 160),
  };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
      },
      cutoffs: {
        orderBy: [{ year: 'desc' }, { closeRank: 'asc' }],
        take: 20,
      },
    },
  });

  if (!college) {
    notFound();
  }

  return <CollegeDetailClient college={college} />;
}
