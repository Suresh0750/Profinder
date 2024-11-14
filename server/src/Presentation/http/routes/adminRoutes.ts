
import {Request,Response,Router} from 'express'
import {verifyTokenAndRole} from '../middlewares/verifyTokenAndRole'
import upload from '../../../infrastructure/service/multer'
import {
    isBlock, // * worker block admin side
    workerDetails,
    downloadSales,
    salesReport,
    reviewDashboard,
    addCategoryController,
    AdminVerify,
    getAllCategory,
    editCategory,
    verifyListController,
    deleteProductController, 
    adminLogoutController,
    getALLWorkerListController, 
    getAllUserList, 
    isBlockUserController, 
    getAllUnApprovalWorkerlist, 
    isWorkerApproval,
    dashboardOverview,
    dashboard,
    workerDashboard,
    categoryList
} from "../controllers/AdminController"

const adminRoutes = Router()



// * ADMIN SALES - REPORT 
adminRoutes.get('/sales-report',verifyTokenAndRole('admin'),salesReport)
adminRoutes.get('/categoryList',verifyTokenAndRole('admin'),categoryList)
adminRoutes.get('/download-sales',verifyTokenAndRole('admin'),downloadSales)


// * Admin / dashboard side
adminRoutes.get('/dashboardOverview',verifyTokenAndRole('admin'),dashboardOverview)
adminRoutes.get('/dashboard',verifyTokenAndRole('admin'),dashboard)
adminRoutes.get('/dashboardWorker',verifyTokenAndRole('admin'),workerDashboard)
adminRoutes.get('/dashboard-review',verifyTokenAndRole('admin'),reviewDashboard)


// * admin / User side
adminRoutes.get('/getAllUserList',verifyTokenAndRole('admin'),getAllUserList)
adminRoutes.post('/isBlockUser',verifyTokenAndRole('admin'),isBlockUserController)

// * admin / Worker Approval side
adminRoutes.get('/getAllUnApprovalWorkerlist',verifyTokenAndRole('admin'),getAllUnApprovalWorkerlist)
adminRoutes.put('/isWorkerApproval/:id',verifyTokenAndRole('admin'),isWorkerApproval)

// admin / worker details
adminRoutes.get('/worker-details/:workerId',verifyTokenAndRole('admin'),workerDetails)


// * admin/ worker side
adminRoutes.get("/getWorkerList",verifyTokenAndRole('admin'),getALLWorkerListController)
adminRoutes.patch("/worker/isBlock/:id",verifyTokenAndRole('admin'),isBlock)


// * admin catagory router
adminRoutes.post("/addCategory",verifyTokenAndRole('admin'),upload.single('CategoryImage'),addCategoryController)
adminRoutes.get('/fetchCategoryData',verifyTokenAndRole('admin'),getAllCategory)
adminRoutes.post('/editCategory',verifyTokenAndRole('admin'),upload.single('newImageData'),editCategory)
adminRoutes.post('/isListVerify',verifyTokenAndRole('admin'),verifyListController)
adminRoutes.delete('/deleteProduct/:id',verifyTokenAndRole('admin'),deleteProductController)


// * admin authendication 
adminRoutes.post('/adminLogout',verifyTokenAndRole('admin'),adminLogoutController)
adminRoutes.post("/adminVerify",AdminVerify)

export default adminRoutes


