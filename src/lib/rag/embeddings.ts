// Простая эмуляция эмбеддингов для RAG
// В реальном проекте используйте OpenAI embeddings

export function generateEmbedding(text: string, dimension: number = 128): number[] {
  const embedding = new Array(dimension).fill(0);
  const lowerText = text.toLowerCase();
  
  // Ключевые слова для разных тем
  const topics = {
    documents: ['документ', 'справка', 'паспорт', 'заявление', 'фото', 'медсправка', 'несудимость'],
    vnh: ['внж', 'вид на жительство', 'разрешение', 'проживание'],
    citizenship: ['гражданство', 'паспорт рф', 'российский паспорт'],
    timing: ['срок', 'сколько', 'долго', 'период', 'месяц'],
    cost: ['стоимость', 'цена', 'госпошлина', 'платить', 'руб'],
    work: ['работа', 'трудоустройство', 'работать', 'устроиться']
  };
  
  // Заполняем эмбеддинг на основе символов
  for (let i = 0; i < Math.min(lowerText.length, dimension / 2); i++) {
    const code = lowerText.charCodeAt(i);
    embedding[i] += (code % 256) / 256;
  }
  
  // Добавляем вес для ключевых слов
  for (const [topic, keywords] of Object.entries(topics)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        const hashIndex = topic.charCodeAt(0) % (dimension / 2) + dimension / 2;
        embedding[hashIndex] += 0.5;
      }
    }
  }
  
  // Нормализация
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    return embedding.map(v => v / norm);
  }
  
  return embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dot = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 0.0001);
}

export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    let chunk = text.substring(i, i + chunkSize);
    
    // Разбиваем по предложениям
    const lastPeriod = chunk.lastIndexOf('.');
    if (lastPeriod > chunkSize / 2) {
      chunk = chunk.substring(0, lastPeriod + 1);
    }
    
    if (chunk.trim().length > 50) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}
