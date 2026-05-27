"use client";

import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Headphones, MapPin, Mail, Phone } from "lucide-react";

const features = [
  { icon: Shield, title: "Только оригинал", desc: "Мы работаем напрямую с брендами и официальными дистрибьюторами. Каждый товар проходит проверку подлинности." },
  { icon: Truck, title: "Быстрая доставка", desc: "Доставляем по всей России от 1 дня. Бесплатная доставка при заказе от 10 000 ₽." },
  { icon: RotateCcw, title: "Лёгкий возврат", desc: "Не подошёл размер? Верните товар в течение 14 дней — мы заберём его курьером бесплатно." },
  { icon: Headphones, title: "Поддержка 24/7", desc: "Наша команда всегда на связи. Ответим на вопросы о товарах, доставке и возврате в любое время." },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">О нас</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Burmalda — это современный магазин одежды и обуви, созданный для тех, кто ценит стиль,
          качество и комфорт. Мы собираем лучшие модели от мировых брендов и делаем их доступными
          для каждого.
        </p>
      </motion.section>

      {/* Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold">Наша история</h2>
          <p className="text-muted-foreground leading-relaxed">
            Магазин Burmalda открылся в 2024 году с идеей создать пространство, где можно легко
            найти актуальную одежду и обувь без компромиссов в качестве. За короткое время мы
            выстроили надёжные связи с поставщиками и заслужили доверие тысяч покупателей.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Мы верим, что правильный гардероб — это не просто вещи, а способ самовыражения.
            Поэтому тщательно отбираем каждую позицию в каталоге.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center"
        >
          <span className="text-6xl font-black text-neutral-300/60">BURMALDA</span>
        </motion.div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border bg-card text-card-foreground space-y-3"
            >
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border rounded-2xl p-8 md:p-12 bg-muted/30"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Контакты</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">Москва, ул. Примерная, 1</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">support@burmalda.ru</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Phone className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">+7 (999) 123-45-67</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
