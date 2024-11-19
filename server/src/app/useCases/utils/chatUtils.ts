
// * chat application send the message between user and worker

import {io} from '../../../server'
import {MessageType} from '../../../domain/entities/commonTypes'


export const sendMessage =async (message:MessageType)=>{
    try {

        // console.log('call socket')
        // console.log(message)
        // console.log(JSON.stringify(message))

       await io.to(String(message?.conversationId)).emit("message",message)
    } catch (error) {
        console.log(`Error from app->useCause->utils->chatUtils`)
        console.log(error)
        throw error
    }
}