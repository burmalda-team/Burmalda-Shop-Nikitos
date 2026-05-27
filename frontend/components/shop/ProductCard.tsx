"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Product, getImageUrl } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length > 0 && product.colors.length > 0) {
      addItem(product, product.sizes[0], product.colors[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images.length > 0 ? (
            <Image
              src={getImageUrl(product.images[0])}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Нет изображения
            </div>
          )}

          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="bg-white/90 backdrop-blur">
                Новинка
              </Badge>
            )}
            {product.oldPrice && (
              <Badge variant="destructive" className="bg-red-500/90 backdrop-blur">
                Скидка
              </Badge>
            )}
          </div>

          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />

          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-3 right-3 opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0"
            onClick={handleQuickAdd}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(Number(product.oldPrice))}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
