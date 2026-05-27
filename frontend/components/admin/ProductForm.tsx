"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { api, Product, Category } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, categories, open, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    categoryId: "",
    sizes: "",
    colors: "",
    inStock: true,
    isNew: false,
    isBestseller: false,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || "",
        categoryId: product.categoryId,
        sizes: product.sizes.join(", "),
        colors: product.colors.join(", "),
        inStock: product.inStock,
        isNew: product.isNew,
        isBestseller: product.isBestseller,
      });
      setExistingImages(product.images);
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        price: "",
        oldPrice: "",
        categoryId: categories[0]?.id || "",
        sizes: "",
        colors: "",
        inStock: true,
        isNew: false,
        isBestseller: false,
      });
      setExistingImages([]);
    }
    setNewFiles([]);
  }, [product, categories, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.oldPrice) data.append("oldPrice", formData.oldPrice);
      data.append("categoryId", formData.categoryId);
      data.append("sizes", JSON.stringify(formData.sizes.split(",").map((s) => s.trim()).filter(Boolean)));
      data.append("colors", JSON.stringify(formData.colors.split(",").map((s) => s.trim()).filter(Boolean)));
      data.append("inStock", String(formData.inStock));
      data.append("isNew", String(formData.isNew));
      data.append("isBestseller", String(formData.isBestseller));
      data.append("existingImages", JSON.stringify(existingImages));

      newFiles.forEach((file) => data.append("images", file));

      if (product) {
        await api.put(`/products/${product.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Редактировать товар" : "Новый товар"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (URL)</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Цена</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Старая цена</label>
              <Input
                type="number"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Категория</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Размеры (через запятую)</label>
              <Input
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                placeholder="S, M, L, XL"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Цвета (через запятую)</label>
              <Input
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="Черный, Белый, Синий"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              />
              В наличии
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
              />
              Новинка
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
              />
              Хит продаж
            </label>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Изображения</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                    onClick={() => removeExistingImage(i)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFilesChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" /> Загрузить изображения
            </Button>
            {newFiles.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Выбрано файлов: {newFiles.length}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
