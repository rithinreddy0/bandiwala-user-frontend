import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorDetailsMutation } from '../App/Services/RestaurantApi';
import { useAddCartMutation, useGetCartMutation } from '../App/Services/CartApi';
import { context } from '../App';

function RestaurantPage() {
  const { id } = useParams();
  const [getVendorDetails] = useGetVendorDetailsMutation();
  const [addCart] = useAddCartMutation();
  const [getCart] = useGetCartMutation(); // Mutation to get the user's cart details
  const [vendorDetails, setVendorDetails] = useState(null);
  const [cart, setCart] = useState({}); // State to track cart items and their quantities
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // To store the total cart amount
  const navigate = useNavigate();
  const { token } = useContext(context);
  const [amount,setAmount ]  = useState(0);
  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await getVendorDetails({ id }).unwrap();
        setVendorDetails(response.data); // Set the vendor details
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
  
  // Fetch cart details and merge with vendor menu items
  useEffect(() => {
    if (token && vendorDetails) {
      const fetchCart = async () => {
        try {
          const response = await getCart({ token }).unwrap();
          const cartData = response.data;
          setAmount(response.cart.totalAmount)
          console.log("hello",response.cart.totalAmount)
          // Map existing items from the cart to a key-value object with item ID as key and quantity as value
          const updatedCart = {};
          cartData.items.forEach(item => {
            updatedCart[item.menuItem._id] = item.quantity;
          });

          // Merge cart quantities with vendor items
          const updatedMenuItems = vendorDetails.menuItems.map(item => {
            return {
              ...item,
              cartQuantity: updatedCart[item._id] || 0, // Merge cart quantity if item is present in the cart
            };
          });

          setVendorDetails(prevDetails => ({
            ...prevDetails,
            menuItems: updatedMenuItems,
          }));

          // Calculate the total amount for the cart
          const total = cartData.items.reduce((acc, item) => {
            const itemPrice = item.menuItem.price;
            const itemQuantity = item.quantity;
            return acc + itemPrice * itemQuantity;
          }, 0);
          setTotalAmount(total); // Update the total amount state
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      };

      fetchCart();
    }
  }, [token, vendorDetails, getCart]);

  // Handle adding item to the cart (with quantity +1)
  const handleAddToCart = async (item) => {
    if (!token) {
      return alert('Please Login to Continue');
    }

    const currentQuantity = item.cartQuantity || 0;
    const newQuantity = currentQuantity + 1;

    // Update cart in state
    setVendorDetails(prevDetails => ({
      ...prevDetails,
      menuItems: prevDetails.menuItems.map(menuItem =>
        menuItem._id === item._id ? { ...menuItem, cartQuantity: newQuantity } : menuItem
      ),
    }));

    try {
      await addCart({ item: { menuItemId: item._id, quantity: newQuantity }, token }).unwrap();
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Handle updating item quantity in the cart
  const handleQuantityChange = async (item, newQuantity) => {
    if (!token || newQuantity < 0) {
      return;
    }

    // Update cart in state
    setVendorDetails(prevDetails => ({
      ...prevDetails,
      menuItems: prevDetails.menuItems.map(menuItem =>
        menuItem._id === item._id ? { ...menuItem, cartQuantity: newQuantity } : menuItem
      ),
    }));

    try {
      await addCart({ item: { menuItemId: item._id, quantity: newQuantity }, token }).unwrap();
      console.log('Item quantity updated in cart');
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  // Handle removing an item completely from the cart
  const handleRemoveItem = async (item) => {
    try {
      await addCart({ item: { menuItemId: item._id, quantity: 0 }, token }).unwrap();
      setVendorDetails(prevDetails => ({
        ...prevDetails,
        menuItems: prevDetails.menuItems.map(menuItem =>
          menuItem._id === item._id ? { ...menuItem, cartQuantity: 0 } : menuItem
        ),
      }));
      console.log('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // If no id is passed, navigate away
  if (!id) {
    navigate('/');
  }

  // Show loading or error message if applicable
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
            {/* Add to Cart / Quantity Controls */}
            <div className="flex items-center ml-auto">
              {item.cartQuantity > 0 ? (
                <>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleQuantityChange(item, item.cartQuantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.cartQuantity}
                    min="0"
                    className="w-12 text-center mx-2"
                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10))}
                  />
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleQuantityChange(item, item.cartQuantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-700 text-white px-2 py-1 rounded ml-2"
                    onClick={() => handleRemoveItem(item)}
                  >
                    Remove
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

      {/* Sticky Cart Total and Go to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-green-500 p-4 flex justify-between items-center text-white">
        <div className="text-lg font-bold">Total: ₹{amount}</div>
        <button
          className="bg-white text-green-500 px-6 py-2 rounded-lg"
          onClick={() => navigate('/cart')} // Redirect to the Cart page
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
}

export default RestaurantPage;
