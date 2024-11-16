import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
    del: build.mutation({
        query: (body) => ({
          url: `AddToCart`,
          method: 'POST',
          body,
          mode:"cors"
        })
      }),
    
    

    
  }),
})

// Auto-generated hooks
export const { 
  useAddCartMutation
  
} = CartApi


