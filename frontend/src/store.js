import { configureStore } from "@reduxjs/toolkit";
import { expensesApi } from "./features/apiSlice";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./services/authApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expensesApi.middleware),
});

export default store;
