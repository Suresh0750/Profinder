
import Image from "next/image";
import bgImage from '../../../../../../public/images/User/SetOTP_bg.jpg';
import SetNewPass from '@/components/Utils/CommonInputOTP'
import {ForgetPasswordPage} from '@/types/utilsTypes'

const SetPassword = ({params}:{params:ForgetPasswordPage}) => {
  
    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full h-[75vh] flex max-w-6xl mx-auto shadow-lg rounded-lg overflow-hidden">
                <div className="w-[30%] relative">
                    <Image
                        src={bgImage}
                        alt="Set forget password image"
                        layout="fill" // Ensures the image takes the full size of the parent div
                        objectFit="cover" // Ensures the image covers the entire div without distortion
                    />
                </div>

                <div className="w-[70%] bg-white p-10">
                    <h2 className="text-gray-800 text-center text-3xl md:text-4xl font-bold mb-8" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                        Enter OTP and New Password
                    </h2>
                    
                    <div className="flex justify-center">
                       <SetNewPass role= {params.getCustomer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetPassword;
