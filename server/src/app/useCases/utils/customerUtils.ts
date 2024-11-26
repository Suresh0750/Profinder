
import {CustomerQueryRepository} from '../../../infrastructure/database/mongoose/customer'


// * types 
import { ServiceRequest } from '../../../domain/entities/customerTypes'
import { CustomError,ReviewTypes } from '../../../domain/entities/commonTypes';

// * Filter the workers according to the user's location
import {FindNearByWorkers} from '../../../infrastructure/service/workerLocationFilter'





// * payment details
export const paymentUsecases = async(requesId:string)=>{
    try {
        return await CustomerQueryRepository().paymentDetails(requesId)
    } catch (error) {
        console.log(`Error from useCases->utils-> paymentUsecases \n${error}`)
        throw error 
    }
}




// * Review useCases 
export const getReviewUsecases = async(workerId:string)=>{
    try {
        return await CustomerQueryRepository().getReview(workerId)
    } catch (error) {
        console.log(`Error from useCases->utils-> getReviewUsecases \n${error}`)
        throw error 
    }
}
export const ReviewUsecases = async(data:ReviewTypes)=>{
    try {
        return CustomerQueryRepository().createReview(data)
    } catch (error) {
        console.log(`Error from useCases->utils-> ReviewUsecases \n${error}`)
        throw error 
    }
}

// * getUser Request 

export const getUserRequestDataUsecasuse = async(userId:string,workerId:string)=>{
    try {
      
        const payment = await CustomerQueryRepository().checkUserPayed(workerId,userId)
        
        const res = await CustomerQueryRepository().checkExitstRequestQuery(userId,workerId);
        // console.log('usecases getUserRequestDataUsecasuse')
        // console.log(payment)
        // console.log(res)
        if(payment?.paymentId){
            const result = {...res,paymentId:payment?.paymentId}
            return result
        }
        return res
    } catch (error) {
        console.log(`Error from useCases->utils-> getUserRequestDataUsecasuse \n${error}`)
        throw error  
    }
}

// * userRequest usecses

export const userRequestUsecases = async (userRequestDetails:ServiceRequest)=>{
    try {
        const result = await CustomerQueryRepository().checkExitstRequestQuery(userRequestDetails?.userId,userRequestDetails?.workerId);
        // console.log(`Request from userRequestUseCases`)
        // console.log(result)
        if(result && result?.isAccept=="Pending"){
           const error:CustomError =  new Error('Request already exist'); // * if the request already exist means
            error.statusCode = 409
            throw error
        }
        console.log(userRequestDetails)

        // const additionalNotes = userRequestDetails.additionalNotes // * change the name convention
        // delete userRequestDetails.additionalNotes 
        // console.log(userRequestDetails)
        return await CustomerQueryRepository().userRequestQuery(userRequestDetails)

    } catch (error) {
        console.log(`Error from useCases->utils-> userRequestUsecases \n${error}`)
        throw error  
    }
}

// * get workerdetails for emergency details

export const getNearByWorkerListUtils = async(categoryName:string)=>{
    try {
        return await CustomerQueryRepository().getNearByWorkerListQuery(categoryName)
    } catch (error) {
        console.log(`Error from useCases->utils-> getNearByWorkerListUtils \n${error}`)
        throw error
    }
}

// * get category name utils
export const getCategoryNameUtils = async()=>{
    try{
        return await CustomerQueryRepository().getCategoryName()
    }catch(error){
        console.log(`Error from useCases->utils-> getCategoryNameUtil \n${error}`)
        throw error
    }
}


export const getVerifiedWorkerUtils = async(lat:string,lon:string)=>{
    try {
        const workerData = await CustomerQueryRepository().getVerifiedWorker()
        console.log('all worker')
        console.log(JSON.stringify(workerData))
        console.log(lat,lon)
        const res = await FindNearByWorkers({latitude:Number(lat),longitude:Number(lon)},workerData)
        return res
    } catch (error) {
        console.log(`Error from useCases->utils-> getCategoryNameUtil \n${error}`)
        throw error
    }
}