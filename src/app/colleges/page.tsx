'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import SearchBar from '@/components/SearchBar';
import FilterSidebar from '@/components/FilterSidebar';
import CollegeCard from '@/components/CollegeCard';
import { SlidersHorizontal, Loader2, Frown, ArrowUpDown, X } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function CollegesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial states from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [stream, setStream] = useState(searchParams.get('stream') || undefined);
  const [state, setState] = useState(searchParams.get('state') || undefined);
  const [type, setType] = useState(searchParams.get('type') || undefined);
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || undefined);
  const [exam, setExam] = useState(searchParams.get('exam') || undefined);
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || undefined);
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state to URL params
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (stream) params.set('stream', stream);
    if (state) params.set('state', state);
    if (type) params.set('type', type);
    if (minRating) params.set('minRating', minRating);
    if (exam) params.set('exam', exam);
    if (maxFee) params.set('maxFee', maxFee);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    if (page > 1) params.set('page', String(page));

    router.replace(`/colleges?${params.toString()}`, { scroll: false });
  }, [searchQuery, stream, state, type, minRating, exam, maxFee, sort, order, page, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Construct API endpoint
  const queryParams = new URLSearchParams();
  if (searchQuery) queryParams.set('q', searchQuery);
  if (stream) queryParams.set('stream', stream);
  if (state) queryParams.set('state', state);
  if (type) queryParams.set('type', type);
  if (minRating) queryParams.set('minRating', minRating);
  if (exam) queryParams.set('exam', exam);
  if (maxFee) queryParams.set('maxFee', maxFee);
  queryParams.set('sort', sort);
  queryParams.set('order', order);
  queryParams.set('page', String(page));
  queryParams.set('limit', '12');

  const { data, error, isLoading } = useSWR(`/api/colleges?${queryParams.toString()}`, fetcher, {
    keepPreviousData: true,
  });

  const colleges = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  const handleFilterChange = (key: string, value: string | undefined) => {
    setPage(1);
    if (key === 'stream') setStream(value);
    if (key === 'state') setState(value);
    if (key === 'type') setType(value);
    if (key === 'minRating') setMinRating(value);
    if (key === 'exam') setExam(value);
    if (key === 'maxFee') setMaxFee(value);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStream(undefined);
    setState(undefined);
    setType(undefined);
    setMinRating(undefined);
    setExam(undefined);
    setMaxFee(undefined);
    setPage(1);
  };

  const activeFilters = [
    ...(stream ? stream.split(',').map((s) => ({ key: 'stream', label: s, val: s })) : []),
    ...(state ? state.split(',').map((s) => ({ key: 'state', label: s, val: s })) : []),
    ...(exam ? exam.split(',').map((e) => ({ key: 'exam', label: e.replace('_', ' '), val: e })) : []),
    ...(type ? [{ key: 'type', label: type, val: type }] : []),
    ...(minRating ? [{ key: 'minRating', label: `${minRating}+ Stars`, val: minRating }] : []),
    ...(maxFee ? [{ key: 'maxFee', label: `Max ₹${Number(maxFee) / 100000}L`, val: maxFee }] : []),
  ];

  const removeSpecificFilter = (item: { key: string; val: string }) => {
    if (item.key === 'stream') {
      const remaining = stream?.split(',').filter((v) => v !== item.val);
      setStream(remaining && remaining.length > 0 ? remaining.join(',') : undefined);
    } else if (item.key === 'state') {
      const remaining = state?.split(',').filter((v) => v !== item.val);
      setState(remaining && remaining.length > 0 ? remaining.join(',') : undefined);
    } else if (item.key === 'exam') {
      const remaining = exam?.split(',').filter((v) => v !== item.val);
      setExam(remaining && remaining.length > 0 ? remaining.join(',') : undefined);
    } else if (item.key === 'type') {
      setType(undefined);
    } else if (item.key === 'minRating') {
      setMinRating(undefined);
    } else if (item.key === 'maxFee') {
      setMaxFee(undefined);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Explore & Discover Colleges</h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter through premier universities by entrance exam, annual tuition fees, and placements
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:flex-1">
            <SearchBar
              initialValue={searchQuery}
              onSearch={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters ({activeFilters.length})</span>
            </button>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm shadow-xs">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={`${sort}-${order}`}
                onChange={(e) => {
                  const [newSort, newOrder] = e.target.value.split('-');
                  setSort(newSort);
                  setOrder(newOrder);
                }}
                className="bg-transparent border-none text-slate-700 text-xs font-semibold focus:ring-0 cursor-pointer"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="nirfRank-asc">NIRF Ranking (Top First)</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pills */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Active filters:</span>
            {activeFilters.map((af, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2.5 py-1 rounded-lg"
              >
                <span>{af.label}</span>
                <button
                  onClick={() => removeSpecificFilter(af)}
                  className="hover:text-blue-900 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout (Sidebar + Results) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterSidebar
            filters={{ stream, state, type, minRating, exam, maxFee }}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-slate-500 hover:text-slate-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar
                filters={{ stream, state, type, minRating, exam, maxFee }}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* College Grid List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing {colleges.length} of {pagination.total} colleges
            </span>
            {isLoading && (
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Updating...
              </span>
            )}
          </div>

          {isLoading && colleges.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4 h-72"
                >
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2 pt-6">
                    <div className="h-16 bg-slate-100 rounded-xl" />
                    <div className="h-16 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colleges.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Frown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching colleges found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try widening your fee range, choosing different exams, or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-600 px-3">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Loading colleges...</p>
        </div>
      }
    >
      <CollegesListContent />
    </Suspense>
  );
}
