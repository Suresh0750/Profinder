

import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import {editeprofile} from '@/types/userTypes'
// * import { register } from "module"


const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    credentials: 'include',  // * for include cookies
})

const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs, 
    unknown,            
    FetchBaseQueryError 
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

 
    if (
        result.error &&
        (result.error.status === 403 || result.error.status === 401)
    ) {
       
        localStorage.setItem("customerData", "");

    }

    return result;
};

// * Function to get headers and pass the role via header in request
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  // Specify Content-Type header
});


export const userApi = createApi({
    reducerPath : "userApi",
    baseQuery,
    endpoints :(builder)=>({
        SignUp : builder.mutation({
            query : (data)=>({
                url:`/user/userSignup`,
                method:"POST",
                body : data
            })
        }),
        Login : builder.mutation({
            query : (data)=>({
                url:`/user/loginverify`,
                method:"POST",
                body : data
            })
        }),
        checkEmailForgetPass : builder.mutation({
            query : (data)=>({
                url:`/user/checkEmailForgetPass`,
                method : 'POST',
                body : data
            })
        }),
        Profile : builder.query({
            query :(data)=>({
                url : `/user/profile/${data}`,
                method: "GET",
                headers : getHeaders("user")
            })
        }),
        updateprofile : builder.mutation({
            query :(data:editeprofile | any)=>({
                url : `/user/updateprofile`,
                method: "PUT",
                body : data,
                headers: {
                    'Role' : 'user',
                    // 'Content-Type': 'multipart/form-data', 
                },
            })
        }),
        conversation : builder.mutation({
            query :(data)=>({
                url:`/user/conversation`,
                method : 'POST',
                body : data,
                headers : getHeaders("user")
            })
        }),
        getAllconversation: builder.query({
            query:(userId:string)=>({
                url:`/user/conversation/${userId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        getAllMessage:builder.query({
            query:(conversationId:string)=>({
                url:`/user/message/${conversationId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        booking : builder.query({
            query : (userId:string)=>({
                url:`/user/booking/${userId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        paymentId : builder.query({
            query : (requestId:string)=>({
                url:`/user/paymentId/${requestId}`,
                method:'GET',   
                headers:getHeaders('user')
            })
        })
    })
})


export const {
    useSignUpMutation,
    useLoginMutation,
    useCheckEmailForgetPassMutation,
    useProfileQuery,
    useUpdateprofileMutation,
    useConversationMutation,
    useGetAllconversationQuery,
    useGetAllMessageQuery,
    useBookingQuery,
    usePaymentIdQuery,
} = userApi



import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true,
})

// * for add the photo
const axiosInstance1 = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    withCredentials : true,
})


// * Error handler
export const handleAxiosError = (error: any) => {
    console.log(error)
    const errorMessage = error?.response?.data?.errorMessage || "Unexpected error occurred.";
    console.log(errorMessage)
    return new Error(errorMessage);
};

export const signUp = async (data:any)=>{
    try{
        const response = await axiosInstance.post(`/user/userSignup`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const logIn = async (data: any) => {
    try {
        const response = await axiosInstance.post("/user/loginverify", data);
        return response.data;
    } catch (error: any) {      
        throw handleAxiosError(error)
    }
};

export const checkEmailForgetPass = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/user/checkEmailForgetPass",{data})
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}
export const profile = async(data:string)=>{
    try{
        const response = await axiosInstance.get(`/user/profile/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}
export const updateprofile = async(data:string)=>{
    try{
        const response = await axiosInstance1.put(`/user/updateprofile`,{data})
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const conversation  = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/user/conversation`,{data})
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const fetchAllConversation = async(userId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/conversation/${userId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const fetchAllMessage = async(conversationId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/message/${conversationId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const booking = async(userId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/booking/${userId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const paymentId = async (requestId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/paymentId/${requestId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}
