"use client";

import { useState, useEffect,useRef} from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { CoordsTypes, workerDetailsWithlatlon ,Point} from '@/types/utilsTypes';
import {GOOGLE_API,Map_ID} from '@/lib/server/environment'

export default function Intro({ coords, workerData }: { coords: CoordsTypes, workerData: workerDetailsWithlatlon[] }) {
    const { latitude, longitude } = coords;
    const userPosition = { lat: latitude, lng: longitude };
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState<number>(9);  
    const [nearbyWorkers, setNearbyWorkers] = useState<any[]>([]); // *  State to hold nearby workers
    const mapRef = useRef<google.maps.Map | null>(null);
    // * Find nearby workers and update state
    useEffect(() => {
        const workersNearby = FindNearByWorkers(coords, workerData);

        setNearbyWorkers(workersNearby);
    }, [coords, workerData]);


    // * create radious circle
``
    let radius= 5
    useEffect(() => {
        if (mapRef.current) {
            new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: mapRef.current, // Pass mapRef.current directly
                center: { lat: coords.latitude, lng: coords.longitude },
                radius: radius * 1000, // Convert radius to meters
            });
        }
    }, [coords, radius]);

    // * zoomIn and zoomout function
    const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 1, 20)); //* Max zoom level
    const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 1, 0)); //* Min zoom level

    return (
        <APIProvider apiKey={GOOGLE_API || ''}>
            <div className='relative' style={{ height: "70vh", width: "100%" }}>
                {/* Zoom Controls */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                    <button onClick={handleZoomIn} style={zoomButtonStyles}>+</button>
                    <button onClick={handleZoomOut} style={zoomButtonStyles}>-</button>
                </div>
                
                {/* Map component */}
                <Map zoom={zoom} center={userPosition} mapId={Map_ID}>
                    <AdvancedMarker position={userPosition} onClick={() => setOpen(true)}>
                        <Pin background={'blue'} borderColor={'blue'} glyphColor={"white"} />
                    </AdvancedMarker>

                    {/* Markers for Nearby Workers */}
                    <Markers points={nearbyWorkers} />
                    
                    {/* InfoWindow that opens on User marker click */}
                    {open && (
                        <InfoWindow position={userPosition} onCloseClick={() => setOpen(false)}>
                            <div>
                                <h2>Your Location</h2>
                                <button 
                                    onClick={() => setOpen(false)} 
                                    style={{
                                        padding: '5px 10px', 
                                        backgroundColor: 'red', 
                                        color: 'white', 
                                        borderRadius: '5px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}

// Styles for zoom buttons
const zoomButtonStyles = {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer'
};

type Props = { points: Point[] };

const Markers = ({ points }: Props) => {
    return (
        <>
            {points.map((point) => (
                <AdvancedMarker position={{ lat: point.latitude, lng: point.longitude }} key={point._id}>
                    <Pin background={'grey'} borderColor={'green'} glyphColor={"black"} />
                </AdvancedMarker>
            ))}
        </>
    );
};

// * Find nearby workers using the Haversine formula
const FindNearByWorkers = (coords: CoordsTypes, workerData: workerDetailsWithlatlon[]) => {
    console.log(`FindNearByWokers`)
    console.log(workerData)
    function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const toRadians = (degree: number) => (degree * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers
      
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lat2 - lon1);
      
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        return R * c; // Distance in kilometers
    }
      
    // Example Usage:
    const targetLatitude = coords?.latitude;
    const targetLongitude = coords?.longitude;
    const maxDistance = 7183; // Distance in km
      
    const nearbyWorkers = workerData?.filter((worker: workerDetailsWithlatlon) => {
        const distance = haversineDistance(
          targetLatitude,
          targetLongitude,
          worker?.latitude || 0,
          worker?.longitude || 0
        );
        console.log("distance",distance)
        
        return distance <= maxDistance;
    });

   
    console.log('Nearby Workers:', nearbyWorkers); 
    return nearbyWorkers;
}

