
import WorkerDetails from '@/components/m/WorkerDetails/WorkerDetails'


export default function WorkerDetailsAdmin({ params }: { params: {workerId:string} }) {
  
   return(
    <WorkerDetails  workerId = {params?.workerId}/>
   )
}