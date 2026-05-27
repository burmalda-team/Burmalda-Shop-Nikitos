# Деплой проекта

## Архитектура

Проект состоит из двух частей, которые деплоятся отдельно:
- **Frontend** (Next.js) → Vercel
- **Backend** (Express + PostgreSQL) → Render

---

## Часть 1: Backend на Render

### 1. Создайте PostgreSQL базу

1. Зарегистрируйтесь на [render.com](https://render.com)
2. Перейдите в Dashboard → New → PostgreSQL
3. Название: `burmalda-db`
4. Регион: Frankfurt (EU Central) — ближе к России
5. Нажмите Create Database
6. Скопируйте **Internal Database URL** — он понадобится для backend

### 2. Создайте Web Service для Backend

1. Dashboard → New → Web Service
2. Подключите свой GitHub репозиторий
3. Настройки:
   - **Name**: `burmalda-api`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
4. Перейдите в раздел **Environment Variables** и добавьте:
   ```
   DATABASE_URL=postgresql://... (Internal Database URL из шага 1)
   JWT_SECRET=your-super-secret-key-min-32-chars-long
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=10000
   UPLOAD_DIR=uploads
   ```
5. Нажмите Create Web Service

### 3. Запустите миграции (один раз)

После деплоя откройте Shell в Render Dashboard и выполните:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 4. Скопируйте URL бэкенда

Он будет вида: `https://burmalda-api.onrender.com`

---

## Часть 2: Frontend на Vercel

### 1. Импортируйте проект

1. Зарегистрируйтесь на [vercel.com](https://vercel.com) (можно через GitHub)
2. Нажмите **Add New Project**
3. Импортируйте свой GitHub репозиторий

### 2. Настройте проект

| Настройка | Значение |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

### 3. Добавьте Environment Variable

```
NEXT_PUBLIC_API_URL=https://burmalda-api.onrender.com/api
```

(Замените на ваш URL бэкенда из Части 1)

### 4. Deploy

Нажмите **Deploy**. Через 2-3 минуты сайт будет доступен.

---

## Важные замечания

### ⚠️ Изображения на Render

Render использует ephemeral диск — загруженные через админку изображения **будут теряться** при перезапуске сервера.

**Решения:**
1. **Cloudinary** (рекомендуется) — бесплатно до 25GB. Потребуется небольшая доработка загрузки.
2. **AWS S3** — надёжное хранилище.
3. Для теста можно использовать Imgur или аналогичный хостинг изображений.

### ⚠️ Бесплатный tier Render

- Сервер "засыпает" после 15 минут без активности
- Первый запрос после сна может занять 30-60 секунд
- База данных бесплатна навсегда (с ограничениями)

### ⚠️ Бесплатный tier Vercel

- Serverless функции с ограничениями
- Отличная скорость загрузки из-за CDN
- Домен вида `*.vercel.app`

---

## Быстрый чек-лист

- [ ] Создана PostgreSQL на Render
- [ ] Скопирован DATABASE_URL в Environment Variables backend
- [ ] Backend задеплоен и работает (проверьте `/api/health`)
- [ ] Добавлен `NEXT_PUBLIC_API_URL` в Environment Variables Vercel
- [ ] Frontend задеплоен
- [ ] Админ-панель доступна (`/admin`)
