import React, { useState, useContext } from 'react';
import OTPInput from 'react-otp-input';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { context } from '../../App';
import {
  useRequestPasswordResetMutation,
  useVerifyPasswordResetMutation,
  usePasswordResetMutation,
} from '../../App/Services/AuthenticationApi';

const ForgotPassword = () => {
  const [otp, setOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signInOpen, setSignInOpen, signUpInEmail, forgotPasswordOpen, setForgotPasswordOpen } = useContext(context);

  const [requestPasswordReset, { isLoading: isSendingOtp }] = useRequestPasswordResetMutation();
  const [verifyPasswordReset, { isLoading: isVerifyingOtp }] = useVerifyPasswordResetMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = usePasswordResetMutation();

  const handleSendOtp = async () => {
    try {
      const res = await requestPasswordReset({ email: signUpInEmail });
      if (res.error?.status === 400) {
        setMessage(res.error?.data?.message || 'Invalid email address.');
      } else {
        setMessage(res.data.message || 'OTP sent successfully.');
        setOtpSent(true);
        setResendEnabled(false);
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
    }
  };

  const handleSubmitOtp = async () => {
    try {
      const res = await verifyPasswordReset({ email: signUpInEmail, otp:Number(otp) });
      if (res.error?.status === 400) {
        setMessage(res.error?.data?.message || 'Invalid OTP.');
      } else {
        setMessage(res.data?.message || 'OTP verified.');
        setOtpVerified(true);
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await requestPasswordReset({ email: signUpInEmail });
      if (res.error?.status === 400) {
        setMessage(res.error?.data?.message || 'Invalid email address.');
      } else {
        setMessage(res.data?.message || 'OTP resent successfully.');
        setResendEnabled(false);
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const res = await resetPassword({ email: signUpInEmail, newPassword });
      if (res.error?.status === 400) {
        setMessage(res.error?.data?.message || 'Invalid request.');
      } else {
        setMessage(res.data?.message || 'Password reset successfully.');
        alert('Password reset successfully. Please sign in again.');
        setForgotPasswordOpen(false);
        setSignInOpen(true);
      }
    } catch (err) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-30">
      <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md text-center relative">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Reset Password</h2>
        <p className="text-gray-700 mb-1">Reset password for:</p>
        <p className="text-gray-900 font-medium mb-4 truncate">{signUpInEmail}</p>

        {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

        {!otpSent && (
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mb-4"
            disabled={isSendingOtp}
          >
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
        )}

        {otpSent && !otpVerified && (
          <div>
            <p className="text-gray-600 mb-2">Enter OTP (Valid for 5 minutes)</p>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: '2.5rem',
                height: '2.5rem',
                margin: '0 0.25rem',
                fontSize: '1.5rem',
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.3)',
              }}
              isInputNum
            />
            <div className="flex mt-4 gap-2">
              <button
                onClick={handleSubmitOtp}
                className="w-1/2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
              <button
                onClick={handleResendOtp}
                className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                disabled={!resendEnabled || isSendingOtp}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {otpVerified && (
          <form onSubmit={handlePasswordReset} className="mt-4">
            <p className="text-gray-600 mb-4">Enter your new password.</p>
            <div className="mb-4 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
        <button
          onClick={() => {
            setForgotPasswordOpen(false);
            setSignInOpen(true);
          }}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
