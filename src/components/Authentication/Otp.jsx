import React, { useState, useEffect, useContext } from 'react';
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { context } from '../../App';
import { useOtpVerifyMutation, useSignUpMutation } from '../../App/Services/AuthenticationApi';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const [otpVerify] = useOtpVerifyMutation();
  const [signUp] = useSignUpMutation();
  const {
    setSignInOpen,
    setSignUpOpen,
    setOtpOpen,
    signUpInEmail,
  } = useContext(context);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [resendTimer]);

  const handleChange = (otp) => setOtp(otp);

  const handleVerify = async () => {
    if (otp.length < 4) {
      toast.error('Please enter a valid 4-digit OTP.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await otpVerify({ email: signUpInEmail, otp: Number(otp) });
      if (res.error) {
        toast.error(res.error.data?.message || 'OTP verification failed. Please try again.');
      } else {
        toast.success('OTP verification successful! Please sign in.');
        setOtpOpen(false);
        setSignInOpen(true);
      }
    } catch {
      toast.error('Server error. Please try again later.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await signUp({ email: signUpInEmail });
      if (res.error) {
        toast.error(res.error.data?.message || 'Failed to resend OTP. Please try again.');
      } else {
        toast.success('OTP resent successfully!');
        setResendTimer(60); // Reset the timer
      }
    } catch {
      toast.error('Server error. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignUp = () => {
    setOtpOpen(false);
    setSignUpOpen(true);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Enter OTP</h2>
        <p className="text-sm text-gray-700 mb-6 text-center">
          An OTP has been sent to <span className="font-semibold">{signUpInEmail}</span>. It’s valid for 5 minutes.
        </p>
        <div className="flex justify-center">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={4}
            isInputNum
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus
            inputStyle={{
              width: '3rem',
              height: '3rem',
              margin: '0 0.5rem',
              fontSize: '2rem',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.3)',
            }}
            focusStyle={{
              border: '1px solid blue',
            }}
          />
        </div>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className={`w-full bg-blue-500 text-white p-3 mt-6 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
            isVerifying ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-busy={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={handleResend}
          disabled={isResending || resendTimer > 0}
          className={`w-full bg-gray-200 text-gray-700 p-3 mt-4 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300 ${
            isResending || resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-busy={isResending}
        >
          {isResending ? 'Resending...' : `Resend OTP ${resendTimer > 0 ? `in ${resendTimer}s` : ''}`}
        </button>
        <button
          onClick={handleBackToSignUp}
          className="w-full bg-gray-200 text-gray-700 p-3 mt-4 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
        >
          Back to Sign Up
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Otp;
