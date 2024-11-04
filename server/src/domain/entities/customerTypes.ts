
import {Types} from 'mongoose'


export interface RequestData {
    service : string,
    worker :string,
    preferredDate : string,
    preferredTime : number | string,
    servicelocation : string,
    AdditionalNotes? : string,
    userId : string,
    workerId : string,
    isAccept ?: string,
    additionalNotes?:string
}

export interface getReviewTypes {
    _id?:Types.ObjectId
    coment : string,
    userId :{
        _id : Types.ObjectId,
        profile : string,
        username :string
    },
    workerId : Types.ObjectId
}