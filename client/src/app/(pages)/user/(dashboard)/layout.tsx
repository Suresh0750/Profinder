import { User,MessageSquare,Book } from 'lucide-react'

import Link from 'next/link'


export default function Layout ({children}:{children:React.ReactNode}){

    return(
        <>
         <div className="flex h-screen bg-gray-100 mt-[4em]">
            <aside className="w-64 bg-[#111826] shadow-md text-white">
                <div className="p-4">
                <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                </div>
                <nav className="mt-4">
                <h2  className="py-2 px-4 text-white active:bg-gray-200 hover:bg-gray-700 flex gap-1 cursor-pointer">

                    <Link href="/user/profile">
                    <User className="w-4 h-4 mr-2 text-white inline " />
                        Profile
                    </Link>
                </h2>
                <h2 className="flex py-2 px-4 text-white hover:bg-gray-700 cursor-pointer">
                    <Link href="/user/message">
                    <MessageSquare className="w-4 h-4 mr-2 text-white inline " />
                        Messages
                    </Link>
                </h2>
                <h2 className="flex py-2 px-4 text-white hover:bg-gray-700 cursor-pointer">
                    <Link href="/user/booking">
                    
                    <Book className="w-4 h-4 mr-2 text-white inline " />
                        Booking Details
                    </Link>
                </h2>

                </nav>
            </aside>    
            {children}
         </div>
        </>
    )
}