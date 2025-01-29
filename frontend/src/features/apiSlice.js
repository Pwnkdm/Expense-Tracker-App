import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API slice
export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => "/api/expenses",
      providesTags: ["Expenses"],
    }),
    addExpense: builder.mutation({
      query: (newExpense) => ({
        url: "/api/expenses",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expenses"], // Refetch after adding
    }),
  }),
});

// Export hooks
export const { useGetExpensesQuery, useAddExpenseMutation } = expensesApi;

// Export reducer
export default expensesApi.reducer;
