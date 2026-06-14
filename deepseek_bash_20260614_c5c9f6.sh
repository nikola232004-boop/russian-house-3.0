mkdir -p src/app/api/rag/upload
cat > src/app/api/rag/upload/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateSimpleEmbedding, chunkText } from '@/lib/rag/embeddings';

const prisma = new PrismaClient();

// Простой парсер текста (для PDF нужно будет добавить pdf-parse)
async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Для TXT файлов
  if (file.name.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }
  
  // Для PDF файлов (заглушка, требует установки pdf-parse)
  if (file.name.endsWith('.pdf')) {
    // TODO: Добавить реальный парсинг PDF
    // const pdf = await pdfParse(buffer);
    // return pdf.text;
    return `Содержимое PDF файла: ${file.name}\n\nЭто демонстрационный текст. Для полноценной работы с PDF установите библиотеку pdf-parse.\n\nПример содержимого:\n- Документы для ВНЖ\n- Требования к заявителям\n- Сроки рассмотрения\n- Госпошлины и сборы`;
  }
  
  throw new Error('Неподдерживаемый формат файла');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не загружен' }, { status: 400 });
    }
    
    console.log('📄 Загрузка файла:', file.name);
    
    // Проверяем тип файла
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      return NextResponse.json({ 
        error: 'Поддерживаются только PDF и TXT файлы' 
      }, { status: 400 });
    }
    
    // Проверяем размер (максимум 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 10MB)' }, { status: 400 });
    }
    
    // Извлекаем текст
    let content = await extractTextFromFile(file);
    
    // Ограничиваем длину текста
    if (content.length > 50000) {
      content = content.substring(0, 50000);
      content += '\n\n[Текст обрезан из-за большого размера]';
    }
    
    // Разбиваем на чанки для лучшего поиска
    const chunks = chunkText(content, 1500);
    console.log(`📦 Текст разбит на ${chunks.length} чанков`);
    
    // Генерируем эмбеддинг для всего документа
    const embedding = generateSimpleEmbedding(content);
    
    // Сохраняем документ в базу
    const document = await prisma.document.create({
      data: {
        filename: file.name,
        content: content,
        embedding: JSON.stringify(embedding),
      }
    });
    
    console.log('✅ Документ сохранён:', document.id);
    
    return NextResponse.json({ 
      success: true, 
      document: { 
        id: document.id, 
        filename: document.filename,
        size: content.length,
        chunks: chunks.length
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка загрузки:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Ошибка загрузки файла' 
    }, { status: 500 });
  }
}
EOF