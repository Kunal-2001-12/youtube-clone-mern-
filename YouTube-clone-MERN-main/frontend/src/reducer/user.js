import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { backendURL } from "../config";

// Define the initial state
const initialState = {
  user: {},
  status: "idle", // for tracking the status of the fetch
  error: null,
};

// Create an async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${backendURL}/userdata`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  }
);

// Create a slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = "succeeded";
    },
    clearUser: (state) => {
      state.user = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the actions
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
