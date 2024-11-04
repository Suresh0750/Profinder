import Image from "next/image";
import bgImage from '../../../../../../public/images/User/forgetPassword_bgImage.jpeg';
import UserForgetPassword from '@/components/user/ForgetPasswordEmail';
import {ForgetPasswordPage} from '@/types/utilsTypes'

const ForgetPassword = ({params}:{params:ForgetPasswordPage}) => {
    
    console.log(params.getCustomer)
      
    return (
        <div className="relative w-full h-[93.7vh]">
            <Image 
                alt="forgetPassword bgImage" 
                src={bgImage} 
                layout="fill" 
                objectFit="cover" 
                className="z-0" 
            />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                <div className="flex flex-col w-full justify-center space-y-5 max-w-md mx-auto">
                    <div className="flex flex-col space-y-2 text-center">
                        <h2 
                            className="text-3xl md:text-4xl font-bold" 
                            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
                        >
                            Forget Password
                        </h2>
                        <p 
                            className="text-md md:text-xl" 
                            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)' }}
                        >
                            Enter your email Id here.
                        </p>
                    </div>
                    <div className="flex flex-col max-w-md space-y-5">
                        <UserForgetPassword role={params.getCustomer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;