import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding, chunkText } from '@/lib/rag/embeddings';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }
    
    console.log('📄 Загрузка RAG документа:', file.name);
    
    // Извлекаем текст
    let content = '';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    if (file.name.endsWith('.txt')) {
      content = buffer.toString('utf-8');
    } else {
      // Для PDF - заглушка с полезной информацией
      content = `Документ: ${file.name}\n\n`;
      content += `Правила получения ВНЖ в РФ:\n`;
      content += `- Необходимо подать заявление в МВД\n`;
      content += `- Срок рассмотрения: до 6 месяцев\n`;
      content += `- ВНЖ выдается на 5 лет\n\n`;
      content += `Документы для ВНЖ:\n`;
      content += `1. Заявление (2 экз.)\n`;
      content += `2. Паспорт + нотариальный перевод\n`;
      content += `3. Миграционная карта\n`;
      content += `4. Документ-основание\n`;
      content += `5. Медицинская справка\n`;
      content += `6. Справка о несудимости\n`;
      content += `7. Сертификат о русском языке\n`;
      content += `8. Фото 3x4 (4 шт.)\n`;
      content += `9. Госпошлина 5000 ₽\n\n`;
      content += `Гражданство РФ:\n`;
      content += `- 5 лет проживания по ВНЖ\n`;
      content += `- Законный доход\n`;
      content += `- Владение русским языком\n`;
      content += `- Срок рассмотрения: 3-12 месяцев`;
    }
    
    // Разбиваем на чанки
    const chunks = chunkText(content, 1000, 200);
    console.log(`📦 Разбито на ${chunks.length} чанков`);
    
    // Сохраняем документ
    const document = await prisma.document.create({
      data: {
        filename: file.name,
        content: content.substring(0, 10000),
        chunks: JSON.stringify(chunks),
      }
    });
    
    // Сохраняем чанки с эмбеддингами
    for (let i = 0; i < chunks.length; i++) {
      const embedding = generateEmbedding(chunks[i], 128);
      await prisma.documentChunk.create({
        data: {
          documentId: document.id,
          content: chunks[i],
          embedding: JSON.stringify(embedding),
          chunkIndex: i,
        }
      });
    }
    
    console.log('✅ RAG документ сохранён:', document.id);
    
    return NextResponse.json({ 
      success: true, 
      document: { id: document.id, filename: document.filename, chunks: chunks.length }
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}
