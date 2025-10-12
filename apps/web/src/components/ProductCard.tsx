import React from "react";

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

export default function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 hover:scale-105 transition">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded-xl mb-3"
      />
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-gray-500 text-sm mt-1">${price.toFixed(2)}</p>
      <button
        onClick={onAddToCart}
        className="mt-3 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
      >
        Add to cart
      </button>
    </div>
  );
}
