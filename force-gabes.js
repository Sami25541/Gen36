/**
 * Force Gabès Map Center
 * This script ensures the map is always centered on Gabès regardless of other settings
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait for map to be initialized
    setTimeout(function() {
        // Check if map controller exists
        if (typeof mapController !== 'undefined' && mapController.map) {
            console.log("Forcing map center to Gabès, Tunisia");
            
            // Gabès coordinates from landmarks-data.js
            const gabesLat = 33.8815;
            const gabesLng = 10.0982;
            
            // Force center map on Gabès
            mapController.map.setView([gabesLat, gabesLng], 14);
            
            // Update marker position
            if (mapController.marker) {
                mapController.marker.setLatLng([gabesLat, gabesLng]);
            }
            
            // Update accuracy circle
            if (mapController.accuracyCircle) {
                mapController.accuracyCircle.setLatLng([gabesLat, gabesLng]);
            }
            
            console.log("Map centered on Gabès successfully");
        } else {
            console.error("Map controller not found or not initialized");
        }
    }, 500); // Wait 500ms to ensure map is loaded
});
