import { createSlice } from "@reduxjs/toolkit";
import { DataState } from "../../types";
import { fetchAllUsers } from "./helper/dataThunks";

const initialState: DataState = {
  project: [],
  users: undefined,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

export default dataSlice.reducer;
