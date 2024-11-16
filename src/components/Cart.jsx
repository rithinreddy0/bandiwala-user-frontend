'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, MapPin } from 'lucide-react' // Import Lucide icons for use

// Mock API function (replace with actual API call)
const fetchOrderItems = async () => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return [
    { id: 1, name: 'Pizza Margherita', price: 12.99, quantity: 2 },
    { id: 2, name: 'Caesar Salad', price: 8.99, quantity: 1 },
    { id: 3, name: 'Garlic Bread', price: 4.99, quantity: 1 },
  ]
}

export default function CheckoutPage() {
  const [address, setAddress] = useState('')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrderItems().then(data => {
      setItems(data)
      setIsLoading(false)
    })
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 3.99
  const total = subtotal + deliveryFee

  const handleAddressChange = (e) => setAddress(e.target.value)

  const handleCheckout = () => {
    if (!address) {
      alert('Please enter a delivery address')
      return
    }
    // Implement checkout logic here
    alert(`Order placed! Delivering to: ${address}`)
  }

  const handleIncrement = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecrement = (id) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

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
          placeholder={address ? "Edit your address" : "Enter your full address"}
          className="mt-2 p-4 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Order Summary Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-xl">
        <div className="mb-4 flex items-center space-x-2">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
        </div>
        {isLoading ? (
          <p>Loading order items...</p>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex justify-between items-center text-sm text-gray-700">
                <div className="flex-1 flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  {/* Move Item Total to the right and make it bolder */}
                  <span className="font-bold text-lg">{`₹${(item.price * item.quantity).toFixed(2)}`}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Decrement Button */}
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="flex items-center justify-center bg-gray-200 border-2 border-gray-400 text-gray-800 rounded-full p-3 w-10 h-10 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  {/* Quantity Display */}
                  <span className="text-lg font-medium">{item.quantity}</span>
                  {/* Increment Button */}
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="flex items-center justify-center bg-gray-200 border-2 border-gray-400 text-gray-800 rounded-full p-3 w-10 h-10 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    +
                  </button>
                </div>
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
  )
}
