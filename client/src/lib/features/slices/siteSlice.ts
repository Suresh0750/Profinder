
import {createSlice,configureStore} from '@reduxjs/toolkit'


const initialState = {
    workerName : []
}

const SiteSlice = createSlice({
    name :"SiteData",
    initialState,
    reducers:{
        updateWorkerName:(state,action)=>{
            state.workerName = action.payload
        }
    }
})

export const {updateWorkerName} = SiteSlice.actions

export default SiteSlice.reducer
