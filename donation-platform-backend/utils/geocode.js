const axios = require('axios');

/**
 * Converts a raw address string into latitude and longitude coordinates.
 * Note: Requires a Google Maps API Key or similar service in your .env file.
 */
const geocodeAddress = async (address) => {
  try {
    // Example using Google Maps Geocoding API
    const apiKey = process.env.MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Maps API Key is missing. Skipping geocoding.');
      return { lat: null, lng: null };
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: apiKey,
      },
    });

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return { lat: null, lng: null };
  }
};

module.exports = geocodeAddress;