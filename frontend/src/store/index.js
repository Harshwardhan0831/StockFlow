import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketReducer from './slices/marketSlice';
import demoReducer from './slices/demoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,
    demo: demoReducer,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
