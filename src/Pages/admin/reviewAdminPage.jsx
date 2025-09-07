import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiRefreshCcw, FiSearch } from "react-icons/fi";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function ReviewsAdminPage() {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest | rating-desc | rating-asc
  const navigate = useNavigate();

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login as admin");
      navigate("/login");
      return;
    }
    try {
      setStatus("loading");
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/reviews/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(Array.isArray(res.data) ? res.data : []);
      setStatus("success");
    } catch (err) {
      console.error(err);
      const code = err?.response?.status;
      if (code === 401 || code === 403) {
        toast.error("Not authorized");
        navigate("/login");
      } else {
        toast.error("Failed to load reviews");
      }
      setStatus("error");
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + `/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete review");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...reviews];
    if (q) {
      list = list.filter((r) => {
        const pid = (r.productId || "").toLowerCase();
        const user = (r.userName || r.user || "").toLowerCase();
        const c = (r.comment || "").toLowerCase();
        return pid.includes(q) || user.includes(q) || c.includes(q);
      });
    }
    list.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sort === "rating-desc") return (b.rating || 0) - (a.rating || 0);
      if (sort === "rating-asc") return (a.rating || 0) - (b.rating || 0);
      return 0;
    });
    return list;
  }, [reviews, query, sort]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reviews</h1>
          <p className="text-sm text-slate-500">View, search and manage customer reviews.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border px-2 py-1.5 bg-white">
            <FiSearch className="opacity-70" />
            <input
              className="outline-none text-sm bg-transparent"
              placeholder="Search productId / user / text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border px-3 py-1.5 text-sm bg-white cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="rating-desc">Rating: High → Low</option>
            <option value="rating-asc">Rating: Low → High</option>
          </select>

          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm bg-white hover:bg-slate-50 cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCcw />
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      {status === "loading" ? (
        <div className="rounded-2xl border p-6 text-slate-500">Loading…</div>
      ) : status === "error" ? (
        <div className="rounded-2xl border p-6 text-red-600">Failed to load reviews.</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border p-6 text-slate-500">No reviews found.</div>
      ) : (
        <>
          {/* Table (desktop) */}
          <div className="hidden md:block rounded-2xl border overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Rating</th>
                  <th className="text-left px-4 py-3">Comment</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const id = r._id || r.id;
                  return (
                    <tr key={id} className="border-t">
                      <td className="px-4 py-3">{fmtDate(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`/overview/${r.productId}`}
                          className="text-blue-600 hover:underline break-all"
                          target="_blank"
                          rel="noreferrer"
                          title="Open product"
                        >
                          {r.productId}
                        </a>
                      </td>
                      <td className="px-4 py-3">{r.userName || r.user || "Customer"}</td>
                      <td className="px-4 py-3">
                        <Stars value={Number(r.rating) || 0} />
                      </td>
                      <td className="px-4 py-3 max-w-[520px]">
                        <span className="line-clamp-2 text-slate-700">{r.comment}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDelete(id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500"
                            title="Delete"
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards (mobile) */}
          <div className="md:hidden space-y-3">
            {filtered.map((r) => {
              const id = r._id || r.id;
              return (
                <div key={id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">{fmtDate(r.createdAt)}</div>
                    <Stars value={Number(r.rating) || 0} />
                  </div>
                  <div className="mt-1 font-semibold">{r.userName || r.user || "Customer"}</div>
                  <div className="mt-1">
                    <a
                      href={`/overview/${r.productId}`}
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.productId}
                    </a>
                  </div>
                  <div className="mt-2 text-slate-700 whitespace-pre-wrap">{r.comment}</div>

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleDelete(id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500"
                      title="Delete"
                    >
                      <RiDeleteBin5Fill />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Stars({ value = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <FaStar key={n} className={n <= value ? "text-yellow-500" : "text-slate-300"} />
      ))}
    </div>
  );
}

function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d);
  if (String(dt) === "Invalid Date") return "-";
  return dt.toLocaleString();
}
