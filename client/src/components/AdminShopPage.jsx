import { useEffect, useState } from "react";
import axios from "axios";
import ImageUpload from "./CloudinaryUpload"; 

const AdminShopPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    keywords: "",
    stock: "",
    images: [],
  });

  const getProducts = () => {
    axios
      .get("http://localhost:3050/shop")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (imageUrls) => {
    setForm({ ...form, images: imageUrls }); // Update the form state with image URLs
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()),
        images: form.images,
      };
      await axios.post("http://localhost:3050/shop/products/add", payload);
      getProducts();
      setForm({
        title: "",
        price: "",
        category: "",
        description: "",
        keywords: "",
        stock: "",
        images: [],
      });
    } catch (err) {
      console.error("Add product error", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3050/shop/products/delete/${id}`);
      getProducts();
      console.log("Product deleted Successfully");
      
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Product Management</h1>

      {/* Add Product Form */}
      <form onSubmit={addProduct} className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow">
        {["title", "price", "category", "description", "keywords", "stock"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="p-2 border rounded"
          />
        ))}

        {/* Image Upload Component */}
        <div className="md:col-span-2">
          <ImageUpload onImagesUploaded={handleImageUpload} />
        </div>

        <button type="submit" className="md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow relative">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="text-green-600 font-bold">${product.price}</p>


            <div className="flex justify-between mt-4">
              <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline">
                Delete
              </button>
              {/* Optionally, add an edit modal or inline edit form here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShopPage;
