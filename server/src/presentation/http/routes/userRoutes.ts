import { Router } from "express";
import {validateUserSignUp,isEmailValidate} from '../middlewares/validationMiddleware'
import upload from '../../../infrastructure/service/multer'

import {
    userSignupController,
    LoginUser,
    isCheckEmail,
    profile,
    editprofile,
    conversation,
    getConversation,
    getMessage,
    getBooking,
    paymentId,
} from "../controllers/user";


// * authendication middleware 

import {verifyTokenAndRole} from '../middlewares/verifyTokenAndRole'

const userRouter = Router()




// * authendication 
userRouter.post('/userSignup',validateUserSignUp,userSignupController)
userRouter.post('/loginverify',LoginUser)
userRouter.post('/checkEmailForgetPass',isEmailValidate,isCheckEmail)   // * check the email for forget Password page


// * user dashboard
userRouter.get('/profile/:id',verifyTokenAndRole('user'),profile)
userRouter.put('/updateprofile',upload.single('newImageData'),verifyTokenAndRole('user'),editprofile)
userRouter.get('/booking/:id',verifyTokenAndRole('user'),getBooking)
userRouter.get('/paymentId/:requestId',paymentId)


// * chats
userRouter.post('/conversation',verifyTokenAndRole('user'),conversation)
userRouter.get('/conversation/:id',verifyTokenAndRole('user'),getConversation)
userRouter.get('/message/:id',verifyTokenAndRole('user'),getMessage)



export default userRouter

