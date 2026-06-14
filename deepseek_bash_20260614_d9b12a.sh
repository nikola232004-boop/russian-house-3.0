mkdir -p src/app/api/auth/login
cat > src/app/api/auth/login/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Вход:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    // Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 400 });
    }

    // Проверяем пароль
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 400 });
    }

    console.log('✅ Вход выполнен:', user.id);

    // Сохраняем событие входа
    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        eventType: 'LOGIN',
        metadata: JSON.stringify({ timestamp: new Date().toISOString() })
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
EOF