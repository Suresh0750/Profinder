
import WorkerApprovalData from '@/components/Admin/WorkerApproval/WorkerApproval'


const WorkerApproval = ()=>{
    return(
        <div className='w-full p-4'>
        <h2 className='text-2xl font-bold text-white opacity-60 ml-3'>Worker Approval Management</h2>
        <WorkerApprovalData />
        </div>
    )
}


export default WorkerApproval