
import SignUPOTP from '@/components/Worker/SignupOTP'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP workerId={params.workerId}/>
        </>

    )
}


export default WorkerOTP