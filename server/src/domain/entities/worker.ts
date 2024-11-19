import { Types } from 'mongoose';

// * Worker Project details
export interface ProjectDetails {
    _id?: string;
    projectName: string;
    projectDescription: string;
    projectImage: string;
}

// * Personal Information
export interface PersonalInformation {
    _id?: string;
    firstName: string;
    lastName: string;
    phoneNumber: number; 
    emailAddress: string;
    password: string;
    profile: string;
    isVerified?: boolean; 
    latitude?: number;
    longitude?: number;
}

// * Profession Information
export interface ProfessionInformation {
    category: string;
    country: string;
    streetAddress: string;
    state: string;
    city: string;
    apt: string;
    identity: string;
    postalCode: string; 
    workerImage?: ProjectDetails[]; 
    isVerified?: boolean;
    isWorker?: boolean;
    experience?: string;
    availability?: string;
    rate?: number;
}

// * Worker Information combining Personal and Profession Info
export type WorkerInformation = PersonalInformation & ProfessionInformation & {
    _id?: string;
    role?: string;
    isBlocked?: boolean;
};

// * Project Data (Worker Image)
export type GetProjectData = {
    workerImage: ProjectDetails[]; 
};

// * Request Data
export type WorkerRequest = {
    service: string;
    worker: string;
    user: string;
    preferredDate: string;
    preferredTime: string;
    serviceLocation: string;
    additionalNotes: string;
    userId: string;
    workerId: string;
    isAccept: boolean;
};

// * Message Types
export type MessageTypes = {
    conversationId?: string | Types.ObjectId;
    message: string;
    sender: Types.ObjectId;
    isRead: boolean;
    lastMessage?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    __v?: number;
};


export type ProfessionalInfoData = {
    coord: {
        lat: number;
        lon: number;
    };
    mapAddress: any;
    category: string;
    streetAddress: string;
    city: string;
    apt: string;
    state: string;
    country: string;
    postalCode: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    emailAddress: string;
    password: string;
    profile: string;
    identity: string;
    latitude: number;
    longitude: number;
};
