# Teacher notes: практики 3–4 — что показать и что важно

## 0) Минимальный план пары (без перегруза)

**Цель:** студенты поняли связку _React ⇄ HTTP ⇄ Express_ и научились тестировать API.

### Блок 1 — 10 мин: что такое “порт” и “клиент-сервер”

- **Порт** — номер “двери” у программы на компьютере.
  - React dev server: `localhost:3001`
  - Express API: `localhost:3000`
- **Клиент** (браузер/React/Postman) стучится по URL → **сервер** (Express) отвечает JSON.

### Блок 2 — 10 мин: “конвейер” middleware в Express

В `backend/app.js` покажите 5 строк, по порядку:

1. `cors(...)`
2. `express.json()`
3. `logger`
4. `app.use("/api/products", productsRouter)`
5. `404`

**Одна фраза:** “Middleware — это функции, которые выполняются ДО роутов или ВМЕСТО роутов, если сами отвечают.”

### Блок 3 — 10 мин: “что где в коде”

Открываете 2 файла:

- `backend/app.js` — `express.json()` и `app.use("/api/products", ...)`
- `backend/routes/products.js` — обработчики `router.get/post/patch/delete`

### Блок 4 — 15–20 мин: Postman (или api.http)

- Запрос `GET /api/products`
- `POST /api/products` (покажите JSON)
- `PATCH` и `DELETE` (по желанию)

### Блок 5 — остальное время: студенты делают TODO

- Практика 3: внешнее API (5 запросов + скрины)
- Практика 4: реализуют CRUD-функции в `productsApi.js`

---

## 1) middleware и next()

- Запрос — как “деталь на конвейере”.
- Middleware — рабочие на конвейере.
- `next()` — “передай деталь следующему”.

**Если next() не вызвать и не ответить res...** — деталь зависнет и конвейер остановится для этого запроса.

---

## 2) Почему CORS вообще нужен

React и backend на разных портах → браузер считает это разными origin.  
CORS — политика браузера “можно ли странице с origin A обращаться к origin B”.

На практике: “Мы явно разрешаем frontend‑origin в backend через cors({ origin: ... })”.

---

## 3) Что в репо специально НЕ доделано (чтобы это не было решением)

- `frontend/src/api/productsApi.js` — стоят `throw new Error("TODO...")`
- В `POST/PATCH` backend — очень простая валидация, студенты должны усилить.

---

## 4) Если Postman не логинится

Запасной вариант:

- VS Code расширение **REST Client**
- файл `backend/api.http` → кликаем “Send Request”
  Это соответствует цели практики (уметь отправлять HTTP), даже если Postman капризничает.

---

## 5) Команды (чтобы не думать на паре)

В двух терминалах:

**Терминал 1 (backend)**

```bash
cd backend
npm i
npm run dev
```

**Терминал 2 (frontend)**

```bash
cd frontend
npm i
npm run dev
```

---

## 6) Типовые ошибки и быстрые фиксы

- Ошибка CORS → origin не совпал → поменять `origin` в `backend/app.js`
- `req.body` пустой → забыли `express.json()`
- React пишет `TODO: ...` → не реализовали `productsApi.js`
- “Порт занят” → поменять порт фронта: `frontend/vite.config.js`
