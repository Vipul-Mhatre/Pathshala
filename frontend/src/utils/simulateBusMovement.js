// This is for testing purposes only
export const updateBusLocation = async (busId) => {
  try {
    // Generate random movement within India
    const lat = 20.5937 + (Math.random() - 0.5) * 10;
    const lon = 78.9629 + (Math.random() - 0.5) * 10;
    
    await axios.put(`/buses/${busId}/location`, { lat, lon });
  } catch (error) {
    console.error('Error updating bus location:', error);
  }
}; 