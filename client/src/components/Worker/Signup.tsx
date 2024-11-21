"use client";

// import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { useSignUpMutation } from '@/lib/features/api/userApiSlice';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner'; 
import Image from 'next/image';
import {useRouter} from "next/navigation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PulseLoader } from 'react-spinners';
import { CgAdd } from 'react-icons/cg';
import { useState } from 'react';
import {signUp} from '@/lib/features/api/workerApiSlice'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // * Eye icon from react-icons
import {signUPformSchema} from '../../lib/formSchema' // * form Schema
import { useDispatch } from "react-redux";
import {updateSignup} from '../../lib/features/slices/workerSlice'
import Link from 'next/link'


export default function WorkerSignUp() {


  const router = useRouter();  // # navigation router
  const dispatch = useDispatch()


  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  // * Password visible control
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [isLoading,setIsloading] = useState<boolean>(false)



  const form = useForm<z.infer<typeof signUPformSchema>>({
    resolver: zodResolver(signUPformSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      password: "",
      confirmPass: "",
    },
  });

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }else if(!file){
      setProfilePicFile(null)
      setProfilePicUrl('')
    }
  }

  // * Form Handler
  async function onSubmit(values: z.infer<typeof signUPformSchema>) {
    try {

      let checkNumber :(RegExpMatchArray | any )= values.phoneNumber.match(/(\d+)/)
      if(!profilePicFile) return toast.error('Please select profile picture') ;
      if(checkNumber[0].length!=10) return toast.error('should give valid number')  // * here check Phone number field is number or not

      if (isLoading) return;

      setIsloading(true)
      const formData:any = new FormData()
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('emailAddress', values.emailAddress);
      formData.append('password', values.password);
      formData.append('profileImage',profilePicFile)

      // const res = await WorkerSignUp(formData).unwrap()
      const res = await signUp(formData)
  
    if(res.success){
      // console.log(res.workerDetails)
      dispatch(updateSignup(res.workerDetails))  // * update the signup details

      toast.success('movie on')
      setTimeout(()=>{
        router.push(`/worker/professionalInfo`)
      },600)
    }else{
      toast.error('somethin wrong try again')
    }
      
    } catch (error : any) {
      console.log(error);
      toast.error(error?.message)

    }finally{
      setIsloading(false)
    }
  }

  return (
    <div className="max-w-[71rem] mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Personal Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-6 max-w-[100%]">
          <div className='w-[60%]'>
            <div className='flex gap-12'>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      {...field}
                      className="p-2 rounded w-full border border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="p-2 rounded w-full border border-gray-300"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      >
                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <FormField
              control={form.control}
              name="confirmPass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                      />
                      <div
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      >
                        {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Toaster richColors position="top-right" /> */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 mt-4 bg-[#90CAF9] text-white cursor-pointer rounded hover:bg-blue-700"
            >
              {isLoading ? <PulseLoader size={8} color="#fff" /> : 'Continue with Email'}
            </Button>
          </div>
          <div className='w-[30%] flex flex-col items-center'>
            {profilePicUrl && (
              <Image src={profilePicUrl} className='w-[100px] h-[100px] rounded-full object-cover' width={100} height={100} alt='Profile Picture' />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="profilePicInput"
            />
            <label
              htmlFor="profilePicInput"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-[16px] cursor-pointer"
            >
              <CgAdd size={'20px'} />
              Upload Image
            </label>
            <h2 className='mt-[25px]'>
              Already have an account? <span className='text-blue-500 cursor-pointer'>
                <Link href={"/worker/login"}>
                    Sign In
                </Link>
              </span>
            </h2>
          </div>
        </form>
      </Form>
    </div>
  );
}
