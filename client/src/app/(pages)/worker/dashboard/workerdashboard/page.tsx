
import React from 'react'
import Dashboard from '@/components/Worker/board/Dashboard'
import {useDashboardQuery} from '@/lib/features/api/workerApiSlice'
const WorkerDashboard: React.FC = () => {

  // const {data} = useDashboardQuery()
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 p-6">
      <Dashboard/>
    </div>
  )
}

export default WorkerDashboard