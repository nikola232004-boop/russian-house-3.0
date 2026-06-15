'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  status: string;
  comment: string;
  uploadedAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Проверяем, что пользователь админ
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
    
    loadDocuments();
  }, [router]);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/admin/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(`/api/user/documents/download?id=${doc.id}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Ошибка скачивания');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Ошибка скачивания');
    }
  };

  const handleUpdateStatus = async (id: string, status: string, comment?: string) => {
    try {
      const response = await fetch(`/api/admin/documents`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, comment })
      });
      
      if (response.ok) {
        loadDocuments();
        alert('Статус обновлён');
      } else {
        alert('Ошибка обновления');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Ошибка обновления');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.originalName.toLowerCase().includes(search.toLowerCase()) ||
    doc.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    doc.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">⏳ На проверке</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">✅ Одобрен</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">❌ Отклонён</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl text-white">📋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Документы клиентов</h1>
              <p className="text-gray-500">Просмотр, скачивание и проверка документов</p>
            </div>
          </div>

          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск по имени файла, клиенту или email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400">Загрузка документов...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-5xl block mb-3">📭</span>
              <p className="text-gray-500">Нет загруженных документов</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-500 font-medium">Клиент</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Документ</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Размер</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Дата</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Статус</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-800">{doc.user?.name || 'Неизвестно'}</p>
                          <p className="text-xs text-gray-400">{doc.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="text-gray-800">{doc.originalName}</p>
                          <p className="text-xs text-gray-400">{doc.fileType}</p>
                        </div>
                      </td>
                      <td className="py-3 text-gray-500 text-sm">{formatFileSize(doc.fileSize)}</td>
                      <td className="py-3 text-gray-500 text-sm">
                        {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="py-3">{getStatusBadge(doc.status)}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                          >
                            ⬇️ Скачать
                          </button>
                          <select
                            onChange={(e) => handleUpdateStatus(doc.id, e.target.value)}
                            defaultValue={doc.status}
                            className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="pending">⏳ На проверке</option>
                            <option value="approved">✅ Одобрен</option>
                            <option value="rejected">❌ Отклонён</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
