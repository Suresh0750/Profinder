'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {customerGoogleLogin,customerGoogleVerification } from '@/lib/features/api/customerApiSlice';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Modal from 'react-modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {WorkerGoogleVerificationschema} from '@/lib/formSchema'



interface GoogleWorkerCredentials {
  firstName ? : any,
  lastName?: any,
  profile ?: any,
  emailAddress ?: any,
  phoneNumber: string;
  password: string;
  category: string;
  country: string;
  streetAddress: string;
  state: string;
  city: string;
  apt?: string;
  identity: File;
  postalCode: number;
}

const GoogleSignIn: React.FC<{ role: string }> = ({ role }) => {

  const [identity,setIdentity] = useState<File | null>(null)

  const [workerData, setWorkerData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<GoogleWorkerCredentials>({
    resolver: yupResolver(WorkerGoogleVerificationschema as yup.ObjectSchema<GoogleWorkerCredentials>)
  });


  const handleImage = (event: React.ChangeEvent<HTMLInputElement>)=>{
    try{
      const file = event.target.files?.[0];
    if (file) {
      setIdentity(file);
      // console.log(file)
    }else if(!file){
      setIdentity(null)

    }

    }catch(err){
      console.log(`Error from handleImage`)
    }
  }

  // * Handle Google login success
  const handleLoginSuccess = async (credentialResponse: any) => {
    try {
     
      const { email, given_name, picture, family_name } = credentialResponse

      setWorkerData({
        FirstName: given_name,
        LastName: family_name,
        Profile: picture,
        EmailAddress: email,
      });
      // alert(email)
      const result  = await customerGoogleVerification({email:email})
      if (result?.success) {
        toast.success(result?.message);

        localStorage.setItem("customerData", JSON.stringify(result.customerData));
        setTimeout(() => {
          router.replace(`/homePage`);
        }, 1000);

      }

    } catch (error: any) {
      toast.error(error?.message)
      if(error?.status == 403){
        toast.error('worker has been blocked')
      }
      console.log(error);
      if (error?.modal) {
        setIsModalOpen(true);
      }
    }
  };

  // * Handle Google login failure
  const handleLoginFailure = (error: any) => {
    console.log('Login Failed:', error);
  };

  // Submit form data including worker data
  const onSubmit: SubmitHandler<GoogleWorkerCredentials> = async (additionalData) => {
    try {
      if (!identity) {
        return toast.error('Identity image is required');
      }
  
      if (workerData) {
        const formData = new FormData();
        
        
        Object.entries({ ...workerData, ...additionalData }).forEach(([key, value]) => {
          formData.append(key, value as any);
        });
        

        formData.append('Identity', identity);
  
       
        const result = await customerGoogleLogin(formData);
      
  
        if (result?.success) {
          await localStorage.setItem("customerData", JSON.stringify(result.customerData));
          toast.success(result?.message);
          setIsModalOpen(false);
          router.push('/homePage');
        }else{
          toast.error(result?.message || 'login is not succeed')
        }
      }
    } catch (error:any) {
      console.log('Error submitting form:', error);
      toast.error(error?.message)
    }
  };
  

  return (
    <div className="p-4">
      <GoogleLogin
        onSuccess={(credentialResponse:any) => {
          const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
         
          handleLoginSuccess(credentialResponseDecoded);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      <Toaster richColors position="top-center" />

      {/* Modal for collecting additional worker data */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="scroll inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white mt-[5em] mb-[5em] rounded-lg shadow-lg w-full max-w-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Complete Your Profile</h2>

          <div className="max-h-[70vh] overflow-y-auto"> {/* Enable scrolling */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone Number */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  {...register('phoneNumber')}
                  className={`border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <p className="text-sm text-red-500">{errors.phoneNumber?.message}</p>
              </div>

              {/* Other form fields... */}
                {/* Password */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                {...register('password')}
                className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>

            {/* Category */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                id="category"
                placeholder="Category"
                {...register('category')}
                className={`border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.category?.message}</p>
            </div>

            {/* Country */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                placeholder="Country"
                {...register('country')}
                className={`border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.country?.message}</p>
            </div>

            {/* Street Address */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                id="streetAddress"
                placeholder="Street Address"
                {...register('streetAddress')}
                className={`border ${errors.streetAddress ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.streetAddress?.message}</p>
            </div>

            {/* State */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                id="state"
                placeholder="State"
                {...register('state')}
                className={`border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.state?.message}</p>
            </div>

            {/* City */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                placeholder="City"
                {...register('city')}
                className={`border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.city?.message}</p>
            </div>

            {/* Apt */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="apt" className="text-sm font-medium text-gray-700">Apt (Optional)</label>
              <input
                type="text"
                id="apt"
                placeholder="Apt"
                {...register('apt')}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-red-500">{errors.apt?.message}</p>
            </div>

            {/* Identity */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="identity" className="text-sm font-medium text-gray-700">Upload Identity</label>
              <input
                type="file"
                id="identity"
                {...register('identity')}
                onChange={handleImage}
                className={`border ${errors.identity ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.identity?.message}</p>
            </div>

            {/* Postal Code */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="number"
                id="postalCode"
                placeholder="Postal Code"
                {...register('postalCode')}
                className={`border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm text-red-500">{errors.postalCode?.message}</p>
            </div>
              
              {/* Submit Button */}
              <div className="flex justify-center mt-4">
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Submit
                </button>
              </div>
            </form>
          </div> {/* End of scrollable container */}
        </div>
      </Modal>

    </div>
  );
};

export default GoogleSignIn;
