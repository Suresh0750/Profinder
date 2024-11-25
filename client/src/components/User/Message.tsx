"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Send } from 'lucide-react'
import {
  fetchAllMessage,
  fetchAllConversation,
  conversation,
} from '@/lib/features/api/userApiSlice'
import { conversationData } from '@/types/userTypes'
import { readMsgType, newMessage } from '@/types/utilsTypes'
import { io, Socket } from 'socket.io-client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Chats() {
  const [inputMessage, setInputMessage] = useState("")
  const [conversationsData, setConversations] = useState<conversationData[]>([])
  const [conversationID, setConversationID] = useState('')
  const [messages, setMessages] = useState<readMsgType[]>([])
  const [messageBox, setMessageBox] = useState<conversationData | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [customerData, setCustomerData] = useState<any>({});
 
  

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        try {
          setCustomerData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
        }
      }
    }
  }, []);



  useEffect(() => {
    if(conversationID){
       // * get Particular worker message
    const fetchConversation = async()=>{
      try{
        const res = await fetchAllMessage(conversationID)
        if(res?.success){
          setMessages(res?.result)
        
        }
      }catch(error:any){
        console.log(error)
      }
    }
      fetchConversation()
    }
  }, [conversationID])

  // * call fetch conversation data
  useEffect(() => {
   if(customerData?._id){
      // * fetch connected worker contect
    const fetchAllConversationData = async ()=>{
    try{
      const res = await fetchAllConversation(customerData?._id)
      if(res?.success){
        console.log(res?.message)
        console.log(res)
        setConversations(res?.result)
      }
    }catch(error:any){
      console.log(error?.message)
    }
  }

    fetchAllConversationData()
   }
  }, [customerData?._id])
 
  // fetchAllConversation
  // const { data: allMessageData } = useGetAllMessageQuery(conversationID, { skip: stopFetch, refetchOnMountOrArgChange: true})

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URI)
    setSocket(socketInstance)

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id)
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {   // * change the conversation room according to worker
    if (socket && conversationID) {
      localStorage.setItem('conversationId',JSON.stringify(conversationID))
      socket.emit("joinRoom", conversationID)
    }
  }, [socket, conversationID])

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: newMessage) => {
        
        const roomId = JSON.parse(localStorage.getItem('conversationId')||'')
        if(newMessage?.conversationId == roomId){
         
          setMessages((prevMessages:any) => [...prevMessages, newMessage])
        }
       
        setConversations((prevConv) => {
          const result = prevConv?.map((conv:any)=>{
            if(conv._id==newMessage?.conversationId && newMessage?.conversationId == roomId){
              return {...conv,lastMessage:newMessage?.message,userUnread:0}
            }else if(conv._id==newMessage?.conversationId ){
              return {...conv,lastMessage:newMessage?.message,userUnread:(conv?.userUnread)+1}  
            }
            return conv
          })
          return result
        })}

      socket.on("message", handleNewMessage)

      return () => {
        socket.off("message", handleNewMessage)
      }
    }
  }, [socket])



 

  const handleShowMsg = useCallback((data: conversationData) => {
    console.log('data')

    console.log(JSON.stringify(data))
    if (!data || !data._id) {
      console.warn("Invalid data or missing ID:", data)
      return
    }

    setConversationID(data._id)
    
    setMessageBox(data)

    setConversations(prevConv => 
      prevConv.map(conv => 
        conv._id === data._id 
          ? { ...conv, userUnread: 0 }
          : conv
      )
    )
  }, [])

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMessage = inputMessage.trim()
    if (trimmedMessage !== "" && messageBox) {
      setInputMessage("")
      await conversation({
        lastMessage: trimmedMessage,
        userId: customerData?._id,
        workerId: messageBox.workerId?._id,
        conversationId: conversationID
      })
    }
  }, [inputMessage, messageBox,customerData?._id, conversationID])

  return (
    <div className="flex h-[82vh] mt-2 ml-3 gap-2 bg-gray-100">
      {/* Left sidebar */} 
      <div className="w-[39.333333%] m-2 bg-white rounded shadow-md">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className='text-xl font-bold'>Messages</h2>
          <Button variant="outline">
            + Compose
          </Button>
        </div>
        <div className="p-4">
          <div className="relative flex">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search conversations"
              className="pl-10 pr-4 w-full mt-[7px]"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(80vh-120px)]">
          {conversationsData.map((conv:any) => (
            <div 
              key={conv._id} 
              onClick={() => handleShowMsg(conv)} 
              className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={conv.workerId?.profile} alt={conv.workerId?.firstName} />
                <AvatarFallback>{conv.workerId?.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold">{conv.workerId?.firstName}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                {conv.userUnread > 0 && (
                  <div className="mt-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {conv.userUnread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right chat area */}
      <div className="flex-1 m-2 flex rounded shadow-md flex-col w-[50em] bg-white">
        {messageBox ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <Avatar>
                <AvatarImage src={messageBox.workerId?.profile} alt={messageBox.workerId?.firstName} />
                <AvatarFallback>{messageBox.workerId?.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h2 className="font-semibold">{messageBox.workerId?.firstName}</h2>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.map((message:any) => (
                <div key={message._id} className={`flex ${message.sender === customerData._id ? "justify-end" : "justify-start"} mt-2`}>
                  <div className={`max-w-xs ${message.sender === customerData._id ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-lg p-3`}>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>  
              ))}
            </ScrollArea>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
              <Input
                type="text"
                placeholder="Type your message"
                className="flex-1 mr-2"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send size={20} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  )
}