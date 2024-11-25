
import {PersonalInformation,WorkerInformation,ProjectDetails,ProfessionalInfoData, MessageTypes} from '../../../domain/entities/worker'
import {getWorkerRepository} from "../../../infrastructure/database/mongoose/worker"
import {OtpService} from '../../services/otpService'
import {OtpStoreData} from '../utils/otpStoreData'
import {verifyRefreshToken} from "../../../infrastructure/service/jwt"
import {GeoCoding} from "../../../infrastructure/service/geoCode"
import { sendMessage } from '../utils/chatUtils'
import { MessageType } from '../../../domain/entities/commonTypes'
import {Types} from 'mongoose'
export const {ObjectId} = Types



// * worker dashboard
export const markasCompleteUsecases = async(_id:string,status:string)=>{
    try {
       
            const res = await getWorkerRepository().workCompleteQuery(_id,status=="Completed",status)
            return await getWorkerRepository().markCompleteQuery(String(res?.requestId),status)
    
    } catch (error) {
        console.log(`Error from useCases->worker->rating\n`,error)
        throw error
    }
}
export const upcomingWorksUsecases =  async(workerId:string)=>{
    try{
        return getWorkerRepository().getUpcomingWorks(workerId)
    }catch(error){
        console.log(`Error from useCases->worker->rating\n`,error)
        throw error
    }
}
export const ratingUsecases = async(workerId:string)=>{
    try {
        return getWorkerRepository().ratingQuery(workerId)
    } catch (error) {
        console.log(`Error from useCases->worker->rating\n`,error)
        throw error
    }
}

export const dashboardUsescases = async(workerId:string)=>{
    try {
        const resentActivity :any = await getWorkerRepository().countResentWorkQuery(workerId)
        const getRecentActivity = await getWorkerRepository().getRecentActivity(workerId)
        const totalOffer = await getWorkerRepository().totalOffer(workerId)
 
        return {resentActivity,getRecentActivity,totalOffer}
    } catch (error) {
        console.log(`Error from useCases->worker->dashboardUsescases\n`,error)
        throw error  
    }
}



// * get chats usecause 
export const fetchMessageUsecases = async(conversationId:string)=>{
    try{
        await getWorkerRepository().updateIsReadQuery(conversationId)
        return await getWorkerRepository().fetchMessage(conversationId)
    }catch(error){
        console.log(`Error from useCases->worker->fetchMessageUsecases\n`,error)
        throw error  
    }
}

export const messageUsecases = async(data:MessageTypes)=>{
    try {       
        const {message,conversationId} = data
        await getWorkerRepository().messageQuery(data)
        const result = await getWorkerRepository().getSingleMsg(message)
        
        if(result) await sendMessage(result)   // * here call the socket
        await getWorkerRepository().updatemessage({_id:new ObjectId(conversationId),lastMessage:message})
        return 
    } catch (error) {
        console.log(`Error from useCases->worker->messageUsecases\n`,error)
        throw error
    }
}
export const getChatsNameUsecases = async(_id:string)=>{
    try{
       
        const result = await getWorkerRepository().getChatsNameQuery(_id)
        console.log(JSON.stringify(result))
        return result
    }catch(error){
        console.log(`Error from useCases->worker->getChatsNameUsecases\n`,error)
        throw error
    }
}



// * getAll Request data  of worker

export const getRequestUsecases = async (workerId:string)=>{
    try {
        return await getWorkerRepository().getAllRequestQuery(workerId)
    } catch (error) {
        console.log(`Error from useCases->worker->getAllWorkerUseCases\n`,error)
        throw error
    }
}

export const isAcceptUseCasess = async(data:any,workerId:string)=>{
    try {
        const {_id,isPayment,userId} = JSON.parse(data)
    
        await getWorkerRepository().isAcceptWorkQuery(_id,Number(isPayment))
    
       return  await getWorkerRepository().isResendActivityQuery(_id,Number(isPayment),workerId,userId)
    } catch (error) {
        console.log(`Error from useCases->worker->isAcceptUseCasess\n`,error)
        throw error
    }
}

