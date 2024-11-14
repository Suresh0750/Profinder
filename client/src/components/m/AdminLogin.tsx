"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import {AdminCredentials} from '@/types/adminTypes'
import {useAdminVeriyAPIMutation} from '@/lib/features/api/adminApiSlice'
import { Toaster, toast } from 'sonner';
import {useRouter} from 'next/navigation'

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [AdminVeriyAPI,{isLoading}]  = useAdminVeriyAPIMutation()

  // * Admin form login
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminCredentials>();

  const Router = useRouter()

  const onSubmit: SubmitHandler<AdminCredentials> = async (data) => {
    try{
      if(isLoading) return 

      const result = await AdminVeriyAPI(data).unwrap()

      if(result?.success){
        toast.success(result.message)
        setTimeout(()=>{
          Router.push('/admin/dashboard')
        })
      }else{
        const {error}:any = result
        console.log(error)
        toast.error(error?.data?.message)
      }

    }catch(error:any){
      console.log(error)
      {
        error?.error?.data?.errorMessage  ? toast.error(error?.error?.data?.errorMessage) : toast.error('something wron try again')
      } 
    }
   
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 mt-8 mx-5 pb-5"
    >
      <div className="flex flex-col">
        <label htmlFor="adminEmail" className="text-lg">
          Admin Email
        </label>
        <input
          type="email"
          id="adminEmail"
          className="p-2 mt-1 focus:border border-b-2 border-gray-500 bg-transparent focus:outline-none transition-all duration-300 ease-in-out transform rounded"
          placeholder="Enter your email"
          {...register("adminEmail", {
            required: "Admin email is required",
            minLength: {
              value: 5,
              message: "Email must be at least 5 characters long",
            },
            maxLength: {
              value: 30,
              message: "Email cannot exceed 30 characters",
            },
            pattern: {
              value: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Please enter a valid email address",
            },
            validate: (value) => value.trim() !== "" || "Email cannot be empty",
          })}
        />
        {errors.adminEmail && (
          <span className="text-red-500 text-sm mt-1">
            {errors?.adminEmail?.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="adminPass" className="text-lg">
          Password
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            id="adminPass"
            className="p-2 mt-1 w-full pr-10 focus:border border-b-2 border-gray-500 bg-transparent focus:outline-none transition-all duration-300 ease-in-out transform rounded"
            placeholder="Enter your password"
            {...register("adminPass", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              maxLength: {
                value: 20,
                message: "Password cannot exceed 20 characters",
              },
              validate: (value) => value.trim() !== "" || "Password cannot be empty",
            })}
          />
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        {errors.adminPass && (
          <span className="text-red-500 text-sm mt-1">
            {errors?.adminPass?.message}
          </span>
        )}
      </div>
      <Toaster richColors position="top-center" />
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[#3094AB] hover:bg-[#257B8C] w-[70%] p-3 rounded transition-colors duration-300"
        >
          Log In
        </button>
      </div>
    </form>
  );
};

export default AdminLogin;
