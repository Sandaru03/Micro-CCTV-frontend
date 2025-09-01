import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../assets/components/loader";
import axios from "axios";
import ImageSlider from "../../assets/components/imageSlider";
import { addToCart, getCart } from "../../utils/cart";

function getPid(p) {
  return p?.productId || p?._id || p?.id;
}
function clampQty(n) {
  const x = Math.floor(Number(n));
  if (Number.isNaN(x) || x < 1) return 1;
  if (x > 999) return 999; // optional upper bound
  return x;
}

export default function ProductOverViewPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setStatus("loading");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/products/${params.productId}`)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
        setQty(1); // reset qty when product changes
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load product");
        setStatus("error");
      });
  }, [params.productId]);

  async function handleAddToCart() {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product, qty); // ✅ use selected qty
      toast.success("Product added to cart");
      const current = await getCart();
      console.log("Cart now:", current);
    } catch (e) {
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        toast.error("Please login to save your cart");
      } else {
        toast.error("Failed to add to cart");
      }
      console.error(e);
    } finally {
      setAdding(false);
    }
  }

  function handleBuyNow() {
    if (!product) return;
    const pid = getPid(product);
    navigate("/checkout", {
      state: {
        items: [
          {
            productId: pid,
            quantity: qty, // ✅ use selected qty
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
          },
        ],
      },
    });
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      {status === "loading" && <Loader />}

      {status === "success" && product && (
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-6 flex flex-col lg:flex-row gap-8">
          {/* Left: Images */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <ImageSlider images={product.images || []} />
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-start pl-[30px]">
            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}{" "}
              {Array.isArray(product.altNames) && product.altNames.length > 0 && (
                <span className="font-light text-gray-500 text-xl">
                  {product.altNames.join(" | ")}
                </span>
              )}
            </h1>

            <p className="text-gray-700 text-lg mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6">
              {product.labellPrice > product.price ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-medium text-gray-500 line-through">
                    Rs {product.labellPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    Rs {product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 px-3 py-1 text-sm bg-red-100 text-red-600 font-semibold rounded-md">
                    {Math.round(
                      ((product.labellPrice - product.price) / product.labellPrice) * 100
                    )}
                    % OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  Rs {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity selector */}
            <div className="mt-6 w-full max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-50"
                  onClick={() => setQty((q) => clampQty(q - 1))}
                  aria-label="Decrease quantity"
                >
                  –
                </button>

                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  value={qty}
                  onChange={(e) => setQty(clampQty(e.target.value))}
                  className="w-20 h-10 rounded-lg border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <button
                  type="button"
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-50"
                  onClick={() => setQty((q) => clampQty(q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <span className="ml-4 text-sm text-gray-600">
                  Subtotal:&nbsp;
                  <b>Rs {(product.price * qty).toFixed(2)}</b>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row gap-4 mt-8">
              <button
                className="px-6 py-3 rounded-xl shadow-lg text-white bg-red-700 border border-red-700 hover:bg-white hover:text-red-700 transition-all duration-300"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <button
                className={`px-6 py-3 rounded-xl shadow-lg text-white border transition-all duration-300 ${
                  adding
                    ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                    : "bg-red-500 border-red-500 hover:bg-white hover:text-red-500"
                }`}
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="text-center text-red-600 font-semibold">
          Error loading product. Please try again later.
        </div>
      )}
    </div>
  );
}
