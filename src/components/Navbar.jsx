import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, List } from 'lucide-react';
import { context } from './Home';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {signInOpen,setSignInOpen,signUpOpen,setSignUpOpen}=useContext(context)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Dummy state for user logged-in status


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 md:flex md:justify-between md:items-center">
      {/* Left Side: Logo and Location */}
      <div className="flex items-center justify-between md:justify-start w-full md:w-auto">
        <h1 className="text-xl font-bold text-orange-600">Bandi Wala</h1>
        
        <button onClick={toggleMobileMenu} className="md:hidden">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
        </button>
      </div>

      
      {/* Centered Search Bar for Desktop */}
      <div className="hidden md:flex relative mx-auto w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>


      {/* Right Side: Links and Icons */}
      <nav className={`md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
        {!isLoggedIn ? (
          <>
            <button onClick={() => {setSignInOpen(!signInOpen)}} className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
              <User className="w-5 h-5 mr-1" /> Sign In
            </button>
            <button onClick={() => {setSignUpOpen(!signUpOpen)}} className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
              <User className="w-5 h-5 mr-1" /> Sign Up
            </button>
          </>
        ) : (
          <Link to="/profile" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
            <User className="w-5 h-5 mr-1" /> Profile
          </Link>
        )}
        <Link to="/services" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
          <List className="w-5 h-5 mr-1" /> Orders
        </Link>
        <Link to="/cart" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
          <ShoppingCart className="w-5 h-5 mr-1" /> Cart
        </Link>
      </nav>


      {/* Mobile Full-Screen Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-20 p-4 flex flex-col items-start">
          <div className="flex items-center justify-between w-full mb-4">
            <h1 className="text-lg font-bold">bandi Wala</h1>
            <button onClick={toggleMobileMenu}>
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-4 w-full">
            <Link to="/services" className="flex items-center text-lg" onClick={toggleMobileMenu}>
              <List className="w-6 h-6 mr-2" /> Orders
            </Link>
            <Link to="/cart" className="flex items-center text-lg" onClick={toggleMobileMenu}>
              <ShoppingCart className="w-6 h-6 mr-2" /> Cart
            </Link>
            {!isLoggedIn ? (
              <>
                <button onClick={() => {setSignInOpen(!signInOpen)}} className="flex items-center text-lg">
                  <User className="w-6 h-6 mr-2" /> Sign In
                </button>
                <button onClick={() => {setSignUpOpen(!signUpOpen)}} className="flex items-center text-lg">
                  <User className="w-6 h-6 mr-2" /> Sign Up
                </button>
              </>
            ) : (
              <Link to="/profile" className="flex items-center text-lg" onClick={toggleMobileMenu}>
                <User className="w-6 h-6 mr-2" /> Profile
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* Search Bar in Mobile View */}
      <div className="md:hidden mt-4 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
