// src/pages/product/ProductAdminPage.jsx
import { useEffect, useMemo, useState } from "react";
import { BiTrash, BiEditAlt } from "react-icons/bi";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../assets/components/loader";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// Derive a reliable created time for sorting:
// 1) Prefer createdAt (if you enabled timestamps in Mongoose)
// 2) Else, fallback to ObjectId's timestamp
function createdTimeMs(p) {
  // 1) createdAt support
  if (p?.createdAt) {
    const t = Date.parse(p.createdAt);
    if (!Number.isNaN(t)) return t;
  }
  // 2) _id fallback (ObjectId -> first 8 hex digits = seconds since epoch)
  const id = String(p?._id || "");
  if (id.length >= 8) {
    const seconds = parseInt(id.substring(0, 8), 16);
    if (!Number.isNaN(seconds)) return seconds * 1000;
  }
  // 3) last resort: 0
  return 0;
}

export default function ProductAdminPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // filters
  const [onlyUnavailable, setOnlyUnavailable] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest"); // "latest" | "oldest"

  const navigate = useNavigate();

  // fetch all (include unavailable) for admin
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchAll() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/products?includeUnavailable=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setProducts(list);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load products");
        setIsLoading(false);
      });
  }

  function refresh() {
    fetchAll();
  }

  // filter first (optional)
  const filtered = useMemo(() => {
    if (!onlyUnavailable) return products;
    return products.filter(
      (p) => !p?.isAvailable || Number(p?.stock ?? 0) <= 0
    );
  }, [products, onlyUnavailable]);

  // sort with robust “latest first” logic
  const shown = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const ta = createdTimeMs(a);
      const tb = createdTimeMs(b);
      if (sortOrder === "latest") return tb - ta; // newest at top
      return ta - tb; // oldest at top
    });
    return arr;
  }, [filtered, sortOrder]);

  return (
    <div className="w-full h-full p-6 bg-gray-50">
      {/* Header / Filters Row */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Sort:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white text-sm cursor-pointer"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={onlyUnavailable}
            onChange={(e) => setOnlyUnavailable(e.target.checked)}
          />
          Show only Out of Stock / Unavailable
        </label>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white">
          <table className="w-full text-left border-collapse">
            {/* Table Head */}
            <thead>
              <tr className="bg-gray-800 text-white text-sm uppercase">
                <th className="p-4">Image</th>
                <th className="p-4">Product ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Label Price</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {shown.map((product) => {
                const img =
                  product?.images?.[0] || product?.image || "/defult-product.jpg";
                const stockNum = Number(product?.stock ?? 0);
                const available = !!product?.isAvailable && stockNum > 0;

                return (
                  <tr
                    key={product.productId || product._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Image */}
                    <td className="p-4">
                      <img
                        src={img}
                        alt={product?.name || "product image"}
                        className="w-12 h-12 rounded-lg object-cover shadow"
                      />
                    </td>

                    {/* Product ID */}
                    <td className="p-4 text-gray-700">{product.productId}</td>

                    {/* Product Name */}
                    <td className="p-4 font-medium text-gray-900">
                      {product.name}
                    </td>

                    {/* Label Price */}
                    <td className="p-4 text-gray-500">
                      Rs {Number(product.labellPrice).toFixed(2)}
                    </td>

                    {/* Price */}
                    <td className="p-4 text-red-600 font-semibold">
                      Rs {Number(product.price).toFixed(2)}
                    </td>

                    {/* Stock */}
                    <td
                      className={classNames(
                        "p-4 font-medium",
                        stockNum > 0
                          ? "text-green-600"
                          : "text-red-600 font-semibold"
                      )}
                    >
                      {stockNum}
                    </td>

                    {/* Availability */}
                    <td className="p-4">
                      <span
                        className={classNames(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        )}
                        title={
                          product.isAvailable
                            ? stockNum > 0
                              ? "In Stock"
                              : "Out of Stock (zero stock)"
                            : "Marked as Unavailable"
                        }
                      >
                        {available ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-gray-700">{product.category}</td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Delete */}
                        <BiTrash
                          className="bg-red-600 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-red-700 transition"
                          onClick={() => {
                            const token = localStorage.getItem("token");
                            if (!token) {
                              navigate("/login");
                              return;
                            }

                            if (
                              !confirm(
                                `Delete product ${product.productId}? This cannot be undone.`
                              )
                            ) {
                              return;
                            }

                            axios
                              .delete(
                                `${import.meta.env.VITE_BACKEND_URL}/products/${product.productId}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              )
                              .then(() => {
                                toast.success("Product Deleted Successfully");
                                refresh();
                              })
                              .catch((error) => {
                                console.error("Error deleting product:", error);
                                toast.error("Failed to delete product");
                              });
                          }}
                        />

                        {/* Edit */}
                        <BiEditAlt
                          onClick={() => {
                            navigate("/admin/updateproduct", {
                              state: product,
                            });
                          }}
                          className="bg-gray-700 p-2 text-3xl rounded-full text-white shadow cursor-pointer hover:bg-gray-900 transition"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="p-8 text-center text-gray-500 text-sm"
                  >
                    No products to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add new product */}
      <Link
        to={"/admin/newproduct"}
        className="fixed right-10 bottom-10 text-white bg-black p-3 rounded-full shadow-lg hover:bg-gray-800 transition"
        title="Add New Product"
      >
        <HiMiniPlusCircle className="text-5xl" />
      </Link>
    </div>
  );
}
