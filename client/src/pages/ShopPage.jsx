import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminShopPage from "../components/AdminShopPage"; 

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("");

  // Fetch products from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));

    // Check the user's role 
    const role = localStorage.getItem("role"); 
    setUserRole(role); 
  }, []);

  if (userRole === "admin") {
    return <AdminShopPage />;
  }

  // If not an admin, render the regular products page
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
