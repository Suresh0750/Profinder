

import {Request, Response,NextFunction} from 'express'
import { StatusCode } from '../../../domain/entities/commonTypes';


export const errorHandles = (err:any,req:Request,res:Response,next:NextFunction)=>{
    // console.log(err.message)
    // console.log(req.originalUrl)
    // console.log(err)
    let errorMessage = err?.message || 'An unexpected error';
    console.log(errorMessage)
    console.log('error Handles\n',errorMessage.message);
    res.status(StatusCode.NotFound).send({errorMessage,success:false})
}