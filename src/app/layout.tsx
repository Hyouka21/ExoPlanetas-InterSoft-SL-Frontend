import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExoClassifier - Exoplanet Classifier',
  description: 'Automatic exoplanet classifier using Machine Learning. Discover new worlds with the help of artificial intelligence.',
  keywords: ['exoplanets', 'machine learning', 'classification', 'astronomy', 'AI'],
  authors: [{ name: 'ExoClassifier Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-galaxy-dark text-galaxy-primary`}>
        <div className="min-h-screen flex flex-col gradient-nebula">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
