import { Request,Response,NextFunction } from "express";
import { body,validationResult } from "express-validator";



// * singup server side validation
export const validateUserSignUp = [
    body('EmailAddress').isEmail().withMessage('Invalid email format'),
    body('Password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    (req:Request,res:Response,next:NextFunction)=>{
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }
            next()
            
        } catch (error) {
            console.log(`Error from validation middleware`,error)
            next(error)
        }
        
    }
]


// * forget password email validate

export const isEmailValidate = [
    body('email').isEmail().withMessage('Invalid email format'), 
    (req:Request,res:Response,next:NextFunction)=>{
        try {
            const errors = validationResult(req)
            // console.log(`middleware`,errors)
            if(!errors.isEmpty()){
                return res.status(400).json({errors:errors.array()})
            }
            next()
            
        } catch (error) {
            console.log(`Error from validation middleware`,error)
            next(error)
        }
        
    }
]