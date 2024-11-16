import React, { useState, useEffect,useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorDetailsMutation } from '../App/Services/RestaurantApi';
import { useAddCartMutation } from '../App/Services/CartApi';
import { context } from '../App';



function RestaurantPage() {
  const { id } = useParams();
  const [getVendorDetails] = useGetVendorDetailsMutation();
  const [addCart] = useAddCartMutation();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // State to track cart items and their quantities
  const navigate = useNavigate();
  const {token}=useContext(context)
  
  // Handle adding item to the cart (with quantity +1)
  const handleAddToCart = async (item) => {
    if(!token){
      console.log(token)
       return alert("Please Login to Continue")
    }
    const currentQuantity = cart[item._id] || 0;
    const newQuantity = currentQuantity + 1;
    setCart(prevCart => ({ ...prevCart, [item._id]: newQuantity }));

    // Call the API to add item with new quantity

    try {
      await addCart({ item:{menuItemId: item._id, quantity: newQuantity},token }).unwrap();
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Handle decrementing item in the cart (with quantity -1)
  const handleDecrement = async (item) => {
    const currentQuantity = cart[item._id] || 0;
    if (currentQuantity <= 1) {
      // If quantity is 1 or less, remove the item from the cart
      const newCart = { ...cart };
      delete newCart[item._id];
      setCart(newCart);

      // Call the API to remove or set quantity to 0
       try {
      await addCart({ item:{menuItemId: item._id, quantity: -1},token }).unwrap();
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
    } else {
      // Otherwise, just decrement the quantity
      const newQuantity = currentQuantity - 1;
      setCart(prevCart => ({ ...prevCart, [item._id]: newQuantity }));

      // Call the API to update the quantity
      try {
        await addCart({ id: item._id, quantity: newQuantity }).unwrap();
        console.log('Item quantity updated in cart');
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }
  };

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await getVendorDetails({ id }).unwrap();
        setVendorDetails(response.data);
      } catch (err) {
        console.error('Failed to fetch vendor details:', err);
        setError('Failed to load restaurant details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchVendorDetails();
    } else {
      setError('Restaurant ID is missing.');
    }
  }, [id, getVendorDetails]);

  if (!id) {
    navigate('/');
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">{vendorDetails.restaurantName}</h2>
      <div className="flex items-center mb-6">
        <p className="text-gray-600 mr-4">{vendorDetails.cuisineType}</p>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
          {vendorDetails.averageRating || 'N/A'} ★
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">Menu</h3>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {vendorDetails.menuItems?.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 flex items-center gap-4">
            {/* Menu Item Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            {/* Menu Item Details */}
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <span className="mt-2 font-bold">₹{item.price}</span>
            </div>
            {/* Add to Cart / Increment-Decrement */}
            <div className="flex items-center ml-auto">
              {cart[item._id] ? (
                <>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <span className="mx-2">{cart[item._id]}</span>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAddToCart(item)}
                  >
                    +
                  </button>
                </>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleAddToCart(item)}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantPage;
