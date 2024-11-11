import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { StatusCode,AdminDetails } from '../../../../domain/entities/commonTypes'
// JWT



declare module 'express-session' {
    interface SessionData {
      AdminData: AdminDetails;
    }
  }

export const verify = (req:Request,res:Response,next:NextFunction)=>{
    try{

        const adminAccessToken = req.cookies.accessToken
        // const adminAccessToken = null // * checking purpose
 
        if(!adminAccessToken){
           if(renewToken(req,res,next)){
            next()
           }
        }else{
           const AdminData =  jwt.verify(adminAccessToken,String(process.env.ACCESS_TOKEN_SECRET))
        
           if(AdminData){
            req.session.AdminData = AdminData as AdminDetails
            next()
           }else{
            return res.status(StatusCode.Unauthorized).json({success:false,message:'Invalid refresh token'})
           }
        }
        return 
        
    }catch (err){
        console.log(err)
        next(err)
    }
}


export const renewToken = (req:Request,res:Response,next:NextFunction)=>{
    try{
        // console.log(`req Enter renewtoken`)
        const refreshToken = req.cookies.adminToken
        // const refreshToken = null // * checking purpose
        let exist = false
        if(!refreshToken){
            // ExpireCookie(req,res,next)   // * delete all cookie
            return res.status(StatusCode.Unauthorized).json({valid:false,message:'no refresh Token'})
        }else{
             const AdminRefreshToken = jwt.verify(refreshToken,String(process.env.REFRESH_TOKEN_SECRET)) 
            //  console.log(AdminRefreshToken)
             if(AdminRefreshToken){
                const accessToken = jwt.sign({adminEmail:process.env.ADMIN_EMAIL},String(process.env.ACCESS_TOKEN_SECRET), { expiresIn:'15m' }); 
                res.cookie('accessToken',accessToken,{
                    maxAge: 2 * 60 * 1000
                })
                exist = true
             }else{
                // ExpireCookie(req,res,next)
                return res.status(StatusCode.Unauthorized).json({valid:false,message:'Invalid refresh token'})
             }
          
        }
        return exist
    }catch(error){
        console.log(error)
        next(error)
    }
}
