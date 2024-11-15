


import {Schema,model} from 'mongoose'
import {ReviewTypes} from '../../../../domain/entities/commonTypes'
const ReviewSchema = new Schema({
    comment : {type:String,required:true},
    rating : {type:Number,required:true},
    userId : {type:Schema.Types.ObjectId,ref:'userdatas',required:true},
    workerId : {type:Schema.Types.ObjectId,ref:"workerdetails",required:true},
    requestId : {type:Schema.Types.ObjectId,ref:'RequestCollection',required:true}
},{timestamps:true})      


export const ReviewModel = model<ReviewTypes>("reviewcollection",ReviewSchema)
