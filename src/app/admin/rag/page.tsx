'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: string;
  filename: string;
  createdAt: string;
}

export default function RAGAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем список документов
  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/rag/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: `✅ Документ "${file.name}" успешно загружен!` });
        setFile(null);
        loadDocuments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка загрузки' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка соединения с сервером' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Удалить документ "${filename}"?`)) return;

    try {
      const response = await fetch(`/api/rag/documents?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `✅ Документ "${filename}" удалён` });
        loadDocuments();
      } else {
        setMessage({ type: 'error', text: 'Ошибка удаления' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка соединения' });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📚</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">База знаний RAG</h1>
              <p className="text-gray-500">Загружайте документы для обучения ИИ-юриста</p>
            </div>
          </div>
          <div className="w-16 h-1 bg-purple-500 rounded-full mt-2" />
        </motion.div>

        {/* Форма загрузки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📤 Загрузить новый документ</h2>
          
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 p-3 rounded-xl ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
            >
              <span className="text-xl">📄</span>
              Выбрать файл
            </label>
            
            {file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Выбран:</span> {file.name}
                  <span className="text-gray-400 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                </p>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isUploading ? 'Загрузка...' : 'Загрузить документ'}
            </button>
            
            <p className="text-xs text-gray-400 mt-4">
              Поддерживаются форматы: PDF, TXT (макс. 10MB)
            </p>
          </div>
        </motion.div>

        {/* Список документов */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">📋 Загруженные документы</h2>
            <span className="text-sm text-gray-400">{documents.length} файлов</span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Загрузка...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <span className="text-4xl block mb-2">📭</span>
              <p>Нет загруженных документов</p>
              <p className="text-sm mt-1">Загрузите первый документ выше</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{doc.filename}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id, doc.filename)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Инструкция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mt-6 border border-purple-100"
        >
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>💡</span> Как это работает
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
            <li>Загрузите документы с законодательством РФ, инструкциями или типовыми ответами</li>
            <li>ИИ-юрист автоматически проанализирует содержимое</li>
            <li>При ответе на вопросы бот будет искать информацию в загруженных документах</li>
            <li>Поддерживаются форматы: <strong>TXT</strong> (простой текст) и <strong>PDF</strong></li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
