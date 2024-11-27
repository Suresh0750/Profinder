import {Types} from 'mongoose'
import {IgetWorkerRepository} from '../../../domain/repositories/worker'
import {PersonalInformation, WorkerInformation,ProjectDetails,MessageTypes} from '../../../domain/entities/worker'

// * model
import { WorkerModel } from './models/worker'
import {RequestModel} from './models/request'
import {RecentActivityModel} from './models/recentActivity'
import { ConversationModel } from './models/conversation'
import { MessageModel } from './models/message'
import { ReviewModel } from './models/review';
import {PaymentModel} from './models/payment'

const {ObjectId} = Types
export const getWorkerRepository = ():IgetWorkerRepository =>({
    createWorker: async(workerData:WorkerInformation)=>{
        try {
            const workerDetails = new WorkerModel(workerData); 
            await workerDetails.save();
            return await WorkerModel.findOne({emailAddress:workerData.emailAddress})
            
        } catch (error) {
            // console.log(`Erro from infrastructure->database->MongooseWorkerRepository\n`,error)
            throw error
        }
    },
    insertWorker:async (customerData:WorkerInformation )=>{
        try {
            const {firstName,lastName,phoneNumber,emailAddress,password,profile,category,country,streetAddress,state,city,apt,identity,postalCode} = customerData
            const workerDetails = await WorkerModel.updateOne({emailAddress:customerData.emailAddress},{$set:{firstName,lastName,phoneNumber,emailAddress,password,profile,category,country,streetAddress,state,city,apt,identity,postalCode,isVerified:true}},{upsert:true})
            return customerData
        } catch (error) {
            // console.log(`Erro from infrastructure->database->insertWorker\n`,error)
            throw error
        }
    },
    findWorker : async (workerEmail:string)=>{
        try {
            return await WorkerModel.findOne({emailAddress:workerEmail})
            
        } catch (error) {
            // console.log(`Error infrastructure->database->MongooseWorkerRepository\n${error}`)
            throw error
        }
    },
    ischeckEmail : async(emailAddress: string)=>{
        try {
            const isCheckEmail = await WorkerModel.findOne({emailAddress})
            console.log(isCheckEmail)
            return isCheckEmail  ? isCheckEmail._id : undefined;
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->ischeckEmail\n`,error)
            throw error
        }
    },
    setNewPassWord : async(customerId:string , newPass : string)=>{
        try{
            await WorkerModel.findByIdAndUpdate({_id:customerId},{$set:{password:newPass}})
        }catch(error){
            // console.log(`Error from infrastructure->mongoseUser->setNewPassWord\n`,error)
            throw error
        }
    },
    loginVerifyQuery : async(workerEmail:string)=>{
        try { 
            console.log(`req reached workerLoginVerify`)
     
            const workerFetchDetails =  await WorkerModel.findOne({emailAddress:workerEmail})

          return workerFetchDetails
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->loginVerify\n`,error)
            throw error
        } 
    },
    getWorkerData : async(workerId:string)=>{
        try {
            return await WorkerModel.findById({_id:workerId})
        } catch (error) {
            // console.log(`Error from infrastructure->mongoseUser->loginVerify\n`,error)
            throw error
        }
    },
    chagneExitWorkerCategoryName : async(existName:string,newName:string)=>{
        try{
            await WorkerModel.updateMany({category:existName},{$set:{category:newName}})
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->chagneExitWorkerCategoryName->\n`,error)
            throw error
        }
    },
    // * Add worker project details  && worker Project page
    addWorkerProjectDetails : async(_id:string,ProjectDetails:ProjectDetails)=>{
        try {
            await WorkerModel.updateOne({_id},{$push:{workerImage:ProjectDetails}})  // * worker add project image
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->addWorkerProjectDetails->\n`,error)
            throw error
        }
    },
    getProjectDetailsQuery : async(_id:string)=>{
        try {
           return await WorkerModel.findById({_id},{workerImage:1,_id:0})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getProjectDetailsQuery->\n`,error)
            throw error
        }
    },
    getSingleWorkerDetailsQuery : async(_id:string)=>{
        try {
            return await WorkerModel.findById({_id})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getSingleWorkerDetailsQuery->\n`,error)
            throw error
        }
    },
    // * Request of worker side
    getAllRequestQuery : async(workerId:string)=>{
        try {
            return await RequestModel.find({workerId,isAccept:"Pending"})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getAllRequestQuery->\n`,error)
            throw error
        }
    },
    isAcceptWorkQuery : async(_id:string,isPayment:number)=>{
        try {
            await RequestModel.findByIdAndUpdate({_id},{$set:{isAccept:"Accepted",payment:isPayment}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->isAcceptWorkQuery->\n`,error)
            throw error
        }
    },
    isRejectWorkQuery : async(_id:string)=>{
        try {
            await RequestModel.findByIdAndUpdate({_id},{$set:{isAccept:"Cancelled"}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->isRejectWorkQuery->\n`,error)
            throw error
        }
    },
    IsActivityQuery : async(requestId:string,paymentId:string)=>{
        try {
            await RecentActivityModel.updateOne({requestId:new ObjectId(requestId)},{$set:{paymentId}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->IsActivityQuery->\n`,error)
            throw error
        }
    },
    paymentData : async(requestId:string,payment:number,paymentId:number)=>{
        try {
            await PaymentModel.create({requestId,payment,paymentId})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->paymentData->\n`,error)
            throw error
        }
    },
    getChatsNameQuery : async(workerId:string)=>{
        try{
            return await ConversationModel.find({workerId},{ __v: 0 }).populate('userId','username profile').lean(); 
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->getChatesNameQuery->\n`,error)
            throw error
        }
    },
    messageQuery : async(data:MessageTypes)=>{
        try {
            return await new MessageModel(data).save()
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->messageQuery->\n`,error)
            throw error
        }
    },
    updatemessage : async({_id,lastMessage} :{_id:Types.ObjectId,lastMessage:string})=>{
        try {
            console.log(`update query`)
            // console.log(_id,lastMessage)
            await ConversationModel.findByIdAndUpdate({_id},{$set:{lastMessage,workerUnread:0},$inc:{userUnread:1}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->updatemessage->\n`,error)
            throw error
        }
    },
    fetchMessage:async(conversationId:string)=>{
        try {
            return await MessageModel.find({conversationId:new ObjectId(conversationId)}).lean()
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->fetchMessage->\n`,error)
            throw error
        }
    },
    getSingleMsg : async(message:string)=>{
        try {
            return await MessageModel.findOne({message})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getSingleMsg->\n`,error)
            throw error
        }
    },
    updateIsReadQuery : async(conversationId:string)=>{
        try {
            await MessageModel.updateMany({conversationId:new ObjectId(conversationId),isRead:false},{$set:{isRead:true}}) // * while worker fetch the data
            await ConversationModel.findByIdAndUpdate({_id:new ObjectId(conversationId)},{$set:{workerUnread:0}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->updateIsReadQuery->\n`,error)
            throw error 
        }
    },
    isResendActivityQuery : async(requestId:string,payment:number,workerId:string,userId:string)=>{
        try {
            await  RecentActivityModel.create({requestId,payment,workerId,userId})
        } catch (error) {
            throw error 
        }
    },
    countResentWorkQuery: async(workerId:string)=>{
        try{
            return await RecentActivityModel.aggregate([
                { $match: {workerId: new ObjectId(workerId)} },
                {
                    $group: {
                        _id: null, // * Grouping all documents together
                        countIsCompleteFalse: {
                            $sum: { $cond: [{ $eq: ["$isCompleted", false] }, 1, 0] }
                        },
                        countIsCompleteTrue: {
                            $sum: { $cond: [{ $eq: ["$isCompleted", true] }, 1, 0] }
                        },
                        totalPayment: {
                            $sum: {
                                $cond: [
                                    { 
                                        $and: [
                                            { $eq: ["$isCompleted", true] }, 
                                            { $ne: ["$paymentId", null] } // Check if paymentId is not null
                                        ] 
                                    },
                                    "$payment", 
                                    0
                                ]
                            }
                        },
                        pendingPayment: {
                            $sum: { 
                                $cond: [
                                    { $and: [{ $eq: ["$isCompleted", true] }, { $eq: ["$paymentId", null] }] }, 
                                    "$payment", 
                                    0 
                                ] 
                            }
                        },
                        pendingCustomer: {
                            $sum: {
                              $cond: [
                                { 
                                  $and: [
                                    { $eq: ["$isCompleted", true] },  // * Check if isCompleted is true
                                    { $eq: ["$paymentId", null] }     // * Check if paymentId is null
                                  ] 
                                },
                                1, // * Add 1 if the document matches the condition, it's increasing count one by  one.
                                0  // Otherwise, add 0
                              ]
                            }
                          }
                    }
                }
            ]);
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->isResendActivityQuery->\n`,error)
            throw error 
        }
    },
    totalOffer : async(workerId:string)=>{
        try {
            return await RequestModel.countDocuments({workerId:new ObjectId(workerId)}).countDocuments()
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->totalOffer->\n`,error)
            throw error 
        }
    },
    getRecentActivity : async(workerId:string)=>{
        try {
            return await RecentActivityModel.find({workerId:new ObjectId(workerId)}).populate("requestId","user workerId").populate("workerId","category")
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getRecentActivity->\n`,error)
            throw error 
        }
    },
    ratingQuery : async(workerId:string)=>{
        try {
                return await ReviewModel.aggregate([
                    { $match: { workerId: new ObjectId(workerId)} },
                    {
                        $group: {
                            _id: null,
                            sum: { $sum: "$rating" },
                            count : {$count:{}}  // * it is count of total document for calculate the review
                        }
                    }
                ]);
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->ratingQuery->\n`,error)
            throw error 
        }
    },
    getUpcomingWorks : async(workerId:string)=>{
        try {
            return await RecentActivityModel.find({workerId}).populate('requestId','_id preferredDate preferredTime serviceLocation additionalNotes payment paymentId').populate('userId','_id username emailAddress address phoneNumber')
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->ratingQuery->\n`,error)
            throw error 
        }
    },
    workCompleteQuery : async(_id:string,isCompleted:boolean,status:string)=>{
        try {
            return await RecentActivityModel.findByIdAndUpdate({_id:new ObjectId(_id)},{$set:{isCompleted: isCompleted,status}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->workComplete->\n`,error)
            throw error 
        }
    },
    markCompleteQuery : async(_id:string,status:string)=>{
        try {
            await RequestModel.findByIdAndUpdate({_id:new ObjectId(_id)},{$set:{isAccept:status}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->workComplete->\n`,error)
            throw error 
        }
    },
    availabilityInfo : async(data:any)=>{
        try{
            await WorkerModel.findByIdAndUpdate({_id:new ObjectId(data?._id)},{experience:data?.experience,availability:data?.availability,rate:data?.rate})
        }catch(error){
            throw error
        }
    }
})


