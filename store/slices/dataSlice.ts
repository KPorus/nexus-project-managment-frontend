import type { DataState } from '../../types';
import { fetchAllprojects } from './helper/dataThunks';
import { createSlice } from "@reduxjs/toolkit";



const initialState: DataState = {
  projects: [],
  // users: undefined,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllprojects.fulfilled, (state, action) => {
      state.projects = action.payload;
    })
  },
});

export default dataSlice.reducer;
