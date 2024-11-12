import {Router} from "express"
import upload from '../../../infrastructure/service/multer'
import {authorizeRoles} from '../middlewares/authorizeRoles'
import { customeVerify } from "../middlewares/JWTVerify/customerVerify"
import {
    addtionalProfessionalData,
    PersonalInformationControll,
    ProfessionalInfoControll,
    isCheckEmail,
    getWorkerDataController,
    LoginWorkerController,
    AddProjectDetails,
    getProjectDetails,
    getSingleWorkerDetails,
    getAllRequestController,
    isAcceptWorkController,
    isRejectWorkController,
    getChatsName,
    messageController,
    fetchMessage,
    dashboard,
    upcomingWorkers,
    workComplete
    } from "../controllers/WorkerController"


const workerRouter = Router()

// * worker dashboard
workerRouter.get('/dashboard/:Id',customeVerify,authorizeRoles('worker'),dashboard)
workerRouter.get('/upcoming-workers/:id',customeVerify,authorizeRoles('worker'),upcomingWorkers)
workerRouter.put('/markStatus/:status/:id',customeVerify,authorizeRoles('worker'),workComplete)


// * chats in worker side

workerRouter.get('/message/:Id',authorizeRoles('worker'),getChatsName)
workerRouter.post('/message',authorizeRoles('worker'),messageController)
workerRouter.get('/fetchmessage/:Id',authorizeRoles('worker'),fetchMessage)


// * request details or woker

workerRouter.get("/getRequestData/:workerId",authorizeRoles('worker'),getAllRequestController)
workerRouter.put("/isAcceptWork/:update",customeVerify,authorizeRoles('worker'),isAcceptWorkController)
workerRouter.put("/rejectWork/:id",authorizeRoles('worker'),isRejectWorkController)

// * get single worker Details
workerRouter.get('/singleWorkerDetails/:workerid/:userId',getSingleWorkerDetails) 

// * Worker in worker Project upload 
workerRouter.post("/uploadWorkerProject",upload.single('image'),AddProjectDetails)
workerRouter.get('/getWorkerProject/:id',authorizeRoles('worker'),getProjectDetails)

workerRouter.post("/personalinfo",upload.single('profileImage'),PersonalInformationControll)
workerRouter.post("/ProfessionalInfo",upload.single('Identity'),ProfessionalInfoControll)
workerRouter.post("/checkEmailForgetPass",isCheckEmail)
workerRouter.get("/getWorkerData",authorizeRoles('worker'),getWorkerDataController)
workerRouter.post('/loginverify',LoginWorkerController)
workerRouter.put('/addtionalProfessionalDetails',authorizeRoles('worker'),addtionalProfessionalData)


export default workerRouter