import { Document, model, Schema } from "mongoose";
import {PersonalInformation, ProfessionInformation,WorkerInformation} from '../../../../domain/entities/Worker'

const workerSchema = new Schema<WorkerInformation>({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    PhoneNumber: { type: Number, required: true },  
    EmailAddress: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Profile: { type: String, default: "" },
    Category: { type: String, required: true },
    Country: { type: String, required: true },
    StreetAddress: { type: String, required: true },
    latitude : {type:Number,requied: true},   // * latitude  and longitude 
    longitude : {type:Number,requied: true},
    State: { type: String, required: true },
    City: { type: String, required: true },
    Apt: { type: String, default: "" },
    Identity: { type: String, required: true },
    PostalCode: { type: String, required: true },  
    WorkerImage: [{
        projectName: { type: String, required: true },
        ProjectDescription: { type: String, required: true },
        ProjectImage: { type: String, required: true }
      }], 
    reviews: [{ type: String }], 
    isVerified : {type:Boolean, default:false},
    isWorker : {type:Boolean,default:false},
    isBlock : {type:Boolean,default:false}
}, { timestamps: true });


const WorkerModel = model<WorkerInformation & Document>('workerdetails', workerSchema);

export { WorkerModel };
