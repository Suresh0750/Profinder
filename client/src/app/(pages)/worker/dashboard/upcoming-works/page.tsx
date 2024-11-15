

import UpcomingWorks from '@/components/Worker/Dashboard/UpcomingWorks'



export default function UpcomingRequestPage(){
    return(
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">Upcoming Works</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UpcomingWorks />
            </div>
        </div>
    )
}