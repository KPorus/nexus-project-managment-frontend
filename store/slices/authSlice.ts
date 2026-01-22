import { createSlice } from "@reduxjs/toolkit";

import { login } from "./helper/authThunks";
import { clearAuthFromStorage, loadAuthFromStorage } from "./helper/authStorage";
import type { AuthState } from "../../types";
const persisted = loadAuthFromStorage();

const initialState: AuthState = {
  user: persisted.user,
  token: persisted.token,
  isAuthenticated: persisted.isAuthenticated,
  isLoading: false,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAuthFromStorage();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Session
      // .addCase(checkAuthSession.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(checkAuthSession.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = true;
      //   state.user = action.payload.user;
      //   state.token = action.payload.token;
      // })
      // .addCase(checkAuthSession.rejected, (state) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = false;
      //   state.user = null;
      //   state.token = null;
      // })
    // // Accept Invite
    // .addCase(acceptInvite.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // })
    // .addCase(acceptInvite.fulfilled, (state) => {
    //   state.isLoading = false;
    //   // Do not set isAuthenticated; user must login manually
    // })
    // .addCase(acceptInvite.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
