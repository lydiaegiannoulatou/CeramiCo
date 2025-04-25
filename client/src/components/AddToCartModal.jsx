import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';

const AddToCartModal = ({ isOpen, onClose, product, type = "product", onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && (type === "workshop" || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = () => {
    onAddToCart(product._id, quantity, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#f7f4ea] rounded-2xl p-6 max-w-md w-full mx-4 relative transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#713818] hover:text-[#5a2c14] transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="flex items-center mb-6">
          <ShoppingCart className="text-[#713818] mr-3" size={24} />
          <h2 className="text-2xl font-serif text-[#713818]">Add to Cart</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={product.images?.[0] || "/placeholder-image.jpg"}
              alt={product.title || product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium text-[#5b3b20]">{product.title || product.name}</h3>
              <p className="text-[#3f612d] font-semibold">€{product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#eee6d2] p-4 rounded-lg">
            <span className="text-[#5b3b20]">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5 rounded-full text-[#713818] hover:bg-[#e5dbc5] disabled:opacity-30 transition-all duration-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium text-[#5b3b20]">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={type === "product" && quantity >= product.stock}
                className="p-1.5 rounded-full text-[#713818] hover:bg-[#e5dbc5] disabled:opacity-30 transition-all duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 p-3 bg-[#f0ece0] rounded-lg">
          <span className="text-[#5b3b20]">Total:</span>
          <span className="text-[#3f612d] font-bold">€{(product.price * quantity).toFixed(2)}</span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#713818] text-white py-3 rounded-xl font-medium hover:bg-[#5a2c14] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;