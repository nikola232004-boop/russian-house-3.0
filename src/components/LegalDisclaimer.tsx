'use client';

interface LegalDisclaimerProps {
  variant?: 'footer' | 'sidebar' | 'inline';
  showDate?: boolean;
}

export default function LegalDisclaimer({ variant = 'footer', showDate = true }: LegalDisclaimerProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`${variant === 'footer' ? 'border-t border-gray-200 pt-6 mt-8' : 'bg-gray-50 p-4 border-l-4 border-gray-300'}`}>
      <div className="text-center">
        <p className="text-gray-500 text-xs leading-relaxed">
          © {currentYear} Высшая школа экономики — Программа правовой поддержки мигрантов
        </p>
        <p className="text-gray-400 text-[11px] mt-2 leading-relaxed max-w-2xl mx-auto">
          Информация на сайте носит ознакомительный характер и не является официальной юридической консультацией. 
          Для получения точной информации обратитесь к сотрудникам программы. 
          ВШЭ не несёт ответственности за возможные последствия использования материалов сайта без консультации со специалистом.
        </p>
        {showDate && (
          <p className="text-gray-400 text-[10px] mt-3">
            Актуально на {new Date().toLocaleDateString('ru-RU')}
          </p>
        )}
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="text-gray-400 text-[11px] hover:text-gray-600 transition-colors">
            Политика конфиденциальности
          </a>
          <a href="#" className="text-gray-400 text-[11px] hover:text-gray-600 transition-colors">
            Пользовательское соглашение
          </a>
          <a href="#" className="text-gray-400 text-[11px] hover:text-gray-600 transition-colors">
            Сведения об организации
          </a>
        </div>
      </div>
    </div>
  );
}
