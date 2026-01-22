import { configureStore, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, UnknownAction>;
