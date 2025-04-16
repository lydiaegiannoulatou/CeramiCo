import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminShopPage from "../components/AdminShopPage";
import AddToCart from "../components/AddToCart";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  if (userRole === "admin") {
    return <AdminShopPage />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative border p-4 rounded-lg shadow hover:shadow-md transition h-full flex flex-col"
          >
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <div className="flex-1">
              <Link
                to={`/product/${product._id}`}
                className="text-xl font-semibold block mb-2"
              >
                {product.title}
              </Link>
              <p className="text-green-600 font-bold">{product.price}€</p>
            </div>

            {/* Add to Cart Button at bottom right */}
            <div className="absolute bottom-4 right-4">
              <AddToCart productId={product._id} userRole={userRole} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
