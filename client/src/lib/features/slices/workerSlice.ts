import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   signUpData: {
    firstName: '',
    lastName: '',  
    phoneNumber: '',
    emailAddress: '',
    password: '',
    profile: ''  
   },
   getWorkerData : {}
}

const WorkerSlice = createSlice({
    name: "WorkerData",
    initialState,
    reducers: {
        updateSignup: (state, action) => {
            state.signUpData = { ...state.signUpData, ...action.payload }; 
        },
        getWorkerData :(state,action)=>{
            state.getWorkerData = action.payload
        }
    }
})

export const { updateSignup,getWorkerData } = WorkerSlice.actions;
export default WorkerSlice.reducer;