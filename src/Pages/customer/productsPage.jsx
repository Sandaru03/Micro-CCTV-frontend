// src/pages/product/ProductsPage.jsx
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "../../assets/components/loader";
import ProductCard from "../../assets/components/productCard";
import { HiX } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";

const CATEGORY_MAP = {
  all: "All",
  cctv1: "CCTV Camera",
  cctv2: "Accessories",
  cctv3: "Package",
};

const CATEGORIES = ["all", "cctv1", "cctv2", "cctv3"];
const getCategoryLabel = (key) => CATEGORY_MAP[key?.toLowerCase()] || key;

function isSoldOut(p) {
  const stockNum = Number(p?.stock ?? 0);
  return !p?.isAvailable || stockNum <= 0;
}

function createdTimeMs(p) {
  if (p?.createdAt) {
    const t = Date.parse(p.createdAt);
    if (!Number.isNaN(t)) return t;
  }
  const id = String(p?._id || "");
  if (id.length >= 8) {
    const seconds = parseInt(id.substring(0, 8), 16);
    if (!Number.isNaN(seconds)) return seconds * 1000;
  }
  return 0;
}

export default function ProductsPage({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  // Filters
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 15;

  // Mobile filter drawer
  const [filtersOpen, setFiltersOpen] = useState(false);

  const topbarRef = useRef(null);
  const [topOffset, setTopOffset] = useState(0);

  const measureTopbar = () => {
    const h = topbarRef.current?.getBoundingClientRect()?.height || 0;
    setTopOffset(h);
  };

  useEffect(() => {
    measureTopbar();
    const onResize = () => measureTopbar();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (filtersOpen) requestAnimationFrame(measureTopbar);
  }, [filtersOpen, query, sort]);

  async function fetchProducts(searchTerm = "") {
    try {
      setStatus("loading");
      let res;
      if (!searchTerm.trim()) {
        res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products?includeUnavailable=true`
        );
      } else {
        res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/search/${encodeURIComponent(
            searchTerm.trim()
          )}?includeUnavailable=true`
        );
      }
      setProducts(res.data || []);
      setStatus("success");
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    fetchProducts("");
  }, []);

  useEffect(() => {
    if (refreshTrigger) fetchProducts(query);
  }, [refreshTrigger]); // eslint-disable-line

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const c = (p.category || "uncategorized").toLowerCase();
      counts[c] = (counts[c] || 0) + 1;
    });
    counts["all"] = products.length;
    return counts;
  }, [products]);

  const [lo, hi] = useMemo(() => {
    const a = Number(minPrice) || 0;
    const b = Number(maxPrice) || 0;
    return a <= b ? [a, b] : [b, a];
  }, [minPrice, maxPrice]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categoryFilter !== "all") {
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => {
        const nameHit = (p.name || "").toLowerCase().includes(q);
        const altHit = Array.isArray(p.altNames)
          ? p.altNames.some((a) => (a || "").toLowerCase().includes(q))
          : false;
        return nameHit || altHit;
      });
    }

    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= lo && price <= hi;
    });

    const inStock = [];
    const outOfStock = [];
    for (const p of list) {
      if (isSoldOut(p)) outOfStock.push(p);
      else inStock.push(p);
    }

    if (sort === "latest") {
      inStock.sort((a, b) => createdTimeMs(b) - createdTimeMs(a));
      outOfStock.sort((a, b) => createdTimeMs(b) - createdTimeMs(a));
      return [...inStock, ...outOfStock];
    }

    if (sort === "price-low-high") {
      inStock.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      outOfStock.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      return [...inStock, ...outOfStock];
    }

    if (sort === "price-high-low") {
      inStock.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      outOfStock.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      return [...inStock, ...outOfStock];
    }

    return [...inStock, ...outOfStock];
  }, [products, query, lo, hi, categoryFilter, sort]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setQuery("");
    setMinPrice(0);
    setMaxPrice(50000);
    setSort("latest");
    setCategoryFilter("all");
    setCurrentPage(1);
    fetchProducts("");
  };

  const pricePresets = [
    { label: "Under 10k", min: 0, max: 10000 },
    { label: "10k – 25k", min: 10000, max: 25000 },
    { label: "25k – 50k", min: 25000, max: 50000 },
  ];
  const applyPreset = (p) => {
    setMinPrice(p.min);
    setMaxPrice(p.max);
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen flex bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[300px] xl:w-[320px] min-h-screen border-r bg-gray-50/80 backdrop-blur-sm">
        <div className="h-[100dvh] sticky top-0 p-6 overflow-y-auto">
          <FiltersPanel />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Mobile top bar with filter + sort button */}
        <div
          ref={topbarRef}
          className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur border-b flex items-center justify-between px-4 py-3"
        >
          <span className="font-bold text-lg">Shop</span>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-xl px-3 py-2 text-sm"
            >
              <option value="latest">Latest</option>
              <option value="price-low-high">Price: Low → High</option>
              <option value="price-high-low">Price: High → Low</option>
            </select>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition"
            >
              <FiFilter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {status === "loading" ? (
          <div className="w-full h-[60dvh] flex items-center justify-center p-6">
            <Loader />
          </div>
        ) : status === "error" ? (
          <div className="w-full h-[60dvh] flex items-center justify-center p-6">
            <p className="text-red-600 font-medium">
              Failed to load products. Try again.
            </p>
          </div>
        ) : (
          <div className="w-full p-4 md:p-6">
            {/* Desktop sort + count row */}
            <div className="hidden md:flex items-center justify-between gap-3 mb-4">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-xl px-3 py-2"
              >
                <option value="latest">Sort by latest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
              <span className="text-sm text-gray-600 px-2 py-1 rounded-full bg-gray-100">
                {filteredProducts.length} result
                {filteredProducts.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Product grid */}
            <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => {
                  const soldOut = isSoldOut(product);
                  return (
                    <div
                      key={product.productId || product._id || product.id}
                      className="relative"
                    >
                      <ProductCard product={product} />
                      {soldOut && (
                        <span className="absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-semibold bg-gray-900/90 text-white">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex items-center justify-center py-16">
                  <p className="text-gray-600">No products found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-6 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 rounded ${
                      currentPage === p
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div
          className="md:hidden fixed left-0 right-0 z-30"
          style={{ top: topOffset, bottom: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-gray-50 shadow-2xl p-6 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Filters</span>
            </div>
            <FiltersPanel />
            {/* Close button moved down */}
            <div className="mt-6">
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                onClick={() => setFiltersOpen(false)}
              >
                <HiX size={18} /> Close Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function FiltersPanel() {
    return (
      <div className="flex flex-col gap-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchProducts(query);
                  setCurrentPage(1);
                }
              }}
              placeholder="Search products..."
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
            />
            <button
              onClick={() => {
                fetchProducts(query);
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition cursor-pointer"
            >
              <FaSearch />
            </button>
          </div>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                fetchProducts("");
                setCurrentPage(1);
              }}
              className="text-xs text-gray-600 hover:text-red-600 transition cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Price filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Filter by price
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-1/2 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
              placeholder="Min"
            />
            <input
              type="number"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-1/2 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
              placeholder="Max"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {pricePresets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white transition cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Current:{" "}
            <span className="font-medium text-gray-700">
              Rs.{lo.toLocaleString()} – Rs.{hi.toLocaleString()}
            </span>
          </p>
        </div>

        {/* Product categories */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Product categories
          </label>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((c) => {
              const active = categoryFilter === c;
              const clsActive =
                "w-full text-left px-3 py-2 rounded-xl bg-red-600 text-white shadow-sm hover:bg-red-700 transition";
              const clsIdle =
                "w-full text-left px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition";
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCategoryFilter(c);
                    setCurrentPage(1);
                  }}
                  className={active ? clsActive : clsIdle}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <span className="capitalize">{getCategoryLabel(c)}</span>
                    <span
                      className={
                        "text-xs px-2 py-0.5 rounded-full " +
                        (active
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700")
                      }
                    >
                      {categoryCounts[c] || 0}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="pt-2">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-[0.99] transition cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      </div>
    );
  }
}
