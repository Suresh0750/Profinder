
import { Router } from "express";
import {authorizeRoles} from '../middlewares/authorizeRoles'
import {customeVerify} from '../middlewares/JWTVerify/customerVerify'
import upload from '../../../infrastructure/service/multer'
import {
    CustomerOtpController,
    ResentOTP,
    ForgetPassWordController ,
    GoogleLogin,
    CustomerLogoutController,
     WorkerGoogleLoginWithRegistrastion, 
    getCategoryName,
    getVerifiedWorkerController,
     getNearByWorkerDetailsController, 
    userRequestWorkerController, 
    paymetnAPIController,
    paymentIdController,
    ReviewController,
    getReviewController,
    paymentDetails
} from "../controllers/customerController";

const customerRouter = Router()




// * Review of worker
customerRouter.get("/review/:id",authorizeRoles('customer'),getReviewController)
customerRouter.post("/review",authorizeRoles('customer'),ReviewController)
// customerRouter.get("/getReview",getReviewUsecases)

// * payment gatway

customerRouter.post("/paymetAPI",authorizeRoles('customer'), paymetnAPIController)
customerRouter.post("/savePaymentId",paymentIdController)
customerRouter.get("/payment-details/:requestId",authorizeRoles('customer'), paymentDetails)

// * router for Request 
customerRouter.post('/userRequestWorker',userRequestWorkerController)


customerRouter.post('/verifyOTP',CustomerOtpController)
customerRouter.post('/resentOTP',ResentOTP)

customerRouter.post('/setForgotPassword',ForgetPassWordController)
customerRouter.post('/CustomerGoogleLogin',upload.single('identity'),authorizeRoles('customer'),GoogleLogin)

customerRouter.post("/cutomerLogout",authorizeRoles('customer'),CustomerLogoutController)
// customerRouter.post("/customerLogIn",customerLogIn) 
customerRouter.post("/customerGoogleVerification",WorkerGoogleLoginWithRegistrastion)   // * worker login with google

// customerRouter.post

customerRouter.get('/getALLVerifiedWorker/:lat/:lon',authorizeRoles('customer'),getVerifiedWorkerController)

customerRouter.get('/getCategoryName',authorizeRoles('customer'),getCategoryName)
customerRouter.post('/getNearByWorkerDetails:categoryName',authorizeRoles('customer'),getNearByWorkerDetailsController)

export default customerRouter   