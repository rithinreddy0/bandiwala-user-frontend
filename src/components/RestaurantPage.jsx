import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetVendorDetailsMutation } from '../App/Services/RestaurantApi';
import { useAddCartMutation, useGetCartMutation } from '../App/Services/CartApi';
import { context } from '../App';
import { Trash2 } from 'lucide-react';
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import Otp from './Authentication/Otp';
import ForgotPassword from './Authentication/ForgotPassword';

function RestaurantPage() {
  const { signInOpen, signUpOpen, otpOpen, forgotPasswordOpen } = useContext(context);
  const { id } = useParams();
  const [getVendorDetails] = useGetVendorDetailsMutation();
  const [addCart] = useAddCartMutation();
  const [getCart] = useGetCartMutation();

  const [vendorDetails, setVendorDetails] = useState(null);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCartFetched, setIsCartFetched] = useState(false);

  const navigate = useNavigate();
  const { token } = useContext(context);

  // Fetch vendor details
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

  // Fetch cart details once
  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !vendorDetails || isCartFetched) return;

      try {
        const response = await getCart({ token }).unwrap();
        const cartData = response.cart;

        const cartItemsMap = {};
        cartData.items.forEach(item => {
          cartItemsMap[item.menuItem._id] = item.quantity;
        });

        const updatedMenuItems = vendorDetails.menuItems.map(item => ({
          ...item,
          cartQuantity: cartItemsMap[item._id] || 0,
        }));

        setVendorDetails(prevDetails => ({
          ...prevDetails,
          menuItems: updatedMenuItems,
        }));

        setTotalAmount(cartData.totalAmount);
        setIsCartFetched(true);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [token, vendorDetails, getCart, isCartFetched]);

  // Update total amount
  const calculateTotalAmount = (menuItems) => {
    const total = menuItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0);
    setTotalAmount(total);
  };

  // Handle adding item to the cart
  const handleAddToCart = async (item) => {
    if (!token) {
      return alert('Please Login to Continue');
    }

    const currentQuantity = item.cartQuantity || 0;
    const newQuantity = currentQuantity + 1;

    const updatedMenuItems = vendorDetails.menuItems.map(menuItem =>
      menuItem._id === item._id ? { ...menuItem, cartQuantity: newQuantity } : menuItem
    );

    setVendorDetails(prevDetails => ({
      ...prevDetails,
      menuItems: updatedMenuItems,
    }));

    calculateTotalAmount(updatedMenuItems);

    try {
      await addCart({ item: { menuItemId: item._id, quantity: newQuantity }, token }).unwrap();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Handle updating item quantity in the cart
  const handleQuantityChange = async (item, newQuantity) => {
    if (!token || newQuantity < 0) {
      return;
    }

    const updatedMenuItems = vendorDetails.menuItems.map(menuItem =>
      menuItem._id === item._id ? { ...menuItem, cartQuantity: newQuantity } : menuItem
    );

    setVendorDetails(prevDetails => ({
      ...prevDetails,
      menuItems: updatedMenuItems,
    }));

    calculateTotalAmount(updatedMenuItems);

    try {
      await addCart({ item: { menuItemId: item._id, quantity: newQuantity }, token }).unwrap();
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  // Handle removing an item from the cart
  const handleRemoveItem = async (item) => {
    try {
      await addCart({ item: { menuItemId: item._id, quantity: 0 }, token }).unwrap();

      const updatedMenuItems = vendorDetails.menuItems.map(menuItem =>
        menuItem._id === item._id ? { ...menuItem, cartQuantity: 0 } : menuItem
      );

      setVendorDetails(prevDetails => ({
        ...prevDetails,
        menuItems: updatedMenuItems,
      }));

      calculateTotalAmount(updatedMenuItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!id) {
    navigate('/');
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        {signInOpen && <SignIn />}
        {signUpOpen && <SignUp />}
        {otpOpen && <Otp />}
        {forgotPasswordOpen && <ForgotPassword />}
      </div>
      <div className="p-4 flex flex-col items-center pb-20"> {/* Added padding-bottom */}
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
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex flex-col flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <span className="mt-2 font-bold">₹{item.price}</span>
              </div>
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
                      <Trash2 className="w-5 h-5" />
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
      {totalAmount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 opacity-90 bg-gray-100 shadow-lg p-3 flex justify-between items-center">
          <p className="text-lg font-semibold">Total: ₹{totalAmount}</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => navigate('/cart')}>
            Proceed To Checkout
          </button>
        </div>
      )}
    </>
  );
}

export default RestaurantPage;
