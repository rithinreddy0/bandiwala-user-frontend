import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from './Services/AuthenticationApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { RestaurantApi } from './Services/RestaurantApi'
export const Store = configureStore({
  reducer: {
    [AuthApi.reducerPath]:AuthApi.reducer,
    [RestaurantApi.reducerPath]:RestaurantApi.reducer

  },
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware()
  .concat(AuthApi.middleware)
  .concat(RestaurantApi.middleware),
})


setupListeners(Store.dispatch)