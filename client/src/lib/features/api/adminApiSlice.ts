
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import { addCategoryType, AdminCredentials, EditCategoryType } from '../../../types/adminTypes';

import axios from "axios"

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



// * Error Handler

export const handleAxiosError = (error:any)=>{
    console.log(error)
    const errorMessage = error?.response?.data?.errorMessage || error?.response?.data?.message || "Unexpected error occurred"
    console.log(errorMessage)
    return new Error(errorMessage)
}

export const addCategory = async(data: FormData)=>{
    try{
        const response = await axiosInstance1.post(`/admin/addCategory`,data);
        return response.data;
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const adminLogin =  async(data:AdminCredentials) =>{
    try{
        const response = await axiosInstance.post(`/admin/adminVerify`,data);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}
export const fetchCategories =  async() =>{
    try{
        const response = await axiosInstance.get(`/admin/fetchCategoryData`);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}
export const editCategorys =  async(data: EditCategoryType | any) =>{
    try{
        const response = await axiosInstance1.post(`/admin/editCategory`,data);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const toggleCategoryListing = async(data:{_id:string,isListed:boolean})=>{
    try{
        const response = await axiosInstance.post(`/admin/isListVerify`,data);
        return response.data
    }catch(error:any){
        throw handleAxiosError(error)
    }
}

export const deleteProduct = async (data:string)=>{
    try{
        const response = await axiosInstance.delete(`/admin/deleteProduct/${data}`);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const adminLogout = async ()=>{
    try{
        const response = await axiosInstance.post(`/admin/adminLogout`);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchWorkerList = async()=>{
    try{
        const response = await axiosInstance.get(`/admin/workerList`);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchUserList = async ()=>{
    try{
        const response = await axiosInstance.get(`/admin/allUserlist`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const toggleUserBlock = async (data:{isBlocked:boolean,_id:string})=>{
    try{
        const response = await axiosInstance.post(`/admin/isBlockUser`,data)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchUnapprovedWorkers = async()=>{
    try{
        const response = await axiosInstance.get(`/admin/allUnApprovalWorkerlist`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}


export const approveWorker =  async (workerId:string)=>{
    try{
        const response = await axiosInstance.put(`/admin/isWorkerApproval/${workerId}`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchDashboardOverview = async()=>{
    try{
        const response = await axiosInstance.get(`/admin/dashboardOverview`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchDashboardData = async ()=>{
    try{
        const response = await axiosInstance.get(`/admin/dashboard`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchWorkerDashboardData = async ()=>{
    try{
        const response = await axiosInstance.get(`/admin/dashboardWorker`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchReviewDashboardData = async ()=>{
    try{
        const response = await axiosInstance.get(`/admin/dashboard-review`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchSalesReport = async (data:any)=>{
    try{
        const response = await axiosInstance.get(`/admin/sales-report`,{
            params: data
          })
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchCategoryList = async()=>{
    try{
        const response = await axiosInstance.get(`/admin/categoryList`);
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const downloadSalesReport = async (data:any)=>{
    try{
        const params = data
        const response = await axiosInstance.get(`/admin/download-sales`,{params});
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const fetchWorkerData = async (data:any)=>{
    try{
        const response = await axiosInstance.get(`/admin/worker-details/${data}`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const blockWorker = async (data:string)=>{
    try{
        const response = await axiosInstance.patch(`/admin/worker/isBlock/${data}`)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}