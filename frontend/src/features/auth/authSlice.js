import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken; // Store refresh token in state
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken); // Store refresh token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
    },
    updateToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateToken, logOut, setError } =
  authSlice.actions;
export default authSlice.reducer;
