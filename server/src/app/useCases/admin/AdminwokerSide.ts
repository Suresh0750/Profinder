

import {AdminMongoose} from '../../../infrastructure/database/mongoose/MongooseAdminRepository'


export const getALLWorkerUseCases = async()=>{
    try {
        return await AdminMongoose().getAllWorkerList()
    } catch (error) {
        console.log(`Error from useCases->admin->getALLWorkerUseCases\n`,error)
        throw error
    }
}

export const getDetails = async(workerId:string)=>{
    try{
        return await AdminMongoose().getWorkerDetails(workerId)
    }catch(error){
        console.log(`Error from useCases->admin->getDetails\n`,error)
        throw error
    }
}
// * worker Block
export const isBlockUsecases = async(workerId:string)=>{
    try {
        return await AdminMongoose().isBlockWorker(workerId)
    } catch (error) {
        console.log(`Error from useCases->admin->isBlockUsecases\n`,error)
        throw error
    }
}