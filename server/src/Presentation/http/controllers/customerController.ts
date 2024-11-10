

import { Request,Response,NextFunction } from "express"
import {OtpVerifyUseCases} from "../../../app/useCases/utils/OtpStoreData"
import {getVerifyOTP} from '../../../domain/entities/CustomerOTP'
import {JwtService} from '../../../infrastructure/service/JwtService'
import {Cookie,StatusCode} from '../../../domain/entities/commonTypes'
import {WorkerInformation} from '../../../domain/entities/Worker'
import {userVerification,workerVerification,ForgetPassWordUseCase,customerResentOTP,GoogleLoginUseCases, workerGoogleVerification, GoogleLoginWorkerRegister} from '../../../app/useCases/utils/customerVerification'
import { uploadImage } from "../../../app/useCases/utils/uploadImage"
import { IMulterFile } from "../../../domain/entities/Admin"
import { hashPassword } from "../../../shared/utils/encrptionUtils"
import { getCategoryNameUtils, getNearByWorkerListUtils, getVerifiedWorkerUtils,userRequestUsecases,ReviewUsecases,getReviewUsecases,paymentUsecases} from "../../../app/useCases/utils/customerUtils"
import { payment,IsActivityUsecases } from "../../../app/services/PayU"
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

        console.log(`Request reached paymetnAPIController`)
        console.log(req.body)
        const {hash}  = await payment(req.body)
        console.log(hash)
        return res.status(StatusCode.Success).json({success:true,hash})

    } catch (error) {
        console.log(`Error from paymetnAPIController\n${error}`)
        next(error)   
    }
}

export const paymentIdController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log(`request reached paymentIdcontroller`)
        console.log(req.body)
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
        console.log(`Request reached useRequestWorkerController`)
        console.log(req.body)
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
        console.log(req.params.categoryName)
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
        console.log(`req reached getVerifiedworkerController`)
        console.log(req.params.lat)
        console.log(req.params.lon)
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
        console.log('req reached getCategoryName')
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
        console.log(`req reach customerotp controller`)

        const {otpValue,userId}:getVerifyOTP = req.body
        const isVerifyOTP = await OtpVerifyUseCases(otpValue,userId)
        if(isVerifyOTP ){
            
            if(req.body.role == 'user'){
                const userData =  await  userVerification(req.body.userId,(req.body.role || "user"))   // * call to verify the customer or update the verify status in database
              

                const  {refreshToken,accessToken} = JwtService((req.body.userId).toString(),(userData?.username || ''),(userData?.EmailAddress || ''),(req.body.role || "user"))   // * mongose Id converted as a string
                // * JWT referesh token setUp
                res.cookie(Cookie.User,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })

                res.cookie('accessToken',accessToken,{
                    maxAge: 15 * 60 * 1000
                })   
                const customerData = {
                    _id:userData?._id,
                    customerName : userData?.username,
                    customerEmail : userData?.EmailAddress,
                    role : 'user'
                } 
                
                res.status(StatusCode.Success).json({success:true,message:'OTP valid and user verified',customerData})
            
            }else{

                const workerData =  await  workerVerification(req.body.userId) 

                const  {refreshToken,accessToken} = JwtService((req.body.userId).toString(),(workerData?.FirstName || ''),(workerData?.EmailAddress || ''),(req.body.role || "worker"))   // * mongose Id converted as a string
                // * JWT referesh token setUp
        
                res.cookie(Cookie.Worker,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie('accessToken',accessToken,{
                    maxAge: 15 * 60 * 1000
                })

                const customerData = {
                    _id : workerData?._id,
                    customerName : workerData?.FirstName,
                    customerEmail : workerData?.EmailAddress,
                    role : 'worker'
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
        if(resendOtp) res.status(200).json({user:req.body.customerID,success:true,message:'OTP resent successfully'})
        else res.status(500).json({user:req.body.customerID,success:false,message:'Failed to resend OTP. Please try again.'})
    } catch (error) {
        console.log(`Error from Customer Resend OTP controller\n ${error}`)
        next(error)
    }
}



// * Worker and User ForgetPassword set Controller

export const ForgetPassWordController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log(`Req reached ForgetPassWordController`)
       const setNewPass =  await ForgetPassWordUseCase(req.body)

       if(setNewPass){
        res.status(200).json({success:true,message:"Your password has been successfully updated!"})
       }

       res.status(500).json({ message: "Server error. Please try again later" });
        
    } catch (error) {
        console.log(`Error from ForgetPassWordController\n${error}`)
        next(error)
    }
}

