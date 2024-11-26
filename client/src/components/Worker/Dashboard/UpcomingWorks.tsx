'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle, XCircle,BadgeIndianRupee } from 'lucide-react'
import { updateWorkStatus, fetchUpcomingWorks} from '@/lib/features/api/workerApiSlice'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {toast,Toaster} from 'sonner'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const MySwal = withReactContent(Swal); // Initialize SweetAlert with React

// * types
import {upcomingWorkerData} from '@/types/workerTypes'

export default function UpcomingWorksPage() {

  const [customerData, setCustomerData] = useState<any>({});
  const [selectedWork, setSelectedWork] = useState<upcomingWorkerData | null>(null)
  const [filter,setFilter] = useState<boolean>(false)
  const [isLoadingUpdate,setIsLoadingUpdate] = useState<boolean>(false)
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const [upcomingWorks,setUpcomingWorks] = useState([])
  const [error,setError] = useState<boolean>(false)



     // handle fetchUpcoming works data
     const handleFethcUpcomingData = async ()=>{
      try{
        console.log('isLoading',isLoading)
        if(isLoading) return
        setIsLoading(true)
        const res = await fetchUpcomingWorks(customerData?._id)
        if(res?.message){
          console.log(res?.result)
          setUpcomingWorks(res?.result)
        }
      }catch(error:any){
        setError(true)
        console.log(error?.message)
      }finally{
        setIsLoading(false)
      }
    }
  useEffect(()=>{
    if(customerData?._id){
   
  handleFethcUpcomingData()
    }
  },[customerData?._id])

  const handleFilter = (isUpdate:boolean)=>{
    setFilter(isUpdate)
  }
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

  const handleWorkSelect = (work: upcomingWorkerData) => {
    
    setSelectedWork(work)
  }

  


  const handleStatusChange = (_id: string, newStatus:string) => {
    try{
      if(isLoadingUpdate) return // * handle multiple click
    
      setIsLoadingUpdate(true)
      if((selectedWork?.paymentId) && newStatus=="Cancelled") return toast.warning(`Payment has been completed`)
  
      MySwal.fire({
        title: `Have you want ${newStatus} "${selectedWork?.userId?.username} of work"?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${newStatus} it!`,
      }).then(async (res:any) => {     
        // alert(JSON.stringify(res))
        const result:any = await updateWorkStatus({status:newStatus,_id})
      
        if(result?.success){
          // alert(newStatus)
          MySwal.fire(
            `Mark as ${newStatus}!`,
            `${selectedWork?.userId?.username} has been ${newStatus}.`,
            "success"
          );
          handleFethcUpcomingData()
        }
        })
    }catch(error:any){
      console.log(error?.message)
    }finally{
      setIsLoadingUpdate(false)
    }

   

  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen">Error loading upcoming works</div>

  return (

        <>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Work List</CardTitle>
            <CardDescription>Your upcoming assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger onClick={()=>handleFilter(false)} value="pending">Pending</TabsTrigger>
                {/* <TabsTrigger value="confirmed">Confirmed</TabsTrigger> */}
                <TabsTrigger onClick={()=>handleFilter(true)} value="completed">Completed</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[60vh] mt-2">
                {['pending', 'completed'].map((status) => (
                  <TabsContent key={status} value={status}>
                    {upcomingWorks?.filter((work: upcomingWorkerData) => work.isCompleted === filter)
                      .map((work: upcomingWorkerData) => (
                        <Card
                          key={work._id}
                          className={`mb-2 cursor-pointer transition-all ${
                            selectedWork?._id === work._id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => handleWorkSelect(work)}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{work?.userId?.username}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {format(parseISO(work?.requestId?.preferredDate), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="w-4 h-4 mr-2" />
                                {work?.requestId?.preferredTime}
                              </div>
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Work Details</CardTitle>
            <CardDescription>Information about the selected work</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedWork ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedWork?.userId?.username}`} />
                    {/* <AvatarFallback>{`${(selectedWork?.userId?.username).charAt(0)}`}</AvatarFallback> */}
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedWork?.userId?.username}</h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    {selectedWork?.userId?.PhoneNumber}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedWork.requestId?.servicelocation}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {format(parseISO(selectedWork?.requestId?.preferredDate), 'MMMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {selectedWork?.requestId?.preferredTime}
                  </div>
                  
                  {
                    selectedWork?.payment && (<div className="flex items-center">
                                                <BadgeIndianRupee  className="w-5 h-5 mr-2"  />
                                                {selectedWork?.payment}
                                              </div>)
                  }
                  {
                    selectedWork?.paymentId ? (<div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2"  />
                                                Payment Completed
                                              </div>) :(<div className="flex items-center">
                                                <XCircle  className="w-5 h-5 mr-2"  />
                                                Payment not Completed
                                              </div>)
                  }
                  
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-muted-foreground">{selectedWork?.requestId?.AdditionalNotes || 'No additional notes'}</p>
                </div>
                <div>
                <h4 className="font-semibold mb-2">Status:</h4>
                  <Badge variant={selectedWork.isCompleted ? 'default' : 'outline'}>
                    {
                      selectedWork.isCompleted 
                        ? ('completed').charAt(0).toUpperCase() + ('completed').slice(1) 
                        : ('pending').charAt(0).toUpperCase() + ('pending').slice(1)
                    }
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                Select a work to view details
              </div>
            )}
          </CardContent>
          {selectedWork && (
            <CardFooter className="flex justify-end space-x-2">
              
              { selectedWork?.status=="Pending" &&(
                <Button onClick={() => handleStatusChange(selectedWork._id, 'Completed')}>
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Mark as Completed
                </Button>
              )}
              {/* {(|| selectedWork.status === 'confirmed') && ( */}
              {!selectedWork.isCompleted  &&selectedWork.status === 'Pending' && (
                <Button variant="destructive" onClick={() => handleStatusChange(selectedWork._id, 'Cancelled')}>
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  Cancel
                </Button>
              )}
            </CardFooter>
          )}
          <Toaster richColors position='top-center' />
        </Card>
        </>
     
  )
}