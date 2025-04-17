import React from "react";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { toast } from "react-toastify";

const ProductList = ({ products, onDelete, onUpdate, isAdmin = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-center w-full">Exhibitions</h1>
        {isAdmin && (
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ml-4 whitespace-nowrap"
          >
            Add New Exhibition
          </button>
        )}
      </div>
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
                className="border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-100 transition text-sm flex items-center gap-1"
              >
                 <RiDeleteBin6Line />
                Delete
              </button>
              <button
                onClick={() => onUpdate(product)}
                className="border border-orange-500 text-orange-500 px-2 py-1 rounded hover:bg-orange-100 transition text-sm flex items-center gap-1"
              >
                <RxUpdate />
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
