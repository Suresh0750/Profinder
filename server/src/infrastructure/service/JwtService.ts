


import Jwt,{JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export function JwtService(customer:string,customerName:string,customerEmail:string,role:string){
    try{
       
        let refreshToken,accessToken ;
        if(role=='user'){

            refreshToken = Jwt.sign({customerId:customer,customerName,customerEmail,role},String(process.env.REFRESH_TOKEN_SECRET),{expiresIn:'7d'})
            // * Access token
            accessToken = Jwt.sign({customerId:customer,customerName,customerEmail,role},String(process.env.ACCESS_TOKEN_SECRET), { expiresIn:'15m' }); 
            //  console.log(refreshToken,accessToken)
        }else{

            refreshToken = Jwt.sign({customerId:customer,customerName,customerEmail,role},String(process.env.REFRESH_TOKEN_SECRET),{expiresIn:'7d'})
            // * Access token
            accessToken = Jwt.sign({customerId:customer,customerName,customerEmail,role},String(process.env.ACCESS_TOKEN_SECRET), { expiresIn:'15m' }); 
            //  console.log(refreshToken,accessToken)
        }
         return {refreshToken,accessToken}

    }catch(err){
        // console.log(`Error from JWTService token generate \n${err}`)
        throw err
    }
}

export function verifyRefreshToken (token:string){
    try {
        // console.log(token,'verifyRefreshToken')
        return Jwt.verify(token,String(process.env.REFRESH_TOKEN_SECRET))
    } catch (error) {
        console.log(`Error from JWTService token verifyRefreshToken \n${error}`)
        throw error
    }
}