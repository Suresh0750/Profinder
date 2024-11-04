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
} from "../controllers/UserController";


// * authendication middleware 
import {customeVerify} from '../middlewares/JWTVerify/customerVerify'
import {authorizeRoles} from '../middlewares/authorizeRoles'

const userRouter = Router()




// * authendication 
userRouter.post('/userSignup',validateUserSignUp,userSignupController)
userRouter.post('/loginverify',LoginUser)
userRouter.post('/checkEmailForgetPass',isEmailValidate,isCheckEmail)   // * check the email for forget Password page


// * user dashboard
userRouter.get('/profile:id',customeVerify,profile)
userRouter.put('/updateprofile',upload.single('newImageData'),customeVerify,editprofile)
userRouter.get('/booking/:id',customeVerify,authorizeRoles('user'),getBooking)
userRouter.get('/paymentId/:requestId',paymentId)


// * chats
userRouter.post('/conversation',customeVerify,authorizeRoles('user'),conversation)
userRouter.get('/conversation/:id',customeVerify,authorizeRoles('user'),getConversation)
userRouter.get('/message:id',customeVerify,authorizeRoles('user'),getMessage)




export default userRouter

