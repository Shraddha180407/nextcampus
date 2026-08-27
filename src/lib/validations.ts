import { z } from 'zod';
import { CollegeType, Stream, Exam, Category, Gender } from '@prisma/client';

export const collegeFilterSchema = z.object({
  q: z.string().max(100).optional(),
  stream: z.string().optional(), // comma-separated strings of Stream enum
  state: z.string().optional(), // comma-separated state names
  type: z.nativeEnum(CollegeType).optional(),
  minFee: z.coerce.number().min(0).optional(),
  maxFee: z.coerce.number().max(10000000).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  exam: z.string().optional(), // comma-separated strings of Exam enum
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sort: z.enum(['rating', 'nirfRank', 'fees', 'name']).default('rating'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const reviewSchema = z.object({
  reviewerName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  graduationYear: z.coerce.number().int().min(2000).max(2028).optional(),
  course: z.string().max(100).optional(),
  overallRating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  infrastructureRating: z.number().min(1).max(5).optional(),
  facultyRating: z.number().min(1).max(5).optional(),
  placementRating: z.number().min(1).max(5).optional(),
  hostelRating: z.number().min(1).max(5).optional(),
  reviewText: z.string().min(30, 'Review must be at least 30 characters').max(2000),
  pros: z.string().max(500).optional(),
  cons: z.string().max(500).optional(),
});

export const compareSchema = z.object({
  ids: z
    .string()
    .min(1, 'Please provide colleges to compare')
    .transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean))
    .refine((arr) => arr.length >= 2, {
      message: 'Select at least 2 colleges to compare',
    })
    .refine((arr) => arr.length <= 3, {
      message: 'Comparison is limited to 3 colleges',
    }),
});

export const predictorSchema = z
  .object({
    exam: z.nativeEnum(Exam),
    rank: z.coerce.number().int().positive().optional(),
    percentile: z.coerce.number().min(0).max(100).optional(),
    score: z.coerce.number().positive().optional(),
    category: z.nativeEnum(Category).default(Category.GENERAL),
    gender: z.nativeEnum(Gender).default(Gender.NEUTRAL),
    year: z.coerce.number().int().min(2022).max(2025).default(2024),
  })
  .refine((d) => d.rank !== undefined || d.percentile !== undefined || d.score !== undefined, {
    message: 'Either rank, percentile, or score must be provided',
  });
