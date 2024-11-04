



import Navbar from '@/components/Navbar/page'

import '../../globals.css'


export default function UserLayout({children}:{children:React.ReactNode}){
    return(
        <>
            <Navbar />
            <div className='mt-[2.75rem]'>

            {children}
            </div>
        </>
    )
}