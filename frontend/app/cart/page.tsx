"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getImageUrl } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">Корзина пуста</h1>
          <p className="text-muted-foreground">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Link href="/shop">
            <Button size="lg" className="mt-4">
              Перейти в каталог
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={`${item.product.id}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={getImageUrl(item.product.images[0])}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Нет фото
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.product.slug}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.size} / {item.color}
                  </p>
                  <p className="font-semibold mt-1">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <button
                        className="px-2 py-1 hover:bg-muted transition-colors"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 hover:bg-muted transition-colors"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Итого</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Товары</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Доставка</span>
                <span>Бесплатно</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>К оплате</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Оформить заказ
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={clearCart}
            >
              Очистить корзину
            </Button>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}
