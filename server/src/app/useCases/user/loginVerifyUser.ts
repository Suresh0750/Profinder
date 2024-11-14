
import {User} from "../../../domain/entities/u(User)"
import {getUserRepository} from "../../../infrastructure/database/mongoose/mur(MongooseUserRepository)"
import {checkPassword} from  "../../../infrastructure/service/bcrypt"

export const LoginVerify = async (EmailAddress:string,Password:string)=>{
    try{       
        const {loginVerifyQuery} = getUserRepository()
        const actualUser = await  loginVerifyQuery(EmailAddress)
        if(!actualUser) throw new Error("Invalid EmailAddress")
        else{
            const isCheckPass =  await checkPassword(Password,actualUser?.Password)
            return isCheckPass ? actualUser : false
        }

    }catch(err){
        console.log(`Error from useCases->user->loginVerify ${err}`)
       throw err
    }
}