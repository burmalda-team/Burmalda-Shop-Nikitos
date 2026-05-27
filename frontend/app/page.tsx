"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { useEffect, useState } from "react";
import { api, Product } from "@/lib/api";

const features = [
  { icon: Truck, title: "Быстрая доставка", desc: "По всей России от 1 дня" },
  { icon: Shield, title: "Гарантия качества", desc: "Только оригинальные товары" },
  { icon: RotateCcw, title: "Легкий возврат", desc: "В течение 14 дней" },
  { icon: Headphones, title: "Поддержка 24/7", desc: "Ответим на любые вопросы" },
];

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products/bestsellers").then((res) => setBestsellers(res.data));
    api.get("/products/new-arrivals").then((res) => setNewArrivals(res.data));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Новая коллекция
                <br />
                <span className="text-muted-foreground">2024</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Откройте для себя лучшие бренды одежды и обуви. Стиль, качество и комфорт в каждой детали.
              </p>
              <div className="flex gap-4">
                <Link href="/shop">
                  <Button size="lg" className="gap-2">
                    В каталог <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/shop?category=sneakers">
                  <Button size="lg" variant="outline">
                    Кроссовки
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center"
            >
              <div className="text-6xl font-black text-neutral-400/50">BURMALDA</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/50"
            >
              <feature.icon className="h-8 w-8 mb-3 text-primary" />
              <h3 className="font-semibold text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Хиты продаж</h2>
          <Link href="/shop" className="text-sm font-medium hover:underline flex items-center gap-1">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Новинки</h2>
          <Link href="/shop" className="text-sm font-medium hover:underline flex items-center gap-1">
            Все товары <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-12 md:p-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Присоединяйтесь к нам
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Получайте уведомления о новых коллекциях и эксклюзивных скидках.
          </p>
          <Link href="/shop">
            <Button size="lg" variant="secondary">
              Начать покупки
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
