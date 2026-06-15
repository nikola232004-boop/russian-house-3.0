import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
        metadata: JSON.stringify({ email, timestamp: new Date().toISOString() })
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
