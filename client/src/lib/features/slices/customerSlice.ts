
import { createSlice,configureStore } from "@reduxjs/toolkit";


const initialState  ={
       customerId : '',
       isLogin : false,   // for testing
       role : ''
} 
const CustomerSlice = createSlice({
    name:"UserData",
    initialState ,
    reducers :{
    updateWorkerId :(state,action)=>{
        state.customerId = action.payload
    },
    updateCustomerLogin : (state,action)=>{
        state.isLogin = action.payload
    },
    updateRole :(state,action)=>{
        state.role = action.payload
    }
   }
})


export const {updateWorkerId,updateCustomerLogin,updateRole} = CustomerSlice.actions

export default CustomerSlice.reducer