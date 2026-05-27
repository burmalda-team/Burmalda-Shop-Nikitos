"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Product, Category } from "@/lib/api";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryParam = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (search) params.append("search", search);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      params.append("sort", sortField);
      params.append("order", sortOrder);
      params.append("page", page.toString());

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, minPrice, maxPrice, sortField, sortOrder, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam || "");
    setPage(1);
  }, [categoryParam]);

  const pagesCount = Math.ceil(total / 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Каталог</h1>
        <p className="text-muted-foreground mt-1">{total} товаров</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Поиск</h3>
            <Input
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3">Категории</h3>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedCategory(""); setPage(1); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !selectedCategory ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                Все категории
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Цена</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              />
              <Input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Сортировка</h3>
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortField(field);
                setSortOrder(order);
              }}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="createdAt-desc">По новизне</option>
              <option value="price-asc">По цене (возр.)</option>
              <option value="price-desc">По цене (убыв.)</option>
              <option value="name-asc">По названию (А-Я)</option>
              <option value="name-desc">По названию (Я-А)</option>
            </select>
          </div>
        </aside>

        {/* Mobile Filters */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
          </Button>

          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-4 border rounded-lg space-y-4"
            >
              <Input
                placeholder="Поиск товаров..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setSelectedCategory(""); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    !selectedCategory ? "bg-primary text-primary-foreground border-primary" : ""
                  }`}
                >
                  Все
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      selectedCategory === cat.slug
                        ? "bg-primary text-primary-foreground border-primary"
                        : ""
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="От"
                  value={minPrice}
                  onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                />
                <Input
                  type="number"
                  placeholder="До"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Сортировка</label>
                <select
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortField(field);
                    setSortOrder(order);
                  }}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="createdAt-desc">По новизне</option>
                  <option value="price-asc">По цене (возр.)</option>
                  <option value="price-desc">По цене (убыв.)</option>
                  <option value="name-asc">По названию (А-Я)</option>
                  <option value="name-desc">По названию (Я-А)</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={products} />

              {pagesCount > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagesCount }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
