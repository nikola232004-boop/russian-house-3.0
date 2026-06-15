'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const applications = [
    { id: 1, type: 'ВНЖ', status: 'На рассмотрении', date: '15.06.2026' },
    { id: 2, type: 'Гражданство', status: 'Документы приняты', date: '10.05.2026' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-xl text-white">👤</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {user.name}!</h1>
                  <p className="text-gray-500">Личный кабинет программы правовой поддержки ВШЭ</p>
                  {user.role === 'ADMIN' && (
                    <p className="text-xs text-purple-600 mt-1">⭐ У вас есть права администратора</p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition"
            >
              Выйти
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl mb-2">📧</div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-900 font-medium text-sm truncate">{user.email}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-gray-500 text-sm">Телефон</p>
            <p className="text-gray-900 font-medium">{user.phone || 'Не указан'}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-gray-500 text-sm">Дата регистрации</p>
            <p className="text-gray-900 font-medium">
              {new Date(user.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 transition">
            <Link href="/dashboard/documents">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-gray-500 text-sm">Мои документы</p>
              <p className="text-blue-600 font-medium">Перейти →</p>
            </Link>
          </div>
        </div>

        {user.role === 'ADMIN' && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-purple-100 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🔧</span> Панель администратора
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-800">Статистика</p>
                  <p className="text-xs text-gray-500">Аналитика и метрики</p>
                </div>
              </Link>
              <Link href="/admin/documents" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-gray-800">Документы</p>
                  <p className="text-xs text-gray-500">Все документы клиентов</p>
                </div>
              </Link>
              <Link href="/admin/rag" className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="font-semibold text-gray-800">RAG база</p>
                  <p className="text-xs text-gray-500">Загрузка документов</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Мои заявки</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-500 font-medium">Тип</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Статус</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{app.type}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${app.status === 'На рассмотрении' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{app.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/assistant" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
            Получить консультацию
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
