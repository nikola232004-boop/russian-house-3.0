import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  createdAt: Date;
}

// Регистрация пользователя
export async function registerUserDB(name: string, email: string, password: string, phone?: string) {
  try {
    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || '',
        role: 'USER',
      }
    });

    // Сохраняем событие регистрации
    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        eventType: 'REGISTRATION',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Ошибка регистрации' };
  }
}

// Вход пользователя
export async function loginUserDB(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'Неверный пароль' };
    }

    // Сохраняем событие входа
    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        eventType: 'LOGIN',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Ошибка входа' };
  }
}

// Сохранение чата
export async function saveChat(userId: string, message: string, response: string, context?: string) {
  try {
    // Сохраняем сообщение пользователя
    await prisma.chat.create({
      data: {
        userId,
        message,
        response,
        role: 'user',
        context: context || '',
      }
    });

    // Сохраняем ответ ассистента
    await prisma.chat.create({
      data: {
        userId,
        message: response,
        response: '',
        role: 'assistant',
      }
    });

    // Сохраняем событие чата
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'START_CHAT',
        metadata: JSON.stringify({ question: message.substring(0, 100) })
      }
    });
  } catch (error) {
    console.error('Save chat error:', error);
  }
}

// Получение статистики для дашборда
export async function getStats(userId?: string) {
  try {
    const where = userId ? { userId } : {};
    
    const [totalChats, totalEvents, recentChats] = await Promise.all([
      prisma.chat.count({ where: { ...where, role: 'user' } }),
      prisma.analyticsEvent.count({ where }),
      prisma.chat.findMany({
        where: { ...where, role: 'user' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } }
      })
    ]);

    return { totalChats, totalEvents, recentChats };
  } catch (error) {
    console.error('Get stats error:', error);
    return { totalChats: 0, totalEvents: 0, recentChats: [] };
  }
}

// Получение воронки продукта
export async function getFunnelData() {
  try {
    const [pageViews, registrations, chats, consultations] = await Promise.all([
      prisma.analyticsEvent.count({ where: { eventType: 'PAGE_VIEW' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'REGISTRATION' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'START_CHAT' } }),
      prisma.analyticsEvent.count({ where: { eventType: 'CONSULTATION_REQUEST' } }),
    ]);

    const total = pageViews || 1;
    return [
      { step: 'Посетили сайт', count: pageViews, conversion: 100 },
      { step: 'Зарегистрировались', count: registrations, conversion: Math.round((registrations / total) * 100) },
      { step: 'Начали чат с ИИ', count: chats, conversion: Math.round((chats / total) * 100) },
      { step: 'Оставили заявку', count: consultations, conversion: Math.round((consultations / total) * 100) },
    ];
  } catch (error) {
    console.error('Get funnel error:', error);
    return [];
  }
}

// Сохранение голосового ввода
export async function saveVoiceInput(userId: string, text: string) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'VOICE_INPUT',
        metadata: JSON.stringify({ text: text.substring(0, 100), timestamp: new Date().toISOString() })
      }
    });
  } catch (error) {
    console.error('Save voice input error:', error);
  }
}

// Получение всех пользователей (для админа)
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: { chats: true, events: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}
