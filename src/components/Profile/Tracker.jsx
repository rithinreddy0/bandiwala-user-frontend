import { useState, useEffect, useContext } from 'react';
import { Star, MapPin, Phone, Clock, CheckCircle, Utensils, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { context } from '../../App';
import { useGetOrderMutation } from '../../App/Services/CartApi';

export default function UserOrderTracking() {
  const [orderStatus, setOrderStatus] = useState('Pending');
  const [isDelivered, setIsDelivered] = useState(false);
  const [rating, setRating] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(35);
  const { id } = useParams();
  const { token } = useContext(context);
  const [getorder] = useGetOrderMutation();
   
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await getorder({ orderId: id, token });
      console.log(response.data);
      
      if (response.data) {
        setOrderDetails(response.data.order);
        setOrderStatus(response.data.order.status);
        setEstimatedTime(response.data.order.status === 'Pending' ? 20 : 10);  // Example estimated time logic
        setIsDelivered(response.data.order.status === 'Delivered');
      }
    };

    fetchOrderDetails();
  }, [id, token, getorder]);

  if (!orderDetails) {
    return <div className="text-center py-10 text-lg">Loading order details...</div>;
  }


  return (
    <div className="container mx-auto p-4 md:p-6 pt-0 mt-0 lg:p-8 max-w-7xl min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#ff5200] text-center">Track Your Order</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Details */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-[#ff5200] text-white p-6">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">Order #{orderDetails._id}</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Clock className="mr-3 h-6 w-6 text-[#ff5200]" />
                <p className="text-xs sm:text-sm md:text-base font-medium text-black">
                  {isDelivered
                    ? 'Your order has been delivered!'
                    : `Estimated delivery in ${estimatedTime} minutes`}
                </p>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6">Order placed at {new Date(orderDetails.createdAt).toLocaleTimeString()}</p>

              {/* Progress Bar */}
              <div className="relative mb-4 h-2 bg-orange-100 rounded-full">
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full ${
                    orderStatus === 'Pending'
                      ? 'bg-[#ff5200] w-1/3'
                      : orderStatus === 'Preparing'
                      ? 'bg-[#ff5200] w-2/3'
                      : 'bg-[#ff5200] w-full'
                  }`}
                ></div>
              </div>

              {/* Order Status */}
              <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-black">
                <span className={orderStatus !== 'Pending' ? 'text-[#ff5200]' : 'text-gray-500'}>Order Placed</span>
                <span className={orderStatus === 'Preparing' ? 'text-[#ff5200]' : 'text-gray-500'}>Preparing</span>
                <span className={orderStatus === 'On the Way' || orderStatus === 'Delivered' ? 'text-[#ff5200]' : 'text-gray-500'}>On the Way</span>
                <span className={orderStatus === 'Delivered' ? 'text-[#ff5200]' : 'text-gray-500'}>Delivered</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-[#ff5200] text-white p-6">
              <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                <Utensils className="mr-3 h-6 w-6" />
                Your Order
              </h2>
            </div>
            <div className="p-6">
              <ul className="list-none mb-6 space-y-3">
                {orderDetails.menuItems.map((item, index) => (
                  <li key={index} className="flex items-center text-xs sm:text-sm md:text-base">
                    <span className="w-6 h-6 bg-[#ff5200] rounded-full text-white flex items-center justify-center mr-3">{item.quantity}</span>
                    <span>{item.menuItem.name}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-black">Total:</span>
                <span className="text-sm sm:text-lg md:text-xl font-bold text-[#ff5200]">${orderDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          {orderStatus === 'On the Way' && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div className="bg-[#ff5200] text-white p-6">
                <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                  <Truck className="mr-3 h-6 w-6" />
                  Delivery Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center">
                  <img 
                    src="https://via.placeholder.com/80" 
                    alt="Delivery Person" 
                    className="rounded-full mb-4 sm:mb-0 sm:mr-6" 
                  />
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-xs sm:text-sm md:text-lg mb-2 text-black">{orderDetails.userId.name} is delivering your order</p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4">Vehicle: Red Scooter (ABC 123)</p>
                    <button className="bg-[#ff5200] hover:bg-[#e64a00] text-white py-2 px-6 rounded-lg">
                      <Phone className="mr-2 h-4 w-4" /> Call {orderDetails.userId.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Location and Rating */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-[#ff5200] text-white p-6">
              <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                <MapPin className="mr-3 h-6 w-6" />
                Delivery Location
              </h2>
            </div>
            <div className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg relative mb-4">
                <MapPin className="w-12 h-12 text-[#ff5200] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">{orderDetails.deliveryAddress}</p>
            </div>
          </div>

          {isDelivered && !rating && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div className="bg-[#ff5200] text-white p-6">
                <h2 className="text-sm sm:text-base md:text-lg">How was your order?</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-center mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 cursor-pointer ${
                        star <= rating ? 'text-[#ff5200] fill-current' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                <button
                  className="w-full bg-[#ff5200] hover:bg-[#e64a00] text-white text-lg py-6 rounded-lg"
                  onClick={() => alert('Thank you for your rating!')}
                >
                  Submit Rating
                </button>
              </div>
            </div>
          )}

          {isDelivered && rating > 0 && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div className="flex items-center justify-center p-8">
                <CheckCircle className="w-8 h-8 text-[#ff5200] mr-3" />
                <p className="text-xs sm:text-sm md:text-lg font-semibold text-black">Thank you for your feedback!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
