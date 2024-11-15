
import SignUPOTP from '@/components/Worker/so(SignupOTP)'

const WorkerOTP = ({params}:{params:any})=>{

    return(
        <>
            <SignUPOTP userId={params.workerId}/>
        </>

    )
}


export default WorkerOTP