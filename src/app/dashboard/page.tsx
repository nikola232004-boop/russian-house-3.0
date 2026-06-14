'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-2xl mb-2">📧</div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
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
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Мои заявки</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-500 font-medium">Тип</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Статус</th>
                  <th className="text-left py-3 text-gray-500 font-medium">Дата</th>
                  <th className="text-left py-3 text-gray-500 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">{app.type}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'На рассмотрении' 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{app.date}</td>
                    <td className="py-3">
                      <Link href="#" className="text-blue-600 text-sm hover:underline">
                        Подробнее
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Получить консультацию
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
