import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Пустое сообщение' }, { status: 400 });
    }
    
    console.log('📨 Вопрос:', message);
    
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL;
    const model = process.env.OPENAI_MODEL;
    
    let response = '';
    let usedGPT = false;
    
    // Пробуем использовать GPT
    if (apiKey) {
      try {
        console.log('🔄 Отправка запроса к OpenRouter...');
        
        const apiResponse = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { 
                role: 'system', 
                content: 'Ты — официальный ИИ-юрист программы правовой поддержки Высшей школы экономики (ВШЭ). Отвечай на русском языке, кратко, понятно и по делу. Специализируешься на вопросах ВНЖ, гражданства РФ и миграционного учёта. Будь вежливым и профессиональным.' 
              },
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          response = data.choices[0]?.message?.content;
          usedGPT = true;
          console.log('✅ GPT ответ получен');
        } else {
          const errorText = await apiResponse.text();
          console.log('❌ Ошибка API:', apiResponse.status, errorText);
        }
      } catch (gptError) {
        console.error('❌ GPT ошибка:', gptError);
      }
    }
    
    // Если GPT не ответил, используем локальный ответ
    if (!usedGPT || !response) {
      console.log('📚 Используем локальный ответ');
      response = getLocalResponse(message);
    }
    
    return NextResponse.json({ response, usedGPT });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json({ response: getLocalResponse('default') });
  }
}

function getLocalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('внж') || (lowerMessage.includes('получ') && lowerMessage.includes('внж'))) {
    return '📋 **ВНЖ (Вид на жительство):**\n\n' +
      '**Что нужно для получения ВНЖ:**\n\n' +
      '1. Заявление (2 экз.)\n' +
      '2. Паспорт + нотариальный перевод\n' +
      '3. Миграционная карта\n' +
      '4. Документ-основание\n' +
      '5. Медицинская справка\n' +
      '6. Справка о несудимости\n' +
      '7. Сертификат о русском языке\n' +
      '8. Фото 3x4 (4 шт.)\n' +
      '9. Госпошлина 5000 ₽\n\n' +
      '**Срок:** 2-6 месяцев\n' +
      '**Действие:** 5 лет';
  }
  
  if (lowerMessage.includes('документ')) {
    return '📋 **Документы для ВНЖ:**\n\n1. Заявление (2 экз.)\n2. Паспорт + перевод\n3. Миграционная карта\n4. Документ-основание\n5. Медицинская справка\n6. Справка о несудимости\n7. Сертификат о русском языке\n8. Фото 3x4 (4 шт.)\n9. Госпошлина 5000 ₽';
  }
  
  if (lowerMessage.includes('гражданств')) {
    return '🇷🇺 **Гражданство РФ:**\n\n• 5 лет по ВНЖ\n• Законный доход\n• Русский язык\n\n**Срок:** 3-12 месяцев';
  }
  
  if (lowerMessage.includes('срок')) {
    return '⏰ **Сроки:**\n\n• ВНЖ: 2-6 месяцев\n• Гражданство: 3-12 месяцев';
  }

  return '🤵 **Консультация ВШЭ**\n\nЗадайте вопрос:\n• "Что нужно для получения ВНЖ?"\n• "Какие документы для ВНЖ?"\n• "Как получить гражданство?"\n\n📞 +7 (495) 123-45-67';
}
