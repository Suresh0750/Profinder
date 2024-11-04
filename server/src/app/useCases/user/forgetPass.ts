
import {getUserRepository} from '../../../infrastructure/database/mongoose/MongooseUserRepository'
import {OtpService} from '../../services/OtpService'
import {OtpStoreData} from '../utils/OtpStoreData'


export const isCheckUserEmail = async (email:string)=>{
    try {

        const {ischeckEmail} = getUserRepository()
        const userId = await ischeckEmail(email)  // * call the querey check whether is email there or not
        if(userId){
            const {customerOTP} = await OtpService(userId,email) // * generate OTP and send to the user
            return  await OtpStoreData(userId,customerOTP) 
        }
        return false
    } catch (error) {
        console.log(`Error from app->->useCases->user->forgetPass \n${error}`)
        throw error
    }
}