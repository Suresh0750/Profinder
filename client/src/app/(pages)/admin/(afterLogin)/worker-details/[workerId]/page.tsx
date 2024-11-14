
import WorkerDetails from '@/components/Admin/WorkerDetails/WorkerDetails'


export default function WorkerDetailsAdmin({ params }: { params: {workerId:string} }) {
  
   return(
    <WorkerDetails  workerId = {params?.workerId}/>
   )
}