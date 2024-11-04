


import Header from "@/components/admin/Header"
import Aside from "@/components/admin/Aside"
console.log('INAdminLayout')

export default function InAdminloyout({children}:{children:React.ReactNode}){
    return(
        <>
            <Header/>
            <div className="flex flex-row">
                <Aside/>
                <div className=" h-[90vh] w-[100%] overflow-y-auto">
                 {children}
                </div>
            </div>
           
        </>
    )
}
