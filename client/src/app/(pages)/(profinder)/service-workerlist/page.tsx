'use client'

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLoadScript, Autocomplete, GoogleMap, Marker } from "@react-google-maps/api"
import { Pagination } from "@mui/material"
import { AiTwotoneEnvironment } from "react-icons/ai"
import { MdSearch } from "react-icons/md"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {Triangle} from 'react-loader-spinner'
import { toast } from 'sonner'
import { WorkerDatails } from '@/types/workerTypes'
import {
  listWorkerData,
  fetchCategoryName,
} from "@/lib/features/api/customerApiSlice"
import Image from "next/image"

const ITEMS_PER_PAGE = 6
const libraries: ("places")[] = ["places"]

const getCurrentLocation = async (): Promise<GeolocationCoordinates | null> => {
  try {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => {
          console.error("Error fetching location:", error)
          reject(null)
        }
      )
    })
  } catch {
    return null
  }
}

export default function ServiceWorkerListPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationSearchTerm, setLocationSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number, lng: number } | null>(null)
  const [markerPosition, setMarkerPosition] = useState<{ lat: number, lng: number } | null>(null)
  const [categoryData, setCategoryData] = useState<string[]>([])
  const [workerData, setWorkerData] = useState<WorkerDatails[]>([])
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerDatails[]>([])
  const [isLoading,setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  // Fetch Worker Data
  useEffect(() => {
    async function fetchWorkerData() {
      try {
        if (!location) return
        setIsLoading(true)
        const res = await listWorkerData(location)
        if (res?.success) {
          setWorkerData(res?.result)
          setFilteredWorkers(res?.result)
        }
      } catch (error: any) {
        console.error(error?.message)
        toast.error("Error fetching workers")
      }finally{
        setIsLoading(false)
      }
    }
    fetchWorkerData()
  }, [location])

  // Fetch Categories
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetchCategoryName()
        if (res?.success) {
          setCategoryData(res?.result)
        }
      } catch (error: any) {
        console.error(error?.message)
        toast.error("Error fetching categories")
      }
    }
    fetchCategory()
  }, [])

  // Get Current Location
  useEffect(() => {
    getCurrentLocation().then((coords) => {
      if (coords) {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude })
        setMarkerPosition({ lat: coords.latitude, lng: coords.longitude })
      }
    })
  }, [])

  // Filter Workers by Category and Search Term
  useEffect(() => {
    setFilteredWorkers(() => {
      return workerData.filter((worker) =>
        (filterCategory === "All" || worker.category === filterCategory) &&
        worker.firstName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }, [filterCategory, searchTerm, workerData])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API as string,
    libraries,
  })

  const handleFilterCategory = useCallback((categoryName: string) => {
    setFilterCategory(categoryName)
    setPage(1)
  }, [])

  const handleRedirectWorkerPage = useCallback((_id: string, worker: WorkerDatails) => {
    if (typeof window !== "undefined" && worker) {
      localStorage.setItem("workerDetails", JSON.stringify({
        _id: worker._id,
        category: worker.category,
        firstName: worker.firstName,
      }))
    }
    router.push(`/worker-details/${_id}`)
  }, [router])

  const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }, [])

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }, [])

  const handleLocationSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearchTerm(event.target.value)
  }, [])

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setLocationSearchTerm(place.formatted_address || "")
        setSelectedPlace({ lat, lng })
        setMarkerPosition({ lat, lng })
        setLocation({ latitude: lat, longitude: lng })
      }
    }
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

  if(isLoading) return <div className='min-h-screen w-full h-screen flex justify-center items-center'>
                        <Triangle
                          visible={true}
                          height="80"
                          width="80"
                          color="#0f1729"
                          ariaLabel="triangle-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          />
                        </div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mt-10">
        <aside className="w-full md:w-1/4 md:sticky md:top-8 md:self-start">
          <Card className="md:max-h-[calc(100vh-4rem)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["All", ...(categoryData || [])].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filterCategory === category}
                      onChange={() => handleFilterCategory(category)}
                      className="cursor-pointer"
                      label={category}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="w-full md:w-3/4">
          <div className="flex gap-4 w-full mb-6">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MdSearch className="text-gray-600" />
                  <Input
                    type="search"
                    placeholder="Search by worker"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-grow inline-block"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={onPlaceChanged}
                >
                  <div className="flex items-center space-x-2">
                    <MdSearch className="text-gray-600" />
                    <Input
                      type="text"
                      placeholder="Search by location"
                      value={locationSearchTerm}
                      onChange={handleLocationSearchChange}
                      className="flex-grow inline-block"
                    />  
                  </div>
                </Autocomplete>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[390.400px]">
            {
              filteredWorkers?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)?.length ? (filteredWorkers?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((worker: any) => (
                <Card key={worker?._id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleRedirectWorkerPage(worker?._id,worker)}>
                  <CardContent className="p-0">
                    <Image
                      src={worker?.profile || "/placeholder.svg?height=256&width=500"}
                      width={500}
                      height={256}
                      alt={worker?.firstName || "Worker"}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-900">{worker?.firstName}</h2>
                      <p className="text-sm text-gray-600">Reviews</p>
                      <div className="flex items-center text-gray-500 mt-2">
                        <AiTwotoneEnvironment className="mr-1" />
                        <span>{worker?.streetAddress}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <Button variant="secondary">{worker?.category}</Button>
                    <Button onClick={() => handleRedirectWorkerPage(worker?._id,worker)}>Read More</Button>
                  </CardFooter>
                </Card>
              ))) :(
                <Card className="flex justify-center items-center">
                  <div className="flex justify-center items-center">
                    <p>No worker available</p>
                  </div>
                </Card>
              )
            }
            
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              count={Math.ceil(filteredWorkers?.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              color="primary"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
