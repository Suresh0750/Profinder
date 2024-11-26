"use client"
import { useSelector } from 'react-redux';
import {useEffect,useState} from 'react'

const DashboardProfessionalInfo = ()=>{

    const workerData = useSelector((state:any)=>state?.WorkerSignupData?.getWorkerData)

    return(
        <>
        {workerData?.length==0 ? (
            <p className="text-white text-center">Loading...</p>
          ) : (
            <div className="text-white w-full space-y-4">
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">First Name</h2>
                <h2 className="text-lg">{workerData?.firstName || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Last Name</h2>
                <h2 className="text-lg">{workerData?.lastName || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Phone Number</h2>
                <h2 className="text-lg">{workerData?.phoneNumber || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Email Id</h2>
                <h2 className="text-lg">{workerData?.emailAddress || 'N/A'}</h2>
              </div>
            </div>
          )}
        </>
    )
}


export default DashboardProfessionalInfo
