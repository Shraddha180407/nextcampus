'use client';

import Link from 'next/link';
import { Star, MapPin, Award, Check, Plus, ExternalLink, IndianRupee, Briefcase } from 'lucide-react';
import { formatFee, formatLpa, getRatingColor } from '@/lib/utils';
import { useCompareList } from './CompareTray';

interface CollegeCardProps {
  college: {
    id: string;
    slug: string;
    name: string;
    shortName?: string | null;
    city: string;
    state: string;
    type: string;
    nirfRank?: number | null;
    naacGrade?: string | null;
    overallRating?: number | null;
    ratingCount?: number;
    streams?: { stream: string }[];
    exams?: { exam: string }[];
    courses?: {
      id: string;
      name: string;
      shortName?: string | null;
      annualFees: number;
    }[];
    placements?: {
      highestPackageLpa?: number | null;
      averagePackageLpa?: number | null;
      placementPercent?: number | null;
      year?: number;
    }[];
    _count?: {
      reviews?: number;
      courses?: number;
    };
  };
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { addItem, removeItem, isInCompare } = useCompareList();
  const selected = isInCompare(college.slug);

  const handleCompareToggle = () => {
    if (selected) {
      removeItem(college.slug);
    } else {
      addItem({
        slug: college.slug,
        name: college.name,
        shortName: college.shortName,
        city: college.city,
        overallRating: college.overallRating,
      });
    }
  };

  const primaryCourse = college.courses?.[0];
  const latestPlacement = college.placements?.[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Section */}
      <div className="p-5">
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {college.nirfRank && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md">
                <Award className="w-3 h-3 text-amber-600" /> NIRF #{college.nirfRank}
              </span>
            )}
            {college.naacGrade && (
              <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-md">
                NAAC {college.naacGrade}
              </span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {college.type}
            </span>
          </div>

          {/* Rating Badge */}
          {college.overallRating ? (
            <div className="flex items-center gap-1">
              <div
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold shadow-2xs ${getRatingColor(
                  college.overallRating
                )}`}
              >
                <span>{college.overallRating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-[11px] text-slate-400">
                ({college.ratingCount || college._count?.reviews || 0})
              </span>
            </div>
          ) : null}
        </div>

        {/* College Name & Location */}
        <Link href={`/colleges/${college.slug}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 leading-snug">
            {college.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {college.city}, {college.state}
          </span>
        </div>

        {/* Streams & Exams Pills */}
        <div className="flex flex-wrap gap-1 mt-3">
          {college.streams?.slice(0, 3).map((s) => (
            <span
              key={s.stream}
              className="text-[11px] bg-slate-100/90 text-slate-700 font-medium px-2 py-0.5 rounded"
            >
              {s.stream.toLowerCase().replace('_', ' ')}
            </span>
          ))}
          {college.exams?.slice(0, 2).map((e) => (
            <span
              key={e.exam}
              className="text-[11px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded"
            >
              {e.exam.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
          {/* Fees */}
          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Avg Annual Fees</span>
            <span className="font-bold text-slate-900 text-sm flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3 h-3 text-slate-600" />
              {formatFee(primaryCourse?.annualFees)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate">
              {primaryCourse?.shortName || primaryCourse?.name || 'Various courses'}
            </span>
          </div>

          {/* Placements */}
          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Avg Package</span>
            <span className="font-bold text-emerald-700 text-sm flex items-center gap-0.5 mt-0.5">
              <Briefcase className="w-3 h-3 text-emerald-600" />
              {formatLpa(latestPlacement?.averagePackageLpa)}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Highest: {formatLpa(latestPlacement?.highestPackageLpa)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleCompareToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selected
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{selected ? 'In Compare' : 'Add to Compare'}</span>
        </button>

        <Link
          href={`/colleges/${college.slug}`}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 transition-colors"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
