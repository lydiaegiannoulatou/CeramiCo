import React from "react";
import { Link } from "react-router-dom";

const ProductList = ({ products, onDelete, onUpdate, isAdmin = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded-lg shadow relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-48 object-cover rounded"
          />
          <Link to={`/product/${product._id}`} className="text-xl font-semibold mt-2 block">
            {product.title}
          </Link>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-green-600 font-bold">{product.price}€</p>

          {isAdmin && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => onDelete(product._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
              <button
                onClick={() => onUpdate(product)}
                className="text-blue-600 hover:underline"
              >
                Update
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
