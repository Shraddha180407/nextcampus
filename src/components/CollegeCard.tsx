'use client';

import Link from 'next/link';
import { Star, MapPin, Award, Check, Plus, ExternalLink, IndianRupee, Briefcase, GraduationCap, Building2 } from 'lucide-react';
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

  // College initials for avatar
  const initials = college.shortName
    ? college.shortName.slice(0, 4)
    : college.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Body */}
      <div className="p-5 space-y-4">
        {/* Header Badges & Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {college.nirfRank && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-900 border border-amber-300/60 px-2.5 py-0.5 rounded-lg shadow-2xs">
                <Award className="w-3.5 h-3.5 text-amber-600" /> NIRF #{college.nirfRank}
              </span>
            )}
            {college.naacGrade && (
              <span className="text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg">
                NAAC {college.naacGrade}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {college.type}
            </span>
          </div>

          {/* Rating Badge */}
          {college.overallRating ? (
            <div className="flex items-center gap-1 shrink-0">
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black shadow-xs ${getRatingColor(
                  college.overallRating
                )}`}
              >
                <span>{college.overallRating.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">
                ({college.ratingCount || college._count?.reviews || 0})
              </span>
            </div>
          ) : null}
        </div>

        {/* Title + Logo Area */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/colleges/${college.slug}`} className="block group-hover:text-blue-600 transition-colors">
              <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                {college.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {college.city}, {college.state}
              </span>
            </div>
          </div>
        </div>

        {/* Streams & Accepted Exams */}
        <div className="space-y-1.5 pt-1">
          <div className="flex flex-wrap gap-1">
            {college.streams?.slice(0, 3).map((s) => (
              <span
                key={s.stream}
                className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {s.stream.toLowerCase().replace('_', ' ')}
              </span>
            ))}
            {college.exams?.slice(0, 2).map((e) => (
              <span
                key={e.exam}
                className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md"
              >
                {e.exam.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics Dual Card */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          {/* Fees */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
              Avg Annual Fee
            </span>
            <span className="font-extrabold text-slate-900 text-sm flex items-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3 h-3 text-slate-500" />
              {formatFee(primaryCourse?.annualFees)}
            </span>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {primaryCourse?.shortName || primaryCourse?.name || 'Various degrees'}
            </span>
          </div>

          {/* Placements */}
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-semibold text-emerald-700 block uppercase tracking-wider">
              Avg CTC
            </span>
            <span className="font-extrabold text-emerald-800 text-sm flex items-center gap-0.5 mt-0.5">
              <Briefcase className="w-3 h-3 text-emerald-600" />
              {formatLpa(latestPlacement?.averagePackageLpa)}
            </span>
            <span className="text-[10px] text-emerald-700 block font-medium mt-0.5">
              Highest: {formatLpa(latestPlacement?.highestPackageLpa)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleCompareToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selected
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{selected ? 'In Compare' : 'Compare'}</span>
        </button>

        <Link
          href={`/colleges/${college.slug}`}
          className="flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 px-2 py-1 transition-colors"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
