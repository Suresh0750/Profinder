

import {Request, Response,NextFunction} from 'express'
import { StatusCode } from '../../../domain/entities/commonTypes';


export const errorHandles = (err:any,req:Request,res:Response,next:NextFunction)=>{

    let errorMessage = err?.message || 'An unexpected error';
    // console.log(err)
    console.log('error Handles\n',errorMessage.message);
    res.status(StatusCode.NotFound).send({errorMessage,success:false})
}