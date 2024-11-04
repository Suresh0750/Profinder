



import './globals.css'
import React,{createContext,useContext,useEffect,useState} from 'react'
import { SessionProvider } from "next-auth/react";
import cookies from "js-cookie";
import {io,Socket} from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_NODE_SERVER_URL

interface SocketContextType {
  socket: Socket | null;
}
const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = ()=>useContext(SocketContext).socket

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [socket,setSocket] = useState<Socket | null>(null)
  useEffect(()=>{
    const token = cookies.get("userToken") || cookies.get('workerToken')

    if(token){
      const socketInstance = io(SOCKET_URL,{
        withCredentials:true,
        auth:{token}
      })
      socketInstance.on("connect",()=>{
        console.log('connected to socket')
        setSocket(socketInstance)
      })
      socketInstance.on("disconnect",()=>{
        console.log("Disconnected from socket")
        setSocket(null)
      })
      return ()=>{
        socketInstance.disconnect();
      }
    }
  },[])

  return (
    <SessionProvider> 
         <SocketContext.Provider value={{ socket }}>
            {children}
          </SocketContext.Provider>
    </SessionProvider>
  );
}
