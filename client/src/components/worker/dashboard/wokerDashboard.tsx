
"use client"
import {useState,useEffect} from 'react'
// import ShowRequest from './ShowRequestToWorker'
import Link from 'next/link'

export const DashboardHeader = ()=>{

    const [customerData, setCustomerData] = useState<any>({});
    useEffect(() => {
        // Only access localStorage in the browser
        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem("customerData");
          if (storedData) {
            try {
              setCustomerData(JSON.parse(storedData));
            } catch (error) {
              console.error("Error parsing customerData from localStorage:", error);
              setCustomerData({});
            }
          }
        }
      }, []);
    return(
        <div className="bg-gray-800 text-white p-4 rounded-md text-center">
            <h1 className="text-xl font-semibold">Welcome, {customerData?.customerName}</h1>
        </div>
    )
}

export const ViewRequest = ()=>{
    return(
        <div className="bg-white shadow-md p-6 rounded-md text-center">
            <h2 className="text-gray-600 font-medium">New Service Requests</h2>
            <Link href={'/worker/dashboard/service-request'}>
                <button  className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md">
                View Details
                </button>
            </Link>
            {/* {
                isOpenRequstModal &&   <ShowRequest onClose={()=>setIsModalOpenRequestModal(false)} />
            } */}
           
        </div>
    )
}