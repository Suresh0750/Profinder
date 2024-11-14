

import {SignupForm} from '@/components/User/signupForm'



export default function SigupPage(){
    return(
        <>
        <main className="w-full bg-[#37474F] pb-5">
            <h2 className="text-center font-bold text-3xl pt-3  text-white">Create Your Account</h2>
            <div className="">
                <section className='flex justify-center items-center'>
                    <SignupForm/>
                </section>
            </div>
        </main>
        </>
    )
}