'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RAGAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/rag/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error(error);
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
        setMessage({ type: 'success', text: `✅ Документ "${file.name}" загружен в RAG!` });
        setFile(null);
        loadDocuments();
      } else {
        setMessage({ type: 'error', text: data.error || 'Ошибка загрузки' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка соединения' });
    } finally {
      setIsUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">🧠</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RAG Ассистент</h1>
              <p className="text-gray-500">Загружайте документы для обучения ИИ</p>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="rag-file"
            />
            <label
              htmlFor="rag-file"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              📄 Выбрать файл
            </label>
            {file && <p className="mt-3 text-sm text-gray-600">Выбран: {file.name}</p>}
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isUploading ? 'Загрузка...' : '🚀 Загрузить в RAG'}
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📚 Документы в RAG</h2>
            {documents.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Нет загруженных документов</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>📄 {doc.filename}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
