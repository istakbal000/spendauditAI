import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Spend Audit — Stop Overpaying for AI Tools',
  description:
    'Audit your startup\'s AI tool stack in 60 seconds. Get personalized recommendations to cut costs and optimize spending on Cursor, ChatGPT, Claude, Copilot, and more.',
  keywords: [
    'AI tools audit',
    'ChatGPT pricing',
    'Cursor pricing',
    'GitHub Copilot cost',
    'Claude pricing',
    'AI spend optimization',
    'startup AI tools',
    'reduce AI costs',
  ],
  authors: [{ name: 'AI Spend Audit' }],
  openGraph: {
    title: 'AI Spend Audit — Stop Overpaying for AI Tools',
    description:
      'Audit your AI tool stack in 60 seconds. Cut costs, eliminate redundancy, optimize your stack.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AI Spend Audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit — Stop Overpaying for AI Tools',
    description: 'Audit your AI stack in 60 seconds. Cut costs, eliminate redundancy.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>

      <body className="antialiased">{children}</body>
    </html>
  );
}
