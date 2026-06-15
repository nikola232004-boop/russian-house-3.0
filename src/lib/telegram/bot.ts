import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Токен бота (получите у @BotFather)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

// Создаём бота
let bot: TelegramBot | null = null;

export function initTelegramBot() {
  if (!TOKEN) {
    console.log('⚠️ TELEGRAM_BOT_TOKEN не настроен');
    return null;
  }

  if (bot) return bot;

  bot = new TelegramBot(TOKEN, { polling: true });
  
  // Обработка команды /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from?.first_name || 'Гость';
    
    await bot?.sendMessage(chatId, 
      `🤵 **Добро пожаловать в Русский Дом - ВШЭ!**\n\n` +
      `Здравствуйте, ${userName}! Я юридический помощник программы правовой поддержки Высшей школы экономики.\n\n` +
      `**Что я умею:**\n` +
      `• Консультировать по вопросам ВНЖ и гражданства РФ\n` +
      `• Помогать со сбором документов\n` +
      `• Отвечать на вопросы о миграционном учёте\n\n` +
      `**Команды:**\n` +
      `/help - помощь\n` +
      `/vnh - информация о ВНЖ\n` +
      `/citizenship - информация о гражданстве\n` +
      `/docs - список документов\n` +
      `/contacts - контакты юриста\n\n` +
      `Просто напишите ваш вопрос!`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка команды /help
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot?.sendMessage(chatId,
      `📚 **Помощь и команды:**\n\n` +
      `• /start - начать диалог\n` +
      `• /vnh - информация о ВНЖ\n` +
      `• /citizenship - информация о гражданстве\n` +
      `• /docs - список документов\n` +
      `• /contacts - контакты юриста\n\n` +
      `💡 **Или просто задайте вопрос!**\n` +
      `Например: "Какие документы нужны для ВНЖ?"`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка команды /vnh
  bot.onText(/\/vnh/, async (msg) => {
    const chatId = msg.chat.id;
    await bot?.sendMessage(chatId,
      `🏛️ **Вид на жительство (ВНЖ):**\n\n` +
      `**Что даёт:**\n` +
      `• Право постоянно проживать в РФ\n` +
      `• Свободно работать без патента\n` +
      `• Свободно въезжать/выезжать\n` +
      `• Получать пенсию и соцвыплаты\n\n` +
      `**Срок действия:** 5 лет\n` +
      `**Рассмотрение:** 2-6 месяцев\n\n` +
      `📞 Для записи на консультацию: +7 (495) 123-45-67`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка команды /citizenship
  bot.onText(/\/citizenship/, async (msg) => {
    const chatId = msg.chat.id;
    await bot?.sendMessage(chatId,
      `🇷🇺 **Гражданство РФ:**\n\n` +
      `**Условия:**\n` +
      `• Проживание по ВНЖ 5+ лет\n` +
      `• Законный источник дохода\n` +
      `• Владение русским языком\n\n` +
      `**Срок рассмотрения:** 3-12 месяцев\n\n` +
      `📞 Консультация: +7 (495) 123-45-67`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка команды /docs
  bot.onText(/\/docs/, async (msg) => {
    const chatId = msg.chat.id;
    await bot?.sendMessage(chatId,
      `📋 **Документы для ВНЖ:**\n\n` +
      `1. Заявление (2 экз.)\n` +
      `2. Паспорт + нотариальный перевод\n` +
      `3. Миграционная карта\n` +
      `4. Документ-основание\n` +
      `5. Медицинская справка\n` +
      `6. Справка о несудимости\n` +
      `7. Сертификат о русском языке\n` +
      `8. Фото 3x4 (4 шт.)\n` +
      `9. Госпошлина 5000 ₽\n\n` +
      `⏰ Срок: 2-6 месяцев`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка команды /contacts
  bot.onText(/\/contacts/, async (msg) => {
    const chatId = msg.chat.id;
    await bot?.sendMessage(chatId,
      `📞 **Контакты программы ВШЭ:**\n\n` +
      `**Телефон:** +7 (495) 123-45-67\n` +
      `**Email:** support@hse-legal.ru\n` +
      `**Адрес:** г. Москва, Покровский бульвар, 11\n\n` +
      `**Режим работы:**\n` +
      `• Пн-Пт: 9:00 – 20:00\n` +
      `• Сб: 10:00 – 16:00\n\n` +
      `💬 **Или напишите нам в чат!**`,
      { parse_mode: 'Markdown' }
    );
  });

  // Обработка текстовых сообщений (ИИ ответы)
  bot.onText(/(.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match?.[1] || '';
    
    // Игнорируем команды
    if (text.startsWith('/')) return;
    
    try {
      // Отправляем индикатор печати
      await bot?.sendChatAction(chatId, 'typing');
      
      // Получаем ответ от локального ИИ
      const response = getLocalResponse(text);
      
      // Отправляем ответ (с разбивкой на части если длинный)
      if (response.length > 4000) {
        const parts = response.match(/.{1,4000}/g) || [];
        for (const part of parts) {
          await bot?.sendMessage(chatId, part, { parse_mode: 'Markdown' });
        }
      } else {
        await bot?.sendMessage(chatId, response, { parse_mode: 'Markdown' });
      }
      
      // Сохраняем в аналитику
      try {
        await prisma.analyticsEvent.create({
          data: {
            userId: 'telegram_' + msg.from?.id,
            eventType: 'START_CHAT',
            metadata: JSON.stringify({ source: 'telegram', question: text.substring(0, 100) })
          }
        });
      } catch (dbError) {
        console.error('Save error:', dbError);
      }
      
    } catch (error) {
      console.error('Bot error:', error);
      await bot?.sendMessage(chatId, '❌ Извините, произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  console.log('✅ Telegram бот запущен!');
  return bot;
}

function getLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('документ')) {
    return '📋 **Документы для ВНЖ:**\n\n1. Заявление (2 экз.)\n2. Паспорт + нотариальный перевод\n3. Миграционная карта\n4. Документ-основание\n5. Медицинская справка\n6. Справка о несудимости\n7. Сертификат о русском языке\n8. Фото 3x4 (4 шт.)\n9. Госпошлина 5000 ₽\n\n**Срок рассмотрения:** 2-6 месяцев.';
  }
  
  if (lowerMessage.includes('гражданств')) {
    return '🇷🇺 **Гражданство РФ:**\n\n**Условия:**\n• 5 лет по ВНЖ\n• Законный доход\n• Русский язык\n\n**Срок:** 3-12 месяцев.';
  }
  
  if (lowerMessage.includes('срок')) {
    return '⏰ **Стандартные сроки:**\n\n• ВНЖ: 2-6 месяцев\n• Гражданство: 3-12 месяцев';
  }
  
  if (lowerMessage.includes('выезд') || lowerMessage.includes('выезжать')) {
    return '🛂 **Выезд с ВНЖ:**\n\n• Свободный выезд и въезд\n• Можно отсутствовать до 6 месяцев\n• За год можно отсутствовать не более 6 месяцев';
  }

  return '🤵 **Консультация эксперта ВШЭ**\n\nЗадайте вопрос:\n• "Какие документы для ВНЖ?"\n• "Как получить гражданство?"\n• "Сроки получения ВНЖ?"\n\n📞 +7 (495) 123-45-67';
}

// Отправка уведомления в Telegram
export async function sendTelegramNotification(chatId: string, message: string) {
  if (!bot) return;
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Send notification error:', error);
  }
}
