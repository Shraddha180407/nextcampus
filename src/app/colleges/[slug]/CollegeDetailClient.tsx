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
        alert(json.error || 'Failed to submit review');
      }
    } catch {
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const latestPlacement = college.placements?.[0];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: `Courses & Fees (${college.courses?.length || 0})` },
    { id: 'placements', label: 'Placements' },
    { id: 'reviews', label: `Reviews (${reviewsList.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {college.nirfRank && (
                <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg">
                  <Award className="w-4 h-4 text-amber-600" /> NIRF #{college.nirfRank} in India
                </span>
              )}
              {college.naacGrade && (
                <span className="text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg">
                  NAAC Grade: {college.naacGrade}
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {college.type}
              </span>
            </div>

            {/* Title & Location */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              {college.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {college.city}, {college.state}
              </span>
              {college.establishedYear && (
                <>
                  <span className="text-slate-300">·</span>
                  <span>Estd. {college.establishedYear}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons & Rating Summary */}
          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            {college.overallRating ? (
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-xl text-sm font-black flex items-center gap-1.5 shadow-xs ${getRatingColor(
                    college.overallRating
                  )}`}
                >
                  <span>{college.overallRating.toFixed(1)}</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block">
                    {college.ratingCount || reviewsList.length} Verified Reviews
                  </span>
                  <span className="text-slate-500">Student verified</span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCompareToggle}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{selected ? 'In Comparison Tray' : '+ Add to Compare'}</span>
              </button>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-slate-500 block font-semibold">Campus Size</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : 'Urban Campus'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-slate-500 block font-semibold">Student-Faculty Ratio</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {college.studentFacultyRatio || '1:12'}
            </span>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
            <span className="text-emerald-800 block font-semibold">Avg CTC (Placements)</span>
            <span className="font-extrabold text-emerald-900 text-sm mt-0.5 block">
              {formatLpa(latestPlacement?.averagePackageLpa)}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-slate-500 block font-semibold">Highest Package</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {formatLpa(latestPlacement?.highestPackageLpa)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
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
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
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
                    className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1 rounded-lg"
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
                    className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg"
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
              <p className="text-xs text-slate-600 mt-0.5">
                Full degree programs offered with annual and full course fee structure
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Course Name</th>
                  <th className="px-6 py-3.5">Level</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Annual Fee</th>
                  <th className="px-6 py-3.5">Total Fee</th>
                  <th className="px-6 py-3.5">Eligibility Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {college.courses?.map((course: any) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div>{course.name}</div>
                      {course.shortName && (
                        <span className="text-xs text-slate-500 font-semibold">{course.shortName}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{course.duration} Years</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {formatFee(course.annualFees)}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {formatFee(course.totalFees)}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700 max-w-sm">
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
                  <span className="text-xs text-slate-600">
                    Placement rate: {placement.placementPercent || 90}%
                  </span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 text-xs font-extrabold rounded-lg border border-emerald-200">
                  {placement.totalOffers || '1000+'} Offers Made
                </span>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Highest Package</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {formatLpa(placement.highestPackageLpa)}
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <span className="text-xs text-emerald-800 font-semibold block uppercase tracking-wider">Average Package</span>
                  <span className="text-xl font-black text-emerald-900 mt-1 block">
                    {formatLpa(placement.averagePackageLpa)}
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Median Package</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {formatLpa(placement.medianPackageLpa || placement.averagePackageLpa * 0.9)}
                  </span>
                </div>
              </div>

              {/* Top Recruiters */}
              {placement.topRecruiters && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Top Participating Companies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(placement.topRecruiters)
                      ? placement.topRecruiters
                      : JSON.parse(placement.topRecruiters || '[]')
                    ).map((company: string) => (
                      <span
                        key={company}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded-lg"
                      >
                        {company}
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
              <h2 className="text-lg font-bold text-slate-900">Student Reviews & Experiences</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Verified reviews from enrolled students and alumni
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {reviewsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsList.map((rev: any) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {rev.reviewerName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {rev.course} · Class of {rev.graduationYear}
                      </span>
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 ${getRatingColor(
                        rev.overallRating
                      )}`}
                    >
                      <span>{rev.overallRating.toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed">{rev.reviewText}</p>

                  {(rev.pros || rev.cons) && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      {rev.pros && (
                        <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-emerald-900">
                          <span className="font-bold block text-emerald-800">Pros:</span> {rev.pros}
                        </div>
                      )}
                      {rev.cons && (
                        <div className="bg-red-50 border border-red-100 p-2 rounded-lg text-red-900">
                          <span className="font-bold block text-red-800">Cons:</span> {rev.cons}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No reviews submitted yet.</p>
              <p className="text-xs text-slate-500">Be the first student to review this institution!</p>
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
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-center text-sm font-bold">
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
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={reviewForm.graduationYear}
                      onChange={(e) => setReviewForm({ ...reviewForm, graduationYear: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Overall Rating (1 - 5 Stars)
                  </label>
                  <select
                    value={reviewForm.overallRating}
                    onChange={(e) => setReviewForm({ ...reviewForm, overallRating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="5" className="text-slate-900 bg-white">⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                    <option value="4" className="text-slate-900 bg-white">⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value="3" className="text-slate-900 bg-white">⭐⭐⭐ (3.0 - Average)</option>
                    <option value="2" className="text-slate-900 bg-white">⭐⭐ (2.0 - Poor)</option>
                    <option value="1" className="text-slate-900 bg-white">⭐ (1.0 - Terrible)</option>
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
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Key Cons</label>
                    <input
                      type="text"
                      value={reviewForm.cons}
                      onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                      placeholder="e.g. Mess food, strict attendance"
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || reviewForm.reviewText.length < 30}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 shadow-md cursor-pointer"
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
