import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery,FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query/react"
import { addCategoryType, AdminCredentials, EditCategoryType } from '../../../types/adminTypes';

// * baseQuery
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    credentials: 'include',  
   
});



// * Function to get headers
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  
});


export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery,
    endpoints: (builder) => ({
        AddCategoryForm: builder.mutation({
            query: (data: FormData) => ({
                url: `/admin/addCategory`,
                method: "POST",
                body: data,
                headers: {
                    Role : 'admin',
                }, 
            }),
        }),
        AdminVeriyAPI: builder.mutation({
            query: (data: AdminCredentials) => ({
                url: `/admin/adminVerify`,
                method: 'POST',
                body: data,
                headers: getHeaders('admin'), 
            }),
        }),
        FetchCategoryData: builder.query({
            query: () => ({
                url: '/admin/fetchCategoryData',
                method: 'GET',
                headers: getHeaders('admin'), 
            }),
        }),
        EditCategoryAPI: builder.mutation({
            query: (data: EditCategoryType | any) => ({
                url: `/admin/editCategory`,
                method: 'POST',
                body: data,
                headers: getHeaders('admin'), 
            }),
        }),
        ListUnlistAPI: builder.mutation({
            query: (data: { _id: string; isListed: boolean }) => ({
                url: `/admin/isListVerify`,
                method: 'POST',
                body: data,
                headers: getHeaders('admin'), 
            }),
        }),
        deleteProductAPI: builder.mutation({
            query: (data: string) => ({
                url: `/admin/deleteProduct/${data}`,
                method: 'DELETE',
                headers: getHeaders('admin'), 
            }),
        }),
        AdminLogoutAPI: builder.mutation({
            query: () => ({
                url: `/admin/adminLogout`,
                method: 'POST',
                headers: getHeaders('admin'), 
            }),
        }),
        getWorkerList : builder.query({
            query : ()=>({
                url: `/admin/getWorkerList`,
                method: "GET",
                headers: getHeaders('admin'), 
            })
        }),
        getUserList : builder.query({
            query:()=>({
                url:'/admin/getAllUserList',
                method:'GET',
                headers:getHeaders('admin')
            })
        }),
        isUserBlock: builder.mutation({
            query: (data:{isBlock:boolean,_id:string}) => ({
              url: `/admin/isBlockUser`,
              method: 'POST',
              body : data,
              headers: getHeaders('admin')
            })
          }), 
        getAllUnApprovalWorkerlist : builder.query({
            query:()=>({
                url: `/admin/getAllUnApprovalWorkerlist`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        isWorkerApproval : builder.mutation({
            query:(data:string)=>({
                url: `/admin/isWorkerApproval/${data}`,
                method: 'PUT',
                headers: getHeaders('admin') 
            })
        }),
        dashboardOverview : builder.query({
            query:()=>({
                url: `/admin/dashboardOverview`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        dashboard : builder.query({
            query:()=>({
                url: `/admin/dashboard`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        dashboardWorker : builder.query({
            query:()=>({
                url: `/admin/dashboardWorker`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        dashboardReview : builder.query({
            query:()=>({
                url: `/admin/dashboard-review`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        salesReport : builder.query({
            query:(data)=>({
                url: `/admin/sales-report`,
                method: 'GET',
                params : data,
                headers: getHeaders('admin') 
            })
        }),
        categoryList : builder.query({
            query:()=>({
                url: `/admin/categoryList`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        downloadSales : builder.query({
            query:(data)=>({
                url: `/admin/download-sales`,
                method: 'GET',
                params : data,
                headers: getHeaders('admin') 
            })
        }),
        getWorkerData : builder.query({
            query : (data)=>({
                url: `/admin/worker-details/${data}`,
                method: 'GET',
                headers: getHeaders('admin') 
            })
        }),
        isWorkerBlock : builder.mutation({
            query : (data:string)=>({
                url : `/admin/worker/isBlock/${data}`,
                method: 'PATCH',
                headers : getHeaders('admin')
            })
        })
    })
});

// * Export hooks for usage in functional components
export const {
    useIsWorkerBlockMutation,
    useGetWorkerDataQuery,
    useDownloadSalesQuery,
    useAddCategoryFormMutation,
    useAdminVeriyAPIMutation,
    useFetchCategoryDataQuery,
    useEditCategoryAPIMutation,
    useListUnlistAPIMutation,
    useDeleteProductAPIMutation,
    useAdminLogoutAPIMutation,
    useGetWorkerListQuery,
    useGetUserListQuery,
    useIsUserBlockMutation,
    useGetAllUnApprovalWorkerlistQuery,
    useIsWorkerApprovalMutation,
    useDashboardOverviewQuery,
    useDashboardQuery,
    useDashboardWorkerQuery,
    useDashboardReviewQuery,
    useSalesReportQuery,
    useCategoryListQuery,
} = adminApi;


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
    const errorMessage = error?.response?.data?.errorMessage || "Unexpected error occurred"
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

export const toggleUserBlock = async (data:{isBlock:boolean,_id:string})=>{
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
        const response = await axiosInstance.get(`/admin/sales-report`,data)
        return response.data
    }catch(error:any){
      throw handleAxiosError(error)
    }
}

export const categoryList = async()=>{
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

export const workerData = async (data:any)=>{
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