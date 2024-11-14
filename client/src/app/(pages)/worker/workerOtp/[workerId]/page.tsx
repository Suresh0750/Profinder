
import SignUPOTP from '@/components/Worker/S(signupOTP)'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP userId={params.workerId}/>
        </>

    )
}


export default WorkerOTP