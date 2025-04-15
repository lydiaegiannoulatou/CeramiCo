import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminShopPage from "../components/AdminShopPage"; 

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(""); // Holds the user's role (admin or user)

  // Fetch products and user role when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));

    // Check user role from localStorage
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  // If the user is an admin, render the admin view (AdminShopPage)
  if (userRole === "admin") {
    return <AdminShopPage />;
  }

  // Otherwise, render the regular product list for non-admin users
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded" />
            <Link to={`/product/${product._id}`} className="text-xl font-semibold mt-2 block">
              {product.title}
            </Link>
            <p className="text-green-600 font-bold">{product.price}€</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
