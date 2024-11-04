"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Tooltip } from "recharts"
import {useEffect,useState} from 'react'
import {useDashboardOverviewQuery} from '@/lib/features/api/adminApiSlice'

// * service
import {revenueCalculation,jobStatusService,getWorkerDistribution} from '@/lib/service/admin/dashboard'


// * types
import {workerDataTypes,jobStatusTypes,revenueData} from '@/types/adminTypes'


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function OverviewPage() {
  const [revenue,setRevenue] = useState<revenueData[]>([])
  const [jobStatus,setJobStatus] = useState<jobStatusTypes[]>([])
  const [workerData,setWorkerdata] = useState<workerDataTypes[]>([])
  const {data} = useDashboardOverviewQuery({})
  useEffect(()=>{
    if(data?.result && Object?.keys(data?.result)?.length>1){  
      setRevenue(revenueCalculation(data?.result?.revenueData))
      setJobStatus(jobStatusService(data?.result?.jobStatus))
      setWorkerdata(getWorkerDistribution(data?.result?.workerDistribution,data?.result?.getAllCategory))
    }

  },[data])
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-3">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Job Status</CardTitle>
            <CardDescription>Current status of all jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                status: {
                  label: "Job Status",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {jobStatus?.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-4 h-4 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="flex-1">{entry.name}</span>
                  <span>{entry.value}</span>
                </div>
              ))}
            </div>  
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Worker Distribution</CardTitle>
          <CardDescription>Number of workers in each trade</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Worker Count",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workerData}>
                <XAxis dataKey="trade" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}