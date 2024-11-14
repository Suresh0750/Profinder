// components/UserOtp.tsx

import OtpImage from "@/components/Op(otpPageImage)/otpsidePage";
import { useParams } from "next/navigation";
import InputOtp from '../../../../../components/OtpInput/Input'

export default function UserOtp({params}:{params:any}) {

    return (
        <div className="flex justify-center items-center bg-[#607D8B] h-[93.8vh]">
            <div className="flex">
                <div className="w-[50%] flex flex-col justify-evenly">
                    <h2 className="text-3xl font-bold">Enter the OTP which we sent to your Email</h2>
                   <InputOtp userId={params.userId} />
                </div>
                <div>
                    <OtpImage  />
                </div>
            </div>
        </div>
    );
}
