cat > src/app/page.tsx << 'EOF'
'use client';

import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import LeadForm from '@/components/landing/LeadForm';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Готовы начать ваш путь?
            </h2>
            <p className="text-gray-600 mb-8">
              Получите бесплатную консультацию ИИ-юриста прямо сейчас
            </p>
            <Link href="/assistant" className="btn-primary inline-block">
              Получить консультацию →
            </Link>
          </motion.div>
        </div>
      </section>
      
      <LeadForm />
    </div>
  );
}
EOF