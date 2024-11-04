
import WorkerDetails from '@/components/admin/WorkerDetails/WorkerDetails'


export default function WorkerDetailsAdmin({ params }: { params: {workerId:string} }) {
  
   return(
    <WorkerDetails  workerId = {params?.workerId}/>
   )
}