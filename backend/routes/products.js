const express = require("express");
const { nanoid } = require("nanoid");

const router = express.Router();

let products = require("../data/products");

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор товара (генерируется автоматически)
 *         title:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Подробное описание
 *         price:
 *           type: number
 *           description: Цена в рублях (положительное число)
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *         rating:
 *           type: number
 *           description: Рейтинг товара (0-5)
 *         image:
 *           type: string
 *           description: URL изображения
 *       example:
 *         id: "abc12345"
 *         title: "Адыгейский нож"
 *         category: "Оружие"
 *         description: "Традиционный черкесский нож ручной работы"
 *         price: 3500
 *         stock: 10
 *         rating: 4.8
 *         image: "https://example.com/knife.jpg"
 */



/**
 * Вспомогательная функция: найти товар по id (id строковый)
 */
function findById(id) {
  return products.find((p) => p.id === id) || null;
}

router.post("/", (req, res) => {
  const { title, category, description, price, stock, rating, image } = req.body;

  // Проверка обязательных полей
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Поле 'title' обязательно и должно быть непустой строкой" });
  }

  // Цена должна быть положительным числом
  const parsedPrice = Number(price);
  if (price === undefined || isNaN(parsedPrice) || parsedPrice <= 0) {
    return res.status(400).json({ error: "Поле 'price' обязательно и должно быть положительным числом" });
  }

  // Количество на складе (необязательное, но если есть – должно быть целым неотрицательным)
  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || !Number.isInteger(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: "Поле 'stock' должно быть целым числом >= 0" });
    }
  }

  const newProduct = {
    id: nanoid(8),
    title: title.trim(),
    category: category && typeof category === "string" ? category.trim() : "Без категории",
    description: description && typeof description === "string" ? description.trim() : "",
    price: parsedPrice,
    stock: stock !== undefined ? Number(stock) : 0,
    rating: rating !== undefined ? Number(rating) : undefined,
    image: image && typeof image === "string" ? image.trim() : "",
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// GET /api/products — список товаров
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Возвращает список всех товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/:id — один товар
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получает товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/products — добавить товар
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создаёт новый товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *             example:
 *               title: "Папаха"
 *               category: "Головные уборы"
 *               description: "Черкесская папаха из каракуля"
 *               price: 4500
 *               stock: 5
 *               rating: 4.9
 *               image: "https://example.com/papaha.jpg"
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
router.post("/", (req, res) => {
  const { title, category, description, price, stock, rating, image } = req.body;

  // TODO (студентам): полноценная валидация, иначе можно сохранить "мусор"
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required (string)" });
  }

  const newProduct = {
    id: nanoid(8),
    title: title.trim(),
    category: typeof category === "string" ? category.trim() : "Без категории",
    description: typeof description === "string" ? description.trim() : "",
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    rating: rating !== undefined ? Number(rating) : undefined,
    image: typeof image === "string" ? image.trim() : "",
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PATCH /api/products/:id — частичное обновление
/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *             example:
 *               price: 4800
 *               stock: 8
 *     responses:
 *       200:
 *         description: Обновлённый товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
router.patch("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { title, category, description, price, stock, rating, image } = req.body;

  // TODO (студентам): валидация PATCH (если поле пришло — проверить)
  if (title !== undefined) product.title = String(title).trim();
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined) product.description = String(description).trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = String(image).trim();

  res.json(product);
});

// DELETE /api/products/:id — удалить товар
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удаляет товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Товар успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 */

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const before = products.length;
  products = products.filter((p) => p.id !== id);

  if (products.length === before) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Обычно делают 204 No Content, но для наглядности вернём JSON
  res.json({ ok: true });
});

module.exports = router;

