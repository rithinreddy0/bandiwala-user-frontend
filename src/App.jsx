import React, { useState,createContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RestaurantPage from './components/RestaurantPage';
import Otp from './components/Authentication/Otp';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Profile from './components/Profile/Profile';
import UserOrderTracking from './components/Profile/Tracker';



export const context=createContext();
function App() {
  const [signInOpen,setSignInOpen]=useState(false)  
  const [signUpOpen,setSignUpOpen]=useState(false)
  const [otpOpen,setOtpOpen]=useState(false)
  const [signUpInEmail,setSignUpInEmail]=useState(null)
  const [userDetails,setUserDetails]=useState(null)
  const [token,setToken]=useState(localStorage.getItem('token'))
  const [forgotPasswordOpen,setForgotPasswordOpen]=useState(false) 
  const verifyfunctio = async()=>{
    const response = await fetch('http://localhost:4000/api/users/verify', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Assuming you're using JWT tokens for auth
      },
    });
    const data = await response.json()
    // console.log(response)
    console.log(data)
    console.log(response)
    if(!response.ok){
      console.log(data)
      localStorage.removeItem('token');
    }
  }
  useEffect( ()=>{
    
      verifyfunctio();
    
  },[])
  return (
    <context.Provider value={{signInOpen,setSignInOpen,signUpOpen,setSignUpOpen,otpOpen,setOtpOpen,signUpInEmail,setSignUpInEmail,userDetails,setUserDetails,token,setToken,forgotPasswordOpen,setForgotPasswordOpen}}>
    <Router >
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/order/:id" element={<UserOrderTracking/>}/>
      </Routes> 
    </Router>
    </context.Provider>
    
  );
}

export default App;
