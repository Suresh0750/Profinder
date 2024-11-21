import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
// import { register } from "module"
import {FormValues} from "@/types/workerTypes"

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    credentials: 'include',  // for include cookies
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

// useGetUpcomingWorksQuery


export const workerApi = createApi({
    reducerPath : "workerApi",
    baseQuery,
    endpoints :(builder)=>({
        WorkerSignUp : builder.mutation({
            query : (data:FormValues)=>({
                url:`/worker/personalinfo`,
                method:"POST",
                body : data
            })
        }),
        ProfessionalInfo : builder.mutation({
            query : (data)=>({
                url:`/worker/ProfessionalInfo`,
                method:"POST",
                body : data
            })
        }),
        checkWorkerEmailForgetPass : builder.mutation({
            query : (data)=>({
                url:`/worker/checkEmailForgetPass`,
                method : 'POST',
                body : data
            })
        }),
        getWorkerDetails : builder.query({
            // query:()=> '/worker/getWorkerData'
            query : ()=>({
                url:`/worker/getWorkerData`,
                method : 'GET',
                headers : getHeaders('worker')
            })
        }),
        Login : builder.mutation({
            query : (data)=>({
                url:`/worker/loginverify`,
                method:"POST",
                body : data
            })
        }),
        workerUploadProject : builder.mutation({
            query : (data:any)=>({
                url:`/worker/uploadWorkerProject`,
                method:"POST",
                body : data,
                headers : {
                    'Role': 'worker', 
                }
            })
        }),
        getWorkerProject : builder.query({
               query :(data)=>({
                url:`/worker/getWorkerProject/${data}`,
                method:"GET",
                headers : getHeaders('worker')
               })
        }),
        getSingleWorkerDetails : builder.query({
            query : (data)=>({
                url:`/worker/singleWorkerDetails/${data}`,
                method:"GET",
            })
        }),
        getAllRequestData : builder.query({
            query : (data:string)=>({
                url : `/worker/getRequestData/${data}`,
                method : "GET",
                headers : getHeaders('worker')
            })
        }),
        AcceptWorkAPI : builder.mutation({
            query : (data:{_id:string,isPayment:number,userId:string})=>({
                url : `/worker/isAcceptWork/${JSON.stringify(data)}`,
                method: "PUT",
                headers : getHeaders('worker')
            })
        }),
        rejectWorkAPI : builder.mutation({
            query : (data)=>({
                url : `/worker/rejectWork/${data}`,
                method: "PUT",
                headers : getHeaders('worker')
            })
        }),
        getmessage : builder.query({  // * fetch the all user name who all have conection with him.
            query :(data:string)=>({
                url : `/worker/message/${data}`,
                method: "GET",
                headers : getHeaders('worker')
            })
        }),
        updateMessage: builder.mutation({
            query:(data)=>({
                url:`/worker/message`,
                method:"POST",
                body:data,
                headers:getHeaders("worker")
            })
        }),
        fetchMessage : builder.query({
            query : (data:string)=>({
                url:`/worker/fetchmessage/${data}`,
                method:"GET",
                headers:getHeaders("worker")
            })
        }),
        dashboard : builder.query({
            query : (data:string)=>({
                url:`/worker/dashboard/${data}`,
                method:"GET",
                headers:getHeaders("worker")
            })
        }),
        getUpcomingWorks: builder.query({
            query : (data)=>({
                url : `/worker/upcoming-workers/${data}`,
                method : 'GET',
                headers : getHeaders('worker')
            })
        }),
        updateWorkStatus: builder.mutation({
            query :(data:{status:string,_id:string})=>({
                url : `/worker/markStatus/${data.status}/${data._id}`,
                method : 'PUT',
                headers : getHeaders('worker')
            })
        }),
        addtionalProffessionalInfo : builder.mutation({
            query : (data:{_id:string,experience:string,rate:number,availability:string})=>({
                url : `/worker/addtionalProfessionalDetails`,
                method:'PUT',
                body : data,
                headers : getHeaders('worker')
            })
        })
    })
})


export const {
    useAddtionalProffessionalInfoMutation,
    useWorkerSignUpMutation,
    useProfessionalInfoMutation,
    useCheckWorkerEmailForgetPassMutation,
    useLoginMutation,
    useGetWorkerDetailsQuery,
    useWorkerUploadProjectMutation,
    useGetWorkerProjectQuery,
    useGetSingleWorkerDetailsQuery,
    useGetAllRequestDataQuery,
    useAcceptWorkAPIMutation,
    useRejectWorkAPIMutation,
    useGetmessageQuery,
    useUpdateMessageMutation,
    useFetchMessageQuery,
    useDashboardQuery,
    useGetUpcomingWorksQuery,
    useUpdateWorkStatusMutation,
} = workerApi

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
        const response = await axiosInstance.post(`/worker/uploadWorkerProject`,data)
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
