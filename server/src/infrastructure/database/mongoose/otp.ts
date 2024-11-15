import { IOTPRepository } from "../../../domain/repositories/otp";
// import { CustomerOTP } from "../../../domain/entities/customerOTP";
import { CustomerOTP } from "../../../domain/entities/customerOTP";
import { customerOTPModel } from "./models/otp";
import {UserModel} from './models/user'
import {WorkerModel} from "./models/worker"

export const OTPRepository = (): IOTPRepository => ({
  createOTP: async (
    customerId: string,
    OtpPIN: number,
    otpExpiration: Date
  ) => {
    try {
      const otpDoc = new customerOTPModel({
        customerId,
        OtpPIN,
        otpExpiration,
      });

      await otpDoc.save();
      return;
    } catch (error) {
      // console.log(
      //   `Error from infrastructure->Otp repository ->createOTP\n`,
      //   error
      // );
      throw error;
    }
  },
  CustomerVerifyOTP: async (otpValue: number, customerId: string) => {
    try {
      // * varifyOTP 

      const CustomerOtpData = await customerOTPModel.findOne({customerId});

      if(CustomerOtpData?.OtpPIN==otpValue) return true
      else throw new Error('OTP mismatch. Please try again.')

    } catch (error) {
      // Error handling logic missing
      // console.log(`Error from infrastructure->Otp repository ->MongooseOtpRepository \n ${error}`)
      throw error
    }  
},  
 verifyUser:async(userId:string)=>{
  try{
    await UserModel.findByIdAndUpdate({_id:userId},{$set:{isVerified:true}}) 
  }catch(err){
    // console.log(`Error from infrastruture->database->MongooseOtpRepository \n ${err}`)
    throw err
  }
},
 verifyWorker:async(workerId:string)=>{
  try{
    await WorkerModel.findByIdAndUpdate({_id:workerId},{$set:{isVerified:true}}) 
  }catch(err){
    // console.log(`Error from infrastruture->database->MongooseOtpRepository \n ${err}`)
    throw err
  }
},
  getUserDataResendOTP:async(customerId:string)=>{
    try{

      const userData = await UserModel.findById({_id:customerId});

      return userData?.EmailAddress
    }catch(error){
      // console.log( `Error from infrastruture->database->MongooseOtpRepository  \n ${error}`)
      throw error
    }
  },
  getWorkerDataResendOTP:async(customerId:string)=>{
    try{

      const workerData = await WorkerModel.findById({_id:customerId});

      return workerData?.EmailAddress
    }catch(error){
      // console.log( `Error from infrastruture->database->MongooseOtpRepository  \n ${error}`)
      throw error
    }
  },
  deleteOTP: async (customerId:string) =>{
    try{
      await customerOTPModel.deleteOne({customerId})
    }catch(error){
      // console.log(`Error from infrastruture->database->ResendOTPStore  \n ${error}`)
      throw error
    }
  }
});

