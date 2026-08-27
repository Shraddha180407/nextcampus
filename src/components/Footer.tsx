import Link from 'next/link';
import { GraduationCap, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              NextCampus
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              A high-performance college discovery and intelligence platform built with Next.js 14 App Router, TypeScript, TailwindCSS, Prisma ORM, and PostgreSQL.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-amber-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Demo Dataset Notice:</strong> Admission cutoffs, placement records, and institutional statistics are realistic simulated estimates for engineering demonstration purposes.
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-blue-400 transition-colors">All Colleges</Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-400 transition-colors">Compare Tool</Link>
              </li>
              <li>
                <Link href="/predictor" className="hover:text-blue-400 transition-colors">Rank & Admission Predictor</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Architecture & Stack</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" /> Next.js 14 App Router & Server Actions
              </p>
              <p className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" /> Prisma ORM + PostgreSQL on Neon
              </p>
              <p className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" /> Zod Validation & Type-safe APIs
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} NextCampus. Built with high agency & ownership for the AI Software Engineer Internship.
        </div>
      </div>
    </footer>
  );
}
