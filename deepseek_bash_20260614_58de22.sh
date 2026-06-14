# Создаём глобальные стили
mkdir -p src/app
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background: #f3f4f6;
}
EOF

# Создаём layout
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Русский Дом - Правовая поддержка ВШЭ',
  description: 'Помощь в получении ВНЖ и гражданства РФ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
EOF

# Создаём главную страницу
cat > src/app/page.tsx << 'EOF'
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          🏛️ Русский Дом
        </h1>
        <p className="text-gray-600 mb-4">
          Программа правовой поддержки ВШЭ
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Нажатий: {count}
        </button>
        <p className="text-sm text-gray-400 mt-4">
          Проект успешно запущен!
        </p>
      </div>
    </div>
  );
}
EOF