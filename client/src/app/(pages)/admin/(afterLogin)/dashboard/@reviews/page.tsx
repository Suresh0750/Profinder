
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"


// * hook
import {useState,useEffect} from 'react'


// * RTK query
// * API CALL
import {fetchReviewDashboardData} from '@/lib/features/api/adminApiSlice'

// * types
import {reviewDashboardTypes} from '@/types/adminTypes'

export default function ReviewsPage() {

  const [recentReviews,setRecentReviews] = useState<reviewDashboardTypes[]>([])


  const fetchDashboardOverview = async ()=>{
    try{
      const res = await fetchReviewDashboardData()
      if(res?.success){
        setRecentReviews(res?.result)
      }
    }catch(error:any){
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchDashboardOverview()
  },[])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReviews?.length>0 && recentReviews?.map((review:reviewDashboardTypes) => (
            <div key={review?._id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{review?.userId?.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{review?.userId?.username}</p>
                <p className="text-sm text-muted-foreground">Worker: {review?.workerId?.FirstName}</p>
                <p className="text-sm">{review.comment}</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{review.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}