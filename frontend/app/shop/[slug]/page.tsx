"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { api, Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (slug) {
      api
        .get(`/products/${slug}`)
        .then((res) => {
          setProduct(res.data);
          if (res.data.sizes.length > 0) setSelectedSize(res.data.sizes[0]);
          if (res.data.colors.length > 0) setSelectedColor(res.data.colors[0]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Товар не найден</h1>
        <Link href="/shop" className="text-primary hover:underline mt-4 inline-block">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Назад в каталог
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square relative rounded-xl overflow-hidden bg-muted">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Нет изображения
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category.name}</Badge>
              {product.isNew && <Badge>Новинка</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(Number(product.oldPrice))}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Размер</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Цвет</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-2 hover:bg-muted transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                className="px-3 py-2 hover:bg-muted transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Добавлено
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> В корзину
                </>
              )}
            </Button>
          </div>

          {!product.inStock && (
            <p className="text-destructive text-sm">Товар временно отсутствует на складе</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
