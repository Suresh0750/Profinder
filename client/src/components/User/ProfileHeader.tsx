'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Wallet, LogOut } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

const ProfileHeader: React.FC<LayoutProps> = ({ children }) => {
  const [activePath, setActivePath] = useState<string>("profile")
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string>('')
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0)
  const [customerData, setCustomerData] = useState<any>({});

  useEffect(() => {
    // Only access localStorage in the browser
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      const userProfile = JSON.parse(localStorage.getItem('userprofile') || '{}');

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setCustomerData(parsedData);
          setUserProfile(parsedData); // Use parsedData directly
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
          setUserProfile({});
        }
      }

      if (userProfile) {
        setProfileImage(userProfile);
      } else {
        setProfileImage('');
      }
    }
  }, []); // Keep it empty if you don't want it to re-run

  const isActive = (path: string) => activePath === path

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={profileImage || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover h-full"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">
                {userProfile ? userProfile.customerName : "Loading..."}
              </h2>
              <p className="text-gray-500">{userProfile?.email}</p>
            </div>
          </div>

          <nav className="mt-6">
            <ul className="flex flex-wrap justify-center md:justify-start gap-4">
              {[
                { path: "user/profile", label: "Manage Account", icon: null },
                { path: "user/message", label: "Messages", icon: MessageCircle },
                // { path: "wallet", label: "Wallet", icon: Wallet },
                { path: "signout", label: "Sign Out", icon: LogOut },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={`/${item.path}`}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setActivePath(item.path)}
                  >
                    {item.icon && <item.icon className="w-5 h-5 mr-2" />}
                    {item.label}
                    {item.path === "chat" && unreadMessagesCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
        {children}
      </div>
    </div>
  )
}

export default ProfileHeader
