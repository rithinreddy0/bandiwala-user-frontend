import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import { context } from '../App';
import Otp from './Authentication/Otp';
import ForgotPassword from './Authentication/ForgotPassword';
import { useGetAllVendorsMutation } from '../App/Services/RestaurantApi';

// Mock data
const foodCategories = [
  { name: 'Gulab Jamun', image: 'https://talodfoods.com/cdn/shop/files/Gulab-Jamun-Creative_img_4f2bd570-4f11-4dba-8386-fa5a26392cd0.webp?v=1725262395&width=1500' },
  { name: 'Rasgulla', image: 'https://img.freepik.com/premium-photo/rasgulla-elegance-famous-bengali-sweet-presented-clay-bowl-social-media-post-size_896558-36866.jpg' },
  { name: 'Paratha', image: 'https://images.mrcook.app/recipe-image/018f6252-8adb-79ee-912a-abe304673ccf' },
  { name: 'Pure Veg', image: 'https://p1.hiclipart.com/preview/516/642/527/healthy-food-vegetarian-cuisine-meal-health-food-delivery-health-food-shop-healthy-diet-dinner-png-clipart.jpg' },
  { name: 'Chinese', image: 'https://content.jdmagicbox.com/comp/def_content_category/the-chinese-wok/68543891-2433329510256103-4325104536055185408-n-the-chinese-wok-1-u2y5n.jpg' },
  { name: 'North Indian', image: 'https://img.freepik.com/premium-psd/indian-food-indian-food-thali-north-indian-thali_932730-457.jpg' },
  { name: 'Khichdi', image: 'https://www.maggi.in/sites/default/files/srh_recipes/f0f349a51947f81de93e374f21372f27.jpg' },
];

function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signInOpen, signUpOpen, otpOpen, forgotPasswordOpen } = useContext(context);
  const [getAllVendors] = useGetAllVendorsMutation();
  const [restaurants, setRestaurants] = useState();
  const location = useLocation(); // Get the current location
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      await getAllVendors().then((res) => {
        console.log(res);
        setRestaurants(res.data.data);
      });
    };

    fetchRestaurants();
  }, [location]); // Re-run when the location changes

  return (
    <>
      <div>
        {signInOpen && <SignIn />}
        {signUpOpen && <SignUp />}
        {otpOpen && <Otp />}
        {forgotPasswordOpen && <ForgotPassword />}
      </div>

      <div className="p-4 max-w-screen-lg mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">What's on your mind?</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {foodCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0">
              <img src={category.image} alt={category.name} className="w-24 h-24 rounded-full" />
              <span className="text-xs md:text-sm">{category.name}</span>
            </div>
          ))}
        </div>
        <h2 className="text-xl md:text-2xl font-bold my-4 text-center">
          Restaurants with food delivery in <span className="text-primary">VNR VJIET</span> with ❤️
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants &&
            restaurants.map((restaurant) => (
              <Link
                key={restaurant._id}
                to={`/restaurant/${restaurant._id}`}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <img src={restaurant.logo} alt={restaurant.restaurantName} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-sm md:text-base font-semibold">{restaurant.restaurantName}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{restaurant.cuisineType}</p>
                  <div className="flex items-center justify-between text-xs md:text-sm mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{restaurant.averageRating} ★</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{restaurant.address}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export default Home;
