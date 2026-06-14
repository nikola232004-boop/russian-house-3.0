'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceInput from '@/components/chat/VoiceInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Здравствуйте! Я ИИ-юрист программы правовой поддержки ВШЭ.\n\nЗадайте любой вопрос о ВНЖ, гражданстве РФ или миграционном учёте. Вы можете задать вопрос голосом, нажав на кнопку микрофона! 🎤',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    setTimeout(() => handleSendMessage(text), 100);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Извините, не удалось получить ответ.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Ошибка подключения. Пожалуйста, попробуйте позже.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { emoji: "📋", text: "Какие документы нужны для ВНЖ?" },
    { emoji: "💰", text: "Сколько стоит гражданство?" },
    { emoji: "⏰", text: "Сроки получения ВНЖ" },
    { emoji: "💼", text: "Можно ли работать с ВНЖ?" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <span className="text-3xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  ИИ-Юрист ВШЭ
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  Поддержка 24/7 • Голосовой ввод
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white ml-2' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white mr-2'
                    }`}>
                      {message.role === 'user' ? '👤' : '⚖️'}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      <span className={`text-xs text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-sm text-gray-500">Юрист печатает...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {messages.length < 3 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 mb-3 flex items-center">
                <span className="mr-2">⚡</span>
                Быстрые вопросы:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleSendMessage(q.text)}
                    className="group px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm"
                  >
                    <span className="mr-1">{q.emoji}</span>
                    {q.text}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                🎤 Или задайте вопрос голосом — нажмите на микрофон
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-end space-x-3">
              <VoiceInput onResult={handleVoiceResult} />
              
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите или скажите вопрос..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                Отправить
              </motion.button>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-400">
                🤖 ИИ-юрист консультирует на основе законодательства РФ
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>🎤</span>
                <span>Голосовой ввод работает</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
