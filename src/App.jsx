import React, { useState,createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RestaurantPage from './components/RestaurantPage';
import Otp from './components/Authentication/Otp';
import Navbar from './components/Navbar';
import Cart from './components/Cart/Cart';
import ForgotPassword from './components/Authentication/ForgotPassword';



export const context=createContext();
function App() {
  const [signInOpen,setSignInOpen]=useState(false)  
  const [signUpOpen,setSignUpOpen]=useState(false)
  const [otpOpen,setOtpOpen]=useState(false)
  const [signUpInEmail,setSignUpInEmail]=useState(null)
  const [userDetails,setUserDetails]=useState(null)
  const [token,setToken]=useState('dd')
  const [forgotPasswordOpen,setForgotPasswordOpen]=useState(false) 
  return (
    <context.Provider value={{signInOpen,setSignInOpen,signUpOpen,setSignUpOpen,otpOpen,setOtpOpen,signUpInEmail,setSignUpInEmail,userDetails,setUserDetails,token,setToken,forgotPasswordOpen,setForgotPasswordOpen}}>
    <Router >
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      
    </Router>
    </context.Provider>
    
  );
}

export default App;
