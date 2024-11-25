import {Types} from 'mongoose'
const {ObjectId} = Types
// * Object types
import { AddCategory,filterSales } from "../../../domain/entities/admin"

// * Repository types
import {IAdminMongoose} from "../../../domain/repositories/admin"

// * Model
import {CategoryModel} from "./models/admin"
import {WorkerModel} from "./models/worker"
import {UserModel} from "./models/user"
import { RecentActivityModel } from "./models/recentActivity"
import { ReviewModel } from './models/review'
import { PaymentModel } from "./models/payment"
import { RequestModel } from "./models/request"


export const AdminMongoose = () : IAdminMongoose =>({
    // * Admin in category side query's
    CheckExistCategory : async(categoryName:string)=>{
        try{
            const checkProduct = await CategoryModel.findOne({categoryName})
            return checkProduct
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->AddCategoryQuery->\n`,error)
            throw error
        }
    },
    AddCategoryQuery: async (categoryDetails:AddCategory)=>{
        try {

            const categoryDetail =  new CategoryModel(categoryDetails)
            return await categoryDetail.save()
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->AddCategoryQuery->\n`,error)
            throw error
        }
    },
    getAllCategoryQuery : async()=>{
        try {
            return await CategoryModel.find({})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getAllCategoryQuery->\n`,error)
            throw error
        }
    },
    IsListedQuery: async(_id:string,isListed:Boolean)=>{
        try {
            console.log('query')
            console.log(_id,isListed)
            await CategoryModel.findByIdAndUpdate({_id:new ObjectId(_id)},{$set:{isListed:isListed}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getAllCategoryQuery->\n`,error)
            throw error
        }
    },
    deleteProductQuery : async(_id:string)=>{
        try{
            await CategoryModel.findByIdAndDelete({_id:new ObjectId(_id)})
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->deleteProductQuery->\n`,error)
            throw error
        }
    },
    EditeCategoryQuery : async(categoryData:AddCategory)=>{
        try {
            await CategoryModel.findByIdAndUpdate({_id:categoryData._id},{$set:{categoryName:categoryData.categoryName,categoryDescription:categoryData.categoryDescription,categoryImage:categoryData.categoryImage}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->EditeCategoryQuery->\n`,error)
            throw error
        }
    },
    getEditCategoryName : async(_id:string)=>{
        try {
            return await CategoryModel.findById({_id},{categoryName:1,_id:0})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getEditCategoryName->\n`,error)
            throw error
        }
    },
    // * Admin in Worker Approval side
    getUnApprovalWorker : async()=>{
        try {
            return await WorkerModel.find({isWorker:false})  //* all un Approval workers
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getInvalidWorker->\n`,error)
            throw error
        }
    },
    isWorkerApproval : async(_id:string)=>{
        try{
            await WorkerModel.findByIdAndUpdate({_id},{$set:{isWorker:true}});
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->isWorkerApproval->\n`,error)
            throw error
        }
    },
    // * Admin in Worker side query's
    getAllWorkerList : async()=>{
        try {
          return  await WorkerModel.find({})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->EditeCategoryQuery->\n`,error)
            throw error
        }
    },
    // * Admin in User Side Query's
    getAllUserList : async()=>{
        try {
            return await UserModel.find({})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getAllUserList->\n`,error)
            throw error
        }
    },
    isBlockUser : async(userId:string,isBlock:false)=>{
        try {
            await UserModel.findByIdAndUpdate({_id:userId},{$set:{isBlock}})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->isBlockUser->\n`,error)
            throw error
        }
    },
    totalRevenue :async()=>{
        try{
            return await RecentActivityModel.aggregate([
                {
              $group:{_id:null,payment:{$sum:{$cond:[{$ne:["$paymentId",null]},"$payment",0]}}}
                  }
              ])
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->totalRevenue->\n`,error)
            throw error
        }
    },
    totalReview : async()=>{
        try{
            return await ReviewModel.countDocuments()
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->totalReview->\n`,error)
            throw error
        }
    },
    totalWorkers : async()=>{
        try{
            return await WorkerModel.countDocuments()
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->totalReview->\n`,error)
            throw error
        }
    },
    avgRating : async()=>{
        try {
            return await ReviewModel.aggregate([
                {
              $group:{_id:null,sum:{$sum:"$rating"}, count: { $sum: 1 }  },
              }
              ])
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->avgRating->\n`,error)
            throw error
        }
    },
    paymentData : async()=>{
        try {
            return await PaymentModel.find()
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->paymentData->\n`,error)
            throw error
        }
    },
    workerDistribution : async()=>{
        try {
            return await WorkerModel.aggregate([
                {$group:{_id:"$category",count:{$sum:1}}}
              ])
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->workerDistribution->\n`,error)
            throw error
        }
    },
    jobStatus : async()=>{
        try {
            return await RequestModel.aggregate([
                {$group:{_id:"$isAccept",value:{$sum:1}}}
              ])
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->jobStatus->\n`,error)
            throw error
        }
    },
    getCompletedWorkerCount :async()=>{
        try {
            return await RecentActivityModel.aggregate([
                {
                  $group: {
                    _id: "$workerId",   
                    count: { $sum: 1 },
                    earning: { $sum: "$payment" } 
                  }
                },
                {
                  $lookup: {
                    from: "workerdetails",
                    localField: "_id", 
                    foreignField: "_id",
                    as: "workerDetails"
                  }
                },
                {
                  $unwind: "$workerDetails"
                },
                {
                  $project: {
                    _id: 1, 
                    count: 1,
                    earning: 1,
                    "workerDetails.firstName": 1, 
                    "workerDetails.category": 1, 
                  }
                }
              ]);
              
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getCompletedWorkerCount->\n`,error)
            throw error
        }
    },
    getTopWorker : async()=>{   // * filer for get top performance worker
        try {
            return await ReviewModel.aggregate([
                {
                  $group: {
                    _id: "$workerId", 
                    totalRating: { $sum: "$rating" },
                    reviewCount: { $sum: 1 }
                  }
                },
                {
                  $sort: { totalRating: -1 } 
                },
                {
                  $limit: 5 
                }
              ])
              
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getTopWorker->\n`,error)
            throw error
        }
    },
    getRecentReview : async()=>{
        try {
            return await ReviewModel.find({}).populate('userId','username').populate('workerId','firstName profile').sort({createAt:-1}).limit(6)
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getRecentReview->\n`,error)
            throw error
        }
    },
    getSalesDatas : async(query:filterSales | any,skip:number,limit:number)=>{
        try{
            return await RequestModel.find(query,{_id:1,user:1,worker:1,service:1,preferredDate:1,isAccept:1,payment:1}).skip(skip).limit(limit).lean()
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->getRecentReview->\n`,error)
            throw error
        }
    },
    getSalesDatasCount : async(query:filterSales | any)=>{
        try{
            return await RequestModel.find(query).countDocuments()
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->getRecentReview->\n`,error)
            throw error
        }
    },
    getAllCategory : async()=>{
        try {
            return await CategoryModel.distinct('categoryName')
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getAllCategory->\n`,error)
            throw error
        }
    },      
    downloadSalesData : async(query:filterSales)=>{
        try{
            return await RequestModel.find(query,{_id:1,user:1,worker:1,service:1,preferredDate:1,isAccept:1,payment:1})
        }catch(error){
            // console.log(`Error from infrastructure->database->mongoose->getRecentReview->\n`,error)
            throw error
        }
    },
    getWorkerDetails : async(workerId:string)=>{
        try {
            return await WorkerModel.findById({_id:new ObjectId(workerId)})
        } catch (error) {
            // console.log(`Error from infrastructure->database->mongoose->getRecentReview->\n`,error)
            throw error
        }
    },
    isBlockWorker : async(workerId:string)=>{
        try {
            await WorkerModel.updateOne(
                { _id: new ObjectId(workerId) },
                [{ $set: { isBlock: { $not: "$isBlock" } } }]
              );            
        } catch (error) {
            throw error
        }
    }

})