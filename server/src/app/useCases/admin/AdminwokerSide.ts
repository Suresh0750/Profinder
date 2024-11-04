

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
        
    }
}