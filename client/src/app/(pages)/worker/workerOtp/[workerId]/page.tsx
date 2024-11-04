
import SignUPOTP from '@/components/worker/signupOTP'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP userId={params.workerId}/>
        </>

    )
}


export default WorkerOTP