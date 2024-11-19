

import axios from 'axios'
import {WorkerInformation} from '../../domain/entities/worker'

export const GeoCoding = async (workerData:any)=>{
  // console.log(`Request reached Geocoding`)
  
const {country,postalCode,state,city,streetAddress}: WorkerInformation = workerData
// * Construct the full address
const fullAddress = `${city}, ${state}, ${postalCode}, ${country}`;

const encodedAddress = encodeURIComponent(fullAddress);

// * Construct the Nominatim API URL
const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json`;

try {
  const response :any= await axios.get(apiUrl)
  if (response?.data?.length > 0) {
    const location = response?.data[0];
    // console.log(`Latitude: ${location?.lat}, Longitude: ${location?.lon}`);
    return location
  } else {
    // console.error('No results found');
    return false
  }
  
} catch (error) {
  console.log(`Error from Geodecoding`,error)
}
}
