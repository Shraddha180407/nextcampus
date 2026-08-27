'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  Award,
  Calendar,
  Building,
  Users,
  Briefcase,
  IndianRupee,
  GraduationCap,
  Plus,
  Check,
  MessageSquarePlus,
  Send,
  Loader2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { formatFee, formatLpa, getRatingColor } from '@/lib/utils';
import { useCompareList } from '@/components/CompareTray';

interface CollegeDetailClientProps {
  college: any;
}

export default function CollegeDetailClient({ college }: CollegeDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>(
    'overview'
  );
  const { addItem, removeItem, isInCompare } = useCompareList();
  const selected = isInCompare(college.slug);

  // Review Form States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState(college.reviews || []);
  const [reviewForm, setReviewForm] = useState({
    reviewerName: '',
    graduationYear: new Date().getFullYear(),
    course: college.courses?.[0]?.shortName || '',
    overallRating: 5,
    infrastructureRating: 5,
    facultyRating: 5,
    placementRating: 5,
    hostelRating: 4,
    reviewText: '',
    pros: '',
    cons: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewSuccessMsg('');

    try {
      const res = await fetch(`/api/colleges/${college.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      const json = await res.json();
      if (json.success) {
        setReviewsList([json.data, ...reviewsList]);
        setReviewSuccessMsg('Review submitted successfully! Thank you for your feedback.');
        setTimeout(() => {
          setIsReviewModalOpen(false);
          setReviewSuccessMsg('');
          setReviewForm({
            reviewerName: '',
            graduationYear: new Date().getFullYear(),
            course: college.courses?.[0]?.shortName || '',
            overallRating: 5,
            infrastructureRating: 5,
            facultyRating: 5,
            placementRating: 5,
            hostelRating: 4,
            reviewText: '',
            pros: '',
            cons: '',
          });
        }, 1500);
      } else {
        alert(json.error || 'Failed to submit review. Please check all fields.');
      }
    } catch {
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: `Courses & Fees (${college.courses?.length || 0})` },
    { id: 'placements', label: 'Placements' },
    { id: 'reviews', label: `Reviews (${reviewsList.length})` },
  ];

  const latestPlacement = college.placements?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/colleges" className="hover:text-blue-600">Colleges</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{college.shortName || college.name}</span>
      </nav>

      {/* College Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {college.nirfRank && (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> NIRF Rank #{college.nirfRank}
                </span>
              )}
              {college.naacGrade && (
                <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg">
                  NAAC {college.naacGrade} Grade
                </span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {college.type} Institute
              </span>
            </div>

            {/* Title & Location */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {college.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {college.city}, {college.state}, India
              </span>
            </div>
          </div>

          {/* Rating & Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            {college.overallRating ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <div
                  className={`px-3 py-1.5 rounded-xl text-base font-extrabold flex items-center gap-1 shadow-2xs ${getRatingColor(
                    college.overallRating
                  )}`}
                >
                  <span>{college.overallRating.toFixed(1)}</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block">Overall Rating</span>
                  <span className="text-[11px] text-slate-400">
                    Based on {reviewsList.length} verified reviews
                  </span>
                </div>
              </div>
            ) : null}

            <button
              onClick={handleCompareToggle}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-xs ${
                selected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{selected ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Established
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {college.establishedYear || 'N/A'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Campus Area
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : 'N/A'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Faculty Ratio
            </span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {college.studentFacultyRatio || '1:12'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Avg Package
            </span>
            <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
              {formatLpa(latestPlacement?.averagePackageLpa)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About {college.name}</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {college.description}
            </p>
          </div>

          {/* Key Accepted Exams & Disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Entrance Exams Accepted</h3>
              <div className="flex flex-wrap gap-2">
                {college.exams?.map((e: any) => (
                  <span
                    key={e.exam}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold px-3 py-1 rounded-lg"
                  >
                    {e.exam.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900">Available Disciplines</h3>
              <div className="flex flex-wrap gap-2">
                {college.streams?.map((s: any) => (
                  <span
                    key={s.stream}
                    className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1 rounded-lg"
                  >
                    {s.stream.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COURSES & FEES TAB */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Courses & Tuition Fees</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full degree programs offered with annual and full course fee structure
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5">Level</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Annual Fee</th>
                  <th className="px-6 py-3.5">Total Fee</th>
                  <th className="px-6 py-3.5">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {college.courses?.map((course: any) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div>{course.name}</div>
                      {course.shortName && (
                        <span className="text-xs text-slate-400 font-medium">{course.shortName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course.duration} Years</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatFee(course.annualFees)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {formatFee(course.totalFees)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">
                      {course.eligibility || 'Check institutional notification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PLACEMENTS TAB */}
      {activeTab === 'placements' && (
        <div className="space-y-6">
          {college.placements?.map((placement: any) => (
            <div
              key={placement.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Placement Highlights ({placement.year})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Placement rate: {placement.placementPercent || 90}%
                  </span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                  {placement.totalOffers || '1000+'} Offers Made
                </span>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-medium block">Highest Package</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {formatLpa(placement.highestPackageLpa)}
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-medium block">Average Package</span>
                  <span className="text-xl font-extrabold text-emerald-800 mt-1 block">
                    {formatLpa(placement.averagePackageLpa)}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-400 font-medium block">Median Package</span>
                  <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                    {formatLpa(placement.medianPackageLpa || placement.averagePackageLpa * 0.9)}
                  </span>
                </div>
              </div>

              {/* Top Recruiters */}
              {placement.topRecruiters && Array.isArray(placement.topRecruiters) && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Top Recruiters
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {placement.topRecruiters.map((recruiter: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 shadow-2xs text-slate-800 font-semibold text-xs px-3 py-1.5 rounded-lg"
                      >
                        {recruiter}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student & Alumni Reviews</h2>
              <p className="text-xs text-slate-500">Authentic experiences and ratings by enrolled students</p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Reviews List */}
          {reviewsList.length > 0 ? (
            <div className="space-y-4">
              {reviewsList.map((rev: any) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.reviewerName}</h4>
                      <span className="text-xs text-slate-400">
                        {rev.course || 'Alumni'} · Class of {rev.graduationYear || '2024'}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${getRatingColor(
                        rev.overallRating
                      )}`}
                    >
                      <span>{rev.overallRating.toFixed(1)}</span>
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed">{rev.reviewText}</p>

                  {(rev.pros || rev.cons) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                      {rev.pros && (
                        <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-100">
                          <span className="font-bold block text-emerald-700 mb-0.5">Pros:</span>
                          {rev.pros}
                        </div>
                      )}
                      {rev.cons && (
                        <div className="bg-red-50 text-red-900 p-3 rounded-xl border border-red-100">
                          <span className="font-bold block text-red-700 mb-0.5">Cons:</span>
                          {rev.cons}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <p className="text-sm text-slate-500">No reviews yet for this college.</p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Be the first to share your review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Write a Review for {college.shortName}</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-sm font-bold">
                {reviewSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.reviewerName}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={reviewForm.graduationYear}
                      onChange={(e) => setReviewForm({ ...reviewForm, graduationYear: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Course / Program</label>
                  <input
                    type="text"
                    value={reviewForm.course}
                    onChange={(e) => setReviewForm({ ...reviewForm, course: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Overall Rating (1 - 5 Stars)
                  </label>
                  <select
                    value={reviewForm.overallRating}
                    onChange={(e) => setReviewForm({ ...reviewForm, overallRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                    <option value="4">⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value="3">⭐⭐⭐ (3.0 - Average)</option>
                    <option value="2">⭐⭐ (2.0 - Poor)</option>
                    <option value="1">⭐ (1.0 - Terrible)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Detailed Review (Min 30 characters)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    placeholder="Share details about academics, campus culture, faculty, and career placement..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Key Pros</label>
                    <input
                      type="text"
                      value={reviewForm.pros}
                      onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                      placeholder="e.g. Great labs, top tech placements"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Key Cons</label>
                    <input
                      type="text"
                      value={reviewForm.cons}
                      onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                      placeholder="e.g. Mess food, strict attendance"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || reviewForm.reviewText.length < 30}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 shadow-md"
                  >
                    {isSubmittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
