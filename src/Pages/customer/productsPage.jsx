import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "../../assets/components/loader";
import ProductCard from "../../assets/components/productCard";
import { HiAdjustments, HiX } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";

const CATEGORY_MAP = {
  all: "All",
  cctv1: "CCTV Camera",
  cctv2: "Accessories",
  cctv3: "Package",
};

const CATEGORIES = ["all", "cctv1", "cctv2", "cctv3"];
const getCategoryLabel = (key) => CATEGORY_MAP[key?.toLowerCase()] || key;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  // Search & filters
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mobile filter drawer
  const [filtersOpen, setFiltersOpen] = useState(false);

  // 🔧 measure mobile top bar height to keep drawer below it
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
    // re-measure when opening drawer (or when controls inside change height)
    if (filtersOpen) {
      requestAnimationFrame(measureTopbar);
    }
  }, [filtersOpen, query, sort]);

  // Fetch products
  async function fetchProducts(searchTerm = "") {
    try {
      setStatus("loading");
      let res;
      if (!searchTerm.trim()) {
        res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/products");
      } else {
        res = await axios.get(
          import.meta.env.VITE_BACKEND_URL +
            "/products/search/" +
            encodeURIComponent(searchTerm.trim())
        );
      }
      setProducts(res.data || []);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    fetchProducts("");
  }, []);

  // Derived  per category
  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const c = (p.category || "uncategorized").toLowerCase();
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Price guard
  const [lo, hi] = useMemo(() => {
    const a = Number(minPrice) || 0;
    const b = Number(maxPrice) || 0;
    return a <= b ? [a, b] : [b, a];
  }, [minPrice, maxPrice]);

  // Client-side filter + sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name || "").toLowerCase().includes(q));
    }
    list = list.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= lo && price <= hi;
    });
    if (categoryFilter !== "all") {
      list = list.filter(
        (p) => (p.category || "").toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    list.sort((a, b) => {
      if (sort === "latest") {
        const ida = Number(a.productId || 0);
        const idb = Number(b.productId || 0);
        return idb - ida;
      }
      if (sort === "price-low-high")
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sort === "price-high-low")
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      return 0;
    });

    return list;
  }, [products, query, lo, hi, categoryFilter, sort]);

  // Quick price presets (buttons)
  const pricePresets = [
    { label: "Under 10k", min: 0, max: 10000 },
    { label: "10k – 25k", min: 10000, max: 25000 },
    { label: "25k – 50k", min: 25000, max: 50000 },
  ];

  function applyPreset(p) {
    setMinPrice(p.min);
    setMaxPrice(p.max);
  }

  function resetFilters() {
    setQuery("");
    setMinPrice(0);
    setMaxPrice(50000);
    setSort("latest");
    setCategoryFilter("all");
    fetchProducts("");
  }

  const activeBtn =
    "w-full text-left px-3 py-2 rounded-xl bg-red-600 text-white shadow-sm hover:bg-red-700 transition";
  const idleBtn =
    "w-full text-left px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition";

  //Filters panel (shared by desktop sidebar + mobile drawer)
  function FiltersPanel() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <span className="block text-2xl font-extrabold text-gray-900">Shop</span>
          <p className="text-sm text-gray-500">Find your products</p>
        </div>

        {/* Search (server + client) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchProducts(query);
              }}
              placeholder="Search products..."
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
            />
            <button
              onClick={() => fetchProducts(query)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition cursor-pointer"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </div>
          {query && (
            <button
              onClick={() => {
                setQuery("");
                fetchProducts("");
              }}
              className="text-xs text-gray-600 hover:text-red-600 transition cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Filter by price</label>
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

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">Product categories</label>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((c) => {
              const active = categoryFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={active ? activeBtn : idleBtn}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <span className="capitalize">{getCategoryLabel(c)}</span>
                    {c !== "all" && (
                      <span
                        className={
                          "text-xs px-2 py-0.5 rounded-full " +
                          (active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700")
                        }
                      >
                        {categoryCounts[c] || 0}
                      </span>
                    )}
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

  // ---------------------------- UI ---------------------------------
  return (
    <div className="w-full min-h-screen flex bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-[300px] xl:w-[320px] min-h-screen border-r bg-gray-50/80 backdrop-blur-sm">
        <div className="h-[100dvh] sticky top-0 p-6 overflow-y-auto">
          <FiltersPanel />
        </div>
      </aside>

      {/* Right side */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Mobile top bar: search (quick) + filters + sort */}
        <div
          ref={topbarRef}
          className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur border-b"
        >
          <div className="p-4 flex flex-col gap-3">
            {/* quick search */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 border rounded-xl px-3 py-2">
                <FaSearch className="opacity-70" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchProducts(query)}
                  placeholder="Search products..."
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => {
                  measureTopbar();
                  setFiltersOpen(true);
                }}
                className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white hover:bg-gray-50"
              >
                <HiAdjustments />
                <span className="text-sm">Filters</span>
              </button>
            </div>

            {/* sort + count */}
            <div className="flex items-center justify-between gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-xl px-3 py-2 flex-1"
              >
                <option value="latest">Sort by latest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {status === "loading" ? (
          <div className="w-full h-[60dvh] flex items-center justify-center p-6">
            <Loader />
          </div>
        ) : status === "error" ? (
          <div className="w-full h-[60dvh] flex items-center justify-center p-6">
            <p className="text-red-600 font-medium">Failed to load products. Try again.</p>
          </div>
        ) : (
          <div className="w-full p-4 md:p-6">
            {/* Desktop sort + count row */}
            <div className="hidden md:flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border rounded-xl px-3 py-2 cursor-pointer outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600"
                >
                  <option value="latest">Sort by latest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                <span className="px-2 py-1 rounded-full bg-gray-100">
                  {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* Responsive grid */}
            <div
              className="
                grid gap-4 sm:gap-5
                grid-cols-2
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productId || product._id || product.id}
                    product={product}
                  />
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center py-16">
                  <p className="text-gray-600">No products found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile filters drawer — now starts below the header */}
      {filtersOpen && (
        <div
          className="md:hidden fixed left-0 right-0 z-30"
          style={{ top: topOffset, bottom: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-gray-50 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold">Filters</span>
              <button
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border hover:bg-gray-50"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <HiX size={18} />
              </button>
            </div>
            <FiltersPanel />
          </div>
        </div>
      )}
    </div>
  );
}
