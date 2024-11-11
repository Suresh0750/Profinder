'use client'


import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useCustomerLogoutMutation } from '@/lib/features/api/customerApiSlice'
import Modal from '@/components/Emergency'
import { Menu, X, ChevronDown, Home, User, Briefcase, FileText, MessageSquare } from 'lucide-react'
import {toast,Toaster} from 'sonner'


export default function Navbar() {
  const [role, setRole] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [customerData, setCustomerData] = useState<any>({});
  const [CustomerLogout,{isLoading}] = useCustomerLogoutMutation()

  const router = useRouter()

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        try {
          setCustomerData(JSON.parse(storedData));
          const data = JSON.parse(storedData)
        if(data?.role)
          setRole(data?.role)
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
        }
      }
    }
  }, []);

 


  const handleLogout = async () => {
    try {

      if(isLoading) return // * handle multiple click
      const result = await CustomerLogout({}).unwrap()
      if (result?.success) {
        toast.success(result?.message)
        localStorage.setItem("customerData", '')
        window.location.replace('/homePage')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>

      <nav className="bg-[#111826] text-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/homePage" className="flex-shrink-0">
                <span className="font-bold text-2xl">ProFinder</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/homePage" className="hover:bg-[#1c2536] px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link href="/service-workerlist" className="hover:bg-[#1c2536] px-3 py-2 rounded-md text-sm font-medium">Service</Link>
                <Link href="#" className="hover:bg-[#1c2536] px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {!role ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="bg-yellow-500 text-[#111826] px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      Get Started <ChevronDown className="ml-1" size={16} />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                        <Link href="/user/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">User Sign In</Link>
                        <Link href="/user/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">User Sign Up</Link>
                        <Link href="/worker/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Worker Sign In</Link>
                        <Link href="/worker/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Worker Sign Up</Link>
                      </div>
                    )}
                  </div>
                ) : role === 'user' ? (
                  <>
                    {/* <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium mr-2">Emergency</button> */}
                    <Link href="/user/profile" className="bg-[#1c2536] hover:bg-[#2a3649] px-4 py-2 rounded-md text-sm font-medium mr-2">Dashboard</Link>
                    <button onClick={handleLogout} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/worker/dashboard/workerdashboard" className="bg-[#1c2536] hover:bg-[#2a3649] px-4 py-2 rounded-md text-sm font-medium mr-2">Dashboard</Link>
                    <button onClick={handleLogout} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium">Logout</button>
                  </>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-[#1c2536] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111826] focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/homePage" className="hover:bg-[#1c2536] block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link href="/service-workerlist" className="hover:bg-[#1c2536] block px-3 py-2 rounded-md text-base font-medium">Service</Link>
              <Link href="#" className="hover:bg-[#1c2536] block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-[#2a3649]">
              <div className="flex items-center px-5">
                {!role ? (
                  <Link href="/user/login" className="block w-full text-center bg-yellow-500 text-[#111826] px-4 py-2 rounded-md text-base font-medium">Get Started</Link>
                ) : role === 'user' ? (
                  <>
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-base font-medium mb-2">Emergency</button>
                    <Link href="/user/profile" className="w-full bg-[#1c2536] hover:bg-[#2a3649] px-4 py-2 rounded-md text-base font-medium mb-2">Dashboard</Link>
                    <button onClick={handleLogout} className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-base font-medium">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/worker/dashboard/workerdashboard" className="w-full bg-[#1c2536] hover:bg-[#2a3649] px-4 py-2 rounded-md text-base font-medium mb-2">Dashboard</Link>
                    <button onClick={handleLogout} className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-base font-medium">Logout</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      < Toaster richColors position='top-center' />
    </>
  )
}