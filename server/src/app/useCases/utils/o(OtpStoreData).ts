import { IOTPRepository } from "../../../domain/repositories/o(OtpRepository)";
import { customerOTPModel } from "../../../infrastructure/database/mongoose/models/o(OTPModel)";
import { OTPRepository } from "../../../infrastructure/database/mongoose/mor(MongooseOtpRepository)";  // * OTP mongooseRepository there we write mongoose query
 

export const ResendOTPStore = async (customerId: string, OtpPIN: number) => {
  try {
    // console.log("req entered OtpStoreData controler");
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
    const OtpRepo: IOTPRepository = OTPRepository();
    await OtpRepo.deleteOTP(customerId)   // * for deleting the old OTP data
    await OtpRepo.createOTP(customerId, OtpPIN, expirationTime);  // * store the new OTP data
    return true;
  } catch (error) {
    console.log(`Error from OtpStoreData controller\n`, error);
    throw error
  }
};

export const OtpStoreData = async (customerId: string, OtpPIN: number) => {
  try {
    // console.log("req entered OtpStoreData controler");
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
    const OtpRepo: IOTPRepository = OTPRepository();
    await OtpRepo.createOTP(customerId, OtpPIN, expirationTime);
    return customerId;
  } catch (error) {
    console.log(`Error from OtpStoreData controller\n`, error);
    throw error
  }
};


export const OtpVerifyUseCases = async (Otp:number,customerId:string)=>{
  try {
    
    // console.log(Otp,customerId)
    const {CustomerVerifyOTP} = OTPRepository(); // * Here we called the method for calling the mogoose query
    return await CustomerVerifyOTP(Otp,customerId)
  } catch (error) {
    console.log(`Error from usecase->utils->Otpverify \n ${error}`)
    throw error
  }
}