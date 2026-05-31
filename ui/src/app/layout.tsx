import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ApiBanner } from '@/components/layout/api-banner';
import { StoreProvider } from '@/lib/store';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Gamage Vehicle Rental',
  description: 'Premium vehicle rental by Malinda Gamage — cars, vans, electric vehicles, and motorbikes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        <AuthProvider>
          <StoreProvider>
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <ApiBanner />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
