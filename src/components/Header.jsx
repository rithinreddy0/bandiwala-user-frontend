import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, HelpCircle, User, MapPin, Menu, X } from 'lucide-react';

function Header({ onOpenModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="ultra-regular text-primary ml-5 text-lg md:text-2xl">BANDIWALA</h1>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm md:text-base">VNRVJIET</span>
          <MapPin className="w-5 h-5 text-black-500 mr-2" />
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/search" className="flex items-center space-x-1 text-sm md:text-base">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </Link>
        <Link to="/offers" className="flex items-center space-x-1 text-sm md:text-base">
          <span>Offers</span>
          <span className="text-xs bg-orange-500 text-white px-1 rounded">NEW</span>
        </Link>
        <Link to="/help" className="flex items-center space-x-1 text-sm md:text-base">
          <HelpCircle className="w-5 h-5" />
          <span>Help</span>
        </Link>
        <button onClick={() => {setIsMobileMenuOpen(!isMobileMenuOpen); onOpenModal(true)}} className="flex items-center space-x-1 text-sm md:text-base">
          <User className="w-5 h-5" />
          <span>Sign In</span>
        </button>
        <button className="flex items-center space-x-1 text-sm md:text-base">
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border border-t-0 shadow-md md:hidden z-10">
          <nav className="flex flex-col items-start p-4">
            <Link to="/search" className="flex items-center space-x-1 py-2 text-sm">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>
            <Link to="/offers" className="flex items-center space-x-1 py-2 text-sm">
              <span>Offers</span>
              <span className="text-xs bg-orange-500 text-white px-1 rounded">NEW</span>
            </Link>
            <Link to="/help" className="flex items-center space-x-1 py-2 text-sm">
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
            <button onClick={() => onOpenModal(true)} className="flex items-center space-x-1 py-2 text-sm">
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
            <button className="flex items-center space-x-1 py-2 text-sm">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
