cat > src/app/about/page.tsx << 'EOF'
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { value: "5000+", label: "Консультаций", icon: "💬", color: "from-blue-500 to-blue-600" },
  { value: "2000+", label: "Получили ВНЖ", icon: "📋", color: "from-green-500 to-green-600" },
  { value: "1000+", label: "Гражданство РФ", icon: "🇷🇺", color: "from-red-500 to-red-600" },
  { value: "98%", label: "Успешных решений", icon: "⭐", color: "from-amber-500 to-amber-600" }
];

const team = [
  { name: "Александр Иванов", role: "Руководитель программы", expert: "Миграционное право", degree: "Доктор юридических наук" },
  { name: "Елена Петрова", role: "Ведущий юрист", expert: "Гражданство РФ", degree: "Кандидат юридических наук" },
  { name: "Михаил Соколов", role: "Эксперт", expert: "ВНЖ и РВП", degree: "Юрист высшей категории" },
  { name: "Татьяна Козлова", role: "Консультант", expert: "Документационное обеспечение", degree: "Сертифицированный специалист" }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 border border-blue-200">
            <span className="text-blue-700 text-sm font-medium">О программе</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Программа правовой поддержки ВШЭ
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
        </motion.div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-blue-600 to-blue-700">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm mt-2 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Миссия */}
        <div className="bg-white rounded-2xl p-8 mb-20 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Наша миссия
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Сделать процесс получения ВНЖ и гражданства РФ понятным, прозрачным и доступным для каждого. 
            Мы объединили академический опыт Высшей школы экономики с практическими знаниями ведущих миграционных юристов.
          </p>
        </div>

        {/* Команда */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Эксперты программы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl text-white">👤</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 text-sm font-semibold mt-1">{member.role}</p>
              <p className="text-gray-500 text-sm mt-2">{member.expert}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">{member.degree}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Кнопка */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Присоединиться к программе
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF