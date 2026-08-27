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
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        text: 'Strong Match',
        icon: CheckCircle2,
      },
      possible: {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        text: 'Possible',
        icon: AlertCircle,
      },
      reach: {
        bg: 'bg-purple-50 text-purple-900 border-purple-200',
        text: 'Reach / Target',
        icon: HelpCircle,
      },
    }[tier];

    const Icon = badgeConfig.icon;

    return (
      <div
        key={item.id}
        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold border px-2.5 py-1 rounded-lg ${badgeConfig.bg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {badgeConfig.text}
            </span>

            {col.nirfRank && (
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
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
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>
                {col.city}, {col.state}
              </span>
            </div>
          </div>

          {/* Course & Cutoff Insight */}
          <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
            <span className="text-slate-500 block font-medium">Predicted Program:</span>
            <span className="font-bold text-slate-800 block">
              {item.course?.name || col.courses?.[0]?.name || 'All Core Engineering / Allied Programs'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Historical Cutoff: Round 1 Closing Rank ~{item.closeRank || item.percentile + '%ile'}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-slate-50 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-medium">Avg Annual Fee</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {formatFee(col.courses?.[0]?.annualFees)}
              </span>
            </div>
            <div className="bg-emerald-50/60 p-2 rounded-lg">
              <span className="text-[10px] text-emerald-600 block font-medium">Avg Package</span>
              <span className="font-bold text-emerald-800 mt-0.5 block">
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
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              isCompared
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isCompared ? 'In Compare' : '+ Compare'}
          </button>

          <Link
            href={`/colleges/${col.slug}`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
          >
            <span>View Full Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Admission Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Rank & Admission Predictor</h1>
        <p className="text-sm text-slate-500">
          Match your entrance test score or rank against previous closing cutoff trends to see categorized college chances.
        </p>
      </div>

      {/* Input Calculator Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Exam Selector Tabs */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
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
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                    selectedExam.id === exam.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block">{exam.name.split(' ')[0]}</span>
                  <span
                    className={`text-[10px] block font-medium ${
                      selectedExam.id === exam.id ? 'text-blue-100' : 'text-slate-400'
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
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
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
                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                3. Reservation Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                4. Gender / Quota Pool
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer bg-white"
              >
                <option value="NEUTRAL">Gender-Neutral Pool</option>
                <option value="FEMALE">Female Supernumerary Only</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Predictions use Round 1 & Round 2 historical closing cutoff curves.</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
              <span>Predict Colleges</span>
            </button>
          </div>
        </form>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Results View */}
      {results && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Results Summary Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">
                Prediction Results for {results.userInput.rank ? `AIR #${results.userInput.rank}` : `${results.userInput.percentile}%ile`} ({results.userInput.category})
              </h2>
              <p className="text-xs text-slate-400">
                Found {results.totalRecommendations} matching institutional programs across 3 probability tiers
              </p>
            </div>

            {/* Disclaimer pill */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-amber-300 max-w-md">
              <strong>Notice:</strong> Historical cutoff-based estimate — not an admission guarantee.
            </div>
          </div>

          {/* 1. Strong Match Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Strong Match ({results.strongMatch?.length || 0})
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                — High probability based on past year closing ranks
              </span>
            </div>

            {results.strongMatch?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.strongMatch.map((item: any) =>
                  renderRecommendationCard(item, 'strong')
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100">
                No strong matches found in this score tier. Check Possible or Reach institutes below.
              </p>
            )}
          </div>

          {/* 2. Possible Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Possible Matches ({results.possible?.length || 0})
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                — Moderate probability (within 15% cutoff margin)
              </span>
            </div>

            {results.possible?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.possible.map((item: any) => renderRecommendationCard(item, 'possible'))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100">
                No colleges in the immediate 15% cutoff boundary.
              </p>
            )}
          </div>

          {/* 3. Reach Tier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <h3 className="text-lg font-bold text-slate-900">
                Reach / Ambitious ({results.reach?.length || 0})
              </h3>
              <span className="text-xs text-slate-500 font-normal">
                — Competitive tier; potential in spot/special rounds
              </span>
            </div>

            {results.reach?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.reach.map((item: any) => renderRecommendationCard(item, 'reach'))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-100">
                No reach tier colleges identified.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
