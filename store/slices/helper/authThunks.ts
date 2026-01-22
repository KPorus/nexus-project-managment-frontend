import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiService } from "../../../services/apiService";
import { User } from "../../../types";


// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data: {email: string, password: string}, { rejectWithValue }) => {
    try {
      return await ApiService.auth.login(data.email, data.password);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const checkAuthSession = createAsyncThunk(
//   'auth/checkSession',
//   async (_, { rejectWithValue }) => {
//     try {
//       return await api.checkSession();
//     } catch (error) {
//       return rejectWithValue('No session');
//     }
//   }
// );

// export const logout = createAsyncThunk('auth/logout', async () => {
//   await api.logout();
// });

// export const acceptInvite = createAsyncThunk(
//   'auth/acceptInvite',
//   async (data: { token: string; password: string }, { rejectWithValue }) => {
//     try {
//       return await api.acceptInvite(data.token, data.password);
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );



export const loadUser = createAsyncThunk("auth/loadUser", async () => {
  const token = localStorage.getItem("taskflow_token");
  const userData = localStorage.getItem("taskflow_user");

  if (!token || !userData) {
    throw new Error("No session found");
  }

  return JSON.parse(userData) as User;
});
