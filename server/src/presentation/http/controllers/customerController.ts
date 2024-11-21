

import { Request,Response,NextFunction } from "express"
import {OtpVerifyUseCases} from "../../../app/useCases/utils/otpStoreData"
import {GetVerifyOTP} from '../../../domain/entities/customerOTP' 
import {JwtService} from '../../../infrastructure/service/jwt'
import {CookieTypes,Role,StatusCode} from '../../../domain/entities/commonTypes'
import {WorkerInformation} from '../../../domain/entities/worker'
import {userVerification,workerVerification,ForgetPassWordUseCase,customerResentOTP,GoogleLoginUseCases, workerGoogleVerification, GoogleLoginWorkerRegister} from '../../../app/useCases/utils/customerVerification'
import { uploadImage } from "../../../app/useCases/utils/uploadImage"
import { IMulterFile } from "../../../domain/entities/admin"
import { hashPassword } from "../../../shared/utils/encrptionUtils"
import { getCategoryNameUtils, getNearByWorkerListUtils, getVerifiedWorkerUtils,userRequestUsecases,ReviewUsecases,getReviewUsecases,paymentUsecases} from "../../../app/useCases/utils/customerUtils"
import { payment,IsActivityUsecases } from "../../../app/services/payU"
import { FindNearByWorkers } from "../../../infrastructure/service/workerLocationFilter"


// * Review in worker

export const getReviewController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getReviewUsecases(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'fetch all review data',result})
    } catch (error) {
        console.log(`Error from getReviewController\n${error}`)
        next(error)
    }
}
export const ReviewController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await ReviewUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'review successfully updated'})
    } catch (error) {
        console.log(`Error from Review\n${error}`)
        next(error)
    }
}


// * paymetAPI

export const paymetnAPIController = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {hash}  = await payment(req.body)
    
        return res.status(StatusCode.Success).json({success:true,hash})

    } catch (error) {
        console.log(`Error from paymetnAPIController\n${error}`)
        next(error)   
    }
}

export const paymentIdController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     
        const result = await IsActivityUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true})
    } catch (error) {
        console.log(`Error from paymentIdController\n${error}`)
        next(error)  
    }
}

export const paymentDetails = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await paymentUsecases(req.params.requestId)
        return res.status(StatusCode.Success).json({success:true,message:'data successfully fetched',result})
    } catch (error) {
        console.log(`Error from paymentDetails\n${error}`)
        next(error)  
    }
}

// * user Request to worker


export const userRequestWorkerController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
       
        const result = await userRequestUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'Request has been sent'})
        
    } catch (error) {
        console.log(`Error from useRequestWorkerController\n${error}`)
        next(error)  
    }
}

// * Get near by worker which around the customer

export const getNearByWorkerDetailsController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
       
        const result = await getNearByWorkerListUtils(req.params.categoryName)
        // console.log(JSON.stringify(result))
     
        return res.status(StatusCode.Success).json({success:true,message:'successfully fetched near by worker details',result})
    } catch (error) {
        console.log(`Error from getNearByWorkerDetailsController\n${error}`)
        next(error)
    }
}


// * Customer( User & Worker) controller

export const getVerifiedWorkerController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
  
         const result = await getVerifiedWorkerUtils(req.params.lat,req.params.lon)
         if(result) return res.status(StatusCode.Success).json({success:true,message:'Verified worker has been fetched',result})
        
        return res.status(StatusCode.InternalServerError).json({success:false,message:'server error trye again'})
    } catch (error) {
        console.log(`Error from Customer Resend OTP controller\n ${error}`)
        next(error)  
    }
}
    

// * getCategory Name for listing while worker signup page 

export const getCategoryName = async(req:Request,res:Response,next:Function)=>{
    try {

        const result = await getCategoryNameUtils()
        return res.status(StatusCode.Success).json({success:true,message:`Fetch category's name has been success`,result})
    } catch (error) {
        console.log(`Error from getCategoryName\n${error}`)
        next(error)
    }
}


// * customer comman authendication Part
export const CustomerOtpController = async(req:Request,res:Response,next:NextFunction)=>{
    try{

        const {otpValue,customerId}:GetVerifyOTP = req.body
        const isVerifyOTP = await OtpVerifyUseCases(otpValue,customerId)
        console.log('otp verify')
        console.log(req.body)
        if(isVerifyOTP ){
            
            if(req.body.role == 'user'){
                const userData =  await  userVerification(req.body.customerId,(req.body.role || Role.User))   // * call to verify the customer or update the verify status in database
              

                const  {refreshToken,accessToken} = JwtService((req.body.customerId).toString(),(userData?.username || ''),(userData?.emailAddress || ''),(req.body.role ||Role.User))   // * mongose Id converted as a string
                res.clearCookie(CookieTypes.Token)
                // * JWT referesh token setUp
                res.cookie(CookieTypes.UserRefreshToken,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })

                res.cookie(CookieTypes.UserAccessToken,accessToken,{
                    maxAge: 15 * 60 * 1000
                })   
                const customerData = {
                    _id:userData?._id,
                    customerName : userData?.username,
                    customerEmail : userData?.emailAddress,
                    role : Role.User
                } 
                
                res.status(StatusCode.Success).json({success:true,message:'OTP valid and user verified',customerData})
            
            }else{

                const workerData =  await  workerVerification(customerId) 

                const  {refreshToken,accessToken} = JwtService((req.body.customerId).toString(),(workerData?.firstName || ''),(workerData?.emailAddress || ''),(req.body.role || Role.Worker))   // * mongose Id converted as a string
                // * JWT referesh token setUp
        
                res.cookie(CookieTypes.WorkerRefreshToken,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie(CookieTypes.WorkerAccessToken,accessToken,{
                    maxAge: 15 * 60 * 1000
                })

                const customerData = {
                    _id : workerData?._id,
                    customerName : workerData?.firstName,
                    customerEmail : workerData?.emailAddress,
                    role : Role.Worker
                }

                res.status(StatusCode.Success).json({success:true,message:'OTP valid and worker verified',customerData})
            }

        }else res.status(401).json({success:false,message:'Invalid message'})
    }catch(err){
        console.log(`Error from CustomerOtpController\n ${err}`)
        next(err)
    }

}



