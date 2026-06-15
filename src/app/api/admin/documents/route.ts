import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию (можно добавить проверку на роль ADMIN)
    const documents = await prisma.clientDocument.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, comment } = await request.json();

    const document = await prisma.clientDocument.update({
      where: { id },
      data: {
        status,
        comment: comment || null,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
  }
}
