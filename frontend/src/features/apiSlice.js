import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API slice
export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      console.log(token, "acess Token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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

    getMonthlyDetails: builder.query({
      query: ({ year, month }) => `/api/monthly/${year}/${month}`, // Dynamically use year and month from params
      providesTags: ["Expenses"],
    }),
  }),
});

// Export hooks
export const {
  useGetExpensesQuery,
  useGetMonthlyDetailsQuery,
  useAddExpenseMutation,
} = expensesApi;

// Export reducer
export default expensesApi.reducer;
