import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowRightCircle, Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { context } from '../../App';
import { useSignInMutation } from '../../App/Services/AuthenticationApi';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInOpen, setSignInOpen, setSignUpOpen, setUserDetails, setToken, forgotPasswordOpen, setForgotPasswordOpen, setSignUpInEmail } = useContext(context);

  const [signIn] = useSignInMutation();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Both email and password are required.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await signIn({ email, password });

      if (response.error) {
        const { status, data } = response.error;
        if (status === 400 || status === 401) {
          toast.error(data.message || 'Invalid email or password.');
        } else if (status === 500) {
          toast.error('Server error occurred. Please try again later.');
        } else {
          toast.error('Unexpected error occurred. Please try again.');
        }
      } else {
        toast.success('Sign In successful!');
        setSignInOpen(false);
        setUserDetails(response.data.user);
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        navigate('/');
      }
    } catch (err) {
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.warn('Please enter your email before proceeding.');
    } else if (!validateEmail(email)) {
      toast.warn('Please enter a valid email address.');
    } else {
      setSignUpInEmail(email);
      setSignInOpen(false);
      setForgotPasswordOpen(true);
      toast.info('Redirecting to Forgot Password.');
    }
  };

  const handleSignUp = () => {
    setSignInOpen(false);
    setSignUpOpen(true);
    toast.info('Redirecting to Sign Up.');
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <button
          onClick={() => setSignInOpen(false)}
          aria-label="Close Sign In"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <div className="mb-6 relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full pl-12 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full pl-12 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
          >
            {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleForgotPassword} className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </button>
          <button onClick={handleSignUp} className="text-sm text-blue-500 hover:underline flex items-center">
            <UserPlus className="w-4 h-4 mr-1" />
            Sign Up
          </button>
        </div>
        <button
          onClick={handleSignIn}
          className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
