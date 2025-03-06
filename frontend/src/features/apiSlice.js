import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define API slice
export const expensesApi = createApi({
  reducerPath: "expensesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");

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

    updateExpense: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/api/expenses/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Expenses"], // Refetch after updating
    }),

    addExpense: builder.mutation({
      query: (newExpense) => ({
        url: "/api/expenses",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expenses"], // Refetch after adding
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/api/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses"], // Refetch after deleting
    }),

    getMonthlyDetails: builder.query({
      query: ({ year, month, type, category, description, sortOrder }) => {
        let url = `/api/monthly/${year}/${month}`;
        const params = new URLSearchParams();

        if (type) params.append("type", type);
        if (category) params.append("category", category);
        if (description) params.append("description", description);
        if (sortOrder) params.append("sortOrder", sortOrder);

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        return url;
      },
      providesTags: ["Expenses"],
    }),
  }),
});

// Export hooks
export const {
  useGetExpensesQuery,
  useGetMonthlyDetailsQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation, // Added delete hook export
} = expensesApi;

// Export reducer
export default expensesApi.reducer;
