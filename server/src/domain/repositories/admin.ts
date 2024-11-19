import { AddCategory} from "../entities/admin";
import {WorkerInformation} from "../entities/worker"
import {User} from "../entities/user"



export interface IAdminMongoose{
    CheckExistCategory(categoryName:string) : Promise<AddCategory | null>  // * Admin in category side
    AddCategoryQuery(categoryDetails:AddCategory) :Promise<AddCategory> ;
    getAllCategoryQuery() : Promise<AddCategory[]>
    IsListedQuery(_id:string,isListed:boolean):Promise<void>
    deleteProductQuery(_id:string) : Promise<void>;
    EditeCategoryQuery(categoryData:AddCategory) : Promise<void>
    getEditCategoryName(_id:string) : Promise<{categoryName:string} |null>
    getUnApprovalWorker() : Promise<WorkerInformation[]> // * All in approval Workers
    isWorkerApproval(_id:string) : Promise<void>;
    getAllWorkerList(): Promise<WorkerInformation[] | undefined> // * all worker list
    getAllUserList(): Promise<User[]>     // * Admin in User side
    isBlockUser(_id:string,isBlock:boolean) : Promise<void>
    totalRevenue() : Promise<number[]>
    totalReview() : Promise<number>
    totalWorkers() : Promise<number>
    avgRating() : Promise<any[]>
    paymentData() : Promise<any[]>
    workerDistribution() : Promise<any[]>
    jobStatus() : Promise<any[]>
    getCompletedWorkerCount() : Promise<any[]>
    getTopWorker() : Promise<any[]>
    getRecentReview() : Promise<any[]>
    getSalesDatas(data:any,skip:number,limit:number) : Promise<any[]>
    getSalesDatasCount(data:any) : Promise<any>
    getAllCategory() : Promise<string[]>
    downloadSalesData(query:any) : Promise<any[]>
    getWorkerDetails(workerId:string) : Promise<any>
    isBlockWorker(workerId:string) : Promise<void>
}
