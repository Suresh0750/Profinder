"use client"
import React, { useState,useEffect } from 'react'
import { Search, Send } from 'lucide-react'
import {conversationData} from '@/types/workerTypes'
import {
    connectedUsers ,
    fetchMessage,
    updateMessage,
} from '../../../lib/features/api/workerApiSlice'
import {readMsgType,newMessage} from '@/types/utilsTypes'
import {io,Socket} from 'socket.io-client'
import Image from "next/image"


const Message = ()=>{
const [inputMessage, setInputMessage] = useState("")
const [allCustomer,setAllCustomer] = useState([])
const [customerDetails,setCustomerDetails] = useState([])
const [conversationID,setConversationID] = useState<string>('')

const [messages ,setMessages] = useState<any[]>([])

const [customerData, setCustomerData] = useState<any>({});
const [socket,setSocket] = useState<Socket|null>(null)
const [messageBox,setMessageBox] = useState<conversationData>({
        _id : '',
        userId : {
          _id : '',
          username:'',
          profile :''
        },
        workerId :'',
        lastMessage:'',
        createdAt:'',
        updatedAt:''
})


interface newMessage {
  _id: string;
  message: string;
  userId: any;
  workerId: any,
  conversationId?:string
}



// fetch user list
const fetchConnectedPeople = async ()=>{
  try{
    const res = await connectedUsers(customerData?._id)
    if(res?.success){
      setCustomerDetails(res?.result)
      setAllCustomer(res?.result)
    }
  }catch(error:any){
    console.log(error)
  }
}

// fetch conversation message

const fetchAllMsg = async ()=>{
  try{
    const res = await fetchMessage(conversationID)
    if(res?.success){
      setMessages(res?.result)
    }
  }catch(error:any){
    console.log(error)
  }
}



useEffect(()=>{
  if(customerData?._id){
    fetchConnectedPeople()
  }
},[customerData?._id])

useEffect(()=>{
  if(conversationID){
    fetchAllMsg()
  }
},[conversationID])


useEffect(() => {
  
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

 // * connect the socket
  useEffect(()=>{
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URI)

    setSocket(socketInstance)

    socketInstance.on("connect",()=>{
      console.log("Socket connected:", socketInstance.id);
    })
    return ()=>{
      socketInstance.disconnect();
    }
  },[])

  useEffect(()=>{
    if (socket && conversationID) {
      localStorage.setItem('conversationId',JSON.stringify(conversationID))
      socket.emit("joinRoom", conversationID);
    }
  },[socket,conversationID])

  useEffect(()=>{
    if (socket) {
      socket.on("message", (newMessage: newMessage) => {
      
        if(newMessage?.conversationId == JSON.parse(localStorage.getItem('conversationId')||'')){
          setMessages((prevMessage:any)=>[...prevMessage,newMessage])
        }
        setCustomerDetails((prevConv:any)=>{
          const result = prevConv?.map((conv:any)=>{
            if(conv._id==newMessage?.conversationId && newMessage?.conversationId == JSON.parse(localStorage.getItem('conversationId')||'') ){
              return {...conv,lastMessage:newMessage?.message,workerUnread:0}
            }else if(conv._id==newMessage?.conversationId && newMessage?.conversationId ){
              return {...conv,lastMessage:newMessage?.message,workerUnread:(conv?.workerUnread)+1}  
            }
            return conv
          })
          return result
        })
      });


      return () => {
        socket.off("message");
      };
    }
  },[socket])

  


const handleSearch = (e:React.ChangeEvent<HTMLInputElement>)=>{

  let searchInput = (e.target.value).toLowerCase()
  if((e.target.value)?.length>1){
    const filter = allCustomer?.filter((prevCustomer:any)=>{
    return (prevCustomer?.userId?.username).toLowerCase().includes(searchInput)
  })
  setCustomerDetails(filter)
  }else{
    setCustomerDetails(allCustomer)
  }
}

const handleShowMsg = (data: conversationData) => {
  if (!data || !data._id) { 
      console.warn("Invalid data or missing ID:", data);
      return;
  }


  setConversationID(data?._id);
  setMessageBox(data);

  setCustomerDetails((prevConv:any) => {
      const result = prevConv?.map((conv:any) => {
          if (conv._id === data?._id) {
              return { ...conv, workerUnread: 0 }; // *Update unread count
          }
          return conv; 
      });

      return result;
  });
};

const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() !== "") {
      // Here you would typically send the message to your backend
      console.log("Sending message:", inputMessage)
      setInputMessage("")
      const result = updateMessage({conversationId:messageBox?._id,sender:messageBox?.workerId,message:inputMessage})
    }
  }


    return(
        <>
          {/* Left sidebar */} 
      <div className="w-1/3 m-2 bg-white rounded border-r">
        <div className="p-4 text-1xl font-bold flex justify-between">
        <h2 className='text-center py-2'>Message</h2>
          <button className=" bg-indigo-100 text-indigo-600 py-2 px-4 rounded font-medium">
            + Compose
          </button>
        </div>
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-full"
              onChange={(e)=>handleSearch(e)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(80vh-120px)]">
          {customerDetails?.length >0&& customerDetails?.map((conv:any) => (
            <div key={conv?._id} className="flex items-center p-4 hover:bg-gray-100 cursor-pointer" onClick={()=>handleShowMsg(conv)}>
              <div className="relative">
                <div className='w-10 h-10'>
                  <Image src={conv?.userId?.profile} alt={conv?.userId?.username} width={250} height={250} className="w-10 h-10 rounded-full" />
                </div>
                {false && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm">{conv?.userId?.username}</h3>
                  <div>
                  <span className="text-xs text-gray-500">{new Date(conv?.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className=" bottom-0 right-0 text-center bg-green-400 rounded-full border-2 border-white">
                    {
                      conv?.workerUnread>0 && <span className='w-3 h-3'>{conv?.workerUnread}</span> 
                    }
                  </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat area */}
      <div className="flex-1 m-2 flex rounded border-r flex-col">
        {/* Chat header */}
        <div className="bg-white p-4 border-b flex items-center">
          <div className='w-10 -10'>
          <Image src={messageBox?.userId?.profile} alt={messageBox?.userId?.username} width={0} height={0} className="w-10 h-10 rounded-full" />
          </div>
          <div className="ml-3">
            <h2 className="font-semibold">{messageBox?.userId?.username}</h2>
            {/* <p className="text-sm text-green-500">Active Now</p> */}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages && messages.map((message:any) => (
            <div key={message?._id} className={`flex ${message?.sender ==customerData?._id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs ${message?.sender ==customerData?._id ? "bg-indigo-600 text-white" : "bg-gray-200"} rounded-lg p-3`}>
                <p className="text-sm">{message?.message}</p>
                <p className="text-xs text-right mt-1 opacity-70">{new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>  
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="bg-white p-4 border-t flex items-center">
          <input
            type="text"
            placeholder="Type your message"
            className="flex-1 border rounded-full py-2 px-4 mr-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white rounded-full p-2">
            <Send size={20} />
          </button>
        </form>
      </div>
        </>
    )
}


export default Message