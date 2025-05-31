import  { useState } from 'react';
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-[#2F4138]/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-[#2F4138]/10 transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[#2F4138] hover:text-[#3C685A] transition-colors duration-200 hover:bg-[#2F4138]/5 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex items-center mb-8">
          <ShoppingCart className="text-[#3C685A] mr-3" size={24} />
          <h2 className="text-2xl font-display text-[#2F4138]">Add to Cart</h2>
        </div>

        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-[#2F4138]/10">
              <img
                src={product.images?.[0] || "/placeholder-image.jpg"}
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#2F4138] mb-2">
                {product.title || product.name}
              </h3>
              <p className="text-xl font-light text-[#3C685A]">
                €{product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-[#f5f2eb] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#2F4138] font-medium">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#2F4138] hover:bg-[#2F4138] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#2F4138] transition-all duration-200 border border-[#2F4138]/10"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium text-[#2F4138]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={type === "product" && quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#2F4138] hover:bg-[#2F4138] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#2F4138] transition-all duration-200 border border-[#2F4138]/10"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            {type === "product" && (
              <p className="text-sm text-[#5C6760]">
                {product.stock} items available
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 p-4 bg-[#f5f2eb] rounded-xl">
          <span className="text-[#2F4138] font-medium">Total</span>
          <span className="text-xl font-medium text-[#3C685A]">
            €{(product.price * quantity).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#2F4138] text-white py-4 rounded-xl font-medium hover:bg-[#3C685A] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
