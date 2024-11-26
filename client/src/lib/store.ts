import { configureStore } from '@reduxjs/toolkit';



// * slice
import UserForgetPasswordData from '@/lib/features/slices/userSlice';
import WorkerSlice from '../lib/features/slices/workerSlice'
import CustomerSlice from '../lib/features/slices/customerSlice'
import SiteSlice from '../lib/features/slices/siteSlice'

export const store = configureStore({
  reducer: {
    UserForgetPassword : UserForgetPasswordData,
    WorkerSignupData : WorkerSlice,
    CustomerData : CustomerSlice,
    SiteDetais : SiteSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
