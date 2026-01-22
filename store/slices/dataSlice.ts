import type { DataState } from "../../types";
import {
  fetchAllprojects,
  fetchAllUsers,
  updateUser,
} from "./helper/dataThunks";
import { createSlice } from "@reduxjs/toolkit";

const initialState: DataState = {
  projects: [],
  users: undefined,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchAllprojects.fulfilled, (state, action) => {
        state.projects = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Safe array access with null checks
        if (state.users?.users && action.meta.arg.id) {
          const idx = state.users.users.findIndex(
            (u) => u.id === action.meta.arg.id
          );
          if (idx !== -1 && action.payload?.user) {
            state.users.users[idx] = action.payload.user;
          }
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Update failed";
      });
  },
});

export default dataSlice.reducer;
