'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GitCompare, X, ArrowRight } from 'lucide-react';

export interface CompareItem {
  slug: string;
  name: string;
  shortName?: string | null;
  city: string;
  overallRating?: number | null;
}

export function useCompareList() {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nextcampus_compare_list');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const save = (newItems: CompareItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('nextcampus_compare_list', JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addItem = (item: CompareItem) => {
    if (items.find((i) => i.slug === item.slug)) return false;
    if (items.length >= 3) {
      alert('You can compare up to 3 colleges at a time.');
      return false;
    }
    const updated = [...items, item];
    save(updated);
    return true;
  };

  const removeItem = (slug: string) => {
    const updated = items.filter((i) => i.slug !== slug);
    save(updated);
  };

  const clear = () => {
    save([]);
  };

  const isInCompare = (slug: string) => items.some((i) => i.slug === slug);

  return { items, addItem, removeItem, clear, isInCompare };
}

export default function CompareTray() {
  const { items, removeItem, clear } = useCompareList();

  if (items.length === 0) return null;

  const compareUrl = `/compare?ids=${items.map((i) => i.slug).join(',')}`;

  return (
    <aside aria-label="College Comparison Tray" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900/95 text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur flex items-center justify-between gap-3">
        {/* Selected List */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 shrink-0 mr-1">
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">Compare ({items.length}/3)</span>
          </div>

          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 shrink-0"
            >
              <span className="font-medium max-w-[120px] truncate">
                {item.shortName || item.name}
              </span>
              <button
                onClick={() => removeItem(item.slug)}
                className="text-slate-400 hover:text-red-400 p-0.5 rounded transition-colors"
                title="Remove from comparison"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors"
          >
            Clear
          </button>
          <Link
            href={compareUrl}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              items.length >= 2
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
