#!/bin/bash

echo "🚀 Запуск Русского Дома..."

# Проверяем наличие базы данных
if [ ! -f "prisma/dev.db" ]; then
  echo "📦 База данных не найдена. Создаём..."
  npx prisma generate
  npx prisma db push
  echo "✅ База данных создана"
else
  echo "✅ База данных найдена"
fi

# Запускаем Prisma Studio в фоне (опционально)
# npx prisma studio &

# Запускаем Next.js
echo "🌐 Запуск веб-сервера..."
npm run dev
