'use client'
import {useState} from 'react'
import logo from '../../../public/images/profinderIcon.png'
import Image from 'next/image'
import LogoutIcon from '@mui/icons-material/Logout'
import {adminLogout} from '../../lib/features/api/adminApiSlice'
import {useRouter} from 'next/navigation'
import {toast,Toaster} from 'sonner'

export default function Header(){

    // * navigation route
    const Router = useRouter()
    const [isLoading,setIsLoading] = useState<boolean>(false)


//adminLogout
    const handleLogout = async ()=>{
        try{
            if(isLoading) return
            setIsLoading(true)
            const result = await adminLogout()

            if(result.success){
                toast.success(result.message)
                setTimeout(()=>{
                    window.location.replace(`/admin/login`)
                },1000)
            }
        }catch(error:any){
            console.log(`Error from logout function ${error}`)
           toast.error(error?.message)
        }finally{
            setIsLoading(false)
        }
    }

    return(
        <header className='flex justify-between h-[64px] text-white bg-black bg-opacity-70' style={{paddingRight:'70px',paddingLeft:'70px'}}>
                <div className='flex justify-center items-center h-full'>
                    <div style={{width:'4em',height:'4em'}}>
                        <Image src={logo} alt='icon' className='bg-red-500 w-0' />
                    </div>
                    <p>ProFinder</p>
                </div>
                <div className='flex justify-center items-center'>
                    <div>
                        {/* <Image src="" alt="" /> */}
                    </div>
                    <button className='rounded w-[156px] cursor-pointer md:w-[100px]' style={{height:'38px',backgroundColor:'#D32F2F',color:'rgb(97, 22, 22)'}} onClick={handleLogout} ><LogoutIcon/>Logout</button>
                </div>
                <Toaster richColors position="top-center" />
        </header>

    )
}