
import {AdminCredentials} from '../../../domain/entities/admin'



export const AdminVerifyUseCases = (adminData:AdminCredentials)=>{
    try{

        return (adminData.emailAddress == process.env.ADMIN_EMAIL && adminData.password==process.env.ADMIN_PASS)

    }catch(error){
        console.log(`Error from verifyAdmin\n${error}`)
        throw error
    }
}