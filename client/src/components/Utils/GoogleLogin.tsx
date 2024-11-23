'use client'
// pages/login.tsx

import React,{useState} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useCustomerGoogleLoginMutation ,customerGoogleLogin} from "@/lib/features/api/customerApiSlice"
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner"

const GoogleSignIn = ({ role }: { role: string }) => {
  // const [CustomerGoogleLogin,{isError,isLoading}] = useCustomerGoogleLoginMutation();
  const [isLoading,setIsLoading] = useState<boolean>(false)

  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: any) => {

    if(isLoading) return // * for handling the multiple request

    
    console.log('Login Success:', credentialResponse);
    const { email, given_name } = credentialResponse;
    const data = {
      username: given_name,
      emailAddress: email,
      role
    };
  
    try{
      
      setIsLoading(true)
      
      const result = await customerGoogleLogin(data)

      if (result?.success) {
        toast.success(result?.message);
        localStorage.setItem('customerData', JSON.stringify(result?.customerData));
        setTimeout(() => {
          router.push('/homePage');
        }, 2000);
      }
      
    }catch(error:any){
      console.log(error)
      toast(error?.message)
    }finally{
      setIsLoading(false)
    }
    
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
