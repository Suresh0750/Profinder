
import {Schema,model,Types} from 'mongoose'


const ResentActivitySchema = new Schema({
    requestId : {type:Types.ObjectId,ref:'RequestCollection',required:true},
    workerId : {type:Types.ObjectId,ref:'workerdetails',required:true},
    userId : {type:Types.ObjectId,ref:'userdatas',required:true},
    isCompleted: {type:Boolean,default:false},
    status : {type:String,default:'Pending'},
    paymentId : {type:String,default:null},
    payment : {type:Number}
},{ timestamps: true })

export const ResentActivityModel = model("ResentActivitycollection",ResentActivitySchema)