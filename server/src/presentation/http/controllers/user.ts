import { Request,Response,NextFunction, json } from "express";
import {JwtService} from '../../../infrastructure/service/jwt'
import {LoginVerify} from "../../../app/useCases/user/loginVerifyUser"
import {isCheckUserEmail} from '../../../app/useCases/user/forgetPass'
import { Role, StatusCode } from "../../../domain/entities/commonTypes";
import { IMulterFile } from "../../../domain/entities/admin";
import { uploadImage } from "../../../app/useCases/utils/uploadImage";
import {CookieTypes} from '../../../domain/entities/commonTypes'
import {
    createUser,
    ProfileUsecases,
    EditprofileUsecases,
    conversationUsecases,
    getConversationUsecases,
    getMessageUsecases,
    getBookingUsecases,
    paymentIdUsecases
} from "../../../app/useCases/user/user";
import { generateOtpAccessToken } from "../../../app/services/token";




export const paymentId = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const result = await paymentIdUsecases(req.params.requestId)
        return res.status(StatusCode.Success).json({success:true,message:'successfully fetched data',result})
    } catch (error) {
        console.log(`Error from Presntation->controllers->paymentId \n${error}`)
        next(error)  
    }
}
// * get booking data

export const getBooking = async(req:Request,res:Response,next:NextFunction)=>{
    try{
      
        const {bookingDetails,reviewDetails}  = await getBookingUsecases(req.params.id)
        // console.log(JSON.stringify(bookingDetails))
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result:bookingDetails,reviewDetails})
    }catch(error){
        console.log(`Error from Presntation->controllers->getBooking \n${error}`)
        next(error)  
    }
}

// * user conversation
export const getMessage = async(req:Request,res:Response,next:NextFunction)=>{  /// * get message and show to user
    try {
        const result = await getMessageUsecases(req.params.id)
        // console.log(JSON.stringify(result))
        return res.status(StatusCode.Success).json({success:true,message:'successfully msg fetched',result})
    } catch (error) {
        console.log(`Error from Presntation->controllers->getMessage \n${error}`)
        next(error)
    }
}
export const getConversation = async (req:Request,res:Response,next:NextFunction)=>{  // * get worker name who are all have connection
    try {
        const result = await getConversationUsecases(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'Data successfully fetched',result})
    } catch (error) {
        console.log(`Error from Presntation->controllers->getConversation \n${error}`)
        next(error)
    }
}
export const conversation = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await conversationUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'successfully updated'})
    } catch (error) {
        console.log(`Error from Presntation->controllers->conversation \n${error}`)
        next(error)
    }
}



// * profile
export const editprofile = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        
        const file: IMulterFile |any  = req.file
        if(JSON.parse(req.body.isImage)){
            const image = await uploadImage(file)
            console.log(image)
            req.body.profile = image
            console.log(req.body.profile)
        }
        await EditprofileUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'data successfully updated'})
        
    } catch (error) {
        console.log(`Error from Presntation->controllers->editprofile \n${error}`)
        next(error)
    }
}
export const profile = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('profile')
        
        const result = await ProfileUsecases(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result})
    } catch (error) {
        console.log(`Error from Presntation->controllers->profile \n${error}`)
        next(error)
    }
}


export const userSignupController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('reached userSignup constroller')
        console.log(req.body)
        const user:string = await createUser(req.body);
        const token = await generateOtpAccessToken(user)
        res.cookie(CookieTypes.Token,token,{
            maxAge:15*60*1000,  
            httpOnly: true,         
            secure :true,
            sameSite: 'strict'
        })
        res.status(StatusCode.Success).json({user,success:true})
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const LoginUser = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        console.log('request reached controller')
        console.log(req.body)
        const loginUsecase :any = await LoginVerify(req.body?.emailAddress,req.body?.password)
      
        if(!loginUsecase){
            res.status(StatusCode.Unauthorized)
            throw new Error('check email and password')
        }else if(loginUsecase && loginUsecase?.isBlock){
           
            res.status(StatusCode.Unauthorized)
            throw new Error('User is blocked')
        }else if(loginUsecase && loginUsecase?._id){
    
            const  {refreshToken,accessToken} = JwtService((loginUsecase._id).toString(),loginUsecase.username,loginUsecase.EmailAddress,(req.body.role || Role.User))   // * mongose Id converted as a string
        
            // * JWT referesh token setUp
            
            res.cookie(CookieTypes.UserRefreshToken,refreshToken,{
                httpOnly:true,
                secure :true,
                sameSite:'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.cookie(CookieTypes.UserAccessToken,accessToken,{
                maxAge: 15 * 60 * 1000
            })
            const customerData = {
                _id:loginUsecase._id,
                customerName : loginUsecase.username,
                customerEmail : loginUsecase.emailAddress,
                role : Role.User
            }
            console.log(customerData)
         return res.status(StatusCode.Success).json({success:true,message:'Login successful',customerData}) 
        }   
    }catch(error){
        console.log(`Error from Presntation->controllers ${error}`)
        next(error)
    }
}


// * check email is there or not for forget password page

export const isCheckEmail = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     
        const userEmailValidation = await isCheckUserEmail(req.body?.emailAddress)
        
        if(userEmailValidation){
         return   res.status(StatusCode.Success).json({success:true,message:'verified success',userEmailValidation})
        }else {
         return   res.status(StatusCode.NotFound).json({
                success: false,
                message: 'This email is not registered. Please check your email address.',
              });}
    } catch (error) {
        console.log(`Error from Presntation->controllers->isCheckEmail \n${error}`)
        next(error)
    }
}