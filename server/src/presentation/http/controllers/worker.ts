import {Response,Request, NextFunction } from "express";
import {LoginVerify} from "../../../app/useCases/worker/loginVerifyWorker"
import {isCheckWorkerEmail} from "../../../app/useCases/worker/forgetPass"
import {IMulterFile} from "../../../domain/entities/s3entities"
import {uploadImage} from '../../../app/useCases/utils/uploadImage'
import {WorkerInformation} from '../../../domain/entities/worker'
import {CookieTypes,Role,StatusCode} from '../../../domain/entities/commonTypes'
import {hashPassword} from '../../../shared/utils/encrptionUtils'
import {JwtService} from '../../../infrastructure/service/jwt'
import {
    professionalUsecase,
    WorkerUsecase,
    workerExist,
    getWorkerData,
    workerProjectUsecases,
    getWorkerProjectData, 
    getSingleWorkerDetailsUsecases,
    getRequestUsecases,
    isAcceptUseCasess,
    isRejectUsecases,
    getChatsNameUsecases,
    messageUsecases,
    fetchMessageUsecases,
    dashboardUsescases,
    ratingUsecases,
    upcomingWorksUsecases,
    markasCompleteUsecases
} from "../../../app/useCases/worker/workerUsecases"
import { generateOtpAccessToken } from "../../../app/services/token";

// * dashboard

export const dashboard = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {customerId} = req.session

        const ratingPromise = await ratingUsecases(req.params.Id);
        const resentActivityPromise = await dashboardUsescases(customerId || '');

        const result = {
            rating: ratingPromise,
            resentActivity: resentActivityPromise?.resentActivity,
            getRecentActivity : resentActivityPromise?.getRecentActivity,
            totalOffer : resentActivityPromise?.totalOffer
          };

        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched', result})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> Dashboard \n ${error}`);
        next(error);
    }
}
export const upcomingWorkers = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const result = await upcomingWorksUsecases(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> upcomingWorkers \n ${error}`);
        next(error);
    }
}
// * Mark as complete
export const workComplete = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const result = await markasCompleteUsecases(req.params.id,req.params.status)
        return res.status(StatusCode.Success).json({ success: true, message: 'Marked as complete successfully'});

    } catch (error) {
        console.log(`Error from presentation layer -> http -> workComplete \n ${error}`);
        next(error);
    }
}



// * chat Request details
export const fetchMessage = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await fetchMessageUsecases(req.params.Id)
        return res.status(StatusCode.Success).json({success:true,message:'message successfully fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> fetchMessage \n ${error}`);
        next(error);
    }
}

export const messageController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await messageUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'successfully sent message to user'})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> messageController\n ${error}`);
        next(error);
    }
}

export const connectedUsers = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getChatsNameUsecases(req.params.Id)
        return res.status(StatusCode.Success).json({success:true,message:'data successfully fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> getChatsName\n ${error}`);
        next(error);
    }
}


// * worker Request details 

export const getAllRequestController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const result = await getRequestUsecases(req.params.workerId);
        // * Check if headers have already been sent
     
        if (!res.headersSent) {
            return res.status(StatusCode.Success).json({ 
                success: true, 
                message: 'Data has been successfully fetched', 
                result 
            });
        }
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result})

    } catch (error) {
        console.log(`Error from presentation layer -> http -> getAllRequestController\n ${error}`);
        next(error);
    }
};
export const isAcceptWorkController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {customerId} = req.session
        const result = await isAcceptUseCasess(req.params.update,(customerId|| ''))
        return res.status(StatusCode.Success).json({success:true,message:'successfully updated'})
    } catch (error) {
        console.log(`Error from presentation layer-> http->isAcceptWorkController\n ${error}`)
        next(error)
    }
}

export const isRejectWorkController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        return res.status(StatusCode.Success).json({success:true,message:"Project has been cancelled"})
    } catch (error) {
        console.log(`Error from presentation layer-> http->isRejectWorkController\n ${error}`)
        next(error)
    }
}




// * get worker Single worker Details

export const getSingleWorkerDetails = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getSingleWorkerDetailsUsecases(req.params.workerid)
        return res.status(StatusCode.Success).json({success:true,message:'single worker details has been fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getSingleWorkerDetails\n ${error}`)
        next(error)
    }
}

