/**
 * E-commerce Checkout with Location AI Assistant
 * Assists customers with informal address verification in Tunisia
 */
document.addEventListener('DOMContentLoaded', () => {
    // Checkout Form Elements
    const checkoutForm = document.getElementById('checkout-form');
    const fullnameInput = document.getElementById('fullname');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const addressTextarea = document.getElementById('address');
    const verifyAddressBtn = document.getElementById('verify-address-btn');
    const verificationStatus = document.getElementById('verification-status');
    const continueToPaymentBtn = document.getElementById('continue-to-payment');
    const backToCartBtn = document.getElementById('back-to-cart');
    
    // Disable the continue to payment button initially
    continueToPaymentBtn.disabled = true;
    
    // Location Modal Elements
    const locationModal = document.getElementById('location-modal');
    const closeLocationModal = locationModal.querySelector('.close-modal');
    const cancelVerificationBtn = document.getElementById('cancel-verification');
    const confirmAddressBtn = document.getElementById('confirm-address');
    const modalVerificationStatus = document.getElementById('modal-verification-status');
    const aiStatusMessage = document.getElementById('ai-status-message');
    
    // Chat and Map Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const photoBtn = document.getElementById('photo-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const confidenceLevel = document.getElementById('confidence-level');
    const confidencePercentage = document.getElementById('confidence-percentage');
    
    // Photo Modal Elements
    const photoModal = document.getElementById('photo-modal');
    const closePhotoModal = photoModal.querySelector('.close-modal');
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const uploadPhotoBtn = document.getElementById('upload-photo-btn');
    
    // Location Details Elements
    const areaValue = document.getElementById('area-value');
    const landmarksValue = document.getElementById('landmarks-value');
    const directionsValue = document.getElementById('directions-value')

    // Initialize AI assistant and map when needed (not immediately)
    let mapInitialized = false;
    let locationAssistant = null;
    
    // Function to initialize the map and AI assistant when needed
    function initializeMapAndAI() {
        if (!mapInitialized) {
            mapController.initMap();
            locationAssistant = new LocationAIAssistant();
            mapInitialized = true;
        }
    }
    
    // Checkout Form Event Listeners
    verifyAddressBtn.addEventListener('click', handleAddressVerification);
    continueToPaymentBtn.addEventListener('click', () => alert('Proceeding to payment...'));
    backToCartBtn.addEventListener('click', () => alert('Returning to cart...'));
    
    // Location Modal Event Listeners
    closeLocationModal.addEventListener('click', () => locationModal.style.display = 'none');
    cancelVerificationBtn.addEventListener('click', () => locationModal.style.display = 'none');
    confirmAddressBtn.addEventListener('click', handleConfirmVerifiedAddress);
    
    // Chat and Map Event Listeners
    sendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSend();
        }
    });
    
    voiceBtn.addEventListener('click', handleVoiceInput);
    photoBtn.addEventListener('click', handlePhotoButton);
    confirmBtn.addEventListener('click', handleLocationConfirmation);
    
    // Photo Modal Event Listeners
    closePhotoModal.addEventListener('click', () => photoModal.style.display = 'none');
    photoUpload.addEventListener('change', handlePhotoUpload);
    uploadPhotoBtn.addEventListener('click', handlePhotoSubmit);

    // Listen for manual location updates from the map
    document.addEventListener('location:manual-update', handleMapLocationUpdate);

    /**
     * Handle address verification button click
     * This is the entry point when a customer wants to verify their address
     */
    function handleAddressVerification() {
        const addressText = addressTextarea.value.trim();
        
        if (addressText.length === 0) {
            alert('Please enter a delivery address before verification.');
            return;
        }
        
        // Show the location verification modal
        locationModal.style.display = 'block';
        
        // Initialize the map and AI assistant if not already done
        initializeMapAndAI();
        
        // Clear previous chat messages
        chatMessages.innerHTML = '';
        
        // Show AI status message
        aiStatusMessage.classList.remove('hidden');
        
        // Set initial confidence to 0
        updateConfidenceDisplay(0);
        
        // Check if the address seems precise or needs AI assistance
        const addressPrecision = checkAddressPrecision(addressText);
        
        // Add initial message to chat
        if (addressPrecision.needsAssistance) {
            // Address needs AI assistant help
            const response = locationAssistant.processInitialLocation(addressText);
            
            // Update the UI with AI response
            updateUI(response);
            
            // Update the map
            mapController.updateLocationByConfidence(response.location, response.confidence);
            
            // Update modal status
            updateVerificationStatus('pending', 'Our AI assistant is helping locate your address');
        } else {
            // Address seems precise enough
            addMessageToChat('assistant', 'Your address seems clear, but I can help you verify it on the map. Is the location correct?');
            
            // Set a higher initial confidence
            locationAssistant.confidenceScore = 70;
            updateConfidenceDisplay(70);
            
            // Try to place the marker based on the address
            const tunisiaCoordinates = {lat: 36.8065, lng: 10.1815}; // Default to Tunisia if no match
            mapController.updateLocationByConfidence(tunisiaCoordinates, 70);
            
            // Update modal status
            updateVerificationStatus('pending', 'Please confirm if this location is correct');
        }
        
        // Hide AI status message after processing
        setTimeout(() => {
            aiStatusMessage.classList.add('hidden');
        }, 1500);
    }
    
    /**
     * Check if an address needs AI assistance
     * @param {string} address - The address text
     * @returns {object} Result indicating if assistance is needed
     */
    function checkAddressPrecision(address) {
        // This is a simulated function that would normally use NLP
        // to determine if an address is precise enough
        
        // For demo purposes, we'll check for certain markers of informal addresses
        const addressLower = address.toLowerCase();
        
        // Check for imprecise language patterns
        const imprecisePatterns = [
            'near', 'close to', 'by the', 'next to', 'opposite', 'around',
            'behind', 'in front of', 'left of', 'right of', 'across from',
            'neighborhood', 'area', 'quarter', 'douar', 'village',
            'mosque', 'market', 'school', 'café', 'shop',
            'turn left', 'turn right', 'follow the road'
        ];
        
        // Check if the address contains any of these patterns
        const hasImprecisePattern = imprecisePatterns.some(pattern => addressLower.includes(pattern));
        
        // Check if the address is too short
        const isTooShort = address.length < 20;
        
        // Check if the address lacks postal code format (varies by country)
        const hasPostalCode = /\d{4,5}/.test(address);
        
        // Determine if assistance is needed
        const needsAssistance = hasImprecisePattern || isTooShort || !hasPostalCode;
        
        return {
            needsAssistance,
            hasImprecisePattern,
            isTooShort,
            hasPostalCode
        };
    }

    /**
     * Handle chat input send button
     */
    function handleChatSend() {
        const userResponse = chatInput.value.trim();
        
        if (userResponse.length === 0) {
            return;
        }
        
        // Add user message to the chat
        addMessageToChat('user', userResponse);
        
        // Process the user's response
        const response = locationAssistant.processUserResponse(userResponse);
        
        // Update the UI
        updateUI(response);
        
        // Update the map
        mapController.updateLocationByConfidence(response.location, response.confidence);
        
        // Enable confirmation button if confidence is high enough
        if (locationAssistant.confidenceScore >= 80) {
            confirmAddressBtn.disabled = false;
        }
        
        // Clear the chat input
        chatInput.value = '';
    }
    
    /**
     * Handle confirming the verified address
     * This transfers the verified address back to the checkout form
     */
    function handleConfirmVerifiedAddress() {
        // Get the extracted location details
        const details = locationAssistant.extractedDetails;
        
        // Format the verified address
        let verifiedAddress = '';
        
        if (details.area) {
            verifiedAddress += details.area;
        }
        
        if (details.landmarks && details.landmarks.length > 0) {
            verifiedAddress += (verifiedAddress ? ', near ' : 'Near ') + details.landmarks.join(' and ');
        }
        
        if (details.directions) {
            verifiedAddress += (verifiedAddress ? ', ' : '') + details.directions;
        }
        
        if (details.houseDescription) {
            verifiedAddress += (verifiedAddress ? '. ' : '') + 'Building description: ' + details.houseDescription;
        }
        
        // Update the textarea with the verified address
        addressTextarea.value = verifiedAddress;
        
        // Update the verification status on the main form
        const verificationStatusElement = document.getElementById('verification-status');
        verificationStatusElement.className = 'verified';
        verificationStatusElement.innerHTML = '<span class="status-icon">✓</span><span class="status-text">Address verified</span>';
        
        // Enable continue to payment button
        continueToPaymentBtn.disabled = false;
        
        // Close the modal
        locationModal.style.display = 'none';
    }

    /**
     * Handle voice input button click
     */
    function handleVoiceInput() {
        // In a real app, this would use the Web Speech API
        alert('Voice input is not implemented in this demo. In a full app, this would activate your microphone.');
    }

    /**
     * Handle photo button click
     */
    function handlePhotoButton() {
        // Show the photo modal
        photoModal.style.display = 'flex';
    }

    /**
     * Handle photo upload
     */
    function handlePhotoUpload(e) {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        }
    }

    /**
     * Handle photo submit
     */
    function handlePhotoSubmit() {
        // In a real app, this would use computer vision to analyze the photo
        // For this demo, we'll simulate photo analysis and extract potential location data
        
        // Simulate extracting location from the photo (this would use AI in a real app)
        simulatePhotoAnalysis();
        
        // Update the confidence display
        updateConfidenceDisplay(locationAssistant.confidenceScore);
        
        // Close the modal
        photoModal.style.display = 'none';
        
        // Clear the preview
        photoPreview.src = '';
        photoPreview.style.display = 'none';
        photoUpload.value = '';
    }
    
    /**
     * Simulate photo analysis using AI computer vision
     * In a real app, this would use a service like Google Cloud Vision or Azure Computer Vision
     */
    function simulatePhotoAnalysis() {
        // In a real implementation, we would extract landmarks, text, and other visual elements
        
        // Randomly select a common structure type that might be in the photo
        const structureTypes = ['building', 'house', 'street sign', 'storefront', 'mosque', 'school'];
        const randomStructure = structureTypes[Math.floor(Math.random() * structureTypes.length)];
        
        // Randomly determine the photo quality
        const photoQuality = Math.random();
        let confidenceBoost = 0;
        let message = '';
        
        if (photoQuality > 0.7) {
            // High quality photo simulation
            confidenceBoost = 15;
            
            if (!locationAssistant.currentRegion && locationAssistant.extractedDetails.area === null) {
                // If we don't have a region yet, try to detect one from the "photo"
                const regions = LANDMARKS_DATA.regions;
                const randomRegion = regions[Math.floor(Math.random() * regions.length)];
                
                locationAssistant.currentRegion = randomRegion;
                locationAssistant.extractedDetails.area = randomRegion.name;
                
                message = `Thanks for the photo! I can see this is in ${randomRegion.name}. I can also identify what looks like a ${randomStructure} in the image.`;
            } else {
                message = `Thanks for the photo! I can clearly see the ${randomStructure} you mentioned. This helps me locate you more precisely.`;
            }
            
            // If we don't have a house description yet, add one based on the photo
            if (!locationAssistant.extractedDetails.houseDescription) {
                const colors = ['white', 'blue', 'beige', 'yellow', 'green'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                locationAssistant.extractedDetails.houseDescription = `A ${randomColor} ${randomStructure}`;
            }
        } else if (photoQuality > 0.4) {
            // Medium quality photo simulation
            confidenceBoost = 10;
            message = `I can see the photo, but some details aren't clear. I can make out what appears to be a ${randomStructure}. Could you provide more details about your surroundings?`;
        } else {
            // Low quality photo simulation
            confidenceBoost = 5;
            message = "I received your photo, but it's a bit unclear. Could you describe what you were trying to show in the image?";
        }
        
        // Update the confidence score
        locationAssistant.confidenceScore += confidenceBoost;
        if (locationAssistant.confidenceScore > 100) {
            locationAssistant.confidenceScore = 100;
        }
        
        // Update the map if we have a region
        if (locationAssistant.currentRegion) {
            mapController.updateLocationByConfidence(
                { lat: locationAssistant.currentRegion.latitude, lng: locationAssistant.currentRegion.longitude },
                locationAssistant.confidenceScore
            );
        }
        
        // Add a message to the chat
        addMessageToChat('assistant', message);
        
        // Update location details
        updateLocationDetails(locationAssistant.extractedDetails);
    }

    /**
     * Handle location confirmation button click
     * This is used within the verification modal to confirm the current location
     */
    function handleLocationConfirmation() {
        // Set max confidence when location is manually confirmed
        locationAssistant.confidenceScore = 100;
        updateConfidenceDisplay(100);
        
        // Add a message to the chat
        addMessageToChat('assistant', "Great! I've confirmed your location. Click 'Use This Address' to continue with your order.");
        
        // Enable the confirm address button
        confirmAddressBtn.disabled = false;
        
        // Update verification status
        updateVerificationStatus('verified', 'Address has been verified');
    }

    /**
     * Handle manual location updates from the map
     */
    function handleMapLocationUpdate(event) {
        // Update confidence when user manually moves the marker
        locationAssistant.confidenceScore += 5;
        
        if (locationAssistant.confidenceScore > 100) {
            locationAssistant.confidenceScore = 100;
        }
        
        updateConfidenceDisplay(locationAssistant.confidenceScore);
        
        // Enable confirmation button if confidence is high enough
        if (locationAssistant.confidenceScore >= 80) {
            confirmAddressBtn.disabled = false;
        }
        
        // Add a message about the manual adjustment
        addMessageToChat('assistant', "I see you've adjusted the location on the map. Is this position more accurate?");
    }
    
    /**
     * Update the verification status in the modal
     * @param {string} status - Status type ('pending', 'verified', or 'failed')
     * @param {string} message - Status message to display
     */
    function updateVerificationStatus(status, message) {
        // Update the modal verification status
        modalVerificationStatus.className = status;
        modalVerificationStatus.innerHTML = `
            <span class="status-icon">${status === 'verified' ? '✓' : status === 'failed' ? '✗' : '?'}</span>
            <span class="status-text">${message}</span>
        `;
    }
    
    /**
     * Add a message to the chat
     * @param {string} role - 'user' or 'assistant'
     * @param {string} content - Message content
     */
    function addMessageToChat(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Update the UI with the AI response
     * @param {object} response - Response from the AI assistant
     */
    function updateUI(response) {
        // Add the AI message to the chat
        addMessageToChat('assistant', response.message);
        
        // Update the confidence display
        updateConfidenceDisplay(response.confidence);
        
        // Update the location details panel
        updateLocationDetails(response.extractedDetails);
    }

    /**
     * Update the confidence display
     * @param {number} confidence - Confidence score from 0 to 100
     */
    function updateConfidenceDisplay(confidence) {
        // Update the confidence level display
        confidenceLevel.style.width = `${confidence}%`;
        confidencePercentage.textContent = `${Math.round(confidence)}%`;
        
        // Update the color based on confidence
        if (confidence < 33) {
            confidenceLevel.style.backgroundColor = '#e74c3c'; // Red
        } else if (confidence < 66) {
            confidenceLevel.style.backgroundColor = '#f39c12'; // Orange
        } else {
            confidenceLevel.style.backgroundColor = '#2ecc71'; // Green
        }
    }

    /**
     * Update the location details panel
     * @param {object} details - Extracted location details
     */
    function updateLocationDetails(details) {
        areaValue.textContent = details.area || '--';
        landmarksValue.textContent = details.landmarks.length > 0 
            ? details.landmarks.join(', ') 
            : '--';
        directionsValue.textContent = details.directions || '--';
    }
});