export const ResentOTP = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const resendOtp = await customerResentOTP(req.body)
        if(resendOtp) res.status(200).json({user:req.body.customerId,success:true,message:'OTP resent successfully'})
        else res.status(500).json({user:req.body.customerId,success:false,message:'Failed to resend OTP. Please try again.'})
    } catch (error) {
        console.log(`Error from Customer Resend OTP controller\n ${error}`)
        next(error)
    }
}



// * Worker and User ForgetPassword set Controller

export const ForgetPassWordController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
       const setNewPass =  await ForgetPassWordUseCase(req.body)

       if(setNewPass){
       return res.status(200).json({success:true,message:"Your password has been successfully updated!"})
       }

       return res.status(500).json({ message: "Server error. Please try again later" });
        
    } catch (error) {
        console.log(`Error from ForgetPassWordController\n${error}`)
        next(error)
    }
}

export const WorkerGoogleLoginWithRegistrastion = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const result :(WorkerInformation | null | undefined)= await workerGoogleVerification(req.body.email)
      
        if(!result) return res.status(StatusCode.NotFound).json({success:false,message:`Worker has't register`,modal:true})
        else if(result?.isBlocked){
        return res.status(StatusCode.Forbidden).json({success:false,errorMessage: "This worker is blocked and cannot perform this action." }) 
        }else{
        const  {refreshToken,accessToken} = JwtService(((result._id)?.toString() || ''),result.firstName,result.emailAddress,Role.Worker)
        // * JWT referesh token setUp
        res.cookie(CookieTypes.WorkerRefreshToken,refreshToken,{
            httpOnly:true,
            secure :true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.cookie(CookieTypes.WorkerAccessToken,accessToken,{
            maxAge: 15 * 60 * 1000
        })
    }
    const customerData  = {
        _id: result._id,
        customerName : result.firstName,
        customerEmail : result.emailAddress,
        role : Role.Worker
    }
        return res.status(StatusCode.Success).json({success:true,message:'Worker successfully login',customerData})
    } catch (error) {
        console.log(`Error from WorkerGoogleLoginWithRegistrastion\n${error}`)
        next(error)
    }
}

export const GoogleLogin = async (req:Request,res:Response,next:NextFunction)=>{
    try {
     
        if(req?.body?.role == Role.User){
        
            const userData :any = await GoogleLoginUseCases(req.body)

            if(userData?._id){
                if(userData?.isBlock){
                    res.status(StatusCode.Unauthorized)
                    throw new Error('User is blocked')
                }
                const  {refreshToken,accessToken} = JwtService((userData?._id).toString(),userData.username,userData.EmailAddress,(req.body.role || "worker"))  
                // * JWT referesh token setUp
                res.cookie(CookieTypes.UserRefreshToken,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie(CookieTypes.UserAccessToken,accessToken,{
                    // maxAge: 15 * 60 * 1000
                    maxAge: 15 * 60 * 1000
                })
                const customerData  = {
                    _id: userData._id,
                    customerName : userData.username,
                    customerEmail : userData.EmailAddress,
                    role : Role.User
                }
            return res.status(StatusCode.Success).json({success:true,message:"successfully login",customerData})
            }
        }else if(req.body.role ==Role.Worker){
  
            const file: IMulterFile | any = req.file
          
            const imageUrl = await uploadImage(file)
            req.body.Identity = imageUrl
            req.body.Password = await hashPassword(req.body.Password)
            const customerDetails = await GoogleLoginWorkerRegister(req.body)
         
            if(!customerDetails)  return res.status(StatusCode.NotFound).json({success:false,message:'server error'})

            if(customerDetails?._id){
                const  {refreshToken,accessToken} = JwtService((customerDetails?._id).toString(),customerDetails.firstName,customerDetails.emailAddress, Role.Worker)  
                // * JWT referesh token setUp
                res.cookie(CookieTypes.WorkerRefreshToken,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie(CookieTypes.WorkerAccessToken,accessToken,{
                    // maxAge: 15 * 60 * 1000
                    maxAge: 15 * 60 * 1000
                })
                const customerData  = {
                    _id: customerDetails._id,
                    customerName : customerDetails.firstName,
                    customerEmail : customerDetails.emailAddress,
                    role : Role.Worker
                }

             return   res.status(StatusCode.Success).json({success:true,message:"successfully login",customerData})
            }
        }
        return res.status(StatusCode.InternalServerError).json({success:false,message:'Server error'})
        
    } catch (error) {
        console.log(`Erron from GoogleLogin`,error)
        next(error)
    }
}


export const CustomerLogoutController = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        res.clearCookie(CookieTypes.WorkerRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path : '/'
        });
        res.clearCookie(CookieTypes.UserRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path : '/'
        });
        res.clearCookie(CookieTypes.WorkerAccessToken);
        res.clearCookie(CookieTypes.UserAccessToken);
      
        return res.status(StatusCode.Success).json({success:true, message: 'Logged out successfully' });
    } catch (error) {
        console.log(`Error from CustomerLogoutController\n${error}`)
        next(error)
    }
}






