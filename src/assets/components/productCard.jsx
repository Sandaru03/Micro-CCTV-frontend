import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imgSrc =
    Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : null;

  const hasDiscount =
    typeof product?.labellPrice === "number" &&
    typeof product?.price === "number" &&
    product.labellPrice > product.price;

  const discountPct = hasDiscount
    ? Math.round(((product.labellPrice - product.price) / product.labellPrice) * 100)
    : 0;

  return (
    <Link
      to={`/overview/${product.productId}`}
      className="
        group block w-full h-full
        rounded-2xl border bg-white shadow-sm hover:shadow-md
        transition transform hover:-translate-y-1
        overflow-hidden
      "
    >
      {/* media */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product?.name || "Product image"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm">No image</span>
          </div>
        )}

        {hasDiscount && (
          <span
            className="
              absolute top-2 left-2 text-[11px] font-semibold
              px-2 py-1 rounded-full
              bg-red-600 text-white
            "
          >
            -{discountPct}%
          </span>
        )}
      </div>

      {/* content */}
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        <h2 className="text-sm sm:text-base font-semibold line-clamp-2">
          {product?.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {product?.description}
        </p>

        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          {hasDiscount && (
            // Hide old (label) price on mobile; show from md and up
            <span className="hidden md:inline text-sm line-through text-gray-400">
              Rs.{product.labellPrice.toFixed(2)}
            </span>
          )}
          <span className="text-base sm:text-lg font-bold text-red-600">
            Rs.{Number(product?.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
