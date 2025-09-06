// src/pages/cart/CartPage.jsx
import { useEffect, useState } from "react";
import { addToCart, getCart, isLoggedIn } from "../../utils/cart";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // initial load (server if logged in, else local)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await getCart();
        if (mounted) setCart(items);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleQty(item, delta) {
    const updated = await addToCart(item, delta);
    setCart(updated);
  }

  async function handleDelete(item) {
    const updated = await addToCart(item, -item.quantity);
    setCart(updated);
  }

  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-600">Loading cart…</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {cart.length === 0 && (
          <div className="text-gray-600 mb-6">Your cart is empty.</div>
        )}

        {/* Items */}
        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="
                w-full rounded-2xl bg-white shadow-lg
                p-4 sm:p-5
              "
            >
              <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                {/* image */}
                <div className="col-span-3 sm:col-span-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                </div>

                {/* name + unit price */}
                <div className="col-span-9 sm:col-span-5">
                  <span className="block font-semibold leading-snug line-clamp-2">
                    {item.name}
                  </span>
                  <span className="mt-1 inline-block text-sm text-gray-600">
                    Unit price:&nbsp;
                    <span className="font-semibold">
                      Rs {(item.price || 0).toFixed(2)}
                    </span>
                  </span>
                </div>

                {/* qty controls (mobile: new row; desktop: center) */}
                <div className="col-span-6 sm:col-span-3 flex items-center justify-center sm:justify-center gap-3">
                  <button
                    className="w-9 h-9 text-xl rounded-full border hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                    onClick={() => handleQty(item, -1)}
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center text-lg">
                    {item.quantity}
                  </span>
                  <button
                    className="w-9 h-9 text-xl rounded-full border hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                    onClick={() => handleQty(item, 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* line total + delete (right on desktop, split on mobile) */}
                <div className="col-span-6 sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-bold">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="
                      w-9 h-9 rounded-full
                      bg-accent text-white hover:bg-red-500
                      flex items-center justify-center
                      active:scale-95 transition cursor-pointer
                    "
                    onClick={() => handleDelete(item)}
                    aria-label="Remove item"
                    title="Remove"
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div
            className="
              mt-4 w-full rounded-2xl bg-white shadow-lg
              p-4 sm:p-5
              flex flex-col sm:flex-row items-center gap-3 sm:gap-4
              justify-between
            "
          >
            <div className="text-lg sm:text-xl font-semibold">
              Total: <span className="font-bold">Rs {total.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-3">
              {!isLoggedIn() && (
                <span className="text-xs sm:text-sm text-gray-500">
                  (Login to save your cart)
                </span>
              )}
              <button
                className="
                  bg-accent text-white px-5 py-2 rounded-full font-semibold
                  hover:bg-red-500 active:scale-95 transition cursor-pointer
                "
                onClick={() => {
                  navigate("/checkout", { state: { items: cart } });
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
