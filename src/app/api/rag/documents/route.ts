import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}
