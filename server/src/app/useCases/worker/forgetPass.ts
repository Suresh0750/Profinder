
import {getWorkerRepository} from '../../../infrastructure/database/mongoose/mw(MongooseWorkerRepository)'
import {OtpService} from '../../services/o(OtpService)'
import {OtpStoreData} from '../utils/o(OtpStoreData)'


export const isCheckWorkerEmail = async (email:string)=>{
    try {

        const {ischeckEmail} = getWorkerRepository()
       
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