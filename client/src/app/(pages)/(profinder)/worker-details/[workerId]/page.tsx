'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {fetchSingleWorkerDetails } from '@/lib/features/api/workerApiSlice'
import { fetchReview } from '@/lib/features/api/customerApiSlice'

import defaultImage from '../../../../../../public/images/worker/defaultImage.png'
import MaterialCarousel from '@/components/WokerDetailscarousel'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarIcon, MessageCircleIcon, MapPinIcon, BriefcaseIcon, CalendarIcon, DollarSignIcon } from 'lucide-react'
import Image from 'next/image'

// *types
import {reviewData} from '@/types/utilsTypes'

const WorkerDetailsPage = ({ params }: { params: { workerId: string } }) => {
  const [workerDetails, setWorkerDetails] = useState<any>(null)
  const [reviewDetails, setReviewDetails] = useState<reviewData[]>([])
  const [customerRating, setCustomerRating] = useState(0)
  const [customerData, setCustomerData] = useState<any>(null)
  const [skip,setSkip] = useState<boolean>(true)
  const [isWorkerDetailsLoading,seIsWorkerDetailsLoading] = useState<boolean>(false)
  const [isReviewLoading,setIsReviewLoading] = useState<boolean>(false)




  // fetchReview

  //fetchSingleWorkerDetails

  const router = useRouter()

  useEffect(() => {
    const storedCustomerData = typeof window !== 'undefined' ? localStorage.getItem("customerData") : null
    if (storedCustomerData) {
      setCustomerData(JSON.parse(storedCustomerData))
      setSkip(false)
    } else {
      setSkip(false)
    }
  }, [])

 
  useEffect(() => {
    async function fetchWorkerData(){
      try{
        if(customerData?._id && params?.workerId){
          seIsWorkerDetailsLoading(true)
          let data = `${params.workerId}/${customerData?._id}`
          const res = await fetchSingleWorkerDetails(data)
          if(res?.success){
            console.log(res?.result)
            setWorkerDetails(res?.result)
          }
        }
      }catch(error:any){
        console.log(error)
      }finally{
        seIsWorkerDetailsLoading(false)
      }
    
    }
    fetchWorkerData()
  }, [customerData?._id,customerData])

  useEffect(() => {
     // fetch reviw data

  const fetchReviewDetails = async ()=>{
    try{
      setIsReviewLoading(true)
      const res = await fetchReview(params.workerId)
      if(res?.success){
        setReviewDetails(res.result)
      }
    }catch(error:any){
      console.log(error)
    }finally{
      setIsReviewLoading(false)
    }
  }
  fetchReviewDetails()

  }, [params.workerId])

  useEffect(() => {
    if (reviewDetails.length > 0) {
      const totalRating = reviewDetails.reduce((acc: number, curr: any) => acc + (curr?.rating || 0), 0)
      setCustomerRating(totalRating / reviewDetails.length)
    }
  }, [reviewDetails])

 

  if (isWorkerDetailsLoading || isReviewLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!workerDetails) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[75px]">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Worker details not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[75px]">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={workerDetails?.profile || defaultImage} alt={workerDetails?.firstName} />
              <AvatarFallback>{workerDetails?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{workerDetails?.firstName}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{workerDetails?.city}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(customerRating || 0) ? 'fill-yellow-400' : 'fill-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">({reviewDetails?.length || 0} reviews)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center">  
                <Link href="/request">
                  <Button className="w-full sm:w-auto">
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="work">Our Work</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className='min-h-[137.562px]'>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BriefcaseIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Services:</p>
                      <p>{workerDetails.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {
                      workerDetails?.experience && (
                        <>
                        <CalendarIcon className="w-5 h-5 text-primary" />
                          <div> 
                            <p className="font-semibold">Experience:</p>
                            <p>{workerDetails.experience} years</p>
                          </div>
                        </>
                      )
                    }
                    
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {
                      workerDetails?.rate && (
                        <>
                        <DollarSignIcon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-semibold">Rate:</p>
                          <p>${workerDetails?.rate || 'N/A'} per day</p>
                        </div>
                        </>
                      )
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    {
                      workerDetails?.availability && (
                        <>
                          <CalendarIcon className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-semibold">Availability:</p>
                            <p>{ workerDetails?.availability}</p>
                          </div>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="work">
          <Card  className='min-h-[137.562px]'>
          <CardContent className="p-6">
              {(workerDetails?.workerImage && workerDetails?.workerImage?.length > 0) ? (
                <MaterialCarousel images={workerDetails.workerImage} />
              ) : <p>No work yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card  className='min-h-[137.562px]'>
            <CardContent className="p-6">
              {reviewDetails.length > 0 ? (
                reviewDetails.map((review:reviewData, index:number) => (
                  <>
                  <div key={review?._id}>
                    <Image alt={review?.userId?.username+'Image'} src={review?.userId?.profile} width={50} height={50} className='rounded-full w-10 h-10 inline-block mr-2 text-[#0f1729] text-xl' />
                    <span>{review?.userId?.username}</span>
                  </div>
                  <div key={index} className="mb-4">
                    <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(review?.rating || 0) ? 'fill-yellow-400' : 'fill-gray-300'}`} />
                    ))}
                    </div>
                    <div className='flex'>
                      <Badge variant="default" className="mr-2">
                        {review?.rating}
                      </Badge>
                      <p className="text-gray-700">{review?.comment}</p>
                    </div>
                  </div>
                  </>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WorkerDetailsPage
