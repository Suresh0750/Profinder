
import SignUPOTP from '@/components/Worker/SignupOTP'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP userId={params.workerId}/>
        </>

    )
}


export default WorkerOTP