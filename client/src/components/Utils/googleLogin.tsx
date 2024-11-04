'use client'
// pages/login.tsx

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useCustomerGoogleLoginMutation } from "@/lib/features/api/customerApiSlice"
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner"

const GoogleSignIn = ({ role }: { role: string }) => {
  const [CustomerGoogleLogin] = useCustomerGoogleLoginMutation();
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: any) => {
    console.log('Login Success:', credentialResponse);
    const { email, given_name } = credentialResponse;
    const data = {
      username: given_name,
      EmailAddress: email,
      role
    };
    console.log(email, given_name);
    const result = await CustomerGoogleLogin(data);
    console.log(result);
    if (result?.data?.success) {
      toast.success(result?.data?.message);
      localStorage.setItem('customerData', JSON.stringify(result?.data?.customerData));
      setTimeout(() => {
        router.push('/homePage');
      }, 2000);
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
          console.log(credentialResponseDecoded);
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
