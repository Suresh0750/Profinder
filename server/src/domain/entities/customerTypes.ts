import { Types } from 'mongoose';

// More specific name for the request
export interface ServiceRequest {
    service: string;
    worker: string;
    preferredDate: string;
    preferredTime: number | string;
    serviceLocation: string;
    additionalNotes?: string; 
    userId: string;
    workerId: string;
    isAccept?: string; 
}

export interface Review {
    _id?: Types.ObjectId;
    comment: string; 
    userId: {
        _id: Types.ObjectId;
        profile: string;
        username: string;
    };
    workerId: Types.ObjectId;
}