export const isRejectUsecases = async (_id:string)=>{
    try {
        return await getWorkerRepository().isRejectWorkQuery(_id)
    } catch (error) {
        console.log(`Error from useCases->worker->isRejectUsecases\n`,error)
        throw error
    }
}



// * get Single worker Details

export const getSingleWorkerDetailsUsecases= async (_id:string)=>{
    try {
     
        return await getWorkerRepository().getSingleWorkerDetailsQuery(_id)
    } catch (error) {
        console.log(`Error from useCases->worker->getSingleWorkerDetailsUsecases\n`,error)
        throw error
    }
}



// * worker upload project details usecses
export const workerProjectUsecases = async (workerProjectDetails:ProjectDetails)=>{
    console.log(workerProjectDetails)
    try {
        const {_id,projectName,projectDescription,projectImage} = workerProjectDetails
        const ProjectDetails = {
            projectName,
            projectDescription,
            projectImage 
        }

        if(_id) await getWorkerRepository().addWorkerProjectDetails(_id,ProjectDetails)
        return
    } catch (error) {
        console.log(`Error from useCases->worker->workerProjectUsecases\n`,error)
        throw error
    }
}
export const getWorkerProjectData = async(_id:string)=>{
    try {
        console.log(_id)
        return await getWorkerRepository().getProjectDetailsQuery(_id)
    } catch (error) {
        console.log(`Error from useCases->worker->getWorkerProjectData\n`,error)
        throw error
    }
}



export const workerExist = async (workerData:PersonalInformation) =>{
    try {
      
        const {findWorker} = getWorkerRepository()
        return await findWorker(workerData.emailAddress) // * check the worker already exite or not  

    } catch (error) {
            console.log(`Error from workerExist`,error)
            throw error
    }
}

export const WorkerUsecase= async(workerData:ProfessionalInfoData)=>{
    try {
        console.log(workerData)
        let {firstName,lastName,phoneNumber,emailAddress,postalCode,password,latitude,longitude,profile,identity,category,country,state,city,streetAddress,apt,coord,mapAddress} = workerData

   console.log('step1')
    
        let data = {
            firstName,
            lastName,
            phoneNumber,
            emailAddress,
            password,
            profile,
            identity,
            apt ,
            category,
            country,
            state,
            city,
            postalCode,
            streetAddress,
            latitude : Number(latitude),
            longitude : Number(longitude)
        }
        console.log(mapAddress)
        console.log('step2')
        mapAddress = JSON.parse(mapAddress)
        console.log('step3')
        if(mapAddress?.country) data.country = mapAddress?.country
        if(mapAddress?.postcode) data.postalCode = mapAddress?.postcode
        if(mapAddress?.state) data.state = mapAddress?.state
        console.log('step4')
        const {createWorker} = getWorkerRepository()
        console.log('step5')
        console.log(data)
      
        const workerDetails = await createWorker(data)

        const {customerOTP,customerId} = await OtpService((workerDetails?._id)?.toString(),(workerDetails?.emailAddress || ''))
        await OtpStoreData(customerId,customerOTP)
        return customerId
    } catch (error) {
        console.log(`Error from usecases -> workerUsecase`,error)
        throw error
    }
}

export const getWorkerData = async(token:string)=>{
    try {
   
        const customer :any = verifyRefreshToken(token) 
        console.log('customer')
        console.log(customer)
        const {getWorkerData} = getWorkerRepository()
        return getWorkerData(customer?.customerId)
        // getWorkerData
    } catch (error) {
        console.log(`Error from usecases -> getWorkerData`,error)
        throw error
    }
}

export const professionalUsecase = async(data:any)=>{
    try {
       
        return getWorkerRepository().availabilityInfo(data)
    } catch (error) {
        console.log(`Error from usecases -> professionalUsecase`,error)
        throw error
    }
}