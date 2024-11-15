import {Schema,model} from 'mongoose'

const ConversationShema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'userdatas',
        required:true
    },
    workerId:{
        type: Schema.Types.ObjectId,
        ref:'workerdetails',
        required:true
    },
    lastMessage : {type:String},
    userUnread : {type:Number,default:0},
    workerUnread : {type:Number,default:0},
},{timestamps:true})


export const ConversationModel = model("ConversationCollection",ConversationShema)