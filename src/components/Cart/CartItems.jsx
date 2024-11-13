import React from 'react';
import { Plus, Minus, Trash } from 'lucide-react';

const CartItem = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <h4 className="text-lg font-semibold">{item.name}</h4>
        <div className="flex items-center ml-4">
          <button onClick={() => onDecrement(item)} className="px-2">
            <Minus className="w-5 h-5" />
          </button>
          <span className="px-2">{item.quantity}</span>
          <button onClick={() => onIncrement(item)} className="px-2">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-700">
        <Trash className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CartItem;