// * Worker in Project side
export const addProjectDetails = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        // console.log('addProjectDetails')
        // console.log(req.file)
        const file: IMulterFile |any = req.file
        const imageUrl = await uploadImage(file) 
        req.body.ProjectImage = imageUrl
        const result = await workerProjectUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'Project details has been successfully update'})
    } catch (error) {
        console.log(`Error from presentation layer-> http->AddProjectDetails\n ${error}`)
        next(error)
    }
}
export const getProjectDetails = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        // console.log('params id')
        // console.log(req.params.id)
        if(req.params.id){
            const result = await getWorkerProjectData(req.params.id)
            return res.status(StatusCode.Success).json({success:true,message:'Worker Project Data has been Fetched',result})
        }
        return res.status(StatusCode.BadRequest).json({success:false,message:'worker id is required'})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getProjectDetails\n ${error}`)
        next(error)
    }
}

export const PersonalInformationControll = async (req:Request,res:Response, next : NextFunction)=>{
    try{
        const checkWorker = await workerExist(req.body) // * check weather the worker exist or not
        console.log('check worker')
        console.log(checkWorker)
        const {profileImage,...data} = req.body // * for checking
        if(checkWorker && checkWorker.isVerified) throw new Error('Email already exist')

        const file: IMulterFile |any = req.file
        const imageUrl = await uploadImage(file)    // * call uploadImage usecases
        req.body.profile = imageUrl
        const bcyptPass = await hashPassword(req.body?.password)   // * hash the password
        const workerDetails = req.body
        workerDetails.password = bcyptPass    // * asign the bcrypt pass
        return res.status(StatusCode.Success).json({success:true,workerDetails  })
    }catch(error){
        console.log(`Error from presentation layer-> http->PersonalInformation\n ${error}`)
        next(error)
    }
}

export const ProfessionalInfoControll = async (req:Request,res:Response,next:NextFunction)=>{
    try {
     
        // const file: IMulterFile |any = req.file
        // const imageUrl = await uploadImage(file)    // * call uploadImage usecases
        // req.body.identity = imageUrl
        const workerId = await WorkerUsecase(req.body)
        
        const token = await generateOtpAccessToken(workerId)
        res.cookie(CookieTypes.Token,token,{
            maxAge:15*60*1000,  
            httpOnly: true,         
            secure :true,
            sameSite: 'strict'
        })
        res.status(StatusCode.Success).json({success:true,message:'Worker Details has been register',worker : workerId})
    } catch (error) {
        console.log(`Error from presentation layer-> http->ProfessionalInfoControll\n ${error}`)
        next(error) 
    }
}


export const isCheckEmail = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const userEmailValidation = await isCheckWorkerEmail(req.body.email)
        if(userEmailValidation){
        return res.status(StatusCode.Success).json({success:true,message:'verified success',userEmailValidation})
        }else {
        return res.status(StatusCode.NotFound).json({
                success: false,
                message: 'This email is not registered. Please check your email address.',
              });}
    } catch (error) {
        console.log(`Error from presentation layer-> http->isCheckEmail\n ${error}`)
        next(error) 
    }
}


export const getWorkerDataController = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('req reached worker controller')
        const {workerRefreshToken} = req.cookies
        console.log(workerRefreshToken)
        if(!workerRefreshToken) return res.status(StatusCode.Forbidden).json({ message: "Unauthenticated" });
        const workerData = await getWorkerData(workerRefreshToken)
        return res.status(StatusCode.Success).json({success:true,message:'success',workerData})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getWorkerDataController\n ${error}`)
        next(error) 
    }
}

export const LoginWorkerController = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const loginUsecase : WorkerInformation | boolean = await LoginVerify(req.body?.emailAddress,req.body?.password)
       
        if(!loginUsecase) throw new Error('check email and password')
        else if(loginUsecase.isBlocked){
           return res.status(StatusCode.Forbidden).json({success:false,errorMessage: "This worker is blocked and cannot perform this action." }) 
        }
        const  {refreshToken,accessToken} = JwtService((loginUsecase?._id||'').toString(),loginUsecase.firstName,loginUsecase.emailAddress,(req.body.role || Role.Worker))  
        
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
        const customerData  = {
            _id: loginUsecase._id,
            customerName : loginUsecase.firstName,
            customerEmail : loginUsecase.emailAddress,
            role : 'worker'
        }
        return res.status(StatusCode.Success).json({success:true,message:'Login successful',customerData}) 
        // res.status(StatusCode.Unauthorized)
    }catch(error){
        console.log(`Error from Presntation->controllers ${error}`)
        next(error)
    }
}



export const addtionalProfessionalData = async(req:Request,res:Response,next:NextFunction)=>{
    try{
    
       const result = await professionalUsecase(req.body)
     
       return res.status(StatusCode.Success).json({success:true,message:'successfully updated'})
    }catch(error){
        console.log(`Error from Presntation->addtionalProfessionalData ${error}`)
        next(error) 
    }
}