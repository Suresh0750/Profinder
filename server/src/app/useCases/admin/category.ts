
// * types
import {AddCategory} from '../../../domain/entities/admin'

// * Mongoose Query
import {AdminMongoose} from "../../../infrastructure/database/mongoose/admin"
import {getWorkerRepository} from '../../../infrastructure/database/mongoose/worker'


export const EditCategoryUseCases = async(categoryData:AddCategory)=>{
    try {

        delete categoryData.newImage 
        const {_id} = categoryData
        const getCategoryName = await AdminMongoose().getEditCategoryName((_id || ''))
        const changeCategory = await AdminMongoose().EditeCategoryQuery(categoryData)
        if(getCategoryName&& categoryData && getCategoryName?.categoryName!==categoryData?.categoryName ){
            await getWorkerRepository().chagneExitWorkerCategoryName(getCategoryName?.categoryName,categoryData?.categoryName)  // * change all worker category name if admin change their modal            
        }
    
        return 
        
    } catch (error) {
        console.log(`Error from useCases->admin->EditCategoryUseCases\n`,error)
        throw error
    }
}

export const AddCategoryUseCases = async(categoryDetails:AddCategory)=>{
    try {
        // * call mongoose query
        console.log(`req reached AddCategory Usecases`)
        
        const categoryData = {
            categoryName : categoryDetails.categoryName,
            categoryDescription : categoryDetails.categoryDescription,
            categoryImage : categoryDetails.categoryImage,
        }
        const {AddCategoryQuery}  = AdminMongoose()  
 
        return await AddCategoryQuery(categoryData)
        
    } catch (error) {
        console.log(`Error from useCases->admin->AddCategory\n`,error)
        throw error
    }
}


export const CheckExistCategory =  async(categoryName:string)=>{
    try{
        const {CheckExistCategory}  = AdminMongoose()
        return await CheckExistCategory(categoryName)  // * call to verify the product is there are not

    }catch(error){
        console.log(`Error from useCases->admin->CheckExistCategory\n`,error)
        throw error
    }
    
}

export const getAllCategoryUseCases = async()=>{
    try {

        return await AdminMongoose().getAllCategoryQuery()   // * Query call for
    } catch (error) {
        console.log(`Error from useCases->admin->getAllCategoryUseCases\n`,error)
        throw error
    }
}

export const isListedProductUsecases = async (_id:string,isListed:boolean)=>{
    try {
        return await AdminMongoose().IsListedQuery(_id,(isListed ? false : true))
        
    } catch (error) {
        console.log(`Error from useCases->admin->isListedProductUsecases\n`,error)
        throw error
    }
}

export const deleteProductUsecases = async(_id:string)=>{
    try{
        return await AdminMongoose().deleteProductQuery(_id)
    }catch(error){
        console.log(`Error from useCases->admin->deleteProductUsecases\n`,error)
        throw error
    }
}