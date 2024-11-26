
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import {editeprofile} from '@/types/userTypes'
// * import { register } from "module"
import Router from 'next/router'; 


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
        const response = await axiosInstance.post("/user/checkEmailForgetPass",data)
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
export const updateprofile = async(data:any)=>{
    try{
        const response = await axiosInstance1.put(`/user/updateprofile`,data)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}

export const conversation  = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/user/conversation`,data)
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

export const fetchPaymentId = async (requestId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/paymentId/${requestId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw error
    }
}
