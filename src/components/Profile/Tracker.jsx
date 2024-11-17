import { useState, useEffect, useContext } from 'react';
import { Star, MapPin, Phone, Clock, Utensils, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {  useAddReviewMutation, useGetOrderMutation } from '../../App/Services/CartApi';
import { context } from '../../App';
import { toast } from 'react-toastify';


export default function UserOrderTracking() {
  const [orderStatus, setOrderStatus] = useState('Order Placed');
  const [isDelivered, setIsDelivered] = useState(false);
  const [rating, setRating] = useState();
  const [orderDetails, setOrderDetails] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(35);
  const { id } = useParams();
  const { token } = useContext(context);
  const [getorder] = useGetOrderMutation();
  const [addReview] = useAddReviewMutation();

  

  const getReviewNumber = () => {
    return rating;  // Return the rating as the review number
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const response = await getorder({ orderId: id, token });
      console.log(response.data);

      if (response.data) {
        setOrderDetails(response.data.order);
        setOrderStatus(response.data.order.status);
        console.log(response.data.status)
        setEstimatedTime(response.data.order.status === 'Order Placed' ? 20 : response.data.order.status === 'Accepted' ? 15 : 10);
        setIsDelivered(response.data.order.status === 'Delivered');
      }
    };

    fetchOrderDetails();
  }, [id, token, getorder]);

  if (!orderDetails) {
    return <div className="text-center py-10 text-lg">Loading order details...</div>;
  }
  const addReviewhandler = async ()=>{
    const response = await addReview({orderId:id,token,rating:rating});
    console.log(response)
    if(response.error.status==450){
      toast.error("You have already reviewed this order" );
    }
    else{
      toast.success("Successfullly Added Review")
    }
    
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pt-0 mt-0 lg:p-8 max-w-7xl min-h-screen">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">Track Your Order</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Details */}
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gray-100 text-black p-6">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold">Order #{orderDetails._id}</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Clock className="mr-3 h-6 w-6" />
                <p className="text-xs sm:text-sm md:text-base font-medium text-black">
                  {isDelivered
                    ? 'Your order has been delivered!'
                    : `Estimated delivery in ${estimatedTime} minutes`}
                </p>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6">Order placed at {new Date(orderDetails.createdAt).toLocaleTimeString()}</p>

              {/* Progress Bar */}
              <div className="relative mb-4 h-2 bg-gray-200 rounded-full">
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full ${orderStatus === 'Order Placed' ? 'bg-gray-500 w-1/6' : orderStatus === 'Accepted' ? 'bg-gray-500 w-2/6' : orderStatus === 'Preparing' ? 'bg-gray-500 w-3/6' : orderStatus === 'On the Way' ? 'bg-gray-500 w-4/6' : orderStatus === 'Delivered' ? 'bg-gray-500 w-5/6' : 'bg-gray-500 w-full'}`}></div>
              </div>

              {/* Order Status */}
              <div className="flex justify-between text-xs sm:text-sm md:text-base font-medium text-black">
                <span className={orderStatus !== 'Order Placed' ? 'text-black' : 'text-gray-500'}>Order Placed</span>
                <span className={orderStatus !== 'Accepted' ? 'text-gray-500' : 'text-black'}>Accepted</span>
                <span className={orderStatus !== 'Preparing' ? 'text-gray-500' : 'text-black'}>Preparing</span>
                <span className={orderStatus !== 'On the Way' ? 'text-gray-500' : 'text-black'}>On the Way</span>
                <span className={orderStatus !== 'Delivered' ? 'text-gray-500' : 'text-black'}>Delivered</span>
                <span className={orderStatus !== 'Cancelled' ? 'text-gray-500' : 'text-black'}>Cancelled</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <div className="bg-gray-100 text-black p-6">
              <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                <Utensils className="mr-3 h-6 w-6" />
                Your Order
              </h2>
            </div>
            <div className="p-6">
              <ul className="list-none mb-6 space-y-3">
                {orderDetails.menuItems.map((item, index) => (
                  <li key={index} className="flex items-center text-xs sm:text-sm md:text-base">
                    <span className="w-6 h-6 bg-gray-500 rounded-full text-white flex items-center justify-center mr-3">{item.quantity}</span>
                    <span>{item.menuItem.name}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xs sm:text-sm md:text-base font-semibold text-black">Total:</span>
                <span className="text-sm sm:text-lg md:text-xl font-bold text-black">₹{orderDetails.totalAmount}</span>
              </div>
            </div>
          </div>

          {orderStatus === 'On the Way' && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div className="bg-gray-100 text-black p-6">
                <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                  <Truck className="mr-3 h-6 w-6" />
                  Delivery Information
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center">
                 
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-xs sm:text-sm md:text-lg mb-2 text-black">Bandiwala Team Member is delivering your order</p>
        
                    <button onClick={() => window.location.href = `tel:9063016975`}
                    className="bg-gray-500 hover:bg-gray-400 py-3 text-white py-2 px-6 rounded-lg">
  <Phone className="mr-2 h-4 w-4" /> Call
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
            <div className="bg-gray-100 text-black p-6">
              <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                <MapPin className="mr-3 h-6 w-6" />
                Delivery Location
              </h2>
            </div>
            <div className="p-6">
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                <iframe
                  className="w-full h-full" 
                  title="delivery-location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.3448807202544!2d78.38282767420887!3d17.538759283374464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8e0ab28e0975%3A0x28774ba44b93532c!2sTaj%20Deccan!5e0!3m2!1sen!2sin!4v1692204319874!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>

          {orderStatus === 'Delivered' && (
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div className="bg-gray-100 text-black p-6">
                <h2 className="text-sm sm:text-base md:text-lg flex items-center">
                  <Star className="mr-3 h-6 w-6" />
                  Rate Your Order
                </h2>
              </div>
              <div className="p-6">
              <div className="p-6">
    <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
                key={star}
                className={`text-5xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => {
                  setRating(star);
                  console.log(star)
                  addReviewhandler();
                }}>  ★
          </button>
        ))}
      </div>
    </div>

      {/* Display the review number */}
      {rating &&(
        <div className="mt-4">
        <p className="text-xl font-semibold">Rated: {getReviewNumber()} Stars</p>
      </div>
      )}
    </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
