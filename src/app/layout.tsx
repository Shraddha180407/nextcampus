import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompareTray from '@/components/CompareTray';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextCampus — College Discovery & Decision Platform',
  description:
    'Discover top colleges in India, compare courses, fees, placements, and predict admission chances using historical cutoff intelligence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <CompareTray />
        <Footer />
      </body>
    </html>
  );
}
