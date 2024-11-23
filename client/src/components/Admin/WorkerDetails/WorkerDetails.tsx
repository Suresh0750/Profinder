
"use client"
import React, { useState,useEffect } from 'react'
import { Phone, Mail} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent,CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {fetchWorkerData, useGetWorkerDataQuery} from '@/lib/features/api/adminApiSlice'
import {Triangle} from 'react-loader-spinner'
import IdentityModal from "./IdentityVerifyModal";

import{workerDetailsTypes} from '@/types/adminTypes'
import {toast} from 'sonner'


export default function WorkerDetails({ workerId }: { workerId: string }) {

  const [workerData,setWorkerData] = useState<workerDetailsTypes>()
  const [isLoading,setIsLoading] = useState<boolean>(true)
  


  const [imageUrl, setImageUrl] = useState<string>("");
  const [workerID, setWorkerID] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // Move the handleModal function outside of the useEffect
  const handleModal = (imageUrl: string, workerId: string) => {
    setImageUrl(imageUrl);
    setWorkerID(workerId);
    setModalOpen(true);
  };


  useEffect(()=>{
    async function WorkerDataAPI (){
      try{
        const res = await fetchWorkerData(workerId)
        if(res?.success){
          setWorkerData(res?.result)
        }
      }catch(error:any){
        toast.error(error?.message)
      } finally{
        setIsLoading(false)  // * hide the initial ui
      }
     
    }
    WorkerDataAPI()
  },[])



  if(isLoading) return <div className='w-full h-screen flex justify-center items-center'>
                        <Triangle
                          visible={true}
                          height="80"
                          width="80"
                          color="#0f1729"
                          ariaLabel="triangle-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          />
                      </div>
  
  return (
    <>
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Worker Details</CardTitle>
          <div className="space-x-2">
          
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={workerData?.profile} alt={`${workerData?.firstName} ${workerData?.lastName}`} />
                  <AvatarFallback>{workerData?.firstName[0]}{workerData?.lastName[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{workerData?.firstName} {workerData?.lastName}</h2>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {workerData?.category}
                </span>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{workerData?.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{workerData?.emailAddress}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:w-2/3">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList>
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="FirstName">First Name</Label>
                          <div className="p-2 bg-gray-100 rounded">{workerData?.firstName}</div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="LastName">Last Name</Label>
                          <div className="p-2 bg-gray-100 rounded">{workerData?.lastName}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Category">Category</Label>
                        <div className="p-2 bg-gray-100 rounded">{workerData?.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="address">
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="StreetAddress">Street Address</Label>
                        <div className="p-2 bg-gray-100 rounded">{workerData?.streetAddress}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="City">City</Label>
                          <div className="p-2 bg-gray-100 rounded">{workerData?.city}</div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="State">State</Label>
                          <div className="p-2 bg-gray-100 rounded">{workerData?.state}</div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="PostalCode">Postal Code</Label>
                          <div className="p-2 bg-gray-100 rounded">{workerData?.postalCode}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Country">Country</Label>
                        <div className="p-2 bg-gray-100 rounded">{workerData?.country}</div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="Password">Password</Label>
                        <div className="p-2 bg-gray-100 rounded">••••••••</div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="Identity">Identity Document</Label>
                        <div className="p-2 bg-gray-100 rounded flex items-center justify-between">
                          <span>Identity Document</span>
                          <Button
                           onClick={() =>
                            handleModal(workerData?.identity || '', workerData?._id || '')
                          } variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <IdentityModal
    isOpen={isModalOpen}
    onClose={() => setModalOpen(false)}
    image={imageUrl}
    workerId={workerId}
    
  />
    </>
  )
}