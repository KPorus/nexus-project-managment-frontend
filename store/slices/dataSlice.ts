import { ProjectStatus, type DataState } from "../../types";
import {
  fetchAllprojects,
  fetchAllUsers,
  inviteUser,
  softDelete,
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
      })
      .addCase(inviteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(softDelete.pending,(state)=>{
        state.loading=true
      })
      .addCase(softDelete.fulfilled,(state,action)=>{
        const projectId = action.payload.id || action.payload?._id
        const index = state.projects.findIndex((p)=>p.id === projectId)
        // console.log("from reducer", projectId, index);
        if(index !==-1){
          state.projects[index].isDeleted = true
          state.projects[index].status = ProjectStatus.DELETED
        }
        // console.log("from soft delete builder",state.projects[index]);
        state.loading=false
      })
      .addCase(softDelete.rejected,(state)=>{
        state.loading=false
        state.error = "Delete failed"
      })
  },
});

export default dataSlice.reducer;
