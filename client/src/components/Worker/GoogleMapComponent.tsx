'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'

interface GoogleMapComponentProps {
  apiKey: string;
  onLocationConfirm: (latitude: number, longitude: number, address: string) => void;
  handleCoords: {
    latitude: number,
    longitude: number
  };
  Handlecoords: (coords: { lat: number, lon: number }) => void;
  addressHandle: (address: any) => void;
  closeModal: () => void;
}

function MapComponent({ handleCoords, onPositionChange }:{ handleCoords:any, onPositionChange:any }) {
  const map = useMap()
  const [markerPosition, setMarkerPosition] = useState(handleCoords)

  useEffect(() => {
    if (map) {
      map.setOptions({ 
        zoom: 15,
        mapTypeId: 'hybrid',
        tilt: 45
      })
    }
  }, [map])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPosition({ latitude: lat, longitude: lng })
      onPositionChange(lat, lng)
    }
  }

  const handleMarkerDrag = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarkerPosition({ latitude: lat, longitude: lng })
      onPositionChange(lat, lng)
    }
  }

  return (
    <Map
      defaultCenter={{ lat: handleCoords.latitude, lng: handleCoords.longitude }}
      onClick={()=>handleMapClick}
      mapId={process.env.NEXT_PUBLIC_Map_ID || 'your-default-map-id'}
    >
      <AdvancedMarker 
        position={{ lat: markerPosition.latitude, lng: markerPosition.longitude }}
        draggable={true}
        onDragEnd={handleMarkerDrag}
      >
        <Pin background={'blue'} borderColor={'blue'} glyphColor={"white"} />
      </AdvancedMarker>
    </Map>
  )
}

export default function GoogleMapComponent({ 
  apiKey, 
  onLocationConfirm, 
  addressHandle,
  handleCoords,
  Handlecoords,
  closeModal
}: GoogleMapComponentProps) {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: handleCoords?.latitude || 0,
    longitude: handleCoords?.longitude || 0
  })
  const [address, setAddress] = useState<any>('')
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)

  // Memoize the address fetching function
  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      Handlecoords({ lat: latitude, lon: longitude })
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
      const data = await response.json()
      if (data?.address) {
        setAddress(data.address)
        addressHandle(data.address)
        setIsConfirmEnabled(true)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }, [Handlecoords, addressHandle]) // Add dependencies for the callback

  useEffect(() => {
    if (currentPosition.latitude !== 0 && currentPosition.longitude !== 0) {
      getAddressFromCoordinates(currentPosition.latitude, currentPosition.longitude)
    }
  }, [currentPosition]) // Include getAddressFromCoordinates

  const handlePositionChange = (latitude: number, longitude: number) => {
    setCurrentPosition({ latitude, longitude })
  }

  const handleConfirm = () => {
    onLocationConfirm(currentPosition.latitude, currentPosition.longitude, address)
    closeModal()
  }

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Your Location</DialogTitle>
        </DialogHeader>
        <APIProvider apiKey={apiKey}>
          <div style={{ height: "400px", width: "100%" }}>
            <MapComponent handleCoords={currentPosition} onPositionChange={handlePositionChange} />
          </div>
        </APIProvider>
        <div className="mt-4">
          <p><strong>Latitude:</strong> {currentPosition.latitude.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {currentPosition.longitude.toFixed(6)}</p>
          <p><strong>Address:</strong> {address ? (
            <>
              {address?.country && <p>Country: {address.country}</p>}
              {address?.state && <p>State: {address.state}</p>}
              {address?.state_district && <p>District: {address.state_district}</p>}
              {address?.postcode && <p>Postcode: {address.postcode}</p>}
              {address?.town && <p>Town: {address.town}</p>}
            </>
          ) : 'Loading...'}</p>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={!isConfirmEnabled}>
            Confirm Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
