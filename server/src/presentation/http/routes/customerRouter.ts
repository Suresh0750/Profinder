
import { Router } from "express";
import {verifyTokenAndRole} from '../middlewares/verifyTokenAndRole'
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
customerRouter.get("/review/:id",getReviewController)
customerRouter.post("/review",verifyTokenAndRole(['user','worker']),ReviewController)
// customerRouter.get("/getReview",getReviewUsecases)

// * payment gatway

customerRouter.post("/paymetAPI",paymetnAPIController)
customerRouter.post("/savePaymentId",paymentIdController)
customerRouter.get("/payment-details/:requestId", paymentDetails)

// * router for Request 
customerRouter.post('/userRequestWorker',verifyTokenAndRole(['user','worker']),userRequestWorkerController)


customerRouter.post('/verifyOTP',CustomerOtpController)
customerRouter.post('/resentOTP',ResentOTP)

customerRouter.post('/setForgotPassword',ForgetPassWordController)
customerRouter.post('/CustomerGoogleLogin',upload.single('Identity'),GoogleLogin)

customerRouter.post("/cutomerLogout",verifyTokenAndRole(['user','worker']),CustomerLogoutController)

customerRouter.post("/customerGoogleVerification",WorkerGoogleLoginWithRegistrastion)   // * worker login with google

// customerRouter.post

customerRouter.get('/getALLVerifiedWorker/:lat/:lon',getVerifiedWorkerController)

customerRouter.get('/getCategoryName',getCategoryName)
customerRouter.post('/getNearByWorkerDetails/:categoryName',verifyTokenAndRole(['user','worker']),getNearByWorkerDetailsController)

export default customerRouter   