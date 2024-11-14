"use client";

// Import necessary libraries
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSignUpMutation } from '@/lib/features/api/userApiSlice';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // for password visibility
import { updateCustomerLogin, updateRole } from '@/lib/features/slices/customerSlice';
import { useDispatch } from 'react-redux';

// Form schema validation using Zod
const formSchema = z.object({
  username: z.string().min(5, { message: "Username must be at least 5 characters." }),
  PhoneNumber: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({
    invalid_type_error: "Phone number must be a number.",
    required_error: "Phone number is required.",
  })
    .int({ message: "Phone number must be an integer." })
    .positive({ message: "Phone number must be positive." })
    .refine((val) => val.toString().length === 10, { message: "Phone number should be exactly 10 digits long." })),
  EmailAddress: z.string().email({ message: "Please enter a valid email address." }),
  Address: z.string().min(10, { message: "Address must be at least 10 characters long." }),
  Password: z.string().min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
  ConfirmPass: z.string().nonempty({ message: "Confirm password cannot be empty" }),
}).refine((data) => data.Password === data.ConfirmPass, {
  message: "Passwords don't match",
  path: ["ConfirmPass"],
});

// Signup Form component
export function SignupForm() {
  const [isLoading, setLoading] = useState(false);
  const [SignUp] = useSignUpMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      PhoneNumber: 0,
      EmailAddress: "",
      Address: "",
      Password: "",
      ConfirmPass: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isLoading) return;
      setLoading(true);

      const res = await SignUp(values).unwrap();
      if (res.success) {
        toast.success('User registration successful');
        setTimeout(() => {
          router.push(`/user/userOtp/${res.user}`);
        }, 500);
      } else {
        toast.error(res?.data?.errorMessage);
      }
    } catch (err: any) {
      console.log(err)
    {
      err.data.errorMessage ? toast.error(err.data.errorMessage) :  toast.error("Server error. Please try again.");
    }
     
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="PhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="EmailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} className="p-2 rounded w-full border border-gray-300" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Password"
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
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ConfirmPass"
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
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Toaster richColors position="top-center" /> */}
          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 mt-4 bg-[#90CAF9] text-white rounded hover:bg-blue-700 ${isLoading && "cursor-not-allowed"}`}
          >
            {isLoading ? <PulseLoader /> : "Continue with Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
