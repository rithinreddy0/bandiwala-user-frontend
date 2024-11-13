import { configureStore } from '@reduxjs/toolkit'
import { AuthApi } from './Services/AuthenticationApi'
import { setupListeners } from '@reduxjs/toolkit/query'
export const Store = configureStore({
  reducer: {
    [AuthApi.reducerPath]:AuthApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(AuthApi.middleware),
})


setupListeners(Store.dispatch)