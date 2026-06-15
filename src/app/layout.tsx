import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'ВШЭ — Правовая поддержка | ВНЖ и гражданство РФ',
  description: 'Официальная программа Высшей школы экономики по правовой поддержке иностранных граждан.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-100 py-12 mt-20">
            <div className="container mx-auto px-4">
              <LegalDisclaimer variant="footer" showDate={true} />
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
