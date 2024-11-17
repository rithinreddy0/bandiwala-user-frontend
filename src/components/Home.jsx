import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import SignIn from './Authentication/SignIn';
import SignUp from './Authentication/SignUp';
import Otp from './Authentication/Otp';
import ForgotPassword from './Authentication/ForgotPassword';
import { context } from '../App';
import { useGetAllVendorsMutation } from '../App/Services/RestaurantApi';

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
        {/* Static message */}
       

        {/* Restaurants Section */}
        <h2 className="text-xl md:text-2xl font-bold my-4 text-center mb-7">
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
