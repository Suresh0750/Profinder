
import {Schema,model} from 'mongoose'


const RequestSchema = new Schema({
    service : {type:String,required:true},
    worker :{type:String,required:true},
    user : {type:String,required:true},
    preferredDate : {type:String,required:true},
    preferredTime : {type:String,required:true},
    servicelocation : {type:String,required:true},
    AdditionalNotes : {type:String,required:true},
    userId : {type:Schema.Types.ObjectId,ref:'userdatas',required:true},
    workerId : {type:Schema.Types.ObjectId,ref:'workerdetails',required:true},
    isAccept : {
        type:String,
        default: "Pending"
    },
    payment :{
        type : Number,
        default : 0
    }
},{ timestamps: true })


export const RequestModel = model("RequestCollection",RequestSchema)