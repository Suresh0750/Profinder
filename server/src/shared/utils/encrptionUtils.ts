

import {hash} from 'bcrypt'


// * hash the password

export const hashPassword = async (password: string)=>{
    return await hash(password,10)
}

//  *