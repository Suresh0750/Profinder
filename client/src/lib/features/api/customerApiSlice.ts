"use client"
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import {OTPData} from '../../../types/otpTypes/otpTypes'
import {useRouter} from 'next/navigation'


import axios from 'axios'

const axiosInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true,
})



// * Error handler

export const handleAxiosError = (error: any) => {
    console.log(error)
    console.error('API Error:', error);
    if ((error?.response?.status==403 || error?.response?.status==401 || error.data?.isBlock) && error?.response?.data?.middleware) {
            window.location.replace('/homePage')
            localStorage.setItem('customerData','')
            localStorage.setItem('workerDetails','')
            localStorage.setItem('conversationId','')
            const errorMessage = error?.response?.data?.message || "Unexpected error occurred.";
            return new Error(errorMessage);
        }

    const errorMessage = error?.response?.data?.errorMessage || error?.response?.data?.message || "Unexpected error occurred.";
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

