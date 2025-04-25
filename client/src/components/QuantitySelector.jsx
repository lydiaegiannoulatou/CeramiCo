import React from "react";
import { Plus, Minus } from "lucide-react";

const QuantitySelector = ({
  quantity,
  setQuantity,
  min = 1,
  max,
  label = "Quantity"
}) => {
  const decrement = () => {
    if (quantity > min) {
      setQuantity(quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    
    if (isNaN(value)) {
      setQuantity(min);
    } else if (value < min) {
      setQuantity(min);
    } else if (value > max) {
      setQuantity(max);
    } else {
      setQuantity(value);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-[#5b3b20] text-sm font-medium">{label}</label>
      <div className="flex items-center">
        <button
          onClick={decrement}
          disabled={quantity <= min}
          className={`h-10 w-10 flex items-center justify-center rounded-l-md border border-r-0 border-[#d3c5b0] transition-colors ${
            quantity <= min
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-[#5b3b20] bg-[#f1e8d8] hover:bg-[#e6dbc8] active:bg-[#d3c5b0]"
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={handleChange}
          className="h-10 w-12 border-y border-[#d3c5b0] text-center focus:outline-none text-[#5b3b20]"
          aria-label="Quantity"
        />
        <button
          onClick={increment}
          disabled={quantity >= max}
          className={`h-10 w-10 flex items-center justify-center rounded-r-md border border-l-0 border-[#d3c5b0] transition-colors ${
            quantity >= max
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-[#5b3b20] bg-[#f1e8d8] hover:bg-[#e6dbc8] active:bg-[#d3c5b0]"
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="text-xs text-[#8a7563]">
        {max > 0 ? (
          <span>
            {max} {max === 1 ? "item" : "items"} available
          </span>
        ) : (
          <span className="text-red-500">Out of stock</span>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;