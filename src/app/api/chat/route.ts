import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateSimpleEmbedding, cosineSimilarity } from '@/lib/rag/embeddings';

const prisma = new PrismaClient();

// Простой ответ на основе ключевых слов (fallback, если нет документов)
function getLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('документ') || lowerMessage.includes('справк') || lowerMessage.includes('бумаг')) {
    return '📋 **Документы для ВНЖ:**\n\n1. Заявление (2 экз.)\n2. Паспорт + нотариально заверенный перевод\n3. Миграционная карта\n4. Документ, подтверждающий основание\n5. Медицинская справка\n6. Справка об отсутствии судимости\n7. Сертификат о знании русского языка\n8. Фото 3x4 (4 шт.)\n9. Госпошлина 5000 ₽\n\n**Срок рассмотрения:** 2-6 месяцев.';
  }
  
  if (lowerMessage.includes('гражданств') || lowerMessage.includes('паспорт рф')) {
    return '🇷🇺 **Гражданство РФ:**\n\n**Условия:**\n• Проживание по ВНЖ не менее 5 лет\n• Законный источник дохода\n• Владение русским языком\n• Отказ от предыдущего гражданства\n\n**Срок рассмотрения:** 3-12 месяцев\n\n**Документы:** Заявление, ВНЖ, справка о доходах, сертификат о языке.';
  }
  
  if (lowerMessage.includes('срок') || lowerMessage.includes('сколько времени') || lowerMessage.includes('долго')) {
    return '⏰ **Стандартные сроки:**\n\n• Рассмотрение РВП: 2-4 месяца\n• Рассмотрение ВНЖ: 2-6 месяцев\n• Действие ВНЖ: 5 лет\n• Подача на гражданство: после 5 лет по ВНЖ\n• Рассмотрение гражданства: 3-12 месяцев\n\nСроки могут меняться в зависимости от загруженности МВД.';
  }
  
  if (lowerMessage.includes('стоимость') || lowerMessage.includes('цена') || lowerMessage.includes('госпошлин')) {
    return '💰 **Государственные пошлины (2024):**\n\n• Разрешение на временное проживание (РВП): 1600 ₽\n• Вид на жительство (ВНЖ): 5000 ₽\n• Гражданство РФ: 3500 ₽\n• Медицинская справка: 3000-5000 ₽\n• Нотариальный перевод: 1000-2000 ₽/страница\n\n**Юридическое сопровождение:** от 30 000 ₽ (по договорённости).';
  }
  
  if (lowerMessage.includes('работа') || lowerMessage.includes('трудоустройство')) {
    return '💼 **Работа с ВНЖ:**\n\nС видом на жительство вы можете:\n• Свободно работать по всей России\n• Открывать ИП и ООО\n• Получать пенсию и социальные выплаты\n\n**Важно:** Ежегодно нужно уведомлять МВД о подтверждении проживания (до 30 апреля).';
  }

  return '🤵 **Консультация эксперта ВШЭ**\n\nБлагодарим за обращение в программу правовой поддержки!\n\n**Чтобы получить точный ответ, уточните вопрос.** Например:\n\n• "Какие документы нужны для ВНЖ?"\n• "Как получить гражданство РФ?"\n• "Какие сроки получения ВНЖ?"\n• "Можно ли работать с ВНЖ?"\n• "Сколько стоит оформление?"\n\n📞 **Или запишитесь на консультацию:** +7 (495) 123-45-67';
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Пустое сообщение' }, { status: 400 });
    }

    console.log('📨 Вопрос пользователя:', message);

    // 1. Поиск в загруженных документах (RAG)
    let context = '';
    let sources: string[] = [];

    try {
      const documents = await prisma.document.findMany();

      if (documents.length > 0) {
        const queryEmbedding = generateSimpleEmbedding(message);

        const results = documents.map(doc => {
          const docEmbedding = JSON.parse(doc.embedding || '[]');
          const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
          return { doc, similarity };
        });

        results.sort((a, b) => b.similarity - a.similarity);
        const topResults = results.slice(0, 2);

        for (const result of topResults) {
          if (result.similarity > 0.3) {
            context += result.doc.content.substring(0, 1500) + '\n\n';
            sources.push(result.doc.filename);
          }
        }
      }
    } catch (dbError) {
      console.error('Ошибка поиска в БД:', dbError);
      // Продолжаем без RAG
    }

    // 2. Генерация ответа
    let response = '';

    if (context && sources.length > 0) {
      response = `📚 **Ответ на основе документов:**\n\n`;
      response += `На основе анализа документов "${sources.join(', ')}":\n\n`;
      response += context.substring(0, 1000);
      response += `\n\n📞 **Для уточнения деталей запишитесь на консультацию:** +7 (495) 123-45-67`;
    } else {
      response = getLocalResponse(message);
    }

    // 3. Сохраняем чат в БД, если есть userId
    if (userId) {
      try {
        await prisma.chat.create({
          data: {
            userId,
            message,
            response,
            role: 'user',
          }
        });

        await prisma.analyticsEvent.create({
          data: {
            userId,
            eventType: 'START_CHAT',
            metadata: JSON.stringify({ question: message.substring(0, 100) })
          }
        });
      } catch (dbError) {
        console.error('Ошибка сохранения чата:', dbError);
      }
    }

    return NextResponse.json({ response, sources });

  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json({ response: getLocalResponse('default') }, { status: 200 });
  }
}
