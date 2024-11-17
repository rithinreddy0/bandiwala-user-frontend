import { LogOut, Mail, MapPin, Phone } from "lucide-react";
import { context } from "../../App";
import { useContext, useEffect, useState } from "react";
import { useGetmobileMutation, useGetAllOrdersMutation } from "../../App/Services/CartApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(context);
  const [getmobile] = useGetmobileMutation();
  const [getAllOrders] = useGetAllOrdersMutation();
  const [userProfile, setUserProfile] = useState({});
  const [orders, setOrders] = useState([]);

  // Handle navigation to the order details page
  const handle = (orderID) => {
    navigate(`/order/${orderID}`);
  };

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      if (!token) {
        console.warn("No token available.");
        return;
      }

      try {
        // Fetch User Profile
        const response = await getmobile({ token });
        if (response?.data?.data) {
          setUserProfile(response.data.data);
        } else {
          console.warn("User profile data is invalid:", response?.data);
        }

        // Fetch Orders
        const response2 = await getAllOrders({ token });
        if (Array.isArray(response2?.data.orders)) {
          setOrders(response2.data.orders);
        } else {
          console.error("Orders data is invalid:", response2?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProfileAndOrders();
  }, [token, getmobile, getAllOrders]);

  // Separate orders by status
  const deliveringOrders = orders?.filter((order) => order.status === "Order Placed") || [];
  const deliveredOrders = orders?.filter((order) => order.status === "Delivered") || [];

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{userProfile.name || "Guest"}</h2>
          <div className="flex items-center text-sm sm:text-base text-gray-600 mb-1">
            <Phone className="w-5 h-5 mr-2" />
            {userProfile.mobileNo || "N/A"}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-600 mb-1">
            <Mail className="w-5 h-5 mr-2" />
            {userProfile.email || "N/A"}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            {userProfile.deliveryAddress || "N/A"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Orders</h3>

        {/* Delivering Orders */}
        {deliveringOrders.length > 0 && (
          <>
            <h4 className="text-md sm:text-lg font-semibold text-orange-600 mb-2">Now Delivering</h4>
            <div className="space-y-4">
              {deliveringOrders.map((order) => (
                <OrderCard key={order._id} order={order} handle={handle} />
              ))}
            </div>
          </>
        )}

        {/* Delivered Orders */}
        {deliveredOrders.length > 0 && (
          <>
            <h4 className="text-md sm:text-lg font-semibold text-gray-700 mt-6 mb-2">Delivered</h4>
            <div className="space-y-4">
              {deliveredOrders.map((order) => (
                <OrderCard key={order._id} order={order} handle={handle} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, handle }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white">
      {/* Image Section */}
      <div className="relative sm:w-32 sm:flex-shrink-0">
        <img
          src={order.vendorId.logo || "/placeholder.svg"}
          alt={order.vendorId.restaurantName}
          className="w-full h-36 sm:w-32 sm:h-32 object-cover rounded-md"
        />
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:gap-4 items-start">
        {/* Left Section */}
        <div className="flex-1 flex flex-col gap-1">
          <h4 className="text-md font-semibold text-gray-800">{order.vendorId.restaurantName}</h4>
          <p className="text-xs text-gray-500">ORDER #{order._id}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-2">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="sm:w-40 sm:text-right flex flex-col justify-between">
          <span className="text-md font-semibold text-orange-500">₹{order.totalAmount}</span>
          <span className="text-sm font-medium text-gray-600 mt-2">
            Status: <span className="text-orange-500">{order.status}</span>
          </span>
          <button 
            onClick={() => handle(order._id)}
            className="mt-3 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-300"
          >
            {order.status === "Order Placed" ? "More Details" : "Reorder"}
          </button>
        </div>
      </div>
    </div>
  );
}
