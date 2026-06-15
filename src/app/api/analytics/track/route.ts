import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, eventType, metadata } = await request.json();
    
    if (!userId || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Ищем пользователя в БД
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Если пользователь не найден и userId не 'anonymous', пробуем найти по email
    if (!user && userId !== 'anonymous') {
      user = await prisma.user.findFirst({
        where: { email: userId }
      });
    }
    
    const finalUserId = user?.id || 'anonymous';
    
    // Сохраняем событие
    await prisma.analyticsEvent.create({
      data: {
        userId: finalUserId,
        eventType,
        metadata: JSON.stringify(metadata || {}),
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
