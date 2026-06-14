'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsLoading(false);
    setFormData({ name: '', email: '', topic: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactCards = [
    { icon: "📞", title: "Телефон", value: "+7 (495) 123-45-67", subtitle: "Пн-Пт: 9:00 – 20:00" },
    { icon: "✉️", title: "Email", value: "support@hse-legal.ru", subtitle: "Ответ в течение 24 часов" },
    { icon: "📍", title: "Адрес", value: "Покровский бульвар, 11", subtitle: "Москва, каб. 315" }
  ];

  const topics = ["ВНЖ", "Гражданство РФ", "Сбор документов", "Миграционный учёт", "Другое"];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 border border-blue-200">
            <span className="text-blue-700 text-sm font-medium">Свяжитесь с нами</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Контакты</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {contactCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">{card.title}</h3>
              <p className="text-xl font-bold text-gray-900 mb-2">{card.value}</p>
              <p className="text-sm text-gray-400">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Написать нам</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">✓</span>
                </div>
                <p className="text-green-600 text-xl font-bold">Сообщение отправлено!</p>
                <p className="text-gray-500 mt-2">Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Ваше имя</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Тема обращения</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Выберите тему</option>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Сообщение</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Мы на карте</h2>
            <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🗺️</span>
                <p className="text-gray-600">г. Москва, Покровский бульвар, 11</p>
                <p className="text-gray-400 text-sm mt-2">Метро: Китай-город, Чкаловская</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">Также вы можете связаться с нами через:</p>
              <div className="flex justify-center gap-4 mt-4">
                <span className="text-2xl cursor-pointer hover:scale-110 transition">📱</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition">📘</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition">🎥</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
