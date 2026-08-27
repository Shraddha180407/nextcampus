'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import {
  GitCompare,
  Plus,
  X,
  Star,
  Award,
  MapPin,
  ExternalLink,
  Loader2,
  Search,
} from 'lucide-react';
import { formatFee, formatLpa, getRatingColor } from '@/lib/utils';
import { useCompareList } from '@/components/CompareTray';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { items: trayItems, addItem, removeItem, clear } = useCompareList();

  const idsParam = searchParams.get('ids');
  const idsList = idsParam
    ? idsParam.split(',').filter(Boolean)
    : trayItems.map((i) => i.slug);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  const compareApiUrl =
    idsList.length >= 2 ? `/api/compare?ids=${idsList.slice(0, 3).join(',')}` : null;

  const { data, error, isLoading } = useSWR(compareApiUrl, fetcher);
  const { data: allCollegesData } = useSWR('/api/colleges?limit=30', fetcher);

  const colleges = data?.data || [];
  const allColleges = allCollegesData?.data || [];

  const handleRemoveCollege = (slug: string) => {
    const updated = idsList.filter((s) => s !== slug);
    removeItem(slug);
    if (updated.length > 0) {
      router.push(`/compare?ids=${updated.join(',')}`);
    } else {
      router.push('/compare');
    }
  };

  const handleAddCollege = (slug: string) => {
    if (idsList.length >= 3) {
      alert('You can compare a maximum of 3 colleges.');
      return;
    }
    const updated = [...idsList, slug];
    const collegeToAdd = allColleges.find((c: any) => c.slug === slug);
    if (collegeToAdd) {
      addItem({
        slug: collegeToAdd.slug,
        name: collegeToAdd.name,
        shortName: collegeToAdd.shortName,
        city: collegeToAdd.city,
        overallRating: collegeToAdd.overallRating,
      });
    }
    router.push(`/compare?ids=${updated.join(',')}`);
    setIsAddModalOpen(false);
  };

  const feesList = colleges.map((c: any) => c.courses?.[0]?.annualFees).filter(Boolean);
  const minFee = feesList.length > 0 ? Math.min(...feesList) : null;

  const avgPkgs = colleges.map((c: any) => c.placements?.[0]?.averagePackageLpa).filter(Boolean);
  const maxAvgPkg = avgPkgs.length > 0 ? Math.max(...avgPkgs) : null;

  const highestPkgs = colleges.map((c: any) => c.placements?.[0]?.highestPackageLpa).filter(Boolean);
  const maxHighestPkg = highestPkgs.length > 0 ? Math.max(...highestPkgs) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
            <GitCompare className="w-3.5 h-3.5" /> Decision Engine
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Compare Colleges Side-by-Side</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare up to 3 institutions across tuition fees, placement statistics, NIRF rankings, and entrance criteria
          </p>
        </div>

        {idsList.length > 0 && (
          <div className="flex items-center gap-2">
            {idsList.length < 3 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add College ({idsList.length}/3)</span>
              </button>
            )}
            <button
              onClick={() => {
                clear();
                router.push('/compare');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        )}
      </div>

      {/* Main Comparison Container */}
      {idsList.length < 2 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <GitCompare className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Select at least 2 colleges to compare</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Choose 2 or 3 colleges from our database to generate a comprehensive comparison matrix.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md"
            >
              Pick from List
            </button>
            <Link
              href="/colleges"
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Browse All Colleges
            </Link>
          </div>
        </div>
      ) : isLoading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Building comparison matrix...</p>
        </div>
      ) : colleges.length >= 2 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                    Key Metric
                  </th>
                  {colleges.map((college: any) => (
                    <th key={college.id} className="p-5 align-top relative w-1/4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/colleges/${college.slug}`}
                            className="font-extrabold text-base text-slate-900 hover:text-blue-600 leading-snug line-clamp-2"
                          >
                            {college.name}
                          </Link>
                          <button
                            onClick={() => handleRemoveCollege(college.slug)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-normal">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {college.city}, {college.state}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {colleges.length < 3 && (
                    <th className="p-5 align-middle text-center w-1/4 border-dashed border-l border-slate-200">
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-500 hover:text-blue-600 transition-all flex flex-col items-center gap-1 mx-auto"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-xs font-bold">Add 3rd College</span>
                      </button>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* 1. Student Rating */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Overall Rating</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5">
                      {c.overallRating ? (
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${getRatingColor(
                              c.overallRating
                            )}`}
                          >
                            <span>{c.overallRating.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <span className="text-xs text-slate-400">
                            ({c._count?.reviews || 0} reviews)
                          </span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 2. NIRF Ranking */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">NIRF Ranking</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5">
                      {c.nirfRank ? (
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Rank #{c.nirfRank}
                        </span>
                      ) : (
                        'Unranked'
                      )}
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 3. Institute Type & NAAC */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Type & NAAC Grade</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5 text-xs space-y-1">
                      <span className="inline-block font-semibold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {c.type}
                      </span>
                      {c.naacGrade && (
                        <span className="block font-medium text-blue-700">
                          NAAC Grade: {c.naacGrade}
                        </span>
                      )}
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 4. Annual Tuition Fees */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Avg Annual Fee</td>
                  {colleges.map((c: any) => {
                    const fee = c.courses?.[0]?.annualFees;
                    const isLowest = minFee && fee === minFee && colleges.length > 1;
                    return (
                      <td key={c.id} className="p-5">
                        <div className="space-y-1">
                          <span
                            className={`font-extrabold text-base block ${
                              isLowest ? 'text-emerald-600' : 'text-slate-900'
                            }`}
                          >
                            {formatFee(fee)}
                          </span>
                          {isLowest && (
                            <span className="inline-block text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                              ✓ Most Affordable
                            </span>
                          )}
                          <span className="text-xs text-slate-400 block truncate">
                            {c.courses?.[0]?.shortName || c.courses?.[0]?.name}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 5. Average Placement Package */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Average Package</td>
                  {colleges.map((c: any) => {
                    const avg = c.placements?.[0]?.averagePackageLpa;
                    const isHighest = maxAvgPkg && avg === maxAvgPkg && colleges.length > 1;
                    return (
                      <td key={c.id} className="p-5">
                        <div className="space-y-1">
                          <span
                            className={`font-extrabold text-base block ${
                              isHighest ? 'text-emerald-700' : 'text-slate-800'
                            }`}
                          >
                            {formatLpa(avg)}
                          </span>
                          {isHighest && (
                            <span className="inline-block text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                              ★ Highest Average
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 6. Highest Package */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Highest Package</td>
                  {colleges.map((c: any) => {
                    const highest = c.placements?.[0]?.highestPackageLpa;
                    const isHighest = maxHighestPkg && highest === maxHighestPkg && colleges.length > 1;
                    return (
                      <td key={c.id} className="p-5">
                        <span
                          className={`font-bold text-sm block ${
                            isHighest ? 'text-blue-700 font-extrabold' : 'text-slate-800'
                          }`}
                        >
                          {formatLpa(highest)}
                        </span>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 7. Exams Accepted */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Accepted Exams</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5">
                      <div className="flex flex-wrap gap-1">
                        {c.exams?.map((e: any) => (
                          <span
                            key={e.exam}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded"
                          >
                            {e.exam.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 8. Available Degrees & Stream */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Disciplines</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5">
                      <div className="flex flex-wrap gap-1">
                        {c.streams?.map((s: any) => (
                          <span
                            key={s.stream}
                            className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded"
                          >
                            {s.stream.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>

                {/* 9. Key Detail Page Action */}
                <tr>
                  <td className="p-5 font-bold text-slate-700 bg-slate-50/40">Actions</td>
                  {colleges.map((c: any) => (
                    <td key={c.id} className="p-5">
                      <Link
                        href={`/colleges/${c.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        <span>Full Profile & Courses</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-5 bg-slate-50/20" />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Add College Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add College to Compare</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search college to add..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-slate-100">
              {allColleges
                .filter(
                  (c: any) =>
                    !idsList.includes(c.slug) &&
                    (c.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
                      c.city.toLowerCase().includes(modalSearch.toLowerCase()))
                )
                .map((college: any) => (
                  <div
                    key={college.id}
                    className="pt-2 pb-1 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{college.name}</h4>
                      <span className="text-[11px] text-slate-400">
                        {college.city}, {college.state} · NIRF #{college.nirfRank || 'Unranked'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddCollege(college.slug)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading comparison...</p>
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
