
import { Request,Response,NextFunction } from "express"
import {AdminVerifyUseCases} from '../../../app/useCases/admin/AdminVerify'
import Jwt from 'jsonwebtoken'
// * useCases
import {uploadImage} from '../../../app/useCases/utils/uploadImage'
import {getALLWorkerUseCases,getDetails, isBlockUsecases}  from '../../../app/useCases/admin/AdminwokerSide'
import {getAllUserUseCase,isBlockUserUseCases} from '../../../app/useCases/admin/AdminUserSide'
import {AdminWorkerApprovalUseCases,isWorkerApprovalUseCases} from "../../../app/useCases/admin/AdminWorkerApprovalSide"
import {
    AddCategoryUseCases,
    CheckExistCategory,
    getAllCategoryUseCases, 
    isListedProductUsecases,
    deleteProductUsecases,
    EditCategoryUseCases,
} from "../../../app/useCases/admin/Category"
import {
    reviewUsecases,
    workerUsecases,
    adminOverviewUsecases,
    dashboardUsecases
} from '../../../app/useCases/admin/adminDashboard'
import {
    downloadSalesUsecases,
    salesUsecases,
    getCategory,
} from '../../../app/useCases/admin/salesReport'

// * types
import {IMulterFile} from '../../../domain/entities/Admin'
import { StatusCode } from "../../../domain/entities/commonTypes"



// * admin in sales Report side
export const downloadSales = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const result = await downloadSalesUsecases(req.query)
        return res.status(StatusCode.Success).json({sucess:true,message:'data has been fetched',result})
    }catch(error){
        console.log(`Error from downloadSales\n${error}`)  
        next(error) 
    }
}

export const salesReport = async(req:Request,res:Response,next:NextFunction)=>{
    try {
      
        const result = await salesUsecases(req.query)
   
        return await res.status(StatusCode.Success).json({success:true,message:'data successfully fetched',result})
    } catch (error) {
        console.log(`Error from salesReport\n${error}`)  
        next(error)   
    }
}

export const categoryList = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getCategory()
        return await res.status(StatusCode.Success).json({success:true,message:'data successfully fetched',result})

    } catch (error) {
        console.log(`Error from getCategory\n${error}`)  
        next(error)  
    }
}


// * --- ADMIN DASHBORD---//
// * admin in review dashboard data

export const reviewDashboard = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await reviewUsecases()
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result})
    } catch (error) {
        console.log(`Error from reviewDashboard\n${error}`)  
        next(error)  
    }
}

// * admin worker dashboard side

export const workerDashboard = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await workerUsecases()
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched',result})
    } catch (error) {
        console.log(`Error from workerDashboard\n${error}`)  
        next(error)  
    }
}

// * admin Dashboard side
export const dashboardOverview = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await adminOverviewUsecases()
        return res.status(StatusCode.Success).json({success:true,message:'data successfully fetched',result})
    } catch (error) {
        console.log(`Error from dashboardOverview\n${error}`)  
        next(error)
    }
}
export const dashboard = async(req:Request,res:Response,next:NextFunction)=>{
    try{

        const result = await dashboardUsecases()
        return res.status(StatusCode.Success).json({success:true,message:'data has been fetched successfully',result})
    }catch(error){
        console.log(`Error from dashboard\n${error}`)  
        next(error)
    }
}


// * admin User side
export const isBlockUserController = async(req:Request,res:Response,next:NextFunction)=>{
    try {

        await isBlockUserUseCases(req.body._id,req.body.isBlock)
        return res.status(StatusCode.Success).json({success:true,message:"Data has been update"})
    } catch (error) {
        console.log(`Error from isBlcokUser\n${error}`)  
        next(error)
    }
}

export const getAllUserList = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getAllUserUseCase()
        return res.status(StatusCode.Success).json({success:true,message:'Data fetched successfully',result})
    } catch (error) {
        console.log(`Error from getAllUserList\n${error}`)  
        next(error)
    }
}

// * admin in worker Approval side

export const getAllUnApprovalWorkerlist = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        const result = await AdminWorkerApprovalUseCases()
        return res.status(StatusCode.Success).json({success:true,message:'Data successfully fetched',result})
    } catch (error) {
        console.log(`Error from getALLWorkerListController\n${error}`)  
        next(error)
    }
}

export const workerDetails = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const result = await getDetails(req.params.workerId)
        return res.status(StatusCode.Success).json({success:true,message:'Data successfully fetched',result})
    }catch(error){
        console.log(`Error from workerDetails`,error)
        next(error)
    }
}

