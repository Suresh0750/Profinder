import { Types } from "mongoose";

export interface User {
  _id?: string;
  username: string;
  phoneNumber: number;
  emailAddress: string;
  address: string;
  password: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  profile?: string;
  confirmPass?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}


export interface LoginDetails {
  emailAddress: string;
  password: string;
}


export interface EditProfileTypes {
  username: string;
  phoneNumber: string;
  emailAddress: string;
  profile?: string;
}


export interface ProfileTypes {
  username: string;
  phoneNumber: string;
  emailAddress: string;
  profile?: string;
  isImage: boolean;
  newImageData?: string; 
}


export interface ConversationTypes {
  conversationId?: Types.ObjectId; 
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  lastMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  newMessage?: boolean; 
}

export interface MessageTypes {
  conversationId: string | Types.ObjectId;
  sender: Types.ObjectId; // ID of the sender
  message: string;
  isRead?: boolean; // Optional, used for read receipts
  createdAt?: Date;
  updatedAt?: Date;
}
