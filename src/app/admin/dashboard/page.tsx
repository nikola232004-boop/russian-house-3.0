'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/analytics/stats');
      const json = await res.json();
      
      if (res.ok) {
        setData(json);
      } else {
        setError(json.message || 'Ошибка загрузки');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Повторить
          </button>
        </div>
      </div>
    );
  }

  const maxFunnelCount = Math.max(...(data?.funnel?.map((f: any) => f.count) || [1]), 1);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Админ-дашборд</h1>
          <p className="text-gray-500">Статистика использования и аналитика</p>
          <p className="text-xs text-green-600 mt-1">{data?.message}</p>
        </div>

        {/* Основные KPI карточки */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">👥</div>
            <p className="text-gray-500 text-sm">Пользователей</p>
            <p className="text-3xl font-bold text-gray-900">{data?.total?.users || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-gray-500 text-sm">Сообщений в чате</p>
            <p className="text-3xl font-bold text-gray-900">{data?.total?.chats || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-gray-500 text-sm">Загружено документов</p>
            <p className="text-3xl font-bold text-gray-900">{data?.total?.documents || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-gray-500 text-sm">Всего событий</p>
            <p className="text-3xl font-bold text-gray-900">{data?.total?.events || 0}</p>
          </div>
        </div>

        {/* Воронка продукта */}
        {data?.funnel && data.funnel.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Воронка продукта</h2>
            <div className="space-y-4">
              {data.funnel.map((step: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{step.step}</span>
                    <span className="text-gray-500">
                      {step.count} ({step.conversion}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${(step.count / maxFunnelCount) * 100}%`,
                        backgroundColor: step.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
