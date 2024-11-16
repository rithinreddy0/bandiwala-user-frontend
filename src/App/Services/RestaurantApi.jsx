import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const RestaurantApi = createApi({
  reducerPath: 'Restaurant',  
  baseQuery: fetchBaseQuery({ baseUrl: 'https://bandiwala-backend.onrender.com/api/users/' }),
  endpoints: (build) => ({
    getAllVendors: build.mutation({
      query: () => ({
        url: `getAllVendors`,
        method: 'POST',
        mode:"cors"
      })
    }),
    
    getVendorDetails: build.mutation({
        query: ({id}) => ({
          url: `getVendorDetails`,
          method: 'POST',
          body:{id},
          mode:"cors"
        })
      }),

    
  }),
})

// Auto-generated hooks
export const { 
  useGetAllVendorsMutation,
  useGetVendorDetailsMutation
  
} = RestaurantApi


