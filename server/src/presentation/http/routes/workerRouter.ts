import {Router} from "express"
import upload from '../../../infrastructure/service/multer'


import {verifyTokenAndRole} from '../middlewares/verifyTokenAndRole'
import {
    addtionalProfessionalData,
    PersonalInformationControll,
    ProfessionalInfoControll,
    isCheckEmail,
    getWorkerDataController,
    LoginWorkerController,
    addProjectDetails,
    getProjectDetails,
    getSingleWorkerDetails,
    getAllRequestController,
    isAcceptWorkController,
    isRejectWorkController,
    messageController,
    fetchMessage,
    dashboard,
    upcomingWorkers,
    workComplete,
    connectedUsers
    } from "../controllers/worker"
import { isEmailValidate } from "../middlewares/validationMiddleware"


const workerRouter = Router()

// * worker dashboard
workerRouter.get('/dashboard/:Id',verifyTokenAndRole(['worker']),dashboard)
workerRouter.get('/upcoming-workers/:id',verifyTokenAndRole(['worker']),upcomingWorkers)
workerRouter.put('/markStatus/:status/:id',verifyTokenAndRole(['worker']),workComplete)


// * chats in worker side

workerRouter.get('/connected-users/:Id',verifyTokenAndRole(['worker']),connectedUsers)
workerRouter.put('/message',verifyTokenAndRole(['worker']),messageController)
workerRouter.get('/fetchmessage/:Id',verifyTokenAndRole(['worker']),fetchMessage)


// * request details or woker

workerRouter.get("/getRequestData/:workerId",verifyTokenAndRole(['worker']),getAllRequestController)
workerRouter.put("/isAcceptWork/:update",verifyTokenAndRole(['worker']),isAcceptWorkController)
workerRouter.put("/rejectWork/:id",verifyTokenAndRole(['worker']),isRejectWorkController)

// * get single worker Details
workerRouter.get('/singleWorkerDetails/:workerid/:userId',getSingleWorkerDetails) 

// * Worker in worker Project upload 
workerRouter.post("/uploadWorkerProject",upload.single('image'),addProjectDetails)
workerRouter.get('/getWorkerProject/:id',verifyTokenAndRole(['worker']),getProjectDetails)

workerRouter.post("/personalinfo",upload.single('profileImage'),PersonalInformationControll)
workerRouter.post("/ProfessionalInfo",upload.single('identity'),ProfessionalInfoControll)
workerRouter.post("/checkEmailForgetPass",isCheckEmail)
workerRouter.get("/getWorkerData",verifyTokenAndRole(['worker']),getWorkerDataController)
workerRouter.post('/loginverify',isEmailValidate,LoginWorkerController)
workerRouter.put('/addtionalProfessionalDetails',verifyTokenAndRole(['worker']),addtionalProfessionalData)


export default workerRouter