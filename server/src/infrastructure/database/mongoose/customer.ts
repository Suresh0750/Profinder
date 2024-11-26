
import { ServiceRequest } from "../../../domain/entities/customerTypes";  
import { ReviewTypes } from "../../../domain/entities/commonTypes";  
import { User } from "../../../domain/entities/user";
import { WorkerInformation } from "../../../domain/entities/worker";
import { ICustomerQueryRepository } from "../../../domain/repositories/customer";

// * database model
import { CategoryModel } from "./models/admin(category)";
import {UserModel} from './models/user'
import {WorkerModel} from './models/worker'
import {RequestModel} from './models/request'
import {ReviewModel} from './models/review'

// * Mongoose types
import {Types} from 'mongoose'
import { RecentActivityModel } from "./models/recentActivity";
import { request } from "@esri/arcgis-rest-request";
const {ObjectId} = Types

export const CustomerQueryRepository = ():ICustomerQueryRepository=>({
    UserGoogleLogin : async (user:User) =>{
        try {
            console.log(user)
            const userDoc  = await UserModel.updateOne({emailAddress:user.emailAddress},{$set:{user}},{upsert:true});
            return userDoc
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->createUser\n`,error)
            throw error  
        }
    },
    UserWorkerLogin : async(workerData:WorkerInformation)=>{
        try{
            return await WorkerModel.updateOne({emailAddress:workerData.emailAddress},{$set:{workerData}},{upsert:true})
        }catch(error){
            // console.log(`Error from infrastructure->mongoseUser->UserWorkerLogin\n`,error)
            throw error
        }
    },
    WorkerGoogleLoginVerification : async(emailAddress:string)=>{
        try{
            return await WorkerModel.findOne({emailAddress})
        }catch(error){
            // console.log(`Error from infrastructure->mongoseUser->UserWorkerLogin\n`,error)
            throw error
        }
    },
    getVerifiedWorker : async()=>{
        try {
            return await WorkerModel.find({isWorker:true})  // * replace the query which only fetch verified worker for show the servie page
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->getVerifiedWorker\n`,error)
            throw error
        }
    },
    getCategoryName : async()=>{
        try {
            return await CategoryModel.distinct('categoryName',{isListed:true})   // * show all category in worker signup page for select
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->getCategoryName\n`,error)
            throw error  
        }
    },
    getNearByWorkerListQuery : async(categoryName:string)=>{
        try {
            return await WorkerModel.find({category:categoryName})
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->getNearByWorkerListQuery\n`,error)
            throw error  
        }
    },
    // * userRequest to worker
    userRequestQuery : async(userRequestDetails:ServiceRequest)=>{
        try {
            await RequestModel.create(userRequestDetails)
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->userRequestQuery\n`,error)
            throw error  
        }
    },
    checkExitstRequestQuery : async(userId:string,workerId:string)=>{
        try {
            return await RequestModel.findOne({userId,workerId,isAccept:"Pending"})
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->checkExitstRequestQuery\n`,error)
            throw error  
        }
    },
    createReview : async(data:ReviewTypes)=>{
        try {
            await ReviewModel.create(data)
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->createReview\n`,error)
            throw error  
        }
    },
    getReview : async (workerId:string)=>{
        try {
            return ReviewModel.find({workerId:new ObjectId(workerId)}).populate('userId','username profile _id')
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->getReview\n`,error)
            throw error
        }
    },
    checkUserPayed:async(workerId:string,userId:string)=>{
        try {         
            return await RecentActivityModel.findOne({workerId:new ObjectId(workerId),userId:new ObjectId(userId)},{paymentId:1,_id:0})

        }catch(error){
            // console.log(`Error from infrastructure->mongoseUser->checkUserPayed\n`,error)
            throw error
        }
    },
    paymentDetails : async(requestId:string)=>{
        try{
            return await RequestModel.findOne({_id:new ObjectId(requestId)})
        }catch(error){
            // console.log(`Error from infrastructure->mongoseUser->paymentDetails\n`,error)
            throw error
        }
    }
    
})