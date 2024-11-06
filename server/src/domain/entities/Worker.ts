// * worker Project details]
import {Types} from 'mongoose'

export interface ProjectDetails {
    _id? : string,
    projectName : string,
    ProjectDescription : string,
    ProjectImage : string
}


export interface PersonalInformation{
    _id ? : string,
    FirstName : string,
    LastName : string,
    PhoneNumber : number,
    EmailAddress : string,
    Password : string,
    Profile : String,
    isVerified? : Boolean,
    latitude?: number,
    longitude?: number,
}

export interface ProfessionInformation{ 
    Category : String,
    Country : String,
    StreetAddress : String,
    State : String,
    City : String,
    Apt : String,
    Identity : String,
    PostalCode : Number,
    WorkerImage? : any,
    reviews? : string[],
    isVerified? : Boolean,
    isWorker ? : Boolean
}


export type WorkerInformation = PersonalInformation & ProfessionInformation & {
    _id?: string; 
    role?: string;
    isBlock? : boolean;
};

export type getProjectData = {
    WorkerImage :[{
        projectName:string,
        ProjectDescription : string,
        ProjectImage : string,
        _id : string
    }]
}


// * request data 


export type workerRequest = {
    service : string,
    worker :string,
    user : string,
    preferredDate : string,
    preferredTime : string,
    servicelocation : string,
    AdditionalNotes : string,
    userId : string,
    workerId : string,
    isAccept :string
}

export type messageTypes = {
    conversationId : Types.ObjectId | string,
    message : string,
    sender : string,
    lastMessage?: string
    isRead ?: boolean
    createdAt? : Date | string,
    updatedAt?: Date | string,
    __v ? : number
}

export type ProfessionalInfoData = {
    coord :{
        lat : number,
        lon : number
    },
    mapAddress : any,
    Category : string,
    StreetAddress : string,
    City : string,
    Apt : string,
    State : string,
    Country : string,
    PostalCode : string,
    FirstName : string,
    LastName : string,
    PhoneNumber : number,
    EmailAddress : string,
    Password : string,
    Profile : string,
    Identity : string,
    latitude : string,
    longitude : string,
    lon : string | number,
    lat : string | number,
}
