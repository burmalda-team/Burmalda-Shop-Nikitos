"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">BURMALDA</h3>
            <p className="text-sm text-muted-foreground">
              Современный магазин одежды и обуви. Лучшие бренды по лучшим ценам.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-foreground transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  Корзина
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@burmalda.ru</li>
              <li>+7 (999) 123-45-67</li>
              <li>Москва, ул. Примерная, 1</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 Burmalda. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
