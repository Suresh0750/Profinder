
import {AdminCredentials} from '../../../domain/entities/admin'



export const AdminVerifyUseCases = (adminData:AdminCredentials)=>{
    try{

        return (adminData.adminEmail == process.env.ADMIN_EMAIL && adminData.adminPass==process.env.ADMIN_PASS)

    }catch(error){
        console.log(`Error from verifyAdmin\n${error}`)
        throw error
    }
}