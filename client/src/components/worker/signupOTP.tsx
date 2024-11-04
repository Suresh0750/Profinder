"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import {useCustomerOtpMutation,useCustomerResendMutation} from '@/lib/features/api/customerApiSlice'
import { Toaster, toast } from 'sonner' 
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const SignupOTP  = ({userId}:{userId:string}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [CustomerOtp,{isLoading,isSuccess}] = useCustomerOtpMutation()

  const [CustomerResend,{isLoading:resendLoading}] = useCustomerResendMutation()
  const dispatch = useDispatch()

  const Router = useRouter() // * navigation Hook

  // Handle OTP input change
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error message when user starts typing
    setErrorMessage("");
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if(isLoading) return // * prevent multiple click
      
      const otpString = otp.join("");
      if (otpString.length < 4) {
        setErrorMessage("Please enter a valid OTP.");
        return;
      }
      // Simulate OTP verification
      const result = await CustomerOtp({otpValue:otpString,role:'worker',userId}).unwrap() 
      console.log(result)
      if(result?.success){
        toast.success(result?.message)
        if(result?.customerData){
          localStorage.setItem("customerData",JSON.stringify(result?.customerData))
        }
        ``
        setSuccessMessage("OTP verified successfully!");
        setTimeout(()=>{
          Router.push(`/homePage`)
        },500)
      }
      setErrorMessage("");
      // Reset OTP fields
      setOtp(["", "", "", ""]);
    } catch (error:any) {
      console.log(`Error from  OTP handleSubmit`,error)
      error?.data?.errorMessage ? toast.warning(error?.data?.errorMessage) : toast.warning('something wrong try again!')
    }
   
  };

  // Timer logic for OTP
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
  }, [isTimerActive, timer]);

  // Resend OTP function
  const handleResendOTP = async () => {

    try {
      if(timer!=0 || resendLoading) return //* prevent multiple click

      
      const result = await CustomerResend({userId,role:'worker'}).unwrap()
      console.log(result)
      if(result?.success){
        toast.success(result?.message)
        setTimer(60);
        setIsTimerActive(true);
        setSuccessMessage("");
        setErrorMessage("OTP has been resent to your email.");
      }
    } catch (error:any) {
      console.log(`Error from handleOTP`,error)
      toast.error(error?.message)
    }
  };

  // * Handle pasting OTP
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, otp.length);
    const newOtp = pastedData.split("").map((char) => (/\d/.test(char) ? char : ""));
    setOtp(newOtp);
    newOtp.forEach((_, index) => {
      if (index < inputRefs.current.length && newOtp[index]) {
        inputRefs.current[index]?.focus();
      }
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email ba**@dipainhouse.com</p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} >
              <div className="flex flex-col space-y-6">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {otp.map((digit, index) => (
                    <div key={index} className="w-16 h-16">
                      <input
                        ref={(el:any) => (inputRefs.current[index] = el)}
                        className="w-full h-full flex flex-col items-center justify-center text-center border-solid px-5 outline-none rounded-xl border border-gray-600 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        maxLength={1}
                        onPaste={handlePaste}
                      />
                    </div>
                  ))}
                </div>
                <Toaster richColors position="top-center" /> 
                {errorMessage && (
                  <div className="text-red-600 text-center">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-600 text-center">{successMessage}</div>
                )}

                <div className="flex flex-col space-y-5">
                  <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm cursor-pointer">
                    Verify Account
                  </button>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn&apos;t receive code?</p>
                    <span
                      className="flex flex-row items-center text-blue-600 cursor-pointer"
                      onClick={handleResendOTP}
                    >
                      Resend {isTimerActive ? `(${timer}s)` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupOTP;