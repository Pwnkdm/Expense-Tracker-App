import { configureStore } from "@reduxjs/toolkit";
import { expensesApi } from "./features/apiSlice";

export const store = configureStore({
  reducer: {
    [expensesApi.reducerPath]: expensesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(expensesApi.middleware),
});

export default store;
