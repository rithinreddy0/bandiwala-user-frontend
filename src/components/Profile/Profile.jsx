import { LogOut, Mail, MapPin, Phone } from "lucide-react";

export default function Profile() {
  const userProfile = {
    name: "Sai Navadeep",
    mobile: "7989096656",
    email: "gujjulasainavadeepreddy@gmail.com",
    address: "123 Main St, Anytown, USA 12345",
  };

  const orders = [
    {
      id: "#863279477235269",
      restaurant: "My Village Kitchen Restaurant",
      items: ["Chicken Biryani Handi x 1", "Butter Roti x 1"],
      status: "Delivered",
      totalAmount: 314,
      imageUrl: "/placeholder.svg",
    },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{userProfile.name}</h2>
          <div className="flex items-center text-sm sm:text-base text-gray-600 mb-1">
            <Phone className="w-5 h-5 mr-2" />
            {userProfile.mobile}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-600 mb-1">
            <Mail className="w-5 h-5 mr-2" />
            {userProfile.email}
          </div>
          <div className="flex items-center text-sm sm:text-base text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            {userProfile.address}
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
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 sm:p-6 flex flex-col md:flex-row gap-4 items-start"
            >
              <img
                src={order.imageUrl}
                alt={order.restaurant}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">{order.restaurant}</h4>
                    <p className="text-xs sm:text-sm text-gray-500">ORDER {order.id}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm sm:text-base text-gray-600">
                  {order.items.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm sm:text-base font-medium">
                    Total Paid: ₹{order.totalAmount}
                  </span>
                  <button className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:ring-2 focus:ring-orange-300">
                    Track
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
