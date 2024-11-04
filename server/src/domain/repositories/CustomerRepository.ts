


import { User } from "../entities/User";
import { WorkerInformation } from "../entities/Worker";
import { getCategoryName,ReviewTypes } from "../entities/commonTypes";
import { RequestData,getReviewTypes } from "../entities/customerTypes";


export interface CustomerRepository {
    UserGoogleLogin(user:User): Promise<any>;
    UserWorkerLogin(workerData:WorkerInformation): Promise<any>;
    WorkerGoogleLoginVerification(EmailAddress:string) : Promise<WorkerInformation | undefined | null>
    getVerifiedWorker() : Promise<WorkerInformation[]> 
    getCategoryName () :Promise<getCategoryName>
    getNearByWorkerListQuery (categoryName:string):Promise<WorkerInformation[]>
    userRequestQuery(userRequestDetails:RequestData) : Promise<void>
    checkExitstRequestQuery(userId:string,workerId:string) : Promise<RequestData| null>
    createReview(data:ReviewTypes) : Promise<void>
    getReview(workerId:string) :Promise<getReviewTypes[] | undefined>
    checkUserPayed(workerId:string,userId:string) : Promise<any>
    paymentDetails(requestId:string) : Promise<any>
}