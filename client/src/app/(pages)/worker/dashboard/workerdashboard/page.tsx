
import React from 'react'
import Dashboard from '@/components/Worker/Dashboard/Dashboard'

const WorkerDashboard: React.FC = () => {

  // const {data} = useDashboardQuery()
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 p-6">
      <Dashboard/>
    </div>
  )
}

export default WorkerDashboard