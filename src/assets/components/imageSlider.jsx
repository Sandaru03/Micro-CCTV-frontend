import { useState } from "react";

export default function ImageSlider({ images }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="w-full max-w-[500px]">
      
      <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={images[activeImageIndex]}
          alt="Product"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      
      <div className="w-full flex flex-row items-center justify-center gap-3 mt-4">
        {images.map((image, index) => (
          <img
            src={image}
            key={index}
            alt={`thumbnail-${index}`}
            className={`w-[80px] h-[80px] rounded-lg object-cover cursor-pointer transition-all duration-200 
              ${
                activeImageIndex === index
                  ? "border-4 border-red-600 scale-105"
                  : "border border-gray-300"
              }`}
            onClick={() => setActiveImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
