'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Award,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { formatFee, formatLpa } from '@/lib/utils';
import { useCompareList } from '@/components/CompareTray';

const EXAMS = [
  { id: 'JEE_MAIN', name: 'JEE Main (B.Tech)', type: 'rank', placeholder: 'Enter AIR (e.g. 4500)' },
  { id: 'JEE_ADVANCED', name: 'JEE Advanced (IITs)', type: 'rank', placeholder: 'Enter AIR (e.g. 95)' },
  { id: 'NEET', name: 'NEET UG (Medical)', type: 'rank', placeholder: 'Enter NEET Rank (e.g. 200)' },
  { id: 'CAT', name: 'CAT (IIMs & B-Schools)', type: 'percentile', placeholder: 'Enter Percentile (e.g. 99.4)' },
  { id: 'BITSAT', name: 'BITSAT (BITS Pilani)', type: 'rank', placeholder: 'Enter BITSAT Score (e.g. 330)' },
  { id: 'CLAT', name: 'CLAT (Law NLUs)', type: 'rank', placeholder: 'Enter CLAT Rank (e.g. 150)' },
  { id: 'VITEEE', name: 'VITEEE (VIT Vellore)', type: 'rank', placeholder: 'Enter VITEEE Rank (e.g. 6000)' },
];

const CATEGORIES = [
  { id: 'GENERAL', label: 'General / Open' },
  { id: 'OBC', label: 'OBC (Non-Creamy Layer)' },
  { id: 'SC', label: 'Scheduled Caste (SC)' },
  { id: 'ST', label: 'Scheduled Tribe (ST)' },
  { id: 'EWS', label: 'Economically Weaker Section (EWS)' },
];

export default function PredictorPage() {
  const [selectedExam, setSelectedExam] = useState(EXAMS[0]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [gender, setGender] = useState('NEUTRAL');

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { addItem, isInCompare } = useCompareList();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload: any = {
        exam: selectedExam.id,
        category,
        gender,
        year: 2024,
      };

      if (selectedExam.type === 'percentile') {
        payload.percentile = parseFloat(inputValue);
      } else {
        payload.rank = parseInt(inputValue, 10);
      }

      const res = await fetch('/api/predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      } else {
        setErrorMsg(json.error || 'Failed to calculate predictions');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderRecommendationCard = (item: any, tier: 'strong' | 'possible' | 'reach') => {
    const col = item.college;
    const isCompared = isInCompare(col.slug);

    const badgeConfig = {
      strong: {
        bg: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
        text: 'Strong Match',
        icon: CheckCircle2,
      },
      possible: {
        bg: 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold',
        text: 'Possible',
        icon: AlertCircle,
      },
      reach: {
        bg: 'bg-purple-100 text-purple-950 border-purple-300 font-extrabold',
        text: 'Reach / Target',
        icon: HelpCircle,
      },
    }[tier];

    const Icon = badgeConfig.icon;

    return (
      <div
        key={item.id}
        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs border px-2.5 py-1 rounded-lg ${badgeConfig.bg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {badgeConfig.text}
            </span>

            {col.nirfRank && (
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                NIRF #{col.nirfRank}
              </span>
            )}
          </div>

          <div>
            <Link
              href={`/colleges/${col.slug}`}
              className="font-extrabold text-base text-slate-900 hover:text-blue-600 line-clamp-1"
            >
              {col.name}
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {col.city}, {col.state}
              </span>
            </div>
          </div>

          {/* Course & Cutoff Insight */}
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs space-y-1">
            <span className="text-slate-500 block font-semibold">Predicted Program:</span>
            <span className="font-extrabold text-slate-900 block text-sm">
              {item.course?.name || col.courses?.[0]?.name || 'All Core Engineering / Allied Programs'}
            </span>
            <span className="text-xs text-slate-600 block font-medium">
              Historical Cutoff: Round 1 Closing Rank ~{item.closeRank || item.percentile + '%ile'}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">
                Avg Annual Fee
              </span>
              <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
                {formatFee(col.courses?.[0]?.annualFees)}
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
              <span className="text-[10px] text-emerald-800 block font-semibold uppercase tracking-wider">
                Avg Package
              </span>
              <span className="font-extrabold text-emerald-900 text-sm mt-0.5 block">
                {formatLpa(col.placements?.[0]?.averagePackageLpa)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
          <button
            onClick={() =>
              addItem({
                slug: col.slug,
                name: col.name,
                shortName: col.shortName,
                city: col.city,
                overallRating: col.overallRating,
              })
            }
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              isCompared
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isCompared ? 'In Compare' : '+ Compare'}
          </button>

          <Link
            href={`/colleges/${col.slug}`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-extrabold"
          >
            <span>View Profile</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Admission Intelligence
        </div>
        <h1 className="text-3xl font-black text-slate-900">Rank & Admission Predictor</h1>
        <p className="text-sm text-slate-600 font-normal">
          Match your entrance test score or rank against previous closing cutoff trends to see categorized college chances.
        </p>
      </div>

      {/* Input Calculator Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Exam Selector Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2.5">
              1. Select Entrance Exam
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {EXAMS.map((exam) => (
                <button
                  type="button"
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam);
                    setInputValue('');
                  }}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                    selectedExam.id === exam.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-bold">{exam.name.split(' ')[0]}</span>
                  <span
                    className={`text-[11px] block font-medium mt-0.5 ${
                      selectedExam.id === exam.id ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {exam.name.split('(')[1]?.replace(')', '') || ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Rank / Percentile, Category, Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                2. Your {selectedExam.type === 'percentile' ? 'Percentile' : 'All India Rank'}
              </label>
              <input
                type="number"
                step={selectedExam.type === 'percentile' ? '0.01' : '1'}
                min={selectedExam.type === 'percentile' ? '0' : '1'}
                max={selectedExam.type === 'percentile' ? '100' : '2000000'}
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={selectedExam.placeholder}
                className="w-full px-4 py-3 text-sm font-bold bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                3. Reservation Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 text-xs font-bold bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-slate-900 bg-white">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                4. Gender / Quota Pool
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-3 text-xs font-bold bg-white text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="NEUTRAL" className="text-slate-900 bg-white">Gender-Neutral Pool</option>
                <option value="FEMALE" className="text-slate-900 bg-white">Female Supernumerary Only</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Predictions use Round 1 & Round 2 historical closing cutoff curves.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              <span>Predict Eligible Colleges</span>
            </button>
          </div>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-sm font-bold">
          {errorMsg}
        </div>
      )}

      {/* Results View */}
      {results && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Results Summary Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Prediction Results for {results.userInput.rank ? `AIR #${results.userInput.rank}` : `${results.userInput.percentile}%ile`} ({results.userInput.category})
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Found <span className="text-white font-bold">{results.totalRecommendations}</span> matching institutional programs across 3 probability tiers
              </p>
            </div>

            {/* Disclaimer pill */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3.5 text-xs text-amber-200 max-w-md leading-relaxed">
              <strong className="text-amber-300">Notice:</strong> Historical cutoff-based estimate for counseling guidance — not an official admission guarantee.
            </div>
          </div>

          {/* 1. Strong Match Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Strong Match ({results.strongMatch?.length || 0})
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                — Rank comfortably within past closing cutoffs (≤ 0.85× cutoff)
              </span>
            </div>

            {results.strongMatch?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.strongMatch.map((item: any) =>
                  renderRecommendationCard(item, 'strong')
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic bg-white p-4 rounded-xl border border-slate-200">
                No strong matches found in this score tier. Check Possible or Reach institutes below.
              </p>
            )}
          </div>

          {/* 2. Possible Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Possible Matches ({results.possible?.length || 0})
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                — Close to past closing cutoffs (within 10% margin, ≤ 1.10× cutoff)
              </span>
            </div>

            {results.possible?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.possible.map((item: any) => renderRecommendationCard(item, 'possible'))}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic bg-white p-4 rounded-xl border border-slate-200">
                No colleges in the immediate 10% cutoff boundary.
              </p>
            )}
          </div>

          {/* 3. Reach / Dream Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
              <h3 className="text-lg font-extrabold text-slate-900">
                Reach Choices ({results.reach?.length || 0})
              </h3>
              <span className="text-xs text-slate-600 font-medium">
                — Above past closing cutoffs (≤ 1.35× cutoff, requiring cutoff shifts)
              </span>
            </div>

            {results.reach?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.reach.map((item: any) => renderRecommendationCard(item, 'reach'))}
              </div>
            ) : (
              <p className="text-xs text-slate-600 italic bg-white p-4 rounded-xl border border-slate-200">
                No colleges in the reach bracket.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
