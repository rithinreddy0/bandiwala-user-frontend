  import React, { useState, useContext } from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import { ShoppingCart, User, Menu, X } from 'lucide-react';
  import { context } from '../App';

  const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { signInOpen, setSignInOpen, signUpOpen, setSignUpOpen, token } = useContext(context);
    const location = useLocation();
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
      <>
        <header className="bg-white shadow-md py-4 px-6 md:flex md:justify-between md:items-center fixed top-0 left-0 w-full z-10">
          {/* Left Side: Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="text-2xl font-bold text-orange-600">
              BandiWala
            </Link>
            <button onClick={toggleMobileMenu} className="md:hidden">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>

          {/* Right Side: Links */}
          <nav className={`md:flex ${isMobileMenuOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
            {!token ? (
              <>
                <button onClick={() => setSignInOpen(!signInOpen)} className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
                  <User className="w-5 h-5 mr-1" /> Sign In
                </button>
                <button onClick={() => setSignUpOpen(!signUpOpen)} className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
                  <User className="w-5 h-5 mr-1" /> Sign Up
                </button>
              </>
            ) : (
              <Link to="/profile" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
                <User className="w-5 h-5 mr-1" /> Profile
              </Link>
            )}
            <Link to="/cart" className="flex items-center px-2 py-1 text-sm text-gray-700 hover:text-orange-600">
              <ShoppingCart className="w-5 h-5 mr-1" /> Cart
            </Link>
          </nav>

          {/* Mobile Full-Screen Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-white z-20 p-4 flex flex-col items-start">
              <div className="flex items-center justify-between w-full mb-4">
                <h1 className="text-lg font-bold">Bandi Wala</h1>
                <button onClick={toggleMobileMenu}>
                  <X className="w-6 h-6 text-black" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 w-full">
                <Link to="/cart" className="flex items-center text-lg" onClick={toggleMobileMenu}>
                  <ShoppingCart className="w-6 h-6 mr-2" /> Cart
                </Link>
                {!token ? (
                  <>
                    <button onClick={() => setSignInOpen(!signInOpen)} className="flex items-center text-lg">
                      <User className="w-6 h-6 mr-2" /> Sign In
                    </button>
                    <button onClick={() => setSignUpOpen(!signUpOpen)} className="flex items-center text-lg">
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
        </header>

        {/* Wrapper for Body Content */}
        <div className="pt-20">{/* Adjust pt-20 based on navbar height */}</div>
      </>
    );
  };

  export default Navbar;
