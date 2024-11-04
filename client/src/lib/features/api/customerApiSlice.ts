

// * common API for User and Worker

import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {OTPData} from '../../../types/otpTypes/otpTypes'

console.log('back url',process.env.NEXT_NODE_SERVER_URL)
const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3001/v1/api',
    credentials: 'include',
});

// Function to get headers
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  // Specify Content-Type header
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
                url : `/customer/getNearByWorkerDetails${data}`,
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
    useCustomerOtpMutation,
    useCustomerResendMutation,
    useForgetPasswordMutation,
    useCustomerGoogleLoginMutation,
    useCustomerLogoutMutation,
    useCustomerGoogleVerificationMutation,
    useGetCategoryNameQuery,
    useListWorkerDataAPIQuery,
    useGetNearByworkerListMutation,
    useRequestToWorkerMutation,
    usePayU_APIMutation,
    useSavePaymentIdMutation,
    useSubmitReviewMutation,
    useGetReviewQuery,
    usePaymentDetailsQuery
} = customerApi