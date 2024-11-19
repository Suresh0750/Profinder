
import {User} from "../../../domain/entities/user"
import {getUserRepository} from "../../../infrastructure/database/mongoose/user"
import {checkPassword} from  "../../../infrastructure/service/bcrypt"

export const LoginVerify = async (emailAddress:string,password:string)=>{
    try{       
        const {loginVerifyQuery} = getUserRepository()
        const actualUser = await  loginVerifyQuery(emailAddress)
        if(!actualUser) throw new Error("Invalid EmailAddress")
        else{
            const isCheckPass =  await checkPassword(password,actualUser?.password)
            return isCheckPass ? actualUser : false
        }

    }catch(err){
        console.log(`Error from useCases->user->loginVerify ${err}`)
       throw err
    }
}