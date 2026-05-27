"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Package,
  Users,
  TrendingUp,
  Search,
} from "lucide-react";
import { api, Product, Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    api
      .get("/auth/me")
      .then(() => setIsAdmin(true))
      .catch(() => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      });
  }, [router]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить товар?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-lg">
              BURMALDA
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Админ-панель</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop">
              <Button variant="ghost" size="sm">
                Магазин
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background p-6 rounded-xl border flex items-center gap-4"
          >
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Товаров</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background p-6 rounded-xl border flex items-center gap-4"
          >
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Категорий</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background p-6 rounded-xl border flex items-center gap-4"
          >
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.isBestseller).length}
              </p>
              <p className="text-sm text-muted-foreground">Хитов продаж</p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Добавить товар
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-background border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Загрузка...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Товар</th>
                    <th className="text-left px-4 py-3 font-medium">Категория</th>
                    <th className="text-left px-4 py-3 font-medium">Цена</th>
                    <th className="text-left px-4 py-3 font-medium">Статус</th>
                    <th className="text-right px-4 py-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                            {product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                                Нет
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.category.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{product.price.toLocaleString("ru-RU")} ₽</span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            {Number(product.oldPrice).toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {product.inStock ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              В наличии
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Нет в наличии
                            </span>
                          )}
                          {product.isNew && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Новинка
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Хит
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  Товары не найдены
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ProductForm
        product={editingProduct}
        categories={categories}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
