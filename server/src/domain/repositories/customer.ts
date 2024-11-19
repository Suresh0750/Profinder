


import { User } from "../entities/user";
import { WorkerInformation } from "../entities/worker";
import { getCategoryName,ReviewTypes } from "../entities/commonTypes";
import { ServiceRequest,Review } from "../entities/customerTypes";


export interface ICustomerQueryRepository {
    UserGoogleLogin(user:User): Promise<any>;
    UserWorkerLogin(workerData:WorkerInformation): Promise<any>;
    WorkerGoogleLoginVerification(EmailAddress:string) : Promise<WorkerInformation | undefined | null>
    getVerifiedWorker() : Promise<WorkerInformation[]> 
    getCategoryName () :Promise<getCategoryName>
    getNearByWorkerListQuery (categoryName:string):Promise<WorkerInformation[]>
    userRequestQuery(userRequestDetails:ServiceRequest) : Promise<void>
    checkExitstRequestQuery(userId:string,workerId:string) : Promise<ServiceRequest| null>
    createReview(data:ReviewTypes) : Promise<void>
    getReview(workerId:string) :Promise<Review[] | undefined>
    checkUserPayed(workerId:string,userId:string) : Promise<any>
    paymentDetails(requestId:string) : Promise<any>
}