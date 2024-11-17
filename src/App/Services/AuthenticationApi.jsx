import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const AuthApi = createApi({
  reducerPath: 'Auth',  
  baseQuery: fetchBaseQuery({ baseUrl: 'https://bandiwala-backend.onrender.com/api/users/' }),
  endpoints: (build) => ({
    signUp: build.mutation({
      query: (body) => ({
        url: `signup`,
        method: 'POST',
        body,
      })
    }),
    otpVerify: build.mutation({
      query: (body) => ({
        url: `verify-otp`,
        method: 'POST',
        body,
      })
    }),
    signIn: build.mutation({
      query: (body) => ({
        url: `login`,
        method: 'POST',
        body,
      })
    }),
    requestPasswordReset: build.mutation({
      query: (body) => ({
        url: `request-password-reset`,
        method: 'POST',
        body,
      })
    }),
    verifyPasswordReset: build.mutation({
      query: (body) => ({
        url: `verify-password-reset`,
        method: 'POST',
        body,
      })
    }),
    passwordReset: build.mutation({
      query: (body) => ({
        url: `reset-password`,
        method: 'POST',
        body,
      })
    }),

    
  }),
})

// Auto-generated hooks
export const { 
  useSignUpMutation,
  useOtpVerifyMutation,
  useSignInMutation,
  useRequestPasswordResetMutation,
  useVerifyPasswordResetMutation,
  usePasswordResetMutation

} = AuthApi


