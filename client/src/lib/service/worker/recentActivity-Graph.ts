
// import {format} from 'date-fns'

const {format} = require('date-fns')
 type activityType = {[key:string]:string}


export function graphData(activity:activityType[]){

    console.log('filter')
    // console.log(activity)
    let activityGraph :any[] = []
    
    let obj  :{[key:string]:string} = {}

    activity?.map((val)=>{
        // console.log(val)
        if(val?.paymentId){
            const date = new Date(val?.createdAt);
            const monthName = format(date, 'MMM');
            
            obj[monthName] = (obj[monthName]||0)+val?.payment
             
        }
    })
    for(let key in obj){
        activityGraph?.push({name:key,earnings:obj[key]})
    }

    console.log(JSON.stringify(obj))
    console.log(JSON.stringify(activityGraph))
    return activityGraph
}




// let activity = [
//     {
//         "_id": "6713bb3c31d7f6b0b48f0896",
//         "requestId": {
//             "_id": "6713b8bc31d7f6b0b48f086b",
//             "user": "Sureshbro",
//             "workerId": "670e36e7cba50549d9472b78"
//         },
//         "workerId": {
//             "_id": "670e36e7cba50549d9472b78",
//             "Category": "mechanical"
//         },
//         "userId": "66ea91c78f03af0b8231af43",
//         "isCompleted": true,
//         "status": "Completed",
//         "payment": 1000,
//         "createdAt": "2024-10-19T13:59:24.020Z",
//         "updatedAt": "2024-10-19T14:05:51.356Z",
//         "__v": 0,
//         "paymentId": "403993715532513087"
//     },
//     {
//         "_id": "6713bb3c31d7f6b0b48f0896",
//         "requestId": {
//             "_id": "6713b8bc31d7f6b0b48f086b",
//             "user": "Sureshbro",
//             "workerId": "670e36e7cba50549d9472b78"
//         },
//         "workerId": {
//             "_id": "670e36e7cba50549d9472b78",
//             "Category": "mechanical"
//         },
//         "userId": "66ea91c78f03af0b8231af43",
//         "isCompleted": true,
//         "status": "Completed",
//         "payment": 1000,
//         "createdAt": "2024-10-19T13:59:24.020Z",
//         "updatedAt": "2024-10-19T14:05:51.356Z",
//         "__v": 0,
//         "paymentId": "403993715532513087"
//     },
//     {
//         "_id": "6713bb3c31d7f6b0b48f0896",
//         "requestId": {
//             "_id": "6713b8bc31d7f6b0b48f086b",
//             "user": "Sureshbro",
//             "workerId": "670e36e7cba50549d9472b78"
//         },
//         "workerId": {
//             "_id": "670e36e7cba50549d9472b78",
//             "Category": "mechanical"
//         },
//         "userId": "66ea91c78f03af0b8231af43",
//         "isCompleted": true,
//         "status": "Completed",
//         "payment": 1000,
//         "createdAt": "2024-11-19T13:59:24.020Z",
//         "updatedAt": "2024-10-19T14:05:51.356Z",
//         "__v": 0,
//         "paymentId": "403993715532513087"
//     },
//     {
//         "_id": "67152ccba829bc0d936bc711",
//         "requestId": {
//             "_id": "67151fc9812d56f19913aa1c",
//             "user": "Sureshbro",
//             "workerId": "670e36e7cba50549d9472b78"
//         },
//         "workerId": {
//             "_id": "670e36e7cba50549d9472b78",
//             "Category": "mechanical"
//         },
//         "userId": "66ea91c78f03af0b8231af43",
//         "isCompleted": true,
//         "status": "Completed",
//         "payment": 2000,
//         "createdAt": "2024-11-20T16:16:11.259Z",
//         "updatedAt": "2024-10-20T17:51:25.688Z",
//         "__v": 0,
//         "paymentId": null
//     }
// ]