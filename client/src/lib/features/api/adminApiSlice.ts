import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addCategoryType, AdminCredentials, EditCategoryType } from '../../../types/adminTypes';

// * baseQuery
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}`,
    credentials: 'include',  
   
});

// * Function to get headers
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  // Specify Content-Type header
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
                url: `/admin/isWorkerApproval${data}`,
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
        })
    })
});

// * Export hooks for usage in functional components
export const {
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