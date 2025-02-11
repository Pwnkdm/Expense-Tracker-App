import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setCredentials,
  updateToken,
  logOut,
} from "../features/auth/authSlice";
import { message } from "antd";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const errorData = result.error.data;

    // Only attempt refresh if token is expired (not invalid)
    if (errorData?.isExpired) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = api.getState().auth.refreshToken;

        try {
          const refreshResult = await baseQuery(
            {
              url: "/auth/refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult?.data?.accessToken) {
            api.dispatch(
              updateToken({ accessToken: refreshResult.data.accessToken })
            );
            processQueue(null, refreshResult.data.accessToken);
            // Retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
          } else {
            processQueue(new Error("Failed to refresh token"));
            api.dispatch(logOut());
            message.error("Session expired. Please login again.");
          }
        } catch (err) {
          processQueue(err);
          api.dispatch(logOut());
          message.error("Session expired. Please login again.");
        } finally {
          isRefreshing = false;
        }
      } else {
        // If refresh token is being processed, wait for it
        const retryOriginalRequest = new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        try {
          const token = await retryOriginalRequest;
          const headers = result.meta.request.headers;
          headers.set("authorization", `Bearer ${token}`);
          result = await baseQuery(args, api, extraOptions);
        } catch (err) {
          return { error: err };
        }
      }
    } else {
      // Token is invalid (not just expired)
      api.dispatch(logOut());
      message.error("Invalid session. Please login again.");
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            })
          );
        } catch (error) {
          console.error("Error during signup:", error);
        }
      },
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              user: data.user,
            })
          );
        } catch ({ error }) {
          // console.error("Error during login:", error);
          message.error(error?.data?.msg || "Something went wrong!");
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useLogoutMutation } =
  authApi;
