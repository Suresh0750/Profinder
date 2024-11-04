
type Coordinates = {
    latitude: number;
    longitude: number;
};


// * Find nearby workers using the Haversine formula
// const FindNearByWorkers = (coords: CoordsTypes, workerData: workerDetailsWithlatlon[]) => {
    export const FindNearByWorkers = (coords: Coordinates, workerData: any) => {       
        // * Haversine distance calculation
        function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
            const toRadians = (degree: number) => (degree * Math.PI) / 180;
            const R = 6371; // Radius of the Earth in kilometers
          
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
          
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
          
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          
            return R * c; // Distance in kilometers
        }
          
        // * Extract target coordinates from input
        const targetLatitude = coords?.latitude;
        const targetLongitude = coords?.longitude;
        const maxDistance = 25; // Distance in km
          
        // * Filter workers by distance
        const nearbyWorkers = workerData?.filter((worker: any) => {
            if (!worker?.latitude || !worker?.longitude) return false; // Check if worker coordinates are valid
            
            const distance = haversineDistance(
                11.0128646,
                76.9654417,
              worker?.latitude,
              worker?.longitude
            );
            // console.log("Distance to worker:", distance, "km");
            
            return distance <= maxDistance; // Only include workers within 25km
        });
    
        // console.log('Nearby Workers:', nearbyWorkers); 
        return nearbyWorkers;
    }
    
