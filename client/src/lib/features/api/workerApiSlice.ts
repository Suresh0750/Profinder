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