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
    return () => { mounted = false; };
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
    <div className="w-full min-h-screen flex flex-col py-[40px] items-center">
      {cart.length === 0 && (
        <div className="text-gray-600 mb-6">Your cart is empty.</div>
      )}

      {cart.map((item) => (
        <div
          key={item.productId}
          className="w-[900px] h-[150px] m-[10px] shadow-2xl flex flex-row items-center transition-transform hover:-translate-y-1 duration-200"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-[80px] h-[80px] ml-[20px] object-cover rounded-md"
          />
          <div className="w-[320px] h-full flex flex-col justify-center pl-[10px]">
            <span className="font-bold line-clamp-2">{item.name}</span>
            <span className="font-semibold">Rs {(item.price).toFixed(2)}</span>
          </div>

          <div className="w-[190px] h-full flex flex-row justify-center items-center">
            <button
              className="cursor-pointer text-3xl px-3"
              onClick={() => handleQty(item, -1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="mx-[10px] text-xl">{item.quantity}</span>
            <button
              className="cursor-pointer text-xl px-3"
              onClick={() => handleQty(item, 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="w-[190px] h-full flex justify-end items-center pr-[20px]">
            <span className="font-bold">
              Rs {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>

          <button
            className="w-[30px] h-[30px] bg-accent text-white font-bold hover:bg-red-500 cursor-pointer rounded-full mr-[20px] flex items-center justify-center"
            onClick={() => handleDelete(item)}
            aria-label="Remove item"
            title="Remove"
          >
            <RiDeleteBin5Fill />
          </button>
        </div>
      ))}

      <div className="w-[900px] h-[100px] m-[10px] shadow-2xl flex flex-row items-center justify-end relative">
        <span className="font-bold text-xl mr-[20px]">
          Total: Rs {total.toFixed(2)}
        </span>

        <button
          className="absolute left-10 bg-accent text-white px-5 py-2 rounded-full font-semibold hover:bg-red-500 cursor-pointer transition"
          onClick={() => {
            // pass current state items to checkout (server or local, both ok)
            navigate("/checkout", { state: { items: cart } });
          }}
        >
          Checkout
        </button>

        {!isLoggedIn() && (
          <span className="absolute right-6 text-sm text-gray-500">
            (Login to save your cart)
          </span>
        )}
      </div>
    </div>
  );
}
