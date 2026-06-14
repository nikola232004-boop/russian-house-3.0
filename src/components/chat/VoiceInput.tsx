'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onResult: (text: string) => void;
  isListening?: boolean;
}

export default function VoiceInput({ onResult, isListening: externalListening }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);
  const [interimText, setInterimText] = useState('');
  const [volume, setVolume] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'ru-RU';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setInterimText('');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setVolume(0);
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setInterimText(interimTranscript);
        
        if (finalTranscript) {
          onResult(finalTranscript);
          recognitionInstance.stop();
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onResult]);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Ошибка запуска:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <button disabled className="p-3 bg-gray-100 rounded-full cursor-not-allowed opacity-50">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 -z-10"
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isListening ? stopListening : startListening}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
        }`}
        title={isListening ? 'Остановить запись' : 'Голосовой ввод'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </motion.button>

      {isListening && interimText && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-900 rounded-xl px-4 py-2 whitespace-nowrap">
          <span className="text-white text-sm">{interimText}</span>
        </div>
      )}
    </div>
  );
}
