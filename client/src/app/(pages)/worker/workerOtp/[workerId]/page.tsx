
import SignUPOTP from '@/components/W(worker)/signupOTP'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP userId={params.workerId}/>
        </>

    )
}


export default WorkerOTP