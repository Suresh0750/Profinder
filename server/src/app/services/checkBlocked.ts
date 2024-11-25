import {getUserRepository} from '../../infrastructure/database/mongoose/user'
import {getWorkerRepository} from '../../infrastructure/database/mongoose/worker'
import {User} from '../../domain/entities/user'
import { WorkerInformation } from '../../domain/entities/worker'

//getDataFindById
export const checkBlocked = async (role:string,_id:string)=>{
    console.log(role,_id)
    switch(role){
        case 'user':
            const result: User | null= await getUserRepository().getDataFindById(_id)
            if(!result){
                throw new Error('User not found');
            }
            return result?.isBlocked
        case 'worker':
            const res: WorkerInformation | null = await getWorkerRepository().getSingleWorkerDetailsQuery(_id)
            if(!res){
                throw new Error('worker not found');
            }
            return res?.isBlocked
    }
}