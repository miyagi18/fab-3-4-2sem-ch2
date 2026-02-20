import { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api/productsApi";

// Мягкая цветовая палитра в стиле черкесского флага
const colors = {
  green: '#3A6B4C',       // мягкий зелёный фон
  gold: '#FDDD8C',         // мягкий золотой для акцентов
  lightGold: '#FFF0C0',    // очень светлый золотой для hover
  white: '#FFFFFF',        // белый текст
  lightGreen: '#4F7A5C',   // светлый зелёный для карточек
};

// Общие стили для контейнеров и элементов
const styles = {
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 24,
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    backgroundColor: colors.green,
    color: colors.white,
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    border: `2px solid ${colors.gold}`,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: `2px solid ${colors.gold}`,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gold,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 0,
    marginBottom: 16,
    color: colors.gold,
    borderLeft: `4px solid ${colors.gold}`,
    paddingLeft: 12,
  },
  // Стили для формы
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    backgroundColor: colors.lightGreen,
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${colors.gold}`,
  },
  formRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 8,
    border: `2px solid ${colors.gold}`,
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#333',
    fontSize: 16,
    outline: 'none',
    transition: '0.2s',
    flex: '1 1 auto',
    minWidth: 200,
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 8,
    border: `2px solid ${colors.gold}`,
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#333',
    fontSize: 16,
    outline: 'none',
    transition: '0.2s',
    minHeight: 80,
    resize: 'vertical',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: colors.gold,
    color: colors.green,
    border: 'none',
    borderRadius: 30,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s',
    border: `1px solid ${colors.white}`,
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  // Стили для списка товаров
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGreen,
    padding: '12px 18px',
    marginBottom: 10,
    borderRadius: 50,
    border: `1px solid ${colors.gold}`,
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  itemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    flexWrap: 'wrap',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.gold,
  },
  itemPrice: {
    backgroundColor: colors.gold,
    color: colors.green,
    padding: '4px 12px',
    borderRadius: 20,
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    gap: 8,
  },
  smallButton: {
    padding: '6px 12px',
    backgroundColor: colors.gold,
    color: colors.green,
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s',
    border: `1px solid ${colors.white}`,
  },
  error: {
    color: '#ff8a8a',
    backgroundColor: '#4a1e1e',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ff5555',
  },
  loading: {
    color: colors.lightGold,
    fontStyle: 'italic',
  },
  // Стили для карточки товара (в стиле интернет-магазина)
  productImage: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: `2px solid ${colors.gold}`,
    backgroundColor: '#fff',
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.gold,
  },
  productCategory: {
    fontSize: '14px',
    opacity: 0.8,
    color: colors.white,
  },
  productDescription: {
    fontSize: '14px',
    opacity: 0.7,
    color: colors.white,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px',
  },
  productPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.gold,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '2px 8px',
    borderRadius: '20px',
    display: 'inline-block',
  },
  productStock: {
    fontSize: '14px',
    color: colors.lightGold,
  },
  // Кнопка "В корзину" (основная)
  cartButton: {
    padding: '6px 12px',
    backgroundColor: colors.gold,
    color: colors.green,
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.2s',
    border: `1px solid ${colors.white}`,
  },
  // Обновлённый стиль для карточки (вместо listItem)
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    backgroundColor: colors.lightGreen,
    padding: '20px',
    marginBottom: '12px',
    borderRadius: '16px',
    border: `1px solid ${colors.gold}`,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  // Группа кнопок справа (по вертикали)
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginLeft: 'auto',
    justifyContent: 'flex-start',
  },
};

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const canSubmit = useMemo(() =>
    title.trim() !== "" && price !== "" && Number(price) > 0
    && (stock === "" || Number(stock) > 0), [title, price, stock]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    try {
      await createProduct({
        title: title.trim(),
        price: Number(price),
        category: category.trim() || "Без категории",
        description: description.trim() || "Нет описания",
        stock: Number(stock) || 0,
        image: image.trim() || "https://via.placeholder.com/150/92c952"
      });
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setStock("");
      setImage("");
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  async function onPricePlus(id, currentPrice) {
    setError("");
    try {
      await updateProduct(id, { price: Number(currentPrice) + 10 });
      await load();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Circassian Store</h1>
      </div>

      <p style={{ color: colors.lightGold, marginBottom: 20 }}>
        Магазин адыгской (черкесской) атрибутики
      </p>

      <section style={{ marginBottom: 30 }}>
        <h2 style={styles.subtitle}>Добавить товар</h2>
        <form onSubmit={onAdd} style={styles.form}>
          <div style={styles.formRow}>
            <input
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название *"
            />
            <input
              style={styles.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Цена *"
              type="number"
            />
            <input
              style={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Категория"
            />
          </div>
          <div style={styles.formRow}>
            <textarea
              style={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
            />
            <input
              style={styles.input}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Остаток"
              type="number"
            />
            <div style={styles.formRow}>
              <input
                style={styles.input}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL изображения (необязательно)"
              />
            </div>
          </div>
          <div style={{ ...styles.formRow, justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                ...styles.button,
                ...(canSubmit ? {} : styles.buttonDisabled)
              }}
              onMouseEnter={(e) => canSubmit && (e.target.style.backgroundColor = colors.lightGold)}
              onMouseLeave={(e) => canSubmit && (e.target.style.backgroundColor = colors.gold)}
            >
              Добавить товар
            </button>
            <button
              type="button"
              onClick={load}
              style={styles.button}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.lightGold}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.gold}
            >
              Обновить список
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 style={styles.subtitle}>Список товаров</h2>

        {loading && <p style={styles.loading}>Загрузка...</p>}
        {error && (
          <div style={styles.error}>
            <strong>Ошибка:</strong> {error}
            <br />
            Проверьте, что: (1) backend запущен на 3000, (2) CORS настроен, (3) API функции реализованы.
          </div>
        )}

        <ul style={styles.list}>
          {items.map((p) => (
            <li key={p.id} style={styles.card}>
              {/* Изображение товара (если нет, подставляем заглушку) */}
              <img
                src={p.image || "https://via.placeholder.com/150/92c952?text=Circassian"}
                alt={p.title}
                style={styles.productImage}
                onError={(e) => { e.target.src = "https://via.placeholder.com/150/92c952?text=No+Image"; }}
              />
              {/* Информация о товаре */}
              <div style={styles.productInfo}>
                <div style={styles.productTitle}>{p.title}</div>
                <div style={styles.productCategory}>{p.category}</div>
                {p.description && (
                  <div style={styles.productDescription}>{p.description}</div>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={styles.productPrice}>{p.price} ₽</span>
                  {p.stock !== undefined && (
                    <span style={styles.productStock}>Остаток: {p.stock}</span>
                  )}
                </div>
              </div>
              {/* Кнопки действий */}
              <div style={styles.cardActions}>
                <button
                  onClick={() => {
                    // Имитация добавления в корзину
                    alert(`Товар "${p.title}" добавлен в корзину`);
                  }}
                  style={styles.cartButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.lightGold}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.gold}
                >
                  В корзину
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  style={{ ...styles.smallButton, backgroundColor: '#c04040', color: 'white' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#a03030'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#c04040'}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}