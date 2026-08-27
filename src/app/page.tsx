import Link from 'next/link';
import { Search, GitCompare, Calculator, Award, ArrowRight, BookOpen, Building2 } from 'lucide-react';
import CollegeCard from '@/components/CollegeCard';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getFeaturedColleges() {
  try {
    return await prisma.college.findMany({
      take: 8,
      orderBy: { nirfRank: 'asc' },
      include: {
        streams: { select: { stream: true } },
        exams: { select: { exam: true } },
        courses: {
          take: 2,
          select: { id: true, name: true, shortName: true, annualFees: true },
        },
        placements: {
          take: 1,
          orderBy: { year: 'desc' },
          select: { highestPackageLpa: true, averagePackageLpa: true, year: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });
  } catch (error) {
    console.error('Error in getFeaturedColleges:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredColleges = await getFeaturedColleges();

  const streams = [
    { name: 'Engineering', count: 'IITs, NITs, BITS', icon: Building2, href: '/colleges?stream=ENGINEERING' },
    { name: 'Medical', count: 'AIIMS, JIPMER, CMC', icon: Award, href: '/colleges?stream=MEDICAL' },
    { name: 'Management', count: 'IIMs, XLRI, FMS', icon: BookOpen, href: '/colleges?stream=MANAGEMENT' },
    { name: 'Law', count: 'NLUs, NALSAR', icon: GraduationCapIcon, href: '/colleges?stream=LAW' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Empowering 2026 Admissions & Counseling
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find the Right College with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Data & Cutoff Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Explore verified tuition fees, placement records, and entrance exam cutoffs. Compare institutes side-by-side or calculate your admission probability.
          </p>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto">
            <Link
              href="/colleges"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Explore Colleges</span>
                <span className="text-xs text-slate-300">Filter by fees, rank & exams</span>
              </div>
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Compare (Max 3)</span>
                <span className="text-xs text-slate-300">Side-by-side matrix</span>
              </div>
            </Link>

            <Link
              href="/predictor"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Rank Predictor</span>
                <span className="text-xs text-slate-300">Safe, possible & reach tiers</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stream Quick Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Stream</h2>
            <p className="text-sm text-slate-500">Find premier institutions tailored to your domain</p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {streams.map((stream) => {
            const Icon = stream.icon;
            return (
              <Link
                key={stream.name}
                href={stream.href}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stream.name}
                  </h3>
                  <span className="text-xs text-slate-400 block mt-0.5">{stream.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Top Institutions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Top Ranked Institutions</h2>
            <p className="text-sm text-slate-500">NIRF top-ranked universities with high placement records</p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Browse All Colleges</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">Discover top colleges across all streams.</p>
          </div>
        )}
      </section>

      {/* Predictor Feature Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Smart Predictor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Know Your Admission Chances Before Counseling
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Enter your JEE Main, JEE Advanced, NEET, or CAT score to get categorized college recommendations based on historical cutoff tiers.
            </p>
            <div className="pt-2">
              <Link
                href="/predictor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10"
              >
                <span>Calculate Admission Chances</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
