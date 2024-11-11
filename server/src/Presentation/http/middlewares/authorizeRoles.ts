
import {Request,Response, NextFunction } from "express";
import { StatusCode } from "../../../domain/entities/commonTypes";


export const authorizeRoles = (role:string) => {
    //* console.log(`Req authorizeRoles`)
    
    // * If request header doesn't have role it will return this
    return (req:Request, res:Response, next:NextFunction) => {
        const verifyRole = req.headers['role']; 
   
        if(!verifyRole)  return res.status(StatusCode.Forbidden).json({success:false,message:'Role is Required'});
        // console.log(verifyRole)
        // * if it is not verify it won't allow so it will return access denied
        if (role!=verifyRole) {
            return res.status(StatusCode.Forbidden).json({success:false,message:'Access denied'});
        }
        next();
    };
};

