import React, { useState,useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, ArrowRightCircle, X,Eye, EyeOff, } from 'lucide-react';
import { context } from '../Home';
const SignUp = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInOpen, setSignInOpen, signUpOpen, setSignUpOpen } = useContext(context);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = () => {
    // Add your sign-up logic here
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const HandleSignIn=()=>{
    setSignUpOpen(!signUpOpen);
    setSignInOpen(!signInOpen);
    
  }


  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <button onClick={()=>{setSignUpOpen(!signUpOpen)}} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <div className="mb-6 relative">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <User className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 block w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 block w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full pl-12 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <Link onClick={HandleSignIn} className="text-sm text-blue-500 hover:underline flex items-center">
            <UserCheck className="w-4 h-4 mr-1" />
            Already have an account? Sign In
          </Link>
        </div>
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center justify-center text-lg"
        >
          <ArrowRightCircle className="w-5 h-5 mr-2" />
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
