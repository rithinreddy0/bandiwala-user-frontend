import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetVendorDetailsMutation } from '../App/Services/RestaurantApi';




function RestaurantPage() {
  const { id } = useParams();
  const [getVendorDetails]=useGetVendorDetailsMutation()
  const [vendorDetails,setVendorDetails]=useState()
  

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

 
  useEffect(async() => {
      await getVendorDetails({id}).then((res)=>{
        console.log(res)
        setVendorDetails(res.data.data)
      })
  }, []);

  
  return (
    <div className="p-4 flex flex-col items-center">
      {/*<h2 className="text-2xl font-bold mb-2 text-center">{restaurant.name}</h2>
      <div className="flex items-center mb-6">
        <p className="text-gray-600 mr-4">{restaurant.cuisines.join(', ')}</p>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">{restaurant.rating} ★</span>
        <span>{restaurant.deliveryTime}</span>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">Menu</h3>
      <div className="flex flex-col gap-4 w-full max-w-md ">
        {menuItems&&menuItems.map((item) => (
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
      </div>*/}
    </div>
  );
}

export default RestaurantPage;
