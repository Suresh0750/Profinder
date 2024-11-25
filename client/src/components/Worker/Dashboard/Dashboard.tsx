"use client"
import { DashboardHeader, ViewRequest } from "@/components/Worker/Dashboard/WokerDashboard"
import { 
  DollarSign, 
  CheckCircle, 
  Calendar, 
  Star, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dashboard } from "@/lib/features/api/workerApiSlice"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { graphData } from '@/lib/service/worker/recentActivity-Graph'

const Dashboard = () => {
  const [dashboardDetails, setDashboardDetails] = useState<any>([])
  const [customerData, setCustomerData] = useState<any>({});

  const [graphDetails, setGraphDetails] = useState<any[]>([])
  const [rating, setRating] = useState([
    {
      "_id": null,
      "sum": 3,
      "count": 1
    }
  ])
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
    async function fetchDashBoardData(){
      if(customerData?._id){
        const res = await dashboard(customerData?._id)
        if(res?.success){
          setDashboardDetails(res?.result)
          setRating(res?.result?.rating)
          getGraphData(res?.result?.getRecentActivity)
        }
      }
    }
    
    const getGraphData = async function(activityData:any) {
      await setGraphDetails(graphData(activityData))
    }
    fetchDashBoardData()
  }, [customerData])

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardDetails?.resentActivity?.length ? dashboardDetails?.resentActivity[0]?.totalPayment : 0}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardDetails?.resentActivity?.length ? dashboardDetails?.resentActivity[0]?.countIsCompleteTrue : 0}</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
          <ViewRequest />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardDetails?.resentActivity?.length ? dashboardDetails?.resentActivity[0]?.countIsCompleteFalse : 0}</div>
              <Link href={'/worker/dashboard/upcoming-works'}>
                <Button className="mt-4 w-full" variant="outline">
                  View Schedule <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rating?.length && (rating[0]?.sum / rating[0]?.count) || 0}</div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < ((dashboardDetails?.rating?.length > 0 && (dashboardDetails?.rating[0].sum / dashboardDetails?.rating[0]?.count)) || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">({rating?.length && rating[0]?.count || 0} reviews)</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardDetails?.resentActivity?.length ? (dashboardDetails?.resentActivity[0]?.pendingPayment || 0) : 0}</div>
              <p className="text-xs text-muted-foreground">From {dashboardDetails?.resentActivity?.length ? dashboardDetails?.resentActivity[0]?.pendingCustomer : 0} customers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphDetails}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardDetails?.getRecentActivity?.length > 0 && (
                  dashboardDetails.getRecentActivity.map((act: any) => {
                    return (
                      <div key={act.requestId._id} className="flex items-center">
                        <div className="mr-2 rounded-full p-1 bg-yellow-100">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">Customer: {act?.requestId?.user}</p>
                        </div>
                        {(!act?.isCompleted) ? (
                          <span className="text-xs text-yellow-600 font-medium">Pending</span>
                        ) : (
                          <span className="text-xs text-green-600 font-medium">Completed</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Your acceptance rate is higher than {(Number(dashboardDetails?.getRecentActivity?.length) / Number(dashboardDetails?.totalOffer)) || 0}% of workers in your area.</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm font-medium">You have {dashboardDetails?.resentActivity?.length && (dashboardDetails?.resentActivity[0]?.countIsCompleteTrue - (dashboardDetails?.rating?.length ? dashboardDetails?.rating[0]?.count : 0)) || 0} pending reviews. Responding quickly can improve your rating.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Dashboard
