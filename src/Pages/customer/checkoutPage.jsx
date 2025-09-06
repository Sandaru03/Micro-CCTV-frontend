// src/pages/checkout/CheckoutPage.jsx
import { useEffect, useMemo, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Normalize cart: ensure numeric quantity >= 1 and price is numeric
  const [cart, setCart] = useState(() =>
    (location.state?.items || []).map((it) => ({
      ...it,
      quantity: Math.max(1, Number(it.quantity) || 1),
      price: Number(it.price) || 0,
    }))
  );

  // user + form
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // redirect if no items
  useEffect(() => {
    if (!location.state?.items || location.state.items.length === 0) {
      toast.error("Please select items to checkout");
      navigate("/shop");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch user (require login)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setName(`${res.data.firstName ?? ""} ${res.data.lastName ?? ""}`.trim());
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch user details.");
        navigate("/login");
      });
  }, [navigate]);

  // qty handlers — pure immutable updates (no in-place mutation)
  function decQty(index) {
    setCart((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
      )
    );
  }
  function incQty(index) {
    setCart((prev) =>
      prev.map((it, i) => (i === index ? { ...it, quantity: it.quantity + 1 } : it))
    );
  }
  function removeItem(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill all the details");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const order = {
      address,
      phone,
      items: cart.map((it) => ({ productId: it.productId, qty: it.quantity })),
    };

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/orders", order, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully");
      navigate("/"); // or navigate("/orders")
    } catch (error) {
      console.log(error);
      toast.error("Error placing order");
    }
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Items */}
        <div className="flex flex-col gap-4">
          {cart.map((item, index) => (
            <div
              key={item.productId ?? index}
              className="w-full rounded-2xl bg-white shadow-lg p-4 sm:p-5"
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
                    <span className="font-semibold">Rs {item.price.toFixed(2)}</span>
                  </span>
                </div>

                {/* qty controls */}
                <div className="col-span-6 sm:col-span-3 flex items-center justify-center gap-3">
                  <button
                    className="w-9 h-9 text-xl rounded-full border hover:bg-gray-50 active:scale-95 transition disabled:opacity-40 cursor-pointer"
                    onClick={() => decQty(index)}
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center text-lg">{item.quantity}</span>
                  <button
                    className="w-9 h-9 text-xl rounded-full border hover:bg-gray-50 active:scale-95 transition cursor-pointer"
                    onClick={() => incQty(index)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* line total + delete */}
                <div className="col-span-6 sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-bold">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500 flex items-center justify-center active:scale-95 transition"
                    onClick={() => removeItem(index)}
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

        {/* Address / Contact */}
        <div className="mt-4 w-full rounded-2xl bg-white shadow-lg p-4 sm:p-5">
          <h2 className="text-lg font-semibold mb-3">Delivery Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="w-full h-11 border border-gray-300 rounded-lg px-3 outline-none focus:ring-2 focus:ring-red-600/20"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full h-11 border border-gray-300 rounded-lg px-3 outline-none focus:ring-2 focus:ring-red-600/20"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              className="sm:col-span-2 w-full min-h-[96px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/20"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
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

          <button
            className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-500 active:scale-95 transition disabled:opacity-60 cursor-pointer"
            onClick={placeOrder}
            disabled={!name.trim() || !address.trim() || !phone.trim() || cart.length === 0}
          >
            Place Order
          </button>
        </div>
      </main>
    </div>
  );
}
