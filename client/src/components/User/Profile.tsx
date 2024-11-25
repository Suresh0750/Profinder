'use client'

import React, { useState, useEffect, useReducer } from 'react'
import { User, Mail, Phone, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from "sonner"
import { profile,updateprofile } from "@/lib/features/api/userApiSlice"

interface UserProfile {
  name: string
  email: string
  phone: number
  avatarUrl: string
}

type UserProfileAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_FIELD'; field: string; value: any }

function userProfileReducer(state: UserProfile, action: UserProfileAction): UserProfile {
  switch (action.type) {
    case 'SET_PROFILE':
      return action.payload
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      return state
  }
}

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isNewImage, setIsNewImage] = useState(false)
  const [newImageData, setNewImageData] = useState<File | null>(null)
  const [customerData, setCustomerData] = useState<any>({});
  const [isProfileLoading,setIsProfileLoading] = useState<boolean>(false)
  const [isUpdating,setIsUpdating] = useState<boolean>(false)
  const [userProfile, dispatch] = useReducer(userProfileReducer, {
    name: '',
    email: '',
    phone: 0,
    avatarUrl: '/placeholder.svg?height=100&width=100'
  })

  // * fetch the User Profile data
  async function fetchProfile(){
    try{
      if(isProfileLoading || !customerData?._id) return

      setIsProfileLoading(true)
      const res = await profile(customerData?._id)
      if(res?.success){
        dispatch({
          type: 'SET_PROFILE',
          payload: {
            name: res?.result?.username,
            email: res?.result?.emailAddress,
            phone: res?.result?.phoneNumber,
            avatarUrl: res?.result?.profile || '/placeholder.svg?height=100&width=100',
          },
        })
      }

    }catch(error:any){
      console.log(error)
      toast.error(error?.message)
    }finally{
      setIsProfileLoading(false)
    }
    
  }
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
  // const { data, refetch, isLoading: isProfileLoading } = useProfileQuery(customerData?._id)

  // 
  useEffect(() => {
    fetchProfile()
  }, [customerData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0]
    if (image) {
      setNewImageData(image)
      dispatch({ type: 'UPDATE_FIELD', field: 'avatarUrl', value: URL.createObjectURL(image) })
      setIsNewImage(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch({ type: 'UPDATE_FIELD', field: name, value })
  }

  const handleSave = async () => {
    if (String(userProfile.phone).length !== 10) {
      toast.error("Please enter a valid 10-digit phone number")
      return
    }

    try {
      if(isUpdating) return

      setIsUpdating(true)
      const formData = new FormData()
      formData.append("username", userProfile.name)
      formData.append("emailAddress", userProfile.email)
      formData.append("phoneNumber", String(userProfile.phone))

      if (isNewImage && newImageData) {
        formData.append("newImageData", newImageData)
        formData.append("isImage", "true")
      } else {
        formData.append("isImage", "false")
      }

      // const result = await updateProfile(formData).unwrap()
      const result = await updateprofile(formData)

      if (result.success) {
        toast.success("Your profile has been updated successfully")
        setIsEditing(false)
        fetchProfile()
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    } catch (error:any) {
      console.error(error)
      toast.error(error?.message)
    }finally{
      setIsUpdating(false)
    }
  }

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center w-[80%] h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }


  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={isUpdating}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Label className="mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded">
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  Change Avatar
                </Label>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="name"
                      name="name"
                      value={userProfile.name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userProfile.email}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <Input
                      id="phone"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {isEditing && (
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster richColors position="top-center" />
    </main>
  )
}
