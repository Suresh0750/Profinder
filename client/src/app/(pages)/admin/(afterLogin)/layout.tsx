


import Header from "@/components/Admin/Header"
import Aside from "@/components/Admin/Aside"


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
