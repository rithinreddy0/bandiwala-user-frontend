import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowRightCircle, Eye, EyeOff, X } from 'lucide-react';
import { context } from '../Home';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signInOpen, setSignInOpen, signUpOpen, setSignUpOpen } = useContext(context);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = () => {
    // Add your sign-in logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const HandleSignUp=()=>{
    setSignInOpen(!signInOpen);
    setSignUpOpen(!signUpOpen);
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <button onClick={() => setSignInOpen(!signInOpen)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
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
          <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link onClick={HandleSignUp} className="text-sm text-blue-500 hover:underline flex items-center">
            <UserPlus className="w-4 h-4 mr-1" />
            Sign Up
          </Link>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center justify-center text-lg"
        >
          <ArrowRightCircle className="w-5 h-5 mr-2" />
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
