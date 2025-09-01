import { Link } from "react-router-dom";

export default function ProductCard({ product }) {

    return (
        <Link to={"/overview/"+product.productId}  className="w-[250px] h-[350px] bg-white border shadow-lg rounded-2xl p-4 flex flex-col">
            <div className="w-full h-[180px] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img 
                    src={product.images[0]} className="w-full h-full object-cover"
                    alt={product.name}
                />
            </div>
            <h2 className="text-lg font-bold text-[18px] line-clamp-2">{product.name}</h2>
            <p className="text-gray-600 text-sm flex-1 line-clamp-2">{product.description}</p>
            <div>
                {
                    product.labellPrice > product.price ? (
                    <p>
                        <span className="line-through  mr-[10px] text-red-600 font-bold">{product.labellPrice.toFixed(2)}</span>
                        <span className="text-red-600 font-bold">{product.price.toFixed(2)}</span>
                    </p> ) : (<span className="text-red-600 font-bold">{product.price.toFixed(2)}</span>)
                }
            </div>
        </Link>
    )
}