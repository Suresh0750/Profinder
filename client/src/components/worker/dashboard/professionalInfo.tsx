"use client"
import { useSelector } from 'react-redux';

const DashboardProfessionalInfo = ()=>{

    
  const workerData = useSelector((state:any)=>state?.WorkerSignupData?.getWorkerData)
  console.log(workerData)


    return(
        <>
        {!workerData ? (
            <p className="text-white text-center">Loading...</p>
          ) : (
            <div className="text-white w-full space-y-4">
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">First Name</h2>
                <h2 className="text-lg">{workerData.FirstName || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Last Name</h2>
                <h2 className="text-lg">{workerData.LastName || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Phone Number</h2>
                <h2 className="text-lg">{workerData.PhoneNumber || 'N/A'}</h2>
              </div>
              <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Email Id</h2>
                <h2 className="text-lg">{workerData.EmailAddress || 'N/A'}</h2>
              </div>
            </div>
          )}
        </>
    )
}


export default DashboardProfessionalInfo