


// * Customer authendication 

import {OTPRepository} from '../../../infrastructure/database/mongoose/mor(MongooseOtpRepository)'
import {getUserRepository} from '../../../infrastructure/database/mongoose/mur(MongooseUserRepository)'
import {getWorkerRepository} from '../../../infrastructure/database/mongoose/mw(MongooseWorkerRepository)'
import {CustomerQueryRepository} from '../../../infrastructure/database/mongoose/mc(MongooseCustomerRepository)'
import {ResendOTP,GoogleLogintypes} from '../../../domain/entities/c(CustomerOTP)'  // * resend otp data types
import {User} from '../../../domain/entities/u(User)'  // * resend otp data types
import {OtpService} from "../../services/o(OtpService)"
import {ResendOTPStore,OtpVerifyUseCases} from './o(OtpStoreData)'   // * store otp data in database and verif OTP
import { hashPassword } from '../../../shared/utils/encrptionUtils'

// * types
import {forgetPasswordDataType} from '../../../domain/entities/c(CustomerOTP)'
import { WorkerInformation } from '../../../domain/entities/w(Worker)'





// * get all verified Worker for list in service page Usecases 

export const getAllWorkerDataUseCases = async ()=>{
    try {
        return await CustomerQueryRepository().getVerifiedWorker()
    } catch (error) {
        console.log(`Error from app->utils->getAllWorkerDataUseCases \n ${error}`)
        throw error
    }
}

// * here verified the worker and user data. check whether they are verified OTP 

export const userVerification= async (customerId:string,role:string)=>{
    try {
        const {verifyUser} = OTPRepository()
        const {getDataFindById} = getUserRepository()
       
            verifyUser(customerId)
            return getDataFindById(customerId)

    } catch (error) {
        console.log(`Error from app->utils->customerVerification \n ${error}`)
        throw error
    }
}

export const workerVerification = (wokerId:string)=>{
    try {
        const {verifyWorker} = OTPRepository()
        const {getWorkerData} = getWorkerRepository()

        verifyWorker(wokerId)
        return getWorkerData(wokerId)
    } catch (error) {
        console.log(`Error from app->utils->workerVerification \n ${error}`)
        throw error
    }
}


export const customerResentOTP = async(customerData:ResendOTP)=>{
    try {
        // console.log(`Req reached usCases utils cutomerResentOTP`)

        const {getUserDataResendOTP,getWorkerDataResendOTP} = OTPRepository()
        if(customerData.role=='user'){
            const userEmail : string | undefined= await getUserDataResendOTP(customerData.userId) 
            if(userEmail){
                const userData  = await OtpService(customerData.userId,userEmail)
                ResendOTPStore(customerData.userId,Number(userData?.customerOTP))      // * Restore the OTP data in mongodb database
            }
        }else {
            const userEmail : string | undefined= await getWorkerDataResendOTP(customerData.userId)
            console.log(`customerResentotp in worker role`) 
      
            if(userEmail){
                const userData  = await OtpService(customerData.userId,userEmail)
                ResendOTPStore(customerData.userId,Number(userData?.customerOTP))      // * Restore the OTP data in mongodb database
            }

        }
    
        return true
    } catch (error) {
        console.log(`Error from app->usecase->utils->customerResentOTP\n${error}`)
        throw error
    }
}

export const ForgetPassWordUseCase = async (forgetPasswordData:forgetPasswordDataType)=>{
    try {

        const verifyOTP = await OtpVerifyUseCases(Number(forgetPasswordData?.formData?.otpValue),forgetPasswordData.customerId)
        if(forgetPasswordData.role=="user" && verifyOTP){
            const {setNewPassWord} = getUserRepository();
            const hashNewPassword = await hashPassword(forgetPasswordData.formData.newPass)
            await setNewPassWord(forgetPasswordData.customerId,hashNewPassword)  // * call the setNewPassWord function for setting new Password user database
            return true
        }else if(forgetPasswordData.role=="worker" && verifyOTP){
            const {setNewPassWord} = getWorkerRepository();
            const hashNewPassword = await hashPassword(forgetPasswordData.formData.newPass)
            await setNewPassWord(forgetPasswordData.customerId,hashNewPassword)  // * call the setNewPassWord function for setting new Password in worker database
            return true
        }
        return false
        
    } catch (error) {
        console.log(`Error from app->usecase->utils->ForgetPassWordUseCase\n${error}`)
        throw error
    }
}

// * if customer is a worker after verification of email is not there means here we create an account for them
export const GoogleLoginWorkerRegister = async(customerData:WorkerInformation)=>{
    try {
        
        // console.log(`Req reached GoogleLoginWorker`)
       
        delete customerData.role
     
        await getWorkerRepository().insertWorker(customerData)
        return getWorkerRepository().findWorker(customerData.EmailAddress)
    } catch (error) {
        
    }
}

// * Google Login UseCases 
export const GoogleLoginUseCases = async (customerData:GoogleLogintypes )=>{
    try {
        
        if(customerData.role=='user'){
            const {UserGoogleLogin} = CustomerQueryRepository()     // * user
            // console.log(customerData)
            const UserData : User = {
                username : customerData.username,
                PhoneNumber : 0,
                EmailAddress : customerData.EmailAddress,
                Password : '',
                isVerified : true,
                Address : ''
            }
            await UserGoogleLogin(UserData)             // * create the user if already there means it won't create. Used Upsert
            const {findUserByEmail} = getUserRepository()
            return findUserByEmail(customerData.EmailAddress)
        }
    } catch (error) {
        console.log(`Error from app->usecase->utils->GoogleLoginUseCases\n${error}`)
        throw error
    }
}


// * worker verification while worker login through google
export const workerGoogleVerification = async (workerEmail:any)=>{
    try {   
        return await CustomerQueryRepository().WorkerGoogleLoginVerification(workerEmail)
        
    } catch (error) {
        console.log(`Error from app->usecase->utils->workerGoogleVerification\n${error}`)
        throw error
    }
}