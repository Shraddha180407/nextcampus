'use client';

import { RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    stream?: string;
    state?: string;
    type?: string;
    minRating?: string;
    exam?: string;
    maxFee?: string;
  };
  onFilterChange: (key: string, value: string | undefined) => void;
  onReset: () => void;
}

const STREAMS = [
  { label: 'Engineering', value: 'ENGINEERING' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Management', value: 'MANAGEMENT' },
  { label: 'Law', value: 'LAW' },
  { label: 'Science', value: 'SCIENCE' },
  { label: 'Design', value: 'DESIGN' },
  { label: 'Pharmacy', value: 'PHARMACY' },
];

const STATES = [
  'Delhi',
  'Maharashtra',
  'Tamil Nadu',
  'Karnataka',
  'Rajasthan',
  'Gujarat',
  'West Bengal',
  'Uttar Pradesh',
];

const EXAMS = [
  { label: 'JEE Main', value: 'JEE_MAIN' },
  { label: 'JEE Advanced', value: 'JEE_ADVANCED' },
  { label: 'NEET', value: 'NEET' },
  { label: 'CAT', value: 'CAT' },
  { label: 'BITSAT', value: 'BITSAT' },
  { label: 'CLAT', value: 'CLAT' },
  { label: 'GATE', value: 'GATE' },
  { label: 'VITEEE', value: 'VITEEE' },
];

const RATINGS = [
  { label: 'Any Rating', value: '' },
  { label: '4.5+ Stars', value: '4.5' },
  { label: '4.0+ Stars', value: '4.0' },
  { label: '3.5+ Stars', value: '3.5' },
];

const TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Government', value: 'GOVERNMENT' },
  { label: 'Private', value: 'PRIVATE' },
  { label: 'Deemed', value: 'DEEMED' },
  { label: 'Central', value: 'CENTRAL' },
];

export default function FilterSidebar({ filters, onFilterChange, onReset }: FilterSidebarProps) {
  const activeStreamList = filters.stream ? filters.stream.split(',') : [];
  const activeStateList = filters.state ? filters.state.split(',') : [];
  const activeExamList = filters.exam ? filters.exam.split(',') : [];

  const toggleMultiSelect = (currentList: string[], value: string, key: string) => {
    let updated: string[];
    if (currentList.includes(value)) {
      updated = currentList.filter((v) => v !== value);
    } else {
      updated = [...currentList, value];
    }
    onFilterChange(key, updated.length > 0 ? updated.join(',') : undefined);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <aside aria-label="Filters" className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-900 text-base">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* 1. Stream Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Stream / Discipline
        </h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {STREAMS.map((s) => {
            const isChecked = activeStreamList.includes(s.value);
            return (
              <label
                key={s.value}
                className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect(activeStreamList, s.value, 'stream')}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-3.5 h-3.5"
                />
                <span>{s.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. State / Location */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          State / Location
        </h3>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {STATES.map((state) => {
            const isChecked = activeStateList.includes(state);
            return (
              <label
                key={state}
                className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect(activeStateList, state, 'state')}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-3.5 h-3.5"
                />
                <span>{state}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Entrance Exam */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Accepted Exam
        </h3>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {EXAMS.map((e) => {
            const isChecked = activeExamList.includes(e.value);
            return (
              <label
                key={e.value}
                className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMultiSelect(activeExamList, e.value, 'exam')}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-3.5 h-3.5"
                />
                <span>{e.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Minimum Rating */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Student Rating
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => onFilterChange('minRating', r.value || undefined)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                (filters.minRating || '') === r.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. College Type */}
      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Institute Type
        </h3>
        <div className="space-y-1">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer select-none py-0.5"
            >
              <input
                type="radio"
                name="collegeType"
                checked={(filters.type || '') === t.value}
                onChange={() => onFilterChange('type', t.value || undefined)}
                className="text-blue-600 focus:ring-blue-500 border-slate-300 w-3.5 h-3.5"
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 6. Max Annual Fees Slider */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold uppercase tracking-wider text-slate-500">Max Annual Fee</span>
          <span className="font-bold text-slate-900">
            {filters.maxFee ? `₹${(Number(filters.maxFee) / 100000).toFixed(1)} Lakh` : 'Any Fee'}
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="1500000"
          step="50000"
          value={filters.maxFee || '1500000'}
          onChange={(e) => onFilterChange('maxFee', e.target.value === '1500000' ? undefined : e.target.value)}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹50K</span>
          <span>₹7.5L</span>
          <span>₹15L+</span>
        </div>
      </div>
    </aside>
  );
}
