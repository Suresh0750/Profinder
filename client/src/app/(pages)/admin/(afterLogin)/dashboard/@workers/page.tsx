
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"

// * hook

import {useState,useEffect} from 'react'


// * api call
import {useDashboardWorkerQuery} from '@/lib/features/api/adminApiSlice'

// * types
import {topWorkerTypes} from '@/types/adminTypes'


export default function WorkersPage() {

  const [worker,setWorker] = useState<topWorkerTypes[]>([])

  const {data} = useDashboardWorkerQuery({})

  useEffect(()=>{
    setWorker(data?.result)

  },[data])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Workers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Trade</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Jobs Completed</TableHead>
              <TableHead>Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {worker?.length && worker?.map((worker:topWorkerTypes) => (
              <TableRow key={worker.id}>
                <TableCell className="font-medium">{worker.name}</TableCell>
                <TableCell>{worker.trade}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{worker.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{worker.jobs}</TableCell>
                <TableCell>${worker.earnings.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}