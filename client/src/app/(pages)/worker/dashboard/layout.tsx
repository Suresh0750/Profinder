"use client"

import React, { useState, useEffect } from 'react'
import { useGetWorkerDetailsQuery } from '@/lib/features/api/workerApiSlice'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { getWorkerData } from '@/lib/features/slices/workerSlice'
import { usePathname } from 'next/navigation'
import { Home, User, Briefcase, FileText, MessageSquare, Menu, X } from 'lucide-react'

const navItems = [
  { href: '/worker/dashboard/workerdashboard', label: 'Dashboard', icon: Home },
  { href: '/worker/dashboard/personalInfo', label: 'Personal Info', icon: User },
  { href: '/worker/dashboard/professionalInfo', label: 'Professional Info', icon: Briefcase },
  { href: '/worker/dashboard/workerprojectDetails', label: 'Works', icon: FileText },
  { href: '/worker/dashboard/message', label: 'Messages', icon: MessageSquare },
]

export default function WorkerDashboardLayout({ children }: { children: React.ReactNode }) {
  const [customerData, setCustomerData] = useState<any>({})
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const { data, error, isLoading } = useGetWorkerDetailsQuery('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) {
      console.log(data)
      setCustomerData(data?.workerData || {})
      dispatch(getWorkerData(data?.workerData))
    }
  }, [data, dispatch])

  return (
    <div className="flex  h-[93.5vh] mt-2 bg-gray-100">
    
  
      {/* Sidebar */}
      <aside
        className={`fixed z-10 inset-y-0 left-0 w-64 bg-[#111826] text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 pt-20`}
      >
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-[#1c2536] text-white'
                      : 'text-gray-300 hover:bg-[#1c2536]'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {isLoading ? <p>Loading...</p> : children}
      </main>
    </div>
  )
}