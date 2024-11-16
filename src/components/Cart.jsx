import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, MapPin, Trash } from 'lucide-react'; // Import Lucide icons for use
import { useAddCartMutation, useGetCartMutation } from '../App/Services/CartApi'; // API mutation for adding/updating cart
import { context } from '../App';
import { useCreateorderMutation,useGetmobileMutation } from '../App/Services/CartApi';
import { Navigate, useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [createOrder] = useCreateorderMutation();
  const [getmobile] = useGetmobileMutation();
  const [addCart] = useAddCartMutation(); // Add/update cart mutation
  const [getCart] = useGetCartMutation();

    const navigate = useNavigate();

  const { token } = useContext(context); // Assuming token is used for API calls
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // Mobile Number state added here
  const [items, setItems]  = useState([]); // Items array will now track quantities and menuItem data
  const [isLoading, setIsLoading] = useState(true); // To track loading state

  // Calculate subtotal and total amount
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = 3.99;
  const total = subtotal + deliveryFee;
  // Handle address change
  const handleAddressChange = (e) => setAddress(e.target.value);

  // Handle mobile number change
  const handleMobileNumberChange = (e) => setMobileNumber(e.target.value);

  // Handle checkout
  const handleCheckout = async() => {
    if (!address || !mobileNumber) {
      alert('Please enter a delivery address and mobile number');
      
      return;
    }
    const orderDetails = {
      deliveryAddress: address,
      mobileNo: mobileNumber,
    };
    
    // The token is passed separately.

    const response = await createOrder({ item: orderDetails, token });
    console.log(response.data.order._id)
    if(!response.error){
      alert('Order created successfully');
      navigate(`/order/${response.data.order._id}`)
    }
  };

  // Handle adding item to the cart (with quantity +1)
  const handleAddToCart = async (item) => {
    if (!token) {
      return alert('Please Login to Continue');
    }

    const currentQuantity = item.quantity || 0;
    const newQuantity = currentQuantity + 1;

    // Update the cart in the state
    setItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem._id === item._id ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );

    try {
      await addCart({
        item: { menuItemId: item.menuItem._id, quantity: newQuantity },
        token,
      }).unwrap();
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Handle decrementing item in the cart (with quantity -1)
  const handleDecrement = async (item) => {
    const currentQuantity = item.quantity || 0;

    if (currentQuantity <= 1) {
      // If quantity is 1 or less, remove the item from the cart
      handleRemoveItem(item);
    } else {
      const newQuantity = currentQuantity - 1;

      // Update the cart in the state
      setItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem._id === item._id ? { ...cartItem, quantity: newQuantity } : cartItem
        )
      );
      // console.log(token)
      try {
        await addCart({
          item: { menuItemId: item.menuItem._id, quantity: newQuantity },
          token,
        }).unwrap();
        console.log('Item quantity updated in cart');
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }
  };

  // Handle removing an item completely from the cart (set quantity to 0)
  const handleRemoveItem = async (item) => {
    try {
      // API call to remove item from cart (set quantity to 0)
      await addCart({
        item: { menuItemId: item.menuItem._id, quantity: 0 },
        token,
      }).unwrap();

      // Remove item from state
      setItems((prevItems) => prevItems.filter((cartItem) => cartItem._id !== item._id));

      console.log('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    // Fetch cart details when the page loads
    const fetchCart = async () => {
      try {
        const response2 = await getmobile({token});

        setMobileNumber(response2.data.data.mobileNo);
        setAddress(response2.data.data.deliveryAddress)
        
        const response = await getCart({ token }); // Your getCart API to fetch cart items
        if (response?.data?.cart?.items) {
          setItems(response.data.cart.items);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setIsLoading(false);
      }
    };

    if (token) {
      fetchCart();
    }
  }, [token, getCart]);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

      {/* Address Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-xl">
        <div className="mb-4 flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-800">Delivery Address</h3>
        </div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          {address ? 'Update your address:' : 'Enter your delivery address:'}
        </label>
        <input
          id="address"
          value={address}
          onChange={handleAddressChange}
          placeholder={address ? 'Edit your address' : 'Enter your full address'}
          className="mt-2 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        
        {/* Mobile Number Field */}
        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mt-4">
          Enter your mobile number:
        </label>
        <input
          id="mobileNumber"
          type="text"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
          placeholder="Enter your mobile number"
          className="mt-2 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Order Summary Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-xl">
        <div className="mb-4 flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
        </div>

        {/* Conditional rendering if no items in the cart */}
        {isLoading ? (
          <p>Loading order items...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500">No items in the cart</p> // No items message
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item._id} className="flex justify-between items-center text-sm text-gray-700">
                <div className="flex-1 flex justify-between">
                  <span>{item.menuItem.name} x{item.quantity}</span>
                  {/* Item Total */}
                  <span className="font-bold text-lg">{`₹${(item.menuItem.price * item.quantity).toFixed(2)}`}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Decrement Button */}
                  <button
                    onClick={() => handleDecrement(item)}
                    className="flex items-center justify-center bg-gray-200 border-2 border-gray-400 text-gray-800 rounded-full p-3 w-10 h-10 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  {/* Quantity Display */}
                  <span className="text-lg font-medium">{item.quantity}</span>
                  {/* Increment Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center bg-gray-200 border-2 border-gray-400 text-gray-800 rounded-full p-3 w-10 h-10 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    +
                  </button>
                </div>

                {/* Remove (Trash Icon) Button */}
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotal:</span>
            <span className="font-bold text-lg">{`₹${subtotal.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Delivery Fee:</span>
            <span className="font-bold text-lg">{`₹${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-700">
            <span>Total:</span>
            <span className="font-bold text-lg">{`₹${total.toFixed(2)}`}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button Section */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 px-11 bg-blue-600 text-white rounded-lg shadow-xl hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
