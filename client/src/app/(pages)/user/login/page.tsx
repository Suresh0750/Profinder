
import {LoginForm} from '@/components/user/signIn'

export default function Login(){

    return(
        <>
          <section className='flex items-center justify-center w-full mt-[115px] mb-20'>
            <article className='flex flex-col items-center justify-center border border-solid border-black w-[50%]'>
            <h2 className='text-center text-3xl mt-5 font-bold'>Sign In</h2>
            <LoginForm />
            </article>
          </section>
        </>
    )

}