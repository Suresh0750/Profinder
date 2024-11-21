
// * server status code

import { Token } from 'aws-sdk';
import {Types} from 'mongoose'


export enum StatusCode {
    Success = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
 }


// * cookie



 export enum CookieTypes {
  AdminAccessToken = "adminAccessToken",
  WorkerAccessToken = "workerAccessToken",
  UserAccessToken = "userAccessToken",
  AdminRefreshToken = "adminRefreshToken",
  WorkerRefreshToken = "workerRefreshToken",
  UserRefreshToken = "userRefreshToken",
  Token = 'token' // * using for produte otp page
}


 export enum Role{
  Admin ="admin",
  Worker="worker",
  User = "user",
  Customer = "customer"
 }

 export enum AdminData{
  customerId = "01",
  customerName = "Suresh"
 }


 export type RoleType = 'user' | 'admin' | 'worker' | "customer";
 // * JWT 

 export interface AdminDetails {
   adminEmail : string,
   iat? : number,
   exp? : number
 }

 // * user JWT

 export interface CustomerDetails{
   customerId : string,
   customerName :string,
   customerEmail : string,
   role: 'user' | 'worker' | 'admin',
   iat ? : number,
   exp ?: number
 }




// * category name type
export type getCategoryName = string[] | any


// * error status code

export interface CustomError extends Error {
  statusCode?: number;
}

export type ConversationTypes = {
  userId : Types.ObjectId
  workerId:Types.ObjectId,
  lastMessage : string,
  createAt? : Date,
  updateAt? : Date
}


// * message 

export interface MessageType {
_id? : Types.ObjectId 
conversationId : Types.ObjectId | string  
sender : string | Types.ObjectId
lastMessage ? : string
message ?: string
isRead? : boolean 
createdAt? : Date | string
updatedAt?:Date | string
__v ? : number
}


// * Review Types

export interface ReviewTypes{
  comment :string,
  rating : number,
  userId : string,
  workerId : string
}

export interface RecentActivityType{
  requestId : Types.ObjectId,
  workerId : Types.ObjectId,
  userId : Types.ObjectId,
  isCompleted : boolean,
  paymentId : string,
  payment : number,
  createdAt : Date
  updatedAt :Date
  __v ? : number
}


export interface ServiceRequest {
  _id: Types.ObjectId;
  service: string;
  worker: string;
  user: string;
  preferredDate: Date;
  preferredTime: string;
  serviceLocation: string;
  additionalNotes: string;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  isAccepted: boolean;
  payment: number;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
