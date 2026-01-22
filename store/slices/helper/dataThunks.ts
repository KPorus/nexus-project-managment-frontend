import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import type { Role, UserStatus } from "../../../types";
interface FetchUsersParams {
  page?: number;
  limit?: number;
}
export const fetchAllUsers = createAsyncThunk(
  "data/fetchAllUsers",
  async ({ page, limit }: FetchUsersParams) => {
    return await ApiService.user.list(page, limit);
  }
);
export const fetchAllprojects = createAsyncThunk(
  "data/fetchAllprojects",
  async () => {
    return await ApiService.project.list();
  }
);

export const updateUser = createAsyncThunk(
  'data/updateUser',
  async ({ id, status, role }: { id: string; status?: UserStatus; role?: Role }) => {
    return await ApiService.user.update(id,status, role);
  }
);

