
import {format} from 'date-fns'
import {workerDataTypes,revenueRowdata,revenueData,jobStatusTypes} from '@/types/adminTypes'
export function revenueCalculation(revenueData:revenueRowdata[]){
  
    if(revenueData?.length==0) return []

    let revenue : revenueData[] = []
    let obj  :{[key:string]:number} = {}
    revenueData?.map((data)=>{
        const date = new Date(data?.createdAt);
        const month = format(date, 'MMM');
        obj[month] = (obj[month]||0)+data?.payment
    })

    for(let key in obj){
        revenue?.push({month:key,revenue:obj[key]})
    }
    return revenue
}
export function jobStatusService(jobData: jobStatusTypes[]): jobStatusTypes[] {
    if (jobData.length === 0) return [];

    let obj: { [key: string]: number } = {
        Completed: 0,
        Pending: 0,
        Cancelled: 0,
    };

    const status: jobStatusTypes[] = [];

    jobData.map((data) => {
        if (data?._id) {
            obj[data._id] = data.value;
        }
    });

    for (let key in obj) {
        status.push({ name: key, value: obj[key] }); 
    }
    return status;
}



export function getWorkerDistribution(worker:workerDataTypes[],category:string[]){

    let obj:{[key:string]:number} = {}
    category?.forEach((val:string)=>{
        obj[val] = 0
    })


    let workerData :workerDataTypes[] = []
    
    worker?.forEach((data:workerDataTypes)=>{
        if(data?._id){
            obj[data?._id] = data?.count
        }
    })

    for(let key in obj){
        workerData?.push({trade:key,count:obj[key]})
    }   

    return workerData
}