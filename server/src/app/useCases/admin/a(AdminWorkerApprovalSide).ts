

import {AdminMongoose} from '../../../infrastructure/database/mongoose/ma(MongooseAdminRepository)'



export const AdminWorkerApprovalUseCases = async ()=>{
    try {
        return await AdminMongoose().getUnApprovalWorker()
    } catch (error) {
        console.log(`Error from AdminWorkerApprovalUseCses \n ${error}`)
        throw error
    }
}

export const isWorkerApprovalUseCases = async (_id:string)=>{
    try {
        return await AdminMongoose().isWorkerApproval(_id)
    } catch (error) {
        console.log(`Error from isWorkerApprovalUseCases \n ${error}`)
        throw error
    }
}