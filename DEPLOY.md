# Деплой на Vercel + Supabase (Полностью бесплатно)

## Часть 1: Supabase

### 1.1 Создай проект
1. Зарегистрируйся на [supabase.com](https://supabase.com)
2. Нажми **New Project**
3. Название: `burmalda`
4. Регион: `Central EU (Frankfurt)`
5. Пароль базы данных: придумай надёжный
6. Жми **Create new project** (жди ~2 минуты)

### 1.2 Скопируй ключи
Перейди в Project Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Создай таблицы
1. SQL Editor → New query
2. Вставь содержимое файла `supabase-schema.sql` из репозитория
3. Жми **Run**

### 1.4 Создай Storage bucket для картинок
1. Storage → New bucket
2. Название: `products`
3. **Public bucket** → включи галочку
4. Create bucket

### 1.5 Создай админа
1. Authentication → Users → Add user
2. Email: `admin@burmalda.ru`
3. Password: придумай пароль
4. Жми **Create user**
5. Затем SQL Editor → New query:
```sql
UPDATE profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@burmalda.ru');
```

---

## Часть 2: Vercel (Frontend)

### 2.1 Импортируй проект
1. [vercel.com](https://vercel.com) → зарегистрируйся через GitHub
2. Add New Project → импортируй репозиторий

### 2.2 Настройки
| Параметр | Значение |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |

### 2.3 Environment Variables
Добавь три переменные:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2.4 Deploy
Жми **Deploy**! Через 2-3 минуты сайт будет доступен.

---

## Готово! 🎉

- **Сайт**: `https://your-project.vercel.app`
- **Админка**: `/admin`
- **Вход**: email `admin@burmalda.ru` + твой пароль

## Локальный запуск (для разработки)

```bash
# 1. Установи зависимости
cd frontend
npm install

# 2. Создай .env.local (не коммить его!)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# 3. Запусти
npm run dev
```
