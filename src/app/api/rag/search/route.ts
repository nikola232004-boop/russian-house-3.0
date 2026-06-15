import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateEmbedding, cosineSimilarity } from '@/lib/rag/embeddings';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 3 } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Запрос пуст' }, { status: 400 });
    }
    
    console.log('🔍 RAG поиск:', query);
    
    const queryEmbedding = generateEmbedding(query, 128);
    
    const chunks = await prisma.documentChunk.findMany({
      include: { document: true }
    });
    
    if (chunks.length === 0) {
      return NextResponse.json({ results: [], message: 'Нет загруженных документов' });
    }
    
    const results = chunks.map(chunk => {
      const chunkEmbedding = JSON.parse(chunk.embedding);
      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      return {
        id: chunk.id,
        content: chunk.content,
        filename: chunk.document.filename,
        similarity: Math.round(similarity * 100),
      };
    });
    
    results.sort((a, b) => b.similarity - a.similarity);
    const topResults = results.slice(0, topK);
    
    console.log(`✅ Найдено ${topResults.length} релевантных результатов`);
    
    return NextResponse.json({ results: topResults });
    
  } catch (error) {
    console.error('Ошибка поиска:', error);
    return NextResponse.json({ error: 'Ошибка поиска' }, { status: 500 });
  }
}
