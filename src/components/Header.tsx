'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/#services' },
    { name: 'ИИ-юрист', href: '/assistant' },
    { name: 'О программе', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white shadow-md'
    }`}>
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🏛️</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-gray-800 font-bold">Высшая школа экономики</p>
              <p className="text-gray-500 text-xs">Правовая поддержка</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-600 hover:text-blue-600 transition">
                {item.name}
              </Link>
            ))}
            
            {user?.role === 'ADMIN' && (
              <div className="flex items-center space-x-3 ml-2 border-l pl-4 border-gray-200">
                <span className="text-xs text-purple-600 font-semibold">🔐 АДМИН</span>
                <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700 transition text-sm">
                  📊 Статистика
                </Link>
                <Link href="/admin/documents" className="text-purple-600 hover:text-purple-700 transition text-sm">
                  📋 Документы
                </Link>
                <Link href="/admin/rag" className="text-purple-600 hover:text-purple-700 transition text-sm">
                  🧠 RAG
                </Link>
              </div>
            )}
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">👋 {user.name?.split(' ')[0]}</span>
                {user.role === 'ADMIN' && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Admin</span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-full hover:bg-red-50 transition text-sm"
                >
                  Выйти
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white font-semibold text-sm"
                >
                  Кабинет
                </Link>
              </div>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white">
                🔒 Личный кабинет
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
