import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID документа не указан' }, { status: 400 });
    }

    // Находим документ в БД
    const document = await prisma.clientDocument.findFirst({
      where: { id, userId }
    });

    if (!document) {
      return NextResponse.json({ error: 'Документ не найден' }, { status: 404 });
    }

    // Полный путь к файлу
    const filePath = path.join(process.cwd(), 'public', document.fileUrl);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Файл не найден на сервере' }, { status: 404 });
    }

    // Читаем файл
    const fileBuffer = await readFile(filePath);

    // Определяем MIME тип
    const mimeType = document.fileType || 'application/octet-stream';

    // Отправляем файл для скачивания
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(document.originalName)}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Ошибка скачивания' }, { status: 500 });
  }
}
