

// * common API for User and Worker
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import {OTPData} from '../../../types/otpTypes/otpTypes'
import Router from 'next/router'; 

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    credentials: 'include',
});
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

// Function to get headers
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  // * Specify Content-Type header
});


export const customerApi  = createApi({
    reducerPath : "CustomerOtp",
    baseQuery,
    endpoints :(builder)=>({
        CustomerOtp : builder.mutation({
            query : (data:OTPData)=>({
                url:`/customer/verifyOTP`,
                method:"POST",
                body : data,
                headers : getHeaders('customer')
            })
        }),
        CustomerResend : builder.mutation({
            query : (data:OTPData)=>({
                url : `/customer/resentOTP`,
                method:"POST",
                body:data,
                headers : getHeaders('customer')
            })
        }), 
        ForgetPassword : builder.mutation({          // * Forget password page API
            query : (data )=>({
                url : `/customer/setForgotPassword`,
                method : "POST",
                body :data,
                headers : getHeaders('customer')
            })
        }),
        CustomerGoogleLogin : builder.mutation({
            query : (data )=>({
                url : `/customer/CustomerGoogleLogin`,
                method : "POST",
                body :data,
                headers : getHeaders('customer')
            })
        }),
        CustomerLogout : builder.mutation({
            query : ()=>({
                url : `/customer/cutomerLogout`,
                method : "POST",
                headers : getHeaders('customer')
            })
        }),
        customerLogIn : builder.mutation({
            query : (data )=>({
                url : `/customer/customerLogIn`,
                method : "POST",
                body :data,
                headers : getHeaders('customer')
            })
        }),
        customerGoogleVerification : builder.mutation({
            query : (data)=>({
                url : `/customer/customerGoogleVerification`,
                method : "POST",
                body :JSON.stringify(data),
                headers : getHeaders('customer')
            })
        }),
        listWorkerDataAPI : builder.query({
            query : (data:{latitude:number,longitude:number})=>({
                url : `/customer/getALLVerifiedWorker/${data.latitude}/${data.longitude}`,
                method : "GET",
                headers : getHeaders('customer')
            })
        }),
        getCategoryName : builder.query({
            query : ()=> ({
                url : `/customer/getCategoryName`,
                method : "GET",
                headers : getHeaders('customer')
            })
        }),
        getNearByworkerList : builder.mutation({
            query : (data)=> ({
                url : `/customer/getNearByWorkerDetails/${data}`,
                method : "POST",
                headers : getHeaders('customer')
            })
        }),
        requestToWorker : builder.mutation({
            query : (data)=> ({
                url : `/customer/userRequestWorker`,
                method : "POST",
                body : data,
                headers : getHeaders('customer')
            })
        }),
        payU_API :builder.mutation({
            query : (data)=> ({
                url : `/customer/paymetAPI`,
                method : "POST",
                body : data,
                headers : getHeaders('customer')
            })
        }),
        savePaymentId : builder.mutation({
            query : (data)=> ({
                url : `/customer/savePaymentId`,
                method : "POST",
                body : data,
                headers : getHeaders('customer')
            })
        }),
        SubmitReview : builder.mutation({
            query : (data)=> ({
                url : `/customer/review`,
                method : "POST",
                body : data,
                headers : getHeaders('customer')
            })
        }),
        getReview : builder.query({
            query : (workerId:string)=>({
                url : `/customer/review/${workerId}`,
                method : "GET",
                headers : getHeaders('customer')
            })
        }),
        paymentDetails : builder.query({ // * show  to user worker details
            query : (requestId:string)=>({
                url : `/customer/payment-details/${requestId}`,
                method : "GET",
                headers : getHeaders('customer')
            })
        })
    })
})

// GoogleLogin


export const {
    // useCustomerOtpMutation,
    // useCustomerResendMutation,
    // useForgetPasswordMutation,
    // useCustomerGoogleLoginMutation,
    // useCustomerLogoutMutation,
    // useCustomerGoogleVerificationMutation,
    // useGetCategoryNameQuery,
    // useListWorkerDataAPIQuery,
    // useGetNearByworkerListMutation,
    // useRequestToWorkerMutation,
    // usePayU_APIMutation,
    // useSavePaymentIdMutation,
    // useSubmitReviewMutation,
    // useGetReviewQuery,
    // usePaymentDetailsQuery
} = customerApi

import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true,
})

// * Axios interceptor

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('accout is block')
        if (response.data?.isBlock) {
            console.log('User is blocked. Redirecting to login...');
            Router.replace('/homePage'); 
            localStorage.setItem('customerData','')
            localStorage.setItem('workerDetails','')
            localStorage.setItem('conversationId','')
            return Promise.reject(new Error('Account is blocked'));
        }
        return response; 
    },
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// * Error handler
export const handleAxiosError = (error: any) => {
    console.log(error)
    const errorMessage = error?.response?.data?.errorMessage || "Unexpected error occurred.";
    console.log(errorMessage)
    return new Error(errorMessage);
};

export const customerOtp = async (data:OTPData)=>{
    try{
        const response = await axiosInstance.post(`/customer/verifyOTP`,data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const customerResend = async(data:OTPData)=>{
    try{
        const response = await axiosInstance.post(`/customer/resentOTP`,data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const forgetPassword = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/customer/setForgotPassword`,data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const customerGoogleLogin = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/customer/CustomerGoogleLogin`,data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const customerLogout = async ()=>{
    try{
        const response = await axiosInstance.post(`/customer/cutomerLogout`)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const customerLogin = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/customer/customerLogIn",data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const customerGoogleVerification = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/customer/customerGoogleVerification",data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const listWorkerData = async(data:{latitude:number,longitude:number})=>{
    try{
        const response = await axiosInstance.get(`/customer/getALLVerifiedWorker/${data.latitude}/${data.longitude}`)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const fetchCategoryName = async()=>{
    try{
        const response = await axiosInstance.get("/customer/getCategoryName")
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const fetchNearByWorkerList = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/customer/getNearByWorkerDetails/${data}`)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const requestToWorker = async(data:any)=>{
    try{
        const response = await axiosInstance.post('/customer/userRequestWorker',data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const payUHash = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/customer/paymentAPI",data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const savePaymentId = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/customer/savePaymentId",data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const submitReview = async(data:any)=>{
    try{
        const response = await axiosInstance.post("/customer/review",data)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const fetchReview = async(workerId:string)=>{
    try{
        const response = await axiosInstance.get(`/customer/review/${workerId}`)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

export const paymentDetails = async(requestId:string)=>{
    try{
        const response = await axiosInstance.get(`/customer/payment-details/${requestId}`)
        return response.data
    }catch(error:any){
       throw handleAxiosError(error)
    }
}

