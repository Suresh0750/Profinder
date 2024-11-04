



import Navbar from '@/components/Navbar/page'

// import '../../globals.css'
import '../../globals.css'
import Footer from '@/components/Footer'


export default function UserLayout({children}:{children:React.ReactNode}){
    return(
        <>
            <Navbar />
            <div className='mt-[2.75rem]'>
            {children}
            </div>
            <Footer />
        </>
    )
}