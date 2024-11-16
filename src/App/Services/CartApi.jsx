import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const token = localStorage.getItem('token');
export const CartApi = createApi({
  reducerPath: 'Cart',  
  baseQuery: fetchBaseQuery({ baseUrl: 'https://bandiwala-backend.onrender.com/api/users/' }),
  endpoints: (build) => ({
    addCart: build.mutation({
      query: ({item,token}) => ({
        url: `AddToCart`,
        method: 'POST',
        body:item,
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    }),
    getItems: build.mutation({
      query: ({token}) => ({
        url: `getCartDetails`,
        method: 'POST',
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    }),
    del: build.mutation({
        query: (body) => ({
          url: `AddToCart`,
          method: 'POST',
          body,
          mode:"cors"
        })
    }),
    getCart: build.mutation({
      query:({token})=>({
        url:`getCartDetails`,
        method: 'POST',
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    })
  }),
})

// Auto-generated hooks
export const { 
  useAddCartMutation,
  useGetItemsMutation,
  useDelMutation,
  useGetCartMutation
} = CartApi


