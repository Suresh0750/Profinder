
import { z } from 'zod';

// * profile page types

export interface ProfileFormData {
                username: string;
                email: string;
                phoneNumber: string;
                address: string;
            }

export const userProfileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Enter a valid email').min(1, 'Email is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  address: z.string().min(1, 'Address is required'),
  photo: z.any().optional(), // Assuming this is a file input
});

export type FormValues = z.infer<typeof userProfileSchema>;


// * editeprofile types

export interface editeprofile {
  username : string,
  email : string,
  phone : number,
  newImageData ?: any,
  isImage? : boolean
}


// * user message

export interface messageTypes {
    conversationId: string,
    sender:string,
    message:string,
}

export interface conversationData {
  _id : string,
  userId : string,
  workerId : {
    _id : string,
    FirstName : string,
    PhoneNumber : number,
    Profile : string,
    lastMessage : string,
    createdAt : Date | string,
    updatedAt : Date | string,
  }
}
