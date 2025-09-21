// src/pages/product/ProductOverViewPage.jsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../assets/components/loader";
import axios from "axios";
import ImageSlider from "../../assets/components/imageSlider";
import { addToCart, getCart } from "../../utils/cart";
import { FaStar } from "react-icons/fa";

function getPid(p) {
  return p?.productId || p?._id || p?.id;
}
function clampQty(n) {
  const x = Math.floor(Number(n));
  if (Number.isNaN(x) || x < 1) return 1;
  if (x > 999) return 999;
  return x;
}

export default function ProductOverViewPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  const [adding, setAdding] = useState(false);
  const [qty, setQty] = useState(1);

  // Reviews state
  const [revStatus, setRevStatus] = useState("idle");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- fetch product ---
  useEffect(() => {
    setStatus("loading");
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/products/${params.productId}`)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
        setQty(1);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load product");
        setStatus("error");
      });
  }, [params.productId]);

  // --- fetch reviews ---
  const fetchReviews = useCallback(
    async (pid) => {
      if (!pid) return;
      try {
        setRevStatus("loading");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reviews`, {
          params: { productId: pid },
          headers: { Authorization: "" },
        });
        setReviews(Array.isArray(res.data) ? res.data : []);
        setRevStatus("success");
      } catch (err) {
        console.error("reviews fetch failed:", err?.response || err);
        setRevStatus("error");
      }
    },
    []
  );

  useEffect(() => {
    if (!product) return;
    fetchReviews(getPid(product));
  }, [product, fetchReviews]);

  async function handleAddToCart() {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart(product, qty);
      toast.success("Product added to cart");
      await getCart();
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
            quantity: qty,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image,
          },
        ],
      },
    });
  }

  // --- submit review ---
  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1-5");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        productId: getPid(product),
        rating,
        comment: comment.trim(),
      };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reviews`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchReviews(getPid(product));
      setComment("");
      setRating(5);
      toast.success("Thank you for your review!");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // Helpers
  const discountPct = useMemo(() => {
    if (!product) return 0;
    if (Number(product?.labellPrice) > Number(product?.price)) {
      return Math.round(
        ((product.labellPrice - product.price) / product.labellPrice) * 100
      );
    }
    return 0;
  }, [product]);

  // ✅ availability logic
  const soldOut = useMemo(() => {
    if (!product) return false;
    const stockNum = Number(product.stock ?? 0);
    return !product.isAvailable || stockNum <= 0;
  }, [product]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
        {status === "loading" && (
          <div className="flex justify-center items-center py-16">
            <Loader />
          </div>
        )}

        {status === "success" && product && (
          <>
            <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left: Images */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="w-full max-w-[560px]">
                  <ImageSlider images={product.images || []} />
                </div>
              </div>

              {/* Right: Details */}
              <div className="w-full lg:w-1/2 flex flex-col items-start justify-start lg:pl-6">
                {/* Title + status badge */}
                <div className="flex items-start gap-3 w-full flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {product.name}{" "}
                    {Array.isArray(product.altNames) && product.altNames.length > 0 && (
                      <span className="block sm:inline font-light text-gray-500 text-base sm:text-xl">
                        {product.altNames.join(" | ")}
                      </span>
                    )}
                  </h1>

                  <span
                    className={
                      "px-3 py-1 text-xs sm:text-sm font-semibold rounded-full mt-1 " +
                      (soldOut
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-700")
                    }
                  >
                    {soldOut ? "Out of Stock" : "In Stock"}
                  </span>
                </div>

                {/* Stock line */}
                <div className="mt-2 text-sm text-gray-600">
                  Stock: <b>{Number(product.stock ?? 0)}</b>
                </div>

                <p className="text-gray-700 text-base sm:text-lg mt-3 sm:mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Price */}
                <div className="mt-5 sm:mt-6">
                  {Number(product.labellPrice) > Number(product.price) ? (
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <span className="text-xl sm:text-2xl font-medium text-gray-500 line-through">
                        Rs {Number(product.labellPrice).toFixed(2)}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-red-600">
                        Rs {Number(product.price).toFixed(2)}
                      </span>
                      {discountPct > 0 && (
                        <span className="px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-600 font-semibold rounded-md">
                          {discountPct}% OFF
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Rs {Number(product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="mt-5 sm:mt-6 w-full max-w-sm">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border cursor-pointer border-gray-300 flex items-center justify-center text-lg sm:text-xl hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setQty((q) => clampQty(q - 1))}
                      aria-label="Decrease quantity"
                      disabled={soldOut}
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
                      className="w-16 sm:w-20 h-9 sm:h-10 rounded-lg border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                      disabled={soldOut}
                    />

                    <button
                      type="button"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border cursor-pointer border-gray-300 flex items-center justify-center text-lg sm:text-xl hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setQty((q) => clampQty(q + 1))}
                      aria-label="Increase quantity"
                      disabled={soldOut}
                    >
                      +
                    </button>

                    <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-600">
                      Subtotal:&nbsp;
                      <b>Rs {(Number(product.price) * qty).toFixed(2)}</b>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <button
                    className={
                      "px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-white border transition-all duration-300 " +
                      (soldOut
                        ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                        : "bg-red-700 border-red-700 hover:bg-white hover:text-red-700 cursor-pointer")
                    }
                    onClick={handleBuyNow}
                    disabled={soldOut}
                  >
                    {soldOut ? "Out of Stock" : "Buy Now"}
                  </button>

                  <button
                    className={
                      "px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-white border transition-all duration-300 " +
                      (soldOut || adding
                        ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                        : "bg-red-500 border-red-500 hover:bg-white hover:text-red-500 cursor-pointer")
                    }
                    onClick={handleAddToCart}
                    disabled={soldOut || adding}
                  >
                    {soldOut ? "Unavailable" : adding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>

                {/* Small note when sold out */}
                {soldOut && (
                  <div className="mt-3 text-sm text-gray-600">
                    This item is currently unavailable. Please check back later.
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 sm:mt-8 bg-white shadow-lg rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List */}
                <div className="lg:col-span-2">
                  {revStatus === "loading" ? (
                    <div className="text-gray-500">Loading reviews…</div>
                  ) : revStatus === "error" ? (
                    <div className="text-red-600">Failed to load reviews.</div>
                  ) : reviews.length === 0 ? (
                    <div className="text-gray-500">No reviews yet. Be the first!</div>
                  ) : (
                    <ul className="space-y-4">
                      {reviews.map((r, i) => (
                        <li
                          key={r.id || r._id || i}
                          className="p-4 border rounded-xl hover:shadow-sm transition"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-gray-800">
                              {r.userName || r.user || "Customer"}
                            </div>
                            <ReviewStars value={Number(r.rating) || 0} />
                          </div>
                          <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                            {r.comment}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            {formatDate(r.createdAt)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Form */}
                <div className="lg:col-span-1">
                  <form onSubmit={handleSubmitReview} className="p-4 border rounded-2xl">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <StarPicker value={rating} onChange={setRating} />

                    <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Share your experience…"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`mt-4 w-full px-4 py-2.5 rounded-xl text-white font-semibold transition ${
                        submitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-500 cursor-pointer"
                      }`}
                    >
                      {submitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="text-center text-red-600 font-semibold py-16">
            Error loading product. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- small helpers ---------- */

function ReviewStars({ value = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar
          key={n}
          className={n <= value ? "text-yellow-500" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="p-1"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          title={`${n} star${n > 1 ? "s" : ""}`}
        >
          <FaStar className={n <= value ? "text-yellow-500" : "text-gray-300"} size={22} />
        </button>
      ))}
    </div>
  );
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (String(dt) === "Invalid Date") return "";
  return dt.toLocaleDateString();
}
