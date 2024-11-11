
import Image from 'next/image'
import '../../globals.css'
import adminbackground from '../../../../public/images/Admin/background.jpg' 




function AdminLayout({children}:{children:React.ReactNode}){
    return(
        <>
        <div className='w-full h-screen'>
        <Image src={adminbackground} alt='backgroundImage' fill  style={{objectFit:'cover'}}/>
        </div>
        <div className='absolute inset-0'>
        {children}
        </div>
        </>
    )
}


export default AdminLayout;