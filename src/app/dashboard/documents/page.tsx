'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  status: string;
  comment: string | null;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      loadDocuments(userData);
    }
  }, [router]);

  const loadDocuments = async (userData: any) => {
    try {
      const response = await fetch('/api/user/documents', {
        headers: { 'x-user-id': userData.id }
      });
      const data = await response.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('document') as File;

    if (!file) {
      setMessage({ type: 'error', text: 'Выберите файл' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;
    const userData = JSON.parse(storedUser);

    setIsUploading(true);
    setMessage(null);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('userId', userData.id);

    try {
      const response = await fetch('/api/user/documents', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Документ успешно загружен!' });
        loadDocuments(userData);
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: 'error', text: data.error || '❌ Ошибка загрузки' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: '❌ Ошибка соединения с сервером' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) return;
      const userData = JSON.parse(storedUser);

      const response = await fetch(`/api/user/documents/download?id=${doc.id}`, {
        headers: { 'x-user-id': userData.id }
      });

      if (response.ok) {
        // Создаём blob и скачиваем
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setMessage({ type: 'success', text: '✅ Скачивание началось!' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '❌ Ошибка скачивания' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: '❌ Ошибка скачивания' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот документ?')) return;

    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) return;
    const userData = JSON.parse(storedUser);

    try {
      const response = await fetch(`/api/user/documents?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userData.id }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Документ удалён' });
        loadDocuments(userData);
      } else {
        setMessage({ type: 'error', text: '❌ Ошибка удаления' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Ошибка соединения' });
    }
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center gap-1">
            ← Назад в личный кабинет
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl text-white">📄</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Мои документы</h1>
              <p className="text-gray-500">Загружайте и скачивайте документы</p>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-3 rounded-xl text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Форма загрузки */}
          <form onSubmit={handleFileUpload} className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📤 Загрузить новый документ</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите файл (PDF, JPEG, PNG, макс. 10MB)
                </label>
                <input
                  type="file"
                  name="document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isUploading ? 'Загрузка...' : 'Загрузить'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Загрузите: паспорт, миграционную карту, документы об образовании, медицинские справки
            </p>
          </form>

          {/* Список документов */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Мои документы</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-400">Загрузка...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <span className="text-5xl block mb-3">📭</span>
                <p className="text-gray-500">У вас пока нет загруженных документов</p>
                <p className="text-sm text-gray-400 mt-1">Загрузите документы выше</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">
                          {doc.fileType.includes('pdf') ? '📕' : '🖼️'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{doc.originalName}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <p className="text-xs text-gray-400">
                            {formatFileSize(doc.fileSize)} • {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                          </p>
                          {getStatusBadge(doc.status)}
                        </div>
                        {doc.comment && (
                          <p className="text-xs text-gray-500 mt-2 italic">💬 Комментарий юриста: {doc.comment}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                        title="Скачать"
                      >
                        ⬇️
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Информация */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              💡 <strong>Как это работает:</strong> Ваши документы будут проверены юристом. 
              После проверки статус документа изменится на "Одобрен" или "Отклонён".
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
