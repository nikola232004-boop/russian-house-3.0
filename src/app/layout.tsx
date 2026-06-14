import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

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
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
