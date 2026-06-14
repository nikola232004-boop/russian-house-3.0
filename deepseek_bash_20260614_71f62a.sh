mkdir -p src/app/api/auth/register
cat > src/app/api/auth/register/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    console.log('📝 Регистрация:', { name, email, phone });

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен быть минимум 6 символов' }, { status: 400 });
    }

    // Проверяем существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || '',
        role: 'USER',
      }
    });

    console.log('✅ Пользователь создан:', user.id);

    // Сохраняем событие регистрации
    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        eventType: 'REGISTRATION',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
EOF