import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало заполнения базы данных...');
  
  // Хэшируем пароли
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  
  // 1. Создаём пользователей
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Администратор',
      phone: '+79991234567',
      role: 'ADMIN',
    }
  });
  console.log('✅ Создан администратор:', admin.email);
  
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Тестовый Пользователь',
      phone: '+79991234568',
      role: 'USER',
    }
  });
  console.log('✅ Создан пользователь:', user.email);
  
  // 2. Создаём события (для статистики)
  const eventTypes = ['PAGE_VIEW', 'START_CHAT', 'REGISTRATION', 'CONSULTATION_REQUEST'];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.analyticsEvent.create({
      data: {
        userId: i % 2 === 0 ? admin.id : user.id,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        metadata: JSON.stringify({ timestamp: date.toISOString(), randomId: i }),
        createdAt: date,
      }
    });
  }
  console.log('✅ Создано 30 событий');
  
  // 3. Создаём чаты
  const questions = [
    'Какие документы нужны для ВНЖ?',
    'Сколько стоит гражданство?',
    'Как получить РВП?',
    'Какие сроки рассмотрения?',
    'Можно ли работать с ВНЖ?'
  ];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.chat.create({
      data: {
        userId: user.id,
        message: questions[Math.floor(Math.random() * questions.length)],
        response: 'Это тестовый ответ на вопрос',
        role: 'user',
        createdAt: date,
      }
    });
  }
  console.log('✅ Создано 20 чатов');
  
  // 4. Создаём документы
  await prisma.clientDocument.create({
    data: {
      userId: user.id,
      filename: 'passport.pdf',
      originalName: 'Паспорт.pdf',
      fileType: 'application/pdf',
      fileSize: 102400,
      fileUrl: '/uploads/test/passport.pdf',
      status: 'approved',
    }
  });
  
  await prisma.clientDocument.create({
    data: {
      userId: admin.id,
      filename: 'contract.pdf',
      originalName: 'Договор.pdf',
      fileType: 'application/pdf',
      fileSize: 204800,
      fileUrl: '/uploads/test/contract.pdf',
      status: 'pending',
    }
  });
  console.log('✅ Создано 2 документа');
  
  console.log('\n🎉 База данных успешно заполнена!');
  console.log('\n📝 Данные для входа:');
  console.log('   👑 Админ: admin@example.com / admin123');
  console.log('   👤 Пользователь: user@example.com / user123');
}

main()
  .catch(e => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
