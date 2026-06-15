import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('📊 Получение статистики из БД...');
    
    // Получаем реальные данные из БД
    const totalUsers = await prisma.user.count();
    const totalChats = await prisma.chat.count({
      where: { role: 'user' }
    });
    const totalDocuments = await prisma.clientDocument.count();
    const totalEvents = await prisma.analyticsEvent.count();
    
    // Воронка продукта (без чатов)
    const pageViews = await prisma.analyticsEvent.count({
      where: { eventType: 'PAGE_VIEW' }
    });
    
    const registrations = await prisma.analyticsEvent.count({
      where: { eventType: 'REGISTRATION' }
    });
    
    const consultations = await prisma.analyticsEvent.count({
      where: { eventType: 'CONSULTATION_REQUEST' }
    });
    
    const total = pageViews || 1;
    const funnel = [
      { step: '👀 Посетили сайт', count: pageViews, conversion: 100, color: '#3B82F6' },
      { step: '📝 Зарегистрировались', count: registrations, conversion: Math.round((registrations / total) * 100), color: '#10B981' },
      { step: '📄 Загрузили документы', count: totalDocuments, conversion: Math.round((totalDocuments / total) * 100), color: '#8B5CF6' },
      { step: '📞 Оставили заявку', count: consultations, conversion: Math.round((consultations / total) * 100), color: '#EF4444' }
    ];
    
    return NextResponse.json({
      success: true,
      total: {
        users: totalUsers,
        chats: totalChats,
        documents: totalDocuments,
        events: totalEvents
      },
      funnel: funnel,
      message: 'Данные из реальной БД'
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Ошибка подключения к БД'
    }, { status: 500 });
  }
}
