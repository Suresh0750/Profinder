"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Star, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {toast,Toaster} from 'sonner'
// API 
import {fetchDashboardData } from '@/lib/features/api/adminApiSlice'

// * types
import {DashboardHeadCard} from '@/types/adminTypes'

const Dashboard = () => {

  const [dashboard, setDashboard] = useState<DashboardHeadCard>({
                                          totalRevenue: [
                                              {
                                                  _id: null,
                                                  payment: 0,
                                              },
                                          ],
                                          totalReview: 0,
                                          totalWorkers: 0,
                                          avgRating: [
                                              {
                                                  _id: null,
                                                  sum: 0,
                                                  count: 0,
                                              },
                                          ],
                                      });

  const router = useRouter();

  useEffect(() => {
    
    const loadDashboardData = async()=>{
      try{
      
        const res = await fetchDashboardData()
        console.log(res)
        if(res?.result){
          setDashboard(res?.result)
        }
      }catch(error:any){
        console.log(error?.message)
        toast.error(error?.message)
      }
    }
    loadDashboardData()
}, []); 

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${dashboard?.totalRevenue?.length && dashboard?.totalRevenue[0]?.payment || 0}
          </div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboard?.totalReview || 0}</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboard?.totalWorkers || 0}</div>
          <p className="text-xs text-muted-foreground">+8% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboard?.avgRating?.length && (dashboard?.avgRating[0]?.sum / dashboard?.avgRating[0]?.count).toFixed(2) || 0}
          </div>
          <p className="text-xs text-muted-foreground">+0.2 from last month</p>
        </CardContent>
      </Card>
      <Toaster richColors position='top-center' />
    </>
  )
}

export default Dashboard
