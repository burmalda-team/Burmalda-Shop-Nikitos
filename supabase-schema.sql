-- Создание таблиц для Burmalda Shop

-- Категории
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Товары
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Профили пользователей (для ролей)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Триггер: автоматическое создание профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS (Row Level Security) для продуктов
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политики для чтения (доступно всем)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);

-- Политики для админа (требуется аутентификация через API Routes)
-- API Routes используют Service Role Key, поэтому RLS не применяется для админских операций

-- Профили: пользователи видят только свой профиль
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Сид: категории
INSERT INTO categories (name, slug, image) VALUES
  ('Кроссовки', 'sneakers', null),
  ('Ботинки', 'boots', null),
  ('Футболки', 'tshirts', null),
  ('Куртки', 'jackets', null),
  ('Джинсы', 'jeans', null);

-- Сид: товары
INSERT INTO products (name, slug, description, price, old_price, images, sizes, colors, category_id, in_stock, is_new, is_bestseller) VALUES
  ('Nike Air Force 1', 'nike-air-force-1', 'Классические кроссовки Nike Air Force 1', 12990, 15990, ARRAY[]::TEXT[], ARRAY['40','41','42','43','44','45'], ARRAY['Белый','Черный'], (SELECT id FROM categories WHERE slug='sneakers'), true, true, true),
  ('Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Беговые кроссовки с технологией Boost', 15490, null, ARRAY[]::TEXT[], ARRAY['40','41','42','43','44'], ARRAY['Черный','Серый'], (SELECT id FROM categories WHERE slug='sneakers'), true, true, false),
  ('Dr. Martens 1460', 'dr-martens-1460', 'Культовые ботинки с 8 люверсами', 18990, 21990, ARRAY[]::TEXT[], ARRAY['39','40','41','42','43','44','45'], ARRAY['Черный','Коричневый'], (SELECT id FROM categories WHERE slug='boots'), true, false, true),
  ('Timberland Premium', 'timberland-premium', 'Водонепроницаемые ботинки', 22990, null, ARRAY[]::TEXT[], ARRAY['40','41','42','43','44','45'], ARRAY['Песочный','Черный'], (SELECT id FROM categories WHERE slug='boots'), true, false, true);
