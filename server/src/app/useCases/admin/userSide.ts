

import {AdminMongoose} from "../../../infrastructure/database/mongoose/admin"


export const isBlockUserUseCases = async(_id:string,value:boolean)=>{
    try {
        return await AdminMongoose().isBlockUser(_id,value ? false : true)  // * block and unblock the value
    } catch (error) {
        console.log(`Error from useCases->admin->isBlockUserUseCases\n`,error)
        throw error 
    }
}
export const getAllUserUseCase = async()=>{
    try{
        return await AdminMongoose().getAllUserList()
    }catch(error){
        console.log(`Error from useCases->admin->getAllUserUseCase\n`,error)
        throw error
    }
}