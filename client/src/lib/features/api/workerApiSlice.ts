
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import {FormValues} from "@/types/workerTypes"
import Router from 'next/router'; 

import axios from 'axios'
const axiosInstance = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    headers : {
        "Content-Type" : "application/json"
    },
    withCredentials : true,
})
const axiosInstance1 = axios.create({
    baseURL : `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    withCredentials : true,
})

// Axios interceptor

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
export const handleAxiosError = (error:any)=>{
    console.log(error)
    const errorMessage = error?.response?.data?.errorMessage || "Unexpected error occurred";
    console.log(errorMessage)
    return new Error(errorMessage)
}

export const signUp = async(data:FormValues)=>{
    try{
        const response = await axiosInstance1.post(`/worker/personalinfo`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const professionalInfo = async(data:any)=>{
    try{
        const response = await axiosInstance1.post(`/worker/ProfessionalInfo`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const checkWorkerEmailForgetPass = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/worker/checkEmailForgetPass`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
    
}

export const fetchWorkerDetails = async()=>{
    try{
        const response = await axiosInstance.get(`/worker/getWorkerData`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}


export const login = async(data:any)=>{
    try{
        const response = await axiosInstance.post(`/worker/loginverify`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const uploadProject = async(data:any)=>{
    try{
        const response = await axiosInstance1.post(`/worker/uploadWorkerProject`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const fetchProject = async(data:any)=>{
    try{
        const response = await axiosInstance.get(`/worker/getWorkerProject/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const fetchSingleWorkerDetails = async(data:any)=>{
    try{
        const response = await axiosInstance.get(`/worker/singleWorkerDetails/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const fetchAllRequest = async(data:any)=>{
    try{
        const response = await axiosInstance.get(`/worker/getRequestData/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const acceptWork = async(data:{_id:string,isPayment:number,userId:string})=>{
    try{
        const response = await axiosInstance.put(`/worker/isAcceptWork/${JSON.stringify(data)}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const rejectWork = async(data:any)=>{
    try{
        const response = await axiosInstance.put(`/worker/rejectWork/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const connectedUsers = async(data:string)=>{
    try{
        const response = await axiosInstance.get(`/worker/connected-users/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const updateMessage = async(data:any)=>{
    try{
        const response = await axiosInstance.put(`/worker/message`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}


export const fetchMessage = async (data:string)=>{
    try{
        const response = await axiosInstance.get(`/worker/fetchmessage/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const dashboard = async (data:string)=>{
    try{
        const response = await axiosInstance.get(`/worker/dashboard/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const fetchUpcomingWorks = async(data:any)=>{
    try{
        const response = await axiosInstance.get(`/worker/upcoming-workers/${data}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const updateWorkStatus = async(data:{status:string,_id:string})=>{
    try{
        const response = await axiosInstance.put(`/worker/markStatus/${data.status}/${data._id}`)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const addtionalProffessionalInfo = async(data:{_id:string,experience:string,rate:number,availability:string})=>{
    try{
        const response = await axiosInstance.put(`/worker/addtionalProfessionalDetails`,data)
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}
