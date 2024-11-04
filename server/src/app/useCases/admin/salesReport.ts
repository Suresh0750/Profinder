
// usernameFilter=null&workerNameFilter=null&categoryFilter=null&dateFilter=null
import {AdminMongoose} from '../../../infrastructure/database/mongoose/MongooseAdminRepository'

// * ADMIN SALES REPORT * //

export const salesUsecases = async(data:any)=>{
    try {
        // console.log('sales side')
        // console.log(data)
        let query:{[key:string]:any} ={}
        if(data?.categoryFilter && data?.categoryFilter!=="All"){
            query.service = data?.categoryFilter
        }
        if(data?.startDateFilter && data?.endDateFilter){
            let startDate = {$gte:data?.startDateFilter,$lte:data?.endDateFilter}
           
            query.preferredDate = startDate
        }else if(data?.endDateFilter){
            let endDate = {$lte:data?.endDateFilter}
            query.preferredDate = endDate
        }else if(data?.startDateFilter){
            let startDate = {$gte:data?.startDateFilter}
            query.preferredDate = startDate
        }
       console.log(query)
       let skip = (Number(data?.currentPage)-1)*Number(data?.itemsPerPage)
       let limit = Number(data?.itemsPerPage)
        console.log(query)
        const [
            salesDatas,
            count 
        ] = await Promise.all([
            AdminMongoose().getSalesDatas(query,skip,limit),
            AdminMongoose().getSalesDatasCount(query)
        ])
        return {
            salesDatas,
            count
        } 
        
    } catch (error) {
        console.log(`Error from useCases->admin->salesUsecases\n`,error)
        throw error
    }
}
export const downloadSalesUsecases = async(data:any)=>{
    try {
        console.log('sales side')
        console.log(data)
        let query:{[key:string]:any} ={}
        if(data?.categoryFilter && data?.categoryFilter!=="All"){
            query.service = data?.categoryFilter
        }
        if(data?.startDateFilter && data?.endDateFilter){
            let startDate = {$gte:data?.startDateFilter,$lte:data?.endDateFilter}
           
            query.preferredDate = startDate
        }else if(data?.endDateFilter){
            let endDate = {$lte:data?.endDateFilter}
            query.preferredDate = endDate
        }else if(data?.startDateFilter){
            let startDate = {$gte:data?.startDateFilter}
            query.preferredDate = startDate
        }
       console.log(query)
       query.isAccept = "Completed"
        return await AdminMongoose().downloadSalesData(query)
     
    } catch (error) {
        console.log(`Error from useCases->admin->salesUsecases\n`,error)
        throw error
    }
}



export const getCategory = async()=> await AdminMongoose().getAllCategory()