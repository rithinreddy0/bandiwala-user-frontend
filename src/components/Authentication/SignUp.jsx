import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, ArrowRightCircle, Eye, EyeOff, X } from 'lucide-react';
import { context } from '../../App';
import { useSignUpMutation } from '../../App/Services/AuthenticationApi';

// Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInOpen, setSignInOpen, signUpOpen, setSignUpOpen, otpOpen, setOtpOpen, signUpInEmail, setSignUpInEmail } = useContext(context);

  const [signUp] = useSignUpMutation();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSignUp = () => {
    setError(''); // Clear any previous errors
    if (!username || !email || !password) {
      setError('All fields are required.');
      toast.error('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    signUp({ name: username, email, password })
      .unwrap()
      .then((response) => {
        toast.success(response.message);
        setLoading(false);
        setSignUpOpen(false);
        setSignUpInEmail(email);
        setOtpOpen(true);
      })
      .catch((err) => {
        setLoading(false);
        if (err.status === 400) {
          setError(err.data.message);
          toast.error(err.data.message);
        } else {
          setError('Server error. Please try again later.');
          toast.error('Server error. Please try again later.');
        }
      });
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSignIn = () => {
    setSignUpOpen(false);
    setSignInOpen(true);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <button onClick={() => setSignUpOpen(false)} aria-label="Close Sign Up" className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-6 relative">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <User className="absolute left-3 top-11 w-5 h-5 text-gray-500" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`mt-1 block w-full pl-12 p-3 border ${error && !username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg`}
            required
            aria-label="Username"
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
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full pl-12 p-3 border ${error && !validateEmail(email) ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg`}
            required
            aria-label="Email"
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
            className={`mt-1 block w-full pl-12 pr-10 p-3 border ${error && !validatePassword(password) ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg`}
            required
            aria-label="Password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          >
            {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Link onClick={handleSignIn} className="text-sm text-blue-500 hover:underline flex items-center" aria-label="Sign In">
            <UserCheck className="w-4 h-4 mr-1" />
            Already have an account? Sign In
          </Link>
        </div>
        
        <button
          onClick={handleSignUp}
          className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center justify-center text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
          aria-label="Sign Up"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path fill="white" d="M12 2a10 10 0 00-1 19.95v-2.02a8 8 0 110-15.96V2z" />
            </svg>
          ) : (
            <ArrowRightCircle className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
      {/* Toast Container to render the Toastify notifications */}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