export const WorkerGoogleLoginWithRegistrastion = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('Request reached WorkerGoogleLoginWithRegistrastion')
        console.log(req.params)
        console.log(req.body)
        const result :(WorkerInformation | null | undefined)= await workerGoogleVerification(req.body.email)
        console.log("result",result)
        if(!result) return res.status(StatusCode.NotFound).json({success:false,message:`Worker has't register`,modal:true})
        else{
        const  {refreshToken,accessToken} = JwtService(((result._id)?.toString() || ''),result.FirstName,result.EmailAddress,'worker')
        // * JWT referesh token setUp
        res.cookie(Cookie.Worker,refreshToken,{
            httpOnly:true,
            secure :true,
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.cookie('accessToken',accessToken,{
            maxAge: 15 * 60 * 1000
        })
    }
    const customerData  = {
        _id: result._id,
        customerName : result.FirstName,
        customerEmail : result.EmailAddress,
        role : 'worker'
    }
        return res.status(StatusCode.Success).json({success:true,message:'Worker successfully login',customerData})
    } catch (error) {
        console.log(`Error from WorkerGoogleLoginWithRegistrastion\n${error}`)
        next(error)
    }
}

export const GoogleLogin = async (req:Request,res:Response,next:NextFunction)=>{
    try {
     
        if(req?.body?.role == "user"){
        
            const userData :any = await GoogleLoginUseCases(req.body)

            if(userData?._id){
                if(userData?.isBlock){
                    res.status(StatusCode.Unauthorized)
                    throw new Error('User is blocked')
                }
                const  {refreshToken,accessToken} = JwtService((userData?._id).toString(),userData.username,userData.EmailAddress,(req.body.role || "worker"))  
                // * JWT referesh token setUp
                res.cookie(Cookie.User,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie('accessToken',accessToken,{
                    // maxAge: 15 * 60 * 1000
                    maxAge: 2 * 60 * 1000
                })
                const customerData  = {
                    _id: userData._id,
                    customerName : userData.username,
                    customerEmail : userData.EmailAddress,
                    role : 'user'
                }
            return res.status(StatusCode.Success).json({success:true,message:"successfully login",customerData})
            }
        }else if(req.body.role ='worker'){
            console.log(`Req entered worker controller`)
          
            const file: IMulterFile | any = req.file
            console.log('file')
            console.log(file)
            const imageUrl = await uploadImage(file)
            req.body.Identity = imageUrl
            req.body.Password = await hashPassword(req.body.Password)
            const customerDetails = await GoogleLoginWorkerRegister(req.body)
         
            if(!customerDetails)  return res.status(StatusCode.NotFound).json({success:false,message:'server error'})

            if(customerDetails?._id){
                const  {refreshToken,accessToken} = JwtService((customerDetails?._id).toString(),customerDetails.FirstName,customerDetails.EmailAddress, "worker")  
                // * JWT referesh token setUp
                res.cookie(Cookie.Worker,refreshToken,{
                    httpOnly:true,
                    secure :true,
                    sameSite:'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.cookie('accessToken',accessToken,{
                    // maxAge: 15 * 60 * 1000
                    maxAge: 2 * 60 * 1000
                })
                const customerData  = {
                    _id: customerDetails._id,
                    customerName : customerDetails.FirstName,
                    customerEmail : customerDetails.EmailAddress,
                    role : 'worker'
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


export const CustomerLogoutController =async (req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log(`Req reached CustomerLogoutController`)
       
        res.clearCookie(Cookie.Worker, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path : '/'
        });
        res.clearCookie(Cookie.User, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path : '/'
        });
      
        return res.status(200).json({success:true, message: 'Logged out successfully' });
    } catch (error) {
        console.log(`Error from CustomerLogoutController\n${error}`)
        next(error)
    }
}

export const customerLogIn = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        console.log(req.cookies)
      
    } catch (error) {
        console.log(`Error from customerLogIn\n${error}`)
        next(error)
    }
}




