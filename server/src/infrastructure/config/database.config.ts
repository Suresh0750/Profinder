
import {connect,set} from 'mongoose'

set('strictQuery', true);

export const connectDB = async ()=>{
            try{
                await connect(`${process.env.MONGO_URL}`)
            }catch(err){
                console.log('connecting to MongoDB Failed :',err)
            }
        }