export const isWorkerApproval = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        
        const result = await isWorkerApprovalUseCases(req.params?.id)
        
        return res.status(StatusCode.Success).json({success:true,message:'worker successfully verified'})
    } catch (error) {
        console.log(`Error from isWorkerApproval\n${error}`)  
        next(error)
    }
}

// * admin worker side

export const getALLWorkerListController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await getALLWorkerUseCases()
        return res.status(StatusCode.Success).json({success:true,message:"successfully fetched the worker list",result})
    } catch (error) {
        console.log(`Error from getALLWorkerListController\n${error}`)  
        next(error)
    }
}

export const isBlock = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await isBlockUsecases(req.params.id)
        return res.status(StatusCode.Success).json({success:true,message:'successfully updated'})
    } catch (error) {
        console.log(`Error from Admin->worker->isBlock\n${error}`)  
        next(error)
    }
}

// * Admin category side

export const addCategoryController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log(`req reached addCategory controller`) 

        const ExistCategory = await CheckExistCategory(req?.body?.CategoryName)

        if(ExistCategory){ return res.status(StatusCode.Conflict).json({success:false,message:'Producet already exist'})}

        const file: IMulterFile |any = req.file
        const imageUrl = await uploadImage(file)    // * call uploadImage usecases
        req.body.categoryImage = imageUrl
        await AddCategoryUseCases(req.body)  // * call usecases
        return res.status(StatusCode.Success).json({success:true,message:'Product has been added'})
          
    } catch (error) {
        console.log(`Error from addCategoryController\n${error}`)
        next(error)
    }
}

export const getAllCategory =async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const totalCategory = await getAllCategoryUseCases()
        res.status(StatusCode.Success).json({success:true,message:'Successfully data fetched',totalCategory})
    } catch (error) {
        console.log(`Error from getAllCategory\n${error}`)
        next(error)
    }
}

export const editCategory = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        
        if(req.body.newImage){
            const file: IMulterFile |any = req.file
            const imageUrl = await uploadImage(file)  
            req.body.categoryImage = imageUrl
        }
    
        await EditCategoryUseCases(req.body)
        return res.status(StatusCode.Success).json({success: true,message:'Product has been successfully edit'})
    }catch(error){
        console.log(`Error from EditCategory\n${error}`)
        next(error)
    }

}

export const verifyListController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        await isListedProductUsecases(req.body._id,req.body.isListed)
        return res.status(StatusCode.Success).json({success:true,message:'List has been updated'})
        
    } catch (error) {
        console.log(`Error from verifyListController\n${error}`)
        next(error)
    }
}

export const deleteProductController = async (req:Request,res:Response,next:NextFunction)=>{
    try {

        await deleteProductUsecases(req?.params?.id)
        return res.status(StatusCode.Success).json({success:true,message:'Product has been deleted'})
    } catch (error) {
        console.log(`Error from deleteProductController\n${error}`)
        next(error)
    }
}


// * Admin authendication

export const AdminVerify = async (req:Request,res:Response,next:NextFunction)=>{
    try{
       
        if(AdminVerifyUseCases(req.body)){
            const refreshToken =  Jwt.sign({adminEmail: req.body.adminEmail},String(process.env.REFRESH_TOKEN_SECRET),{expiresIn:'7d'})
            const accessToken = Jwt.sign({adminEmail:req.body.adminEmail},String(process.env.ACCESS_TOKEN_SECRET), { expiresIn:'15m' }); 
            res.cookie('adminToken',refreshToken,{
                httpOnly:true,
                secure :true,
                sameSite:'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })    
            res.cookie('accessToken',accessToken,{
                maxAge: 2 * 60 * 1000
            })    
            res.status(StatusCode.Success).json({success:true,message:'login verify successful'})
        }    
      
        res.status(StatusCode.Unauthorized).json({success:false,message:'Invalid credentials'})

    }catch(error){
        console.log(`Error from addCategoryController\n${error}`)
        next(error)
    }    
}    

export const adminLogoutController = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     
        res.clearCookie('accessToken'); // * Clear the accessToken
         
        res.clearCookie('adminToken', {  // * Clear the refresh token cookie
            httpOnly: true,
            secure: true, 
            sameSite: 'strict'
        });
        req.session.destroy((err)=>{
            if(err){
                console.log('Error destroying session:', err);
                return res.status(StatusCode.InternalServerError).json({sucess:true,message: 'Logout failed' });
            }
             // * Successfully logged out
             return res.status(StatusCode.Success).json({success:true, message: 'Logged out successfully' });
        })
       
    } catch (error) {
        console.log(`Error from adminLogout\n${error}`)
        next(error)
    }
}