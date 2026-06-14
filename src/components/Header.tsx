'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      setUserName(userData.name.split(' ')[0]);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/#services' },
    { name: 'ИИ-юрист', href: '/assistant' },
    { name: 'О программе', href: '/about' },
    { name: 'Контакты', href: '/contacts' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-md'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🏛️</span>
            </div>
            <div>
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
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white">
                👤 {userName}
              </Link>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-white">
                🔒 Личный кабинет
              </Link>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
