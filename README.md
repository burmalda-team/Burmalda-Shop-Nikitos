# Burmalda Shop

Современный магазин одежды и обуви с админ-панелью. Построен на TypeScript, Next.js, Tailwind CSS, Express и PostgreSQL.

## Стек технологий

### Frontend
- **Next.js 14** — React фреймворк с App Router
- **TypeScript** — типизация
- **Tailwind CSS** — утилитарный CSS
- **Framer Motion** — анимации
- **Zustand** — state management (корзина)
- **shadcn/ui** — UI компоненты
- **Lucide React** — иконки

### Backend
- **Express** — Node.js фреймворк
- **Prisma ORM** — работа с базой данных
- **PostgreSQL** — реляционная база данных
- **JWT** — аутентификация администратора
- **Multer** — загрузка изображений

## Структура проекта

```
Burmalda-Shop-Nikitos/
├── backend/                  # Express API
│   ├── src/
│   │   ├── controllers/      # Логика обработки запросов
│   │   ├── middleware/       # Middleware (auth, upload, errors)
│   │   ├── routes/           # API маршруты
│   │   ├── utils/            # Утилиты (Prisma клиент)
│   │   └── index.ts          # Точка входа
│   ├── prisma/
│   │   └── schema.prisma     # Схема базы данных
│   └── package.json
├── frontend/                 # Next.js приложение
│   ├── app/                  # App Router
│   │   ├── admin/            # Админ-панель
│   │   ├── cart/             # Корзина
│   │   ├── shop/             # Каталог
│   │   └── page.tsx          # Главная страница
│   ├── components/
│   │   ├── ui/               # UI компоненты
│   │   ├── layout/           # Header, Footer
│   │   ├── shop/             # Компоненты магазина
│   │   └── admin/            # Компоненты админки
│   ├── stores/               # Zustand stores
│   └── lib/                  # API клиент, утилиты
└── README.md
```

## Требования

- Node.js 18+
- PostgreSQL 14+

## Быстрый старт

### 1. Клонируйте репозиторий

```bash
git clone <repo-url>
cd Burmalda-Shop-Nikitos
```

### 2. Настройте базу данных

Создайте базу данных PostgreSQL:

```bash
createdb burmalda
```

Или через psql:
```sql
CREATE DATABASE burmalda;
```

### 3. Запустите Backend

```bash
cd backend
npm install

# Настройте переменные окружения в .env
# По умолчанию: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/burmalda?schema=public"

npx prisma migrate dev --name init
npx prisma db seed

npm run dev
```

Backend запустится на `http://localhost:3001`

API Endpoints:
- `GET /api/products` — список товаров
- `GET /api/products/:slug` — детали товара
- `POST /api/products` — создать товар (admin)
- `PUT /api/products/:id` — обновить товар (admin)
- `DELETE /api/products/:id` — удалить товар (admin)
- `GET /api/categories` — список категорий
- `POST /api/auth/login` — вход администратора

### 4. Запустите Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend запустится на `http://localhost:3000`

## Доступ в админ-панель

- URL: `http://localhost:3000/admin`
- Логин: `admin`
- Пароль: `admin123`

## Возможности

### Магазин
- 🏠 Главная страница с хитами продаж и новинками
- 📦 Каталог с фильтрами по категориям, цене и поиску
- 🔍 Детальная страница товара с выбором размера и цвета
- 🛒 Корзина с сохранением в localStorage
- 📱 Адаптивный дизайн
- ✨ Анимации Framer Motion

### Админ-панель
- 📊 Dashboard с статистикой
- ➕ Добавление новых товаров
- ✏️ Редактирование товаров
- 🗑️ Удаление товаров
- 🔐 JWT авторизация

## Архитектура

### Backend
- **Controllers** — содержат бизнес-логику, отделены от роутов
- **Middleware** — reusable auth, error handling, file upload
- **Prisma** — type-safe ORM, миграции и сиды

### Frontend
- **App Router** — современный подход Next.js
- **Server & Client Components** — оптимальный рендеринг
- **Zustand** — легкий state management для корзины
- **API Layer** — централизованный axios клиент с interceptors

## Лицензия

MIT
