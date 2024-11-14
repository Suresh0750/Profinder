"use client";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";
import { Hourglass } from "react-loader-spinner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // * Eye icon from react-icons
import {HandlError} from '@/components/Utils/FM(formValidation)/setPassword' // * from validation
import {useForgetPasswordMutation,useCustomerResendMutation} from '@/lib/features/api/customerApiSlice'
import {Vortex} from 'react-loader-spinner'
import {toast} from 'sonner'
import { useRouter } from "next/navigation";

// * react-store
import { useSelector } from "react-redux";




export default function SetNewPass({role}:{role:string}) {

  const [customerID, setCustomerID] = useState('')


  const {customerId} = useSelector((state:any)=>state?.CustomerData)

    // * Here call API function which is RTK query
    const [ForgetPassword,{isLoading}] = useForgetPasswordMutation()
    const [CustomerResend] = useCustomerResendMutation()

    // * Router function 
    const Router = useRouter()


  const [timer, setTimer] = useState(60); // Timer value for OTP
  const [formData, setFormData] = useState({
    otpValue: "",
    newPass: "",
    confirmPass: ""
  });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const [error, setError] = useState({
    otpValue: "",
    newPass: "",
    confirmPass: ""
  });

  useEffect(()=>{
    if(role=='user'){
      setCustomerID(customerId)
      }

  },[role,customerId])
  

  // * ResendOTP
  const ResendOTPFunc = async()=>{
    try {
  
      if(timer!=0) return
  
      const result = await CustomerResend({role,customerID}).unwrap()
      if(result.success){
        toast.success(result.message)
        setTimer(60)  // * reset timer after resend the OTP
      }

    } catch (error:any) {
      console.log(`Error from ResendOTP`,error)
      {
        error?.data?.errorMessage ? toast.error(error?.data?.errorMessage) : toast.error('server error please try again!')
      }
      
    }
  }


  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;
    if (value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    const otpValue = inputRefs.current.map((input) => input?.value).join('');
    setFormData({ ...formData, otpValue });

    if(formData.otpValue.length==4) error.otpValue = ''
  };


  // * form submit function
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
 
      event.preventDefault();
      const checkError =  HandlError(formData, error);  
     
      if(!checkError || isLoading) return  // * prevent multiple request and validate the input field
      
      const result = await ForgetPassword({formData,role,customerId}).unwrap()
      
      if(result?.success){
        toast.success(result.message)
        if(role=='user'){
          setTimeout(()=>{
            Router.push('/user/login')
          },2000)
        }else{
          setTimeout(()=>{
            Router.push('/worker/login')
          },2000)
        }
      }
    } catch (error:any) {
      console.log(`Error from handleSubmit \n`,error)
      {
        error?.data?.errorMessage ? toast.error(error?.data?.errorMessage) : toast.error('server error please try again!')
      } 
    }

    
  };
  
  // * Otp input value paste handler
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // * Timer logic
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        {/* OTP Inputs */}
        <div className="flex justify-between">
          <span className="flex gap-3">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                ref={(el:any) => (inputRefs.current[index] = el)} // Corrected ref assignment
                className="w-10 h-10 border border-solid border-black rounded text-center text-2xl"
                onChange={(e) => handleInputChange(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </span>

          {/* Timer display */}
          <div className="flex">
            <Hourglass
              visible={true}
              height="30"
              width="30"
              ariaLabel="hourglass-loading"
              colors={["#306cce", "#72a1ed"]}
            />
            {timer}
          </div>
        </div>

        {error.otpValue && <div className="text-red-600">{error.otpValue}</div>}

        {/* New Password Input with Eye Toggle */}
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">Enter your New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            name="newPass"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
            value={formData.newPass}
          />
          <span
            className="absolute top-10 right-4 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
          </span>
        </div>
        {error.newPass && <div className="text-red-600">{error.newPass}</div>}

        {/* Confirm Password Input with Eye Toggle */}
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPass"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
            value={formData.confirmPass}
          />
          <span
            className="absolute top-10 right-4 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
          </span>
        </div>
        {error.confirmPass && <div className="text-red-600">{error.confirmPass}</div>}

        <button className="w-full px-4 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg flex justify-center hover:bg-blue-700 transition duration-300" style={{cursor:'pointer'}}>
        {
          isLoading ? (<Vortex
            visible={true}
            height="40"
            width="40"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />) : "Proceed"
        }
          
        </button>

        <Toaster richColors position="top-center" />
        <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
            © {new Date().getFullYear()} ProFinder.
          </p>
          <span className="text-green-500 cursor-pointer" onClick={ResendOTPFunc}>Resend OTP?</span>
        </div>
      </form>
    </>
  );
}
