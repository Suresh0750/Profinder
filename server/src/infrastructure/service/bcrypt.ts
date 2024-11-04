import {compare} from "bcrypt"


export const checkPassword = async (Password:string,hashStorePass:string)=>{
    try {
        return await compare(Password,hashStorePass)
    } catch (error) {
        // console.log(`Error come from ->infrastruce ->service->bcypt\n`,error)
        throw error
    }
}