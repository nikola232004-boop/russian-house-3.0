'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    icon: "⚖️",
    title: "Юридическая консультация",
    description: "Индивидуальная консультация с экспертом ВШЭ по вопросам миграционного законодательства.",
    badge: "Помощь 24/7",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: "📑",
    title: "Сбор документов",
    description: "Помощь в сборе полного пакета документов для МВД. Нотариальное заверение и переводы.",
    badge: "Полное сопровождение",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: "🏛️",
    title: "Сопровождение в МВД",
    description: "Личное присутствие юриста при подаче документов. Контроль сроков.",
    badge: "Представительство",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: "🤝",
    title: "Получение гражданства",
    description: "Полный цикл получения гражданства РФ от документов до присяги.",
    badge: "Под ключ",
    color: "from-green-500 to-green-600"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 border border-blue-200">
            <span className="text-blue-700 text-sm font-medium">Наши услуги</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Комплексная поддержка
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Полный спектр услуг по миграционному сопровождению под ключ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                
                <div className="absolute top-0 right-0">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full">
                    {service.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                <Link 
                  href="/assistant" 
                  className="inline-flex items-center text-blue-600 text-sm font-semibold hover:text-blue-700 transition gap-1 group-hover:gap-2"
                >
                  Узнать подробнее
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
