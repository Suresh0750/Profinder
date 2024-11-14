
// * server status code

import { conversation } from "../../Presentation/http/controllers/UserController";
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
    Admin = "adminToken",
    Worker = "workerToken",
    User = "userToken",
    AccessToken = 'accessToken'
 }

 export enum Role{
  Admin ="admin",
  Wokrer="worker",
  User = "user",
  Customer = "customer"
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

export type conversationTypes = {
  userId : Types.ObjectId
  workerId:Types.ObjectId,
  lastMessage : string,
  createAt? : Date,
  updateAt? : Date
}


// * message 

export interface messageType {
_id? : Types.ObjectId
conversationId : Types.ObjectId
sender : string
message : string
isRead : boolean
createdAt : Date
updatedAt :Date
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

export interface RequestType{
  _id : Types.ObjectId,
  service : string,
  worker : string,
  user :string,
  preferredData : string,
  preferredTime : string,
  servicelocation : string,
  AdditionalNotes : string,
  userId :  Types.ObjectId,
  workerId :  Types.ObjectId,
  isAccept : string,
  payment : number,
  createdAt : Date
  updatedAt :Date
  __v ? : number
}