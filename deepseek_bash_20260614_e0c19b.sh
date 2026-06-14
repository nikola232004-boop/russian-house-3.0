cat > src/components/landing/Hero.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="relative z-10 container mx-auto px-4 text-center max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <span className="text-blue-700 text-sm font-medium">⚡ Официальная программа ВШЭ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight">
            Правовая поддержка
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mt-2">
              Ваш путь к гражданству РФ
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Консультации ведущих юристов и экспертов Высшей школы экономики. 
            Помощь в оформлении ВНЖ, гражданства и миграционном учёте.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Начать консультацию
              <span>→</span>
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              Узнать о программе
            </Link>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-gray-500">Лицензия ВШЭ № 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-gray-500">Аккредитация МВД РФ</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-gray-500">10+ лет экспертизы</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
EOF