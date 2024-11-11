"use client";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { useCustomerOtpMutation,useCustomerResendMutation } from "@/lib/features/api/customerApiSlice";
import { ClipLoader } from "react-spinners";
import {useRouter} from 'next/navigation'
import { useDispatch } from "react-redux";
import {updateCustomerLogin,updateRole} from '@/lib/features/slices/customerSlice'

export default function InputOtp({ userId }: { userId: string }) {
  const [isLoading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer value for OTP
  const [isResendVisible, setResendVisible] = useState(false);
  const Router = useRouter()

  const [CustomerOtp] = useCustomerOtpMutation();
  const [CustomerResend] = useCustomerResendMutation();

  const dispatch = useDispatch()

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

  };


  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    if (pastedData.length === inputRefs.current.length) {
      pastedData.split("").forEach((char, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char;
        }
      });
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  };

  // * Timer logic
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setResendVisible(true); // * Show the Resend button when timer reaches 0
    }
  }, [timer]);

  const handleResend = async (e:any) => {

    e.preventDefault()

    setResendVisible(false); // * Hide resend button after clicking
    // * Call API to resend OTP
    try {
      setLoading(true);
      const res = await CustomerResend({ userId, role: "user" }).unwrap();

      if (res.success) {
        toast.success(res.message);
        setTimer(60); // Reset the timer
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log("Resend OTP error: ", error);
      toast.error(error?.data?.errorMessage || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const otpValue: string = inputRefs.current
        .map((input) => input?.value)
        .join("");
      if (otpValue.length !== 4) {
        toast.error("OTP is missing");
        return;
      }

      const data = { otpValue, userId, role: "user" };
      const res = await CustomerOtp(data).unwrap();

      if (res.success) {
        toast.success(res.message);
       
        localStorage.setItem("customerData",JSON.stringify(res.customerData))
        setTimeout(()=>{
          Router.push('/homePage')
        },3000)
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log("OTP Page \n", error);
      toast.error(error?.data?.errorMessage || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <span className="flex gap-3">
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el: any) => (inputRefs.current[index] = el)} // Corrected ref assignment
            className="w-10 h-10 border border-solid border-black rounded text-center text-2xl"
            onChange={(e) => handleInputChange(e, index)}
            onPaste={handlePaste}
          />
        ))}
      </span>

      {/* Timer display */}
      <div>Time remaining: {timer}s</div>

      {/* <Toaster richColors position="top-right" /> */}

      {/* Conditionally show Verify button or Resend button */}
      {!isResendVisible ? (
        <button
          disabled={isLoading}
          type="submit"
          style={{cursor:'pointer'}}
          className="bg-black flex justify-center cursor-pointer items-center text-white p-2 rounded"
        >
          {isLoading ? <ClipLoader color="#e6d6e9" /> : "Verify"}
        </button>
      ) : (
        <button
          type="button"
          onClick={(e)=>handleResend(e)}
          className="bg-gray-500 cursor-pointer flex justify-center items-center text-white p-2 rounded"
          style={{cursor:'pointer'}}
        >
          {isLoading ? <ClipLoader color="#e6d6e9" /> : "Resend OTP"}
          Resend OTP
        </button>
      )}
    </form>
  );
}
