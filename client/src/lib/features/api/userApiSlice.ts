"use client"

import axios from 'axios'
import {SERVER_URL} from '@/lib/server/environment'

const axiosInstance = axios.create({
    baseURL : `${SERVER_URL}`,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true,
})

// * for add the photo
const axiosInstance1 = axios.create({
    baseURL : `${SERVER_URL}`,
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
        throw handleAxiosError(error)
    }
}

export const conversation  = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/user/conversation`,data)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw handleAxiosError(error)
    }
}

export const fetchAllConversation = async(userId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/conversation/${userId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw handleAxiosError(error)
    }
}

export const fetchAllMessage = async(conversationId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/message/${conversationId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw handleAxiosError(error)
    }
}

export const booking = async(userId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/booking/${userId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw handleAxiosError(error)
    }
}

export const fetchPaymentId = async (requestId:string)=>{
    try{
        const response = await axiosInstance.get(`/user/paymentId/${requestId}`)
        return response.data
    }catch(error:any){
        console.log(error.errMessage)
        throw handleAxiosError(error)
    }
}
