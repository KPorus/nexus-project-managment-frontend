import {
  configureStore,
  type ThunkDispatch,
  type UnknownAction,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dataReducer from "./slices/dataSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, UnknownAction>;
