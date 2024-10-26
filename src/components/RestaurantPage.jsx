import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Mock data
const restaurants = [
  { id: 1, name: 'Indian Coffee House', cuisines: ['South Indian', 'North Indian'], rating: 4.2, deliveryTime: '45-50 mins' },
  { id: 2, name: 'The Fusion Lounge', cuisines: ['North Indian', 'South Indian', 'Chinese'], rating: 4.0, deliveryTime: '60-65 mins' },
];

const menuItems = [
  { id: 1, name: 'Hot Coffee', price: 36, rating: 5.0, description: 'A rich and invigorating blend.' },
  { id: 2, name: 'Paneer Chilli Dosa', price: 216, rating: 4.5, description: 'A fusion dish combining the crispiness of dosa with spicy paneer filling.' },
];

function RestaurantPage() {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === parseInt(id));

  // State to manage quantity and visibility of controls
  const [cart, setCart] = useState({});
  const [showControls, setShowControls] = useState({}); // Track visibility for each item

  const handleAddToCart = (item) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1, // Increment quantity
    }));
    setShowControls(prev => ({ ...prev, [item.id]: true })); // Show controls after adding
  };

  const handleIncrement = (item) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1, // Increment quantity
    }));
  };

  const handleDecrement = (item) => {
    setCart(prevCart => {
      const newQuantity = (prevCart[item.id] || 0) - 1;
      return {
        ...prevCart,
        [item.id]: Math.max(newQuantity, 0), // Decrement quantity but not below zero
      };
    });
  };

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">{restaurant.name}</h2>
      <div className="flex items-center mb-6">
        <p className="text-gray-600 mr-4">{restaurant.cuisines.join(', ')}</p>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">{restaurant.rating} ★</span>
        <span>{restaurant.deliveryTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">Menu</h3>
      <div className="flex flex-col gap-4 w-full max-w-md ">
        {menuItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-start">
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <span className="mt-2 font-bold">₹{item.price}</span>
            </div>
            {showControls[item.id] ? (
              <div className="flex items-center mt-2">
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded" 
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span className="mx-2">{cart[item.id] || 0}</span>
                <button 
                  className="bg-green-500 text-white px-2 py-1 rounded" 
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2" 
                onClick={() => handleAddToCart(item)}
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantPage;
