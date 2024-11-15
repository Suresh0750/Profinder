'use client'
// pages/login.tsx

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useCustomerGoogleLoginMutation } from "@/lib/features/api/customerApiSlice"
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner"

const GoogleSignIn = ({ role }: { role: string }) => {
  const [CustomerGoogleLogin,{isError,isLoading}] = useCustomerGoogleLoginMutation();
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: any) => {

    if(isLoading) return // * for handling the multiple request
    console.log('Login Success:', credentialResponse);
    const { email, given_name } = credentialResponse;
    const data = {
      username: given_name,
      EmailAddress: email,
      role
    };
  
    try{
      const result = await CustomerGoogleLogin(data).unwrap()

      if (result?.success) {
        toast.success(result?.message);
        localStorage.setItem('customerData', JSON.stringify(result?.customerData));
        setTimeout(() => {
          router.push('/homePage');
        }, 2000);
      }else{
        toast.warning(result?.data?.errorMessage)
        // console.log(result?.data?.errorMessage)
      }
      
    }catch(error:any){
      console.log(error)
      toast(error?.data?.errorMessage)
    }
    
    // Here, you can send the token or response to your backend to authenticate the user
  };

  const handleLoginFailure = (error: any) => {
    console.log('Login Failed:', error);
  };

  return (
    <div className="p-4">
      <GoogleLogin
        onSuccess={(credentialResponse:any) => {
          const credentialResponseDecoded = jwtDecode(credentialResponse?.credential);
          
          handleLoginSuccess(credentialResponseDecoded);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default GoogleSignIn;
