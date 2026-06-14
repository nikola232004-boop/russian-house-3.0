// Простая эмуляция эмбеддингов (для демонстрации)
// В реальном проекте используйте OpenAI embeddings или transformers.js

/**
 * Генерирует простой вектор эмбеддинга на основе символов текста
 * @param text - входной текст
 * @returns массив чисел (вектор) размером 128
 */
export function generateSimpleEmbedding(text: string): number[] {
  const embedding: number[] = new Array(128).fill(0);
  const lowerText = text.toLowerCase();
  
  // Ключевые слова для улучшения поиска
  const keywords = {
    documents: ['документ', 'справка', 'бумага', 'пакет', 'собрать', 'нотариус', 'перевод'],
    vnh: ['внж', 'вид на жительство', 'разрешение', 'проживание', 'внж'],
    citizenship: ['гражданство', 'паспорт рф', 'российский паспорт', 'стать гражданином'],
    timing: ['срок', 'сколько', 'времени', 'долго', 'ждать', 'период', 'месяц'],
    cost: ['стоимость', 'цена', 'госпошлина', 'платить', 'оплата', 'руб'],
    work: ['работа', 'трудоустройство', 'работать', 'устроиться', 'должность']
  };
  
  // Для каждого символа добавляем вклад в эмбеддинг
  for (let i = 0; i < Math.min(lowerText.length, 1000); i++) {
    const code = lowerText.charCodeAt(i);
    embedding[i % 128] += code / 1000;
  }
  
  // Добавляем вес для ключевых слов
  for (const [category, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowerText.includes(word)) {
        const categoryHash = category.charCodeAt(0) % 128;
        embedding[categoryHash] += 0.5;
      }
    }
  }
  
  // Нормализуем вектор
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    return embedding.map(val => val / norm);
  }
  
  return embedding;
}

/**
 * Вычисляет косинусное сходство между двумя векторами
 * @param a - первый вектор
 * @param b - второй вектор
 * @returns значение сходства от 0 до 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.warn('Vectors have different lengths');
    return 0;
  }
  
  let dot = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Разбивает текст на чанки для лучшего поиска
 * @param text - входной текст
 * @param chunkSize - размер чанка в символах
 * @returns массив чанков
 */
export function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  
  return chunks;
}

/**
 * Находит наиболее релевантные чанки для запроса
 * @param query - поисковый запрос
 * @param chunks - массив чанков
 * @param topK - количество результатов
 * @returns массив индексов и оценок
 */
export function findRelevantChunks(
  query: string, 
  chunks: string[], 
  topK: number = 3
): Array<{ index: number; score: number; content: string }> {
  const queryEmbedding = generateSimpleEmbedding(query);
  
  const results = chunks.map((chunk, index) => {
    const chunkEmbedding = generateSimpleEmbedding(chunk);
    const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
    return { index, score, content: chunk };
  });
  
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, topK);
}
