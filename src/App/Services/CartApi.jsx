import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const token = localStorage.getItem('token');
export const CartApi = createApi({
  reducerPath: 'Cart',  
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/users/' }),
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
    }),
    createorder: build.mutation({
      query:({item,token})=>({
        url:`createOrder`,
        method: 'POST',
        body:item,
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    }),
    getmobile: build.mutation({
      query:({token})=>({
        url:`getdeliverydeatils`,
        method: 'POST',
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    }),
    getOrder: build.mutation({
      query:({orderId,token})=>({
        url:`getOrderDetails`,
        method: 'POST',
        body:{orderId},
        headers: {"Authorization":`Bearer ${token}`},
        mode:"cors"
      })
    }),
    getAllOrders:build.mutation({
      query:({token})=>({
        url:"getallorders",
        mode:'cors',
        headers:{"Authorization":`Bearer ${token}`},
        method:"POST",
      })
    })
   
  }),
  
})

// Auto-generated hooks
export const { 
  useAddCartMutation,
  useGetItemsMutation,
  useDelMutation,
  useGetCartMutation,
  useCreateorderMutation,
  useGetmobileMutation,
  useGetOrderMutation,
  useGetAllOrdersMutation
} = CartApi


