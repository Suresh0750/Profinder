import {Response,Request, NextFunction } from "express";
import {LoginVerify} from "../../../app/useCases/worker/loginVerifyWorker"
import {isCheckWorkerEmail} from "../../../app/useCases/worker/forgetPass"
import {IMulterFile} from "../../../domain/entities/s3entities"
import {uploadImage} from '../../../app/useCases/utils/uploadImage'
import {PersonalInformation,WorkerInformation} from '../../../domain/entities/Worker'
import {Cookie,StatusCode} from '../../../domain/entities/commonTypes'
import {hashPassword} from '../../../shared/utils/encrptionUtils'
import {JwtService} from '../../../infrastructure/service/JwtService'
import { getUserRequestDataUsecasuse } from "../../../app/useCases/utils/customerUtils";
import {
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
        console.log(`Request reached messageController`)
        const result = await messageUsecases(req.body)
        return res.status(StatusCode.Success).json({success:true,message:'successfully sent message to user'})
    } catch (error) {
        console.log(`Error from presentation layer -> http -> messageController\n ${error}`);
        next(error);
    }
}

export const getChatsName = async(req:Request,res:Response,next:NextFunction)=>{
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
        console.log('isAcceptWorkerController')
        console.log(customerId)
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
        // const requestData = await getUserRequestDataUsecasuse(req.params.userId,req.params.workerid)
    
        const result = await getSingleWorkerDetailsUsecases(req.params.workerid)
        // if(requestData) return res.status(StatusCode.Success).json({success:true,message:'single worker details has been fetched',result,requestData})
        return res.status(StatusCode.Success).json({success:true,message:'single worker details has been fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getSingleWorkerDetails\n ${error}`)
        next(error)
    }
}

// * Worker in Project side
export const AddProjectDetails = async(req:Request,res:Response,next:NextFunction)=>{
    try {
      
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
        const result = await getWorkerProjectData(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'Worker Project Data has been Fetched',result})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getProjectDetails\n ${error}`)
        next(error)
    }
}

export const PersonalInformationControll = async (req:Request,res:Response, next : NextFunction)=>{
    try{
        const checkWorker = await workerExist(req.body) // * check weather the worker exist or not
        if(checkWorker && checkWorker.isVerified) throw new Error('Email already exist')
        const file: IMulterFile |any = req.file
        const imageUrl = await uploadImage(file)    // * call uploadImage usecases
        req.body.Profile = imageUrl
        const bcyptPass = await hashPassword(req.body.Password)   // * hash the password
        const workerDetails = req.body
        workerDetails.Password = bcyptPass    // * asign the bcrypt pass
        res.cookie('isAuthenticated', 'true', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600 // 1 hour
          })
        return res.status(StatusCode.Success).json({success:true,workerDetails})
    }catch(error){
        console.log(`Error from presentation layer-> http->PersonalInformation\n ${error}`)
        next(error)
    }
}

export const ProfessionalInfoControll = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('ProfessionalInfo')
        console.log(req.body)
        const file: IMulterFile |any = req.file
        const imageUrl = await uploadImage(file)    // * call uploadImage usecases
        req.body.Identity = imageUrl
        const workerId = await WorkerUsecase(req.body)
      
        res.status(200).json({success:true,message:'Worker Details has been register',worker : workerId})
    } catch (error) {
        console.log(`Error from presentation layer-> http->ProfessionalInfoControll\n ${error}`)
        next(error) 
    }
}


export const isCheckEmail = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const userEmailValidation = await isCheckWorkerEmail(req.body.email)
        if(userEmailValidation){
            res.status(200).json({success:true,message:'verified success',userEmailValidation})
        }else {
            res.status(404).json({
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
        const {workerToken} = req.cookies
        if(!workerToken) res.status(StatusCode.Forbidden).json({ message: "Unauthenticated" });
        const workerData = await getWorkerData(workerToken)
        res.status(StatusCode.Success).json({success:true,message:'success',workerData})
    } catch (error) {
        console.log(`Error from presentation layer-> http->getWorkerDataController\n ${error}`)
        next(error) 
    }
}

export const LoginWorkerController = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const loginUsecase : WorkerInformation | boolean = await LoginVerify(req.body?.EmailAddress,req.body?.Password)
        console.log('worker')
        if(!loginUsecase) throw new Error('check email and password')
        else if(loginUsecase.isBlock){
           return res.status(StatusCode.Forbidden).json({success:false,message: "This worker is blocked and cannot perform this action." }) 
        }
        const  {refreshToken,accessToken} = JwtService((loginUsecase?._id||'').toString(),loginUsecase.FirstName,loginUsecase.EmailAddress,(req.body.role || "worker"))  
        
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
        const customerData  = {
            _id: loginUsecase._id,
            customerName : loginUsecase.FirstName,
            customerEmail : loginUsecase.EmailAddress,
            role : 'worker'
        }
        return res.status(StatusCode.Success).json({success:true,message:'Login successful',customerData}) 
        // res.status(StatusCode.Unauthorized)
    }catch(error){
        console.log(`Error from Presntation->controllers ${error}`)
        next(error)
    }
}

