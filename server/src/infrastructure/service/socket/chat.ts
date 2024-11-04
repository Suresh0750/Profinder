

import {Server as SocketIoServer, Socket} from 'socket.io'

export const socketHandler = (io:SocketIoServer)=>{
    io.on("connection",(socket:Socket)=>{
        // console.log("New client connected")

        socket.on("joinRoom",(conversationId:string)=>{
            console.log('User joined room',conversationId)
            socket.join(conversationId)
        })

        socket.on("message",(messageData)=>{
            // console.log(messageData)
            // console.log(`Message received in room ${messageData.conversationId}`,messageData)

            if(!messageData.conversationId || !messageData.message){
                // console.error("Invalid message data:", messageData);
                return
            }
            io.to(messageData.conversationId).emit("message",messageData)
        })
        socket.on("disconnect",()=>{
            console.log('Client disconnected')
        })
    })
}