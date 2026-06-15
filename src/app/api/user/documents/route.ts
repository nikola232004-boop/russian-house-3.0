import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Допустимые форматы: PDF, JPEG, PNG' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс 10MB)' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFilename);
    await writeFile(filePath, buffer);

    const document = await prisma.clientDocument.create({
      data: {
        userId,
        filename: safeFilename,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: `/uploads/${userId}/${safeFilename}`,
        status: 'pending',
      }
    });

    // Сохраняем событие загрузки документа
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'DOCUMENT_UPLOAD',
        metadata: JSON.stringify({ filename: file.name, size: file.size })
      }
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const documents = await prisma.clientDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
