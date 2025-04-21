import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import AddToCart from "./AddToCart"; // Make sure path is correct

const ProductList = ({ products }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="text-3xl font-semibold text-center w-full">Shop</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-xl overflow-hidden hover:shadow-md transition duration-200 relative flex flex-col"
          >
            <Link to={`/product/${product._id}`} className="flex-1">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 text-sm">
                  {product.description?.slice(0, 100)}...
                </p>
                <p className="mt-2 text-lg font-bold">{`${product.price}€`}</p>
              </div>
            </Link>

            {/* Add To Cart or Out of Stock */}
            {product.stock > 0 ? (
              <div className="absolute bottom-4 right-4">
                <AddToCart product={product} showLabel={false} />
              </div>
            ) : (
              <div className="absolute bottom-4 right-4 flex items-center bg-gray-500 text-white py-2 px-4 rounded-full">
                <FaExclamationCircle className="mr-2 text-yellow-400" />
                Out of Stock
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
