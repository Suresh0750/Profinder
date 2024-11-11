import {getWorkerRepository} from "../../../infrastructure/database/mongoose/MongooseWorkerRepository"
import {checkPassword} from  "../../../infrastructure/service/bcrypt"

export const LoginVerify = async (EmailAddress:string,Password:string)=>{
    try{       
        const {loginVerifyQuery} = getWorkerRepository()
        const actualWorker = await  loginVerifyQuery(EmailAddress)

        if(!actualWorker) throw new Error("Invalid EmailAddress")
        else{
            const isCheckPass =  await checkPassword(Password,actualWorker?.Password)
            return isCheckPass ? actualWorker : false 
        }
    }catch(err){
        console.log(`Error from useCases->user->loginVerify ${err}`)
       throw err
    }
}