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
import { Label } from "@/components/ui/label"
import {WorkerDatails} from '@/types/workerTypes'
import {  
  useGetCategoryNameQuery,
  useListWorkerDataAPIQuery,
} from "@/lib/features/api/customerApiSlice"
import Image from "next/image" // Import the Image component

const ITEMS_PER_PAGE = 6
const libraries: ("places")[] = ["places"]

const getCurrentLocation = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    )
  })
}

export default function ServiceWorkerListPage() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationSearchTerm, setLocationSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [location, setLocation] = useState<{latitude: number, longitude: number}>({latitude: 0, longitude: 0})
  const [skip, setSkip] = useState<boolean>(true)
  const [selectedPlace, setSelectedPlace] = useState<{lat: number, lng: number} | null>(null)
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(null)

  const router = useRouter()
  const { data: workerData } = useListWorkerDataAPIQuery(location, {
    skip: skip
  })
  const { data: categoryData } = useGetCategoryNameQuery("")

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API as string,
    libraries,
  })

  useEffect(() => {
    getCurrentLocation().then(
      (coords) => {
        setLocation({latitude: coords.latitude, longitude: coords.longitude})
        setMarkerPosition({lat: coords.latitude, lng: coords.longitude})
        setSkip(false)
      },
      (error) => console.error('Error getting location:', error)
    )
  }, [])

  const filteredWorkers = React.useMemo(() => {
    if (!workerData?.result) return []
    return workerData.result.filter((worker: any) => 
      (filterCategory === "All" || worker.Category === filterCategory) &&
      worker.FirstName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [workerData, filterCategory, searchTerm])

  const handleFilterCategory = useCallback((categoryName: string) => {
    setFilterCategory(categoryName)
    setPage(1)
  }, [])

  const handleRedirectWorkerPage = useCallback((_id: string,worker:WorkerDatails) => {
    if (typeof window !== "undefined" && worker){
     localStorage.setItem("workerDetails",JSON.stringify({_id:worker?._id,Category:worker?.Category,FirstName:worker?.FirstName}))
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
    console.log('Autocomplete loaded:', autocomplete)
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      // console.log('Selected place:', place)
      setLocationSearchTerm(place.formatted_address || "")
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setSelectedPlace({ lat, lng })
        setMarkerPosition({ lat, lng })
        setLocation({ latitude: lat, longitude: lng })
  
        setSkip(false)
      }
    }
  }

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

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
                {["All", ...(categoryData?.result || [])].map((category) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((worker: any) => (
              <Card key={worker._id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleRedirectWorkerPage(worker._id,worker)}>
                <CardContent className="p-0">
                  <Image
                    src={worker.Profile || "/placeholder.svg?height=256&width=500"}
                    width={500}
                    height={256}
                    alt={worker.FirstName || "Worker"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900">{worker.FirstName}</h2>
                    <p className="text-sm text-gray-600">Reviews</p>
                    <div className="flex items-center text-gray-500 mt-2">
                      <AiTwotoneEnvironment className="mr-1" />
                      <span>{worker.StreetAddress}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <Button variant="secondary">{worker.Category}</Button>
                  <Button onClick={() => handleRedirectWorkerPage(worker._id,worker)}>Read More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              count={Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE)}
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
