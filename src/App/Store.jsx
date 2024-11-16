import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from './Services/AuthenticationApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { RestaurantApi } from './Services/RestaurantApi'
import { CartApi } from './Services/CartApi'
export const Store = configureStore({
  reducer: {
    [AuthApi.reducerPath]:AuthApi.reducer,
    [RestaurantApi.reducerPath]:RestaurantApi.reducer,
    [CartApi.reducerPath]:CartApi.reducer

  },
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware()
  .concat(AuthApi.middleware)
  .concat(RestaurantApi.middleware)
  .concat(CartApi.middleware)
})


setupListeners(Store.dispatch)