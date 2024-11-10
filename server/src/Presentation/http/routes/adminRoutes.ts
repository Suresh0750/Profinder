
import {Request,Response,Router} from 'express'
import {verify} from '../middlewares/JWTVerify/adminVerify'
import {authorizeRoles} from '../middlewares/authorizeRoles'
import upload from '../../../infrastructure/service/multer'
import {
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
adminRoutes.get('/sales-report',verify,authorizeRoles('admin'),salesReport)
adminRoutes.get('/categoryList',verify,authorizeRoles('admin'),categoryList)
adminRoutes.get('/download-sales',verify,authorizeRoles('admin'),downloadSales)


// * Admin / dashboard side
adminRoutes.get('/dashboardOverview',verify,authorizeRoles('admin'),dashboardOverview)
adminRoutes.get('/dashboard',verify,authorizeRoles('admin'),dashboard)
adminRoutes.get('/dashboardWorker',verify,authorizeRoles('admin'),workerDashboard)
adminRoutes.get('/dashboard-review',verify,authorizeRoles('admin'),reviewDashboard)


// * admin / User side
adminRoutes.get('/getAllUserList',verify,authorizeRoles('admin'),getAllUserList)
adminRoutes.post('/isBlockUser',verify,authorizeRoles('admin'),isBlockUserController)

// * admin / Worker Approval side
adminRoutes.get('/getAllUnApprovalWorkerlist',verify,authorizeRoles('admin'),getAllUnApprovalWorkerlist)
adminRoutes.put('/isWorkerApproval:id',verify,authorizeRoles('admin'),isWorkerApproval)

// admin / worker details
adminRoutes.get('/worker-details/:workerId',verify,authorizeRoles('admin'),workerDetails)


// * admin/ worker side
adminRoutes.get("/getWorkerList",verify,authorizeRoles('admin'),getALLWorkerListController)


// * admin catagory router
adminRoutes.post("/addCategory",verify,authorizeRoles('admin'),upload.single('CategoryImage'),addCategoryController)
adminRoutes.get('/fetchCategoryData',verify,authorizeRoles('admin'),getAllCategory)
adminRoutes.post('/editCategory',verify,authorizeRoles('admin'),upload.single('newImageData'),editCategory)
adminRoutes.post('/isListVerify',verify,authorizeRoles('admin'),verifyListController)
adminRoutes.delete('/deleteProduct/:id',verify,authorizeRoles('admin'),deleteProductController)


// * admin authendication 
adminRoutes.post('/adminLogout',verify,authorizeRoles('admin'),adminLogoutController)
adminRoutes.post("/adminVerify",AdminVerify)

export default adminRoutes


