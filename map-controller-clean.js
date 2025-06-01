/**
 * Map Controller
 * Handles all map-related functionality including initialization, marker placement, and location updates
 */
class MapController {
    constructor() {
        this.map = null;
        this.marker = null;
        this.currentLocation = {
            lat: 33.8815, // Default center of Gabès, Tunisia
            lng: 10.0982
        };
        this.accuracyCircle = null;
        this.confidenceRadius = 500; // Default radius in meters
    }

    /**
     * Initialize the map with default location
     */
    initMap() {
        // Initialize map centered on Gabès
        this.map = L.map('map-container').setView([this.currentLocation.lat, this.currentLocation.lng], 14);
        
        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Add custom marker with Gabès styling for current location
        const gabesIcon = L.divIcon({
            className: 'gabes-marker',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        
        this.marker = L.marker([this.currentLocation.lat, this.currentLocation.lng], {
            draggable: true,
            icon: gabesIcon,
            title: "Your Location"
        }).addTo(this.map);
        
        // Add circle to show confidence radius with Gabès styling
        this.accuracyCircle = L.circle([this.currentLocation.lat, this.currentLocation.lng], {
            radius: this.confidenceRadius,
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.2
        }).addTo(this.map);
        
        // Add key Gabès landmarks to help with orientation
        this.addGabesLandmarks();
        
        // Setup marker drag events
        this.setupMarkerDragEvents();
        
        // Setup map click events
        this.setupMapClickEvents();
    }

    /**
     * Adds key landmarks in Gabès to help with location recognition
     */
    addGabesLandmarks() {
        // Create landmark icon
        const landmarkIcon = L.divIcon({
            className: 'gabes-landmark',
            iconSize: [10, 10],
            iconAnchor: [5, 5]
        });
        
        // Define important landmarks in Gabès
        const landmarks = [
            { name: "Gabès Central Market", lat: 33.8881, lng: 10.0986 },
            { name: "Université de Gabès", lat: 33.8769, lng: 10.0950 },
            { name: "Chenini Oasis", lat: 33.8950, lng: 10.1022 },
            { name: "Corniche Beach", lat: 33.8812, lng: 10.1153 },
            { name: "Gabès Hospital", lat: 33.8823, lng: 10.0921 },
            { name: "Grand Mosque of Gabès", lat: 33.8857, lng: 10.0982 },
            { name: "Gabès Industrial Zone", lat: 33.9056, lng: 10.0789 },
            { name: "Mtorech", lat: 33.8631, lng: 10.0865 },
            { name: "Jara", lat: 33.8942, lng: 10.1073 }
        ];
        
        // Add landmark markers to the map
        landmarks.forEach(landmark => {
            L.marker([landmark.lat, landmark.lng], {
                icon: landmarkIcon
            }).addTo(this.map)
              .bindTooltip(landmark.name, {
                  permanent: false,
                  direction: 'top',
                  className: 'gabes-tooltip'
              });
        });
    }

    /**
     * Setup event handlers for marker dragging
     */
    setupMarkerDragEvents() {
        this.marker.on('dragend', (event) => {
            const marker = event.target;
            const position = marker.getLatLng();
            
            // Update the marker and circle positions
            this.updateLocation(position.lat, position.lng, this.confidenceRadius);
            
            // Trigger a custom event for the app to handle
            const customEvent = new CustomEvent('location:manual-update', {
                detail: {
                    lat: position.lat,
                    lng: position.lng,
                    accuracy: this.confidenceRadius,
                    source: 'user-drag'
                }
            });
            document.dispatchEvent(customEvent);
        });
    }

    /**
     * Setup event handlers for map clicking
     */
    setupMapClickEvents() {
        this.map.on('click', (event) => {
            const position = event.latlng;
            
            // Update the marker and circle positions
            this.updateLocation(position.lat, position.lng, this.confidenceRadius);
            
            // Trigger a custom event for the app to handle
            const customEvent = new CustomEvent('location:manual-update', {
                detail: {
                    lat: position.lat,
                    lng: position.lng,
                    accuracy: this.confidenceRadius,
                    source: 'map-click'
                }
            });
            document.dispatchEvent(customEvent);
        });
    }

    /**
     * Update the location and accuracy circle on the map
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} radius - Accuracy radius in meters
     * @param {boolean} panTo - Whether to pan the map to the new location
     */
    updateLocation(lat, lng, radius, panTo = true) {
        // Update the current location
        this.currentLocation.lat = lat;
        this.currentLocation.lng = lng;
        
        // Update the confidence radius
        this.confidenceRadius = radius;
        
        // Update the marker position
        this.marker.setLatLng([lat, lng]);
        
        // Update the accuracy circle
        this.accuracyCircle.setLatLng([lat, lng]);
        this.accuracyCircle.setRadius(radius);
        
        // Pan the map to the new location if requested
        if (panTo) {
            this.map.panTo([lat, lng]);
        }
    }

    /**
     * Update the location and accuracy based on confidence score
     * @param {object} location - Location object with lat and lng
     * @param {number} confidenceScore - Confidence score from 0 to 100
     */
    updateLocationByConfidence(location, confidenceScore) {
        // Calculate radius based on confidence (lower confidence = larger radius)
        const radius = this.calculateRadiusByConfidence(confidenceScore);
        
        // Update the location with the new radius
        this.updateLocation(location.lat, location.lng, radius);
    }

    /**
     * Update the confidence radius based on confidence score
     * @param {number} confidence - Confidence score from 0 to 100
     */
    updateConfidenceRadius(confidence) {
        // Update the confidence radius based on confidence score (0-100)
        // Lower confidence = larger radius
        let newRadius;
        let confidenceClass;
        
        if (confidence < 30) {
            newRadius = 800; // Low confidence - large radius
            confidenceClass = 'low';
        } else if (confidence < 60) {
            newRadius = 400; // Medium confidence
            confidenceClass = 'medium';
        } else if (confidence < 90) {
            newRadius = 200; // High confidence
            confidenceClass = 'high';
        } else {
            newRadius = 50; // Very high confidence - small radius
            confidenceClass = 'high';
        }
        
        // Update confidence level visual indicator
        const confidenceEl = document.querySelector('.confidence-level');
        if (confidenceEl) {
            confidenceEl.classList.remove('low', 'medium', 'high');
            confidenceEl.classList.add(confidenceClass);
        }
        
        this.confidenceRadius = newRadius;
        this.accuracyCircle.setRadius(newRadius);
    }

    /**
     * Calculate the radius based on confidence score
     * @param {number} confidenceScore - Confidence score from 0 to 100
     * @returns {number} Radius in meters
     */
    calculateRadiusByConfidence(confidenceScore) {
        // Convert confidence score to a radius
        // High confidence (100) = 20m radius
        // Low confidence (0) = 1000m radius
        return 1000 - (confidenceScore / 100 * 980);
    }

    /**
     * Get the current location information
     * @returns {object} Location and accuracy information
     */
    getCurrentLocation() {
        return {
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
            accuracy: this.confidenceRadius
        };
    }
}

// Create global instance
const mapController = new MapController();
