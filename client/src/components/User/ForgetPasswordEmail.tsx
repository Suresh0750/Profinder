"use client";
import { useState } from "react";
import {checkEmailForgetPass} from "@/lib/features/api/userApiSlice";
import { checkWorkerEmailForgetPass } from "@/lib/features/api/workerApiSlice";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { ColorRing } from "react-loader-spinner";
import {updateUserId} from '@/lib/features/slices/userSlice'
import {updateWorkerId} from '@/lib/features/slices/customerSlice'
import { useDispatch} from "react-redux";

const UserForgetPassword = ({role}:{role:string}) => {
  const [email, setUserEmail] = useState("");
  const [emailErrmsg, setEmailErrMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const Router = useRouter();
  const dispatch = useDispatch()

  const validateEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (isLoading) return; // *  Prevent multiple clicks

      setIsLoading(true)
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      const isValidEmail = emailRegex.test(email);

      if (!isValidEmail) {
        setEmailErrMsg(true);
        toast.warning("Please enter a valid email address.");
        return; // * Stop further processing if invalid email
      }

      setEmailErrMsg(false);

      let result ;
      // * Call the API
      if(role=='user'){
       result = await checkEmailForgetPass({ emailAddress : email,role });
      }else {
        result = await checkWorkerEmailForgetPass({ emailAddress:email,role })

      }
      if (result.success) {
        toast.success(result.message);

      await  dispatch(updateWorkerId(result?.userEmailValidation))
        setTimeout(() => {
          Router.push(`/customer/setforget_password/${role}`);
        }, 600);
      }
     
    } catch (error: any) {
     console.log(error)
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Enter your email id"
          value={email}
          className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-lg font-medium placeholder:font-normal text-black"
          onChange={(e) => setUserEmail(e.target.value)}
        />
        {emailErrmsg && (
          <p className="text-red-600">Please enter a valid email address.</p>
        )}

        <Toaster richColors position="top-center" />

        <button
          onClick={validateEmail}
          className="flex items-center cursor-pointer justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white"
          style={{ cursor: "pointer" }}
        >
          {isLoading ? (
            <ColorRing
              visible={true}
              height="50"
              width="50"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            "Proceed"
          )}
        </button>
      </div>
    </>
  );
};

export default UserForgetPassword;
