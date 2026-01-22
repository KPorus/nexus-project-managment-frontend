import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";

// export const fetchAllUsers = createAsyncThunk(
//   "data/fetchAllUsers",
//   async () => {
//     return await ApiService.user.list();
//   }
// );
export const fetchAllprojects = createAsyncThunk(
  "data/fetchAllprojects",
  async () => {
    return await ApiService.project.list();
  }
);