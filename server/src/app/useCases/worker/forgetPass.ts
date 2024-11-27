
import {getWorkerRepository} from '../../../infrastructure/database/mongoose/worker'
import {OtpService} from '../../services/otpService'
import {OtpStoreData} from '../utils/otpStoreData'


export const isCheckWorkerEmail = async (email:string)=>{
    try {

        const {ischeckEmail} = getWorkerRepository()
    //    console.log(email)
        const workerId = await ischeckEmail(email)  // * call the querey check whether is email there or not
        if(workerId){
            const {customerOTP} = await OtpService(workerId,email) // * generate OTP and send to the user
            
            return  await OtpStoreData(workerId,customerOTP) 
        }
        return false
    } catch (error) {
        console.log(`Error from app->->useCases->user->forgetPass \n${error}`)
        throw error
    }
}