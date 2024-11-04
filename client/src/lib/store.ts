import { configureStore } from '@reduxjs/toolkit';

// * API call 
import { userApi } from './features/api/userApiSlice';  
import { customerApi } from './features/api/customerApiSlice';
import { adminApi } from './features/api/adminApiSlice';
import { workerApi } from './features/api/workerApiSlice';


// * slice
import UserForgetPasswordData from '@/lib/features/slices/userSlice';
import WorkerSlice from '../lib/features/slices/workerSlice'
import CustomerSlice from '../lib/features/slices/customerSlice'
import SiteSlice from '../lib/features/slices/siteSlice'

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [workerApi.reducerPath]: workerApi.reducer,
    UserForgetPassword : UserForgetPasswordData,
    WorkerSignupData : WorkerSlice,
    CustomerData : CustomerSlice,
    SiteDetais : SiteSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(customerApi.middleware)
      .concat(adminApi.middleware)
      .concat(workerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
