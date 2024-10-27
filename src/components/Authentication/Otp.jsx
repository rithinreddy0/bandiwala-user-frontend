import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

const Otp = ({ onVerify, onResend, email }) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (otp) => {
    setOtp(otp);
    if (error) setError(''); // Clear error when OTP changes
  };

  const handleVerify = () => {
    if (otp.length < 4) {
      setError('Please enter a 4-digit OTP.');
      return;
    }
    setIsVerifying(true);
    onVerify(otp)
      .catch(() => setError('Verification failed. Please try again.'))
      .finally(() => setIsVerifying(false));
  };

  const handleResend = () => {
    setIsResending(true);
    onResend()
      .catch(() => setError('Failed to resend OTP. Please try again.'))
      .finally(() => setIsResending(false));
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 sm:p-10 border border-gray-300 rounded-md shadow-md relative w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Enter OTP</h2>
        <p className="text-sm text-gray-700 mb-6 text-center">
          An OTP has been sent to <span className="font-semibold">{email}</span>. It’s valid for 5 minutes.
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
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className={`w-full bg-blue-500 text-white p-3 mt-6 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-busy={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={handleResend}
          disabled={isResending}
          className={`w-full bg-gray-200 text-gray-700 p-3 mt-4 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300 ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-busy={isResending}
        >
          {isResending ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};

export default Otp;
