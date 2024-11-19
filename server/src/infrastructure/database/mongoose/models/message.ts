

import {Schema,model} from 'mongoose'

const MessageSchema = new Schema({
    conversationId : {
        type : Schema.Types.ObjectId,
        requried : true,
        ref : "Conversation",
    },
    sender : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    message : {type:String,required: true,trim:true},
    isRead : {type: Boolean,required: true,default:false}
},{timestamps:true})


export const MessageModel = model("Message",MessageSchema,"messages")

// const MessageSchema = new Schema({
//     conversationId:{
//         type:Schema.Types.ObjectId,
//         required:true
//     },
//     sender:{type:String,required:true},
//     message:{type:String,required:true},
//     isRead: {type:Boolean,required:true,default:false}
// },{timestamps:true})

