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
  "data/updateUser",
  async ({
    id,
    status,
    role,
  }: {
    id: string;
    status?: UserStatus;
    role?: Role;
  }) => {
    return await ApiService.user.update(id, status, role);
  }
);

export const inviteUser = createAsyncThunk(
  "data/inviteUser",
  async ({ email, role }: { email: string; role: Role }) => {
    return await ApiService.user.invite(email, role);
  }
);

export const acceptInvite = createAsyncThunk(
  "data/acceptInvite",
  async ({ token, password }: { token: string; password: string }) => {
    return await ApiService.user.acceptInvite(token, password);
  }
);
