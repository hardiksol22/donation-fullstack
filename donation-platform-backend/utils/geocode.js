// utils/geocode.js

/**
 * Converts a text address into Latitude and Longitude using OpenStreetMap API (Free)
 * @param {string} address - The pickup address provided by the donor
 * @returns {Object} - An object containing { lat, lng }
 */
const geocodeAddress = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    
    // OpenStreetMap Nominatim API strictly requires a User-Agent header
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`, {
      headers: {
        'User-Agent': 'DaanSetu-DonationPlatform/1.0'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    } else {
      // Agar address thik se map par nahi mila, toh default location return karein
      console.warn(`Address not found: ${address}. Using default Vadodara coordinates.`);
      return {
        lat: 22.3072, // Vadodara Latitude 
        lng: 73.1812  // Vadodara Longitude
      };
    }
  } catch (error) {
    console.error('Geocoding API Error:', error.message);
    // Error aane par server crash na ho, isliye default fallback coordinates return karte hain
    return {
      lat: 22.3072,
      lng: 73.1812
    };
  }
};

module.exports = geocodeAddress;