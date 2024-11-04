
import { createSlice,configureStore } from "@reduxjs/toolkit";

// * didn't use change when we need for my understand
const initialState  ={
       userId : ''
} 
const UserSlice = createSlice({
    name:"UserData",
    initialState ,
    reducers :{
    updateUserId :(state,action)=>{
        state.userId = action.payload
    }
   }
})


export const {updateUserId} = UserSlice.actions

export default UserSlice.reducer