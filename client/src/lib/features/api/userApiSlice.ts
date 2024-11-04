

import Login from "@/app/(pages)/admin/login/page"
import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import {editeprofile} from '@/types/userTypes'
// * import { register } from "module"

console.log('back url',process.env.NEXT_NODE_SERVER_URL)
const baseQuery = fetchBaseQuery({
    baseUrl : `http://localhost:3001/v1/api`,
    credentials: 'include',  // * for include cookies
})

// * Function to get headers and pass the role via header in request
const getHeaders = (role: string) => ({
    'Role': role, 
    'Content-Type': 'application/json'  // Specify Content-Type header
});


export const userApi = createApi({
    reducerPath : "userApi",
    baseQuery,
    endpoints :(builder)=>({
        SignUp : builder.mutation({
            query : (data)=>({
                url:`/user/userSignup`,
                method:"POST",
                body : data
            })
        }),
        Login : builder.mutation({
            query : (data)=>({
                url:`/user/loginverify`,
                method:"POST",
                body : data
            })
        }),
        checkEmailForgetPass : builder.mutation({
            query : (data)=>({
                url:`/user/checkEmailForgetPass`,
                method : 'POST',
                body : data
            })
        }),
        Profile : builder.query({
            query :(data)=>({
                url : `/user/profile${data}`,
                method: "GET",
                headers : getHeaders("user")
            })
        }),
        updateprofile : builder.mutation({
            query :(data:editeprofile | any)=>({
                url : `/user/updateprofile`,
                method: "PUT",
                body : data,
                headers: {
                    'Role' : 'user',
                    // 'Content-Type': 'multipart/form-data', 
                },
            })
        }),
        conversation : builder.mutation({
            query :(data)=>({
                url:`/user/conversation`,
                method : 'POST',
                body : data,
                headers : getHeaders("user")
            })
        }),
        getAllconversation: builder.query({
            query:(userId:string)=>({
                url:`/user/conversation/${userId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        getAllMessage:builder.query({
            query:(conversationId:string)=>({
                url:`/user/message${conversationId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        booking : builder.query({
            query : (userId:string)=>({
                url:`/user/booking/${userId}`,
                method:'GET',
                headers:getHeaders('user')
            })
        }),
        paymentId : builder.query({
            query : (requestId:string)=>({
                url:`/user/paymentId/${requestId}`,
                method:'GET',   
                headers:getHeaders('user')
            })
        })
    })
})


export const {
    useSignUpMutation,
    useLoginMutation,
    useCheckEmailForgetPassMutation,
    useProfileQuery,
    useUpdateprofileMutation,
    useConversationMutation,
    useGetAllconversationQuery,
    useGetAllMessageQuery,
    useBookingQuery,
    usePaymentIdQuery,
} = userApi