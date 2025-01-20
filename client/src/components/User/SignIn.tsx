"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Checkbox} from "../ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logIn } from "@/lib/features/api/userApiSlice"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast, Toaster } from "sonner"
import Link from "next/link"
import GoogleSignIn from "../Utils/GoogleLogin"
import {updateCustomerLogin,updateRole} from '@/lib/features/slices/customerSlice'
import { useDispatch } from "react-redux";
import { UserSignInFormSchema } from "@/lib/formSchema"


export function LoginForm() {
  const [selectBox, setSelectBox] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const Router = useRouter()


  const dispatch  = useDispatch()

  const form = useForm<z.infer<typeof UserSignInFormSchema>>({
    resolver: zodResolver(UserSignInFormSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof UserSignInFormSchema>) {
    try {
      
      const res = await logIn(values)
      console.log(res)

      if (res.success) {
     
        localStorage.setItem("customerData",JSON.stringify(res?.customerData))

        toast.success(res.message)
        setTimeout(() => {
          Router.replace("/homePage")
        }, 500)
      }
    } catch (error: any) { 
      console.log(error)
      toast.error(error?.message  || "An error occurred.")
    }
  }


  return (
    <>
      <div className="bg-gray-50 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-lg">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">User Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="p-3 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-bold">User Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="p-3 rounded-lg w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        placeholder="Enter your password"
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Toaster richColors position="top-center" />
            <div className="flex justify-between items-center">
              <Checkbox
                checked={selectBox}
                onChange={() => setSelectBox((prev) => !prev)}
                label="Keep me signed in"
              />
              <p className="text-blue-500 cursor-pointer hover:underline">
                <Link href={'/customer/forgetpassword/user'}>
                  Forget password?
                </Link>
              </p>
            </div>
            <Button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Continue with Email
            </Button>
            <h2 className="text-center text-gray-500 my-4">or</h2>
            <GoogleSignIn role="user" />
          </form>
        </Form>
        <h2 className="text-center mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => Router.push("/user/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </h2>
      </div>
    </>
  )
}