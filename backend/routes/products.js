const express = require("express");
const { nanoid } = require("nanoid");

const router = express.Router();

let products = require("../data/products");

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
router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/:id — один товар
router.get("/:id", (req, res) => {
  const product = findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

// POST /api/products — добавить товар
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
