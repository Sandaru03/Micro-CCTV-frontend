import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// auto-attach Authorization if present (in case a call forgets to pass headers)
API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// support productId | _id | id
function getPid(p) {
  return p?.productId || p?._id || p?.id;
}

/* ---------- Local (guest) cart ---------- */
export function getCartLocal() {
  let s = localStorage.getItem("cart");
  if (!s) {
    s = "[]";
    localStorage.setItem("cart", s);
  }
  return JSON.parse(s);
}

export function addToCartLocal(product, qty) {
  const pid = getPid(product);
  if (!pid) {
    console.error("addToCartLocal: Missing product id", product);
    return getCartLocal();
  }
  const cart = getCartLocal();
  const i = cart.findIndex((it) => it.productId === pid);

  if (i !== -1) {
    const newQty = cart[i].quantity + qty;
    if (newQty <= 0) {
      const next = cart.filter((_, idx) => idx !== i);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    } else {
      cart[i].quantity = newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    }
  } else {
    if (qty > 0) {
      cart.push({
        productId: pid,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.price,
        quantity: qty,
        altNames: product.altNames,
      });
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    return cart;
  }
}

export function clearCartLocal() {
  localStorage.setItem("cart", "[]");
}

/* ---------- Server cart ---------- */
async function getCartServer() {
  const res = await API.get("/cart");
  return res.data.items || [];
}

async function addToCartServer(product, qty) {
  const pid = getPid(product);
  if (!pid) throw new Error("Missing product id (productId/_id/id)");

  const body = {
    item: {
      productId: pid,
      name: product.name,
      image: product.images?.[0] || product.image,
      price: product.price,
    },
    quantity: qty,
  };
  const res = await API.post("/cart", body);
  return res.data.items || [];
}

export async function clearCartServer() {
  await API.delete("/cart");
}

/* ---------- Public API ---------- */
export async function getCart() {
  if (isLoggedIn()) {
    try {
      return await getCartServer();
    } catch (e) {
      console.error("Server getCart failed → local fallback:", e?.response?.status, e);
      return getCartLocal();
    }
  }
  return getCartLocal();
}

export async function addToCart(product, qty) {
  if (isLoggedIn()) {
    try {
      const items = await addToCartServer(product, qty);
      return items;
    } catch (e) {
      const code = e?.response?.status;
      if (code === 401 || code === 403) {
        console.error("Auth error: token missing/invalid/expired. Not saving to DB.");
        throw e; // UI should show login toast
      }
      console.error("addToCart server failed → local fallback:", e);
      return addToCartLocal(product, qty);
    }
  } else {
    return Promise.resolve(addToCartLocal(product, qty));
  }
}

export async function getTotal() {
  const items = await getCart();
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

export async function syncGuestCartToServer() {
  if (!isLoggedIn()) return getCartLocal();
  const guest = getCartLocal();
  if (guest.length === 0) return getCartServer();

  for (const it of guest) {
    try {
      await addToCartServer(it, it.quantity);
    } catch (e) {
      console.error("Sync push failed:", it, e);
    }
  }
  clearCartLocal();
  return await getCartServer();
}
