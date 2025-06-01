/**
 * AI Assistant for Location Intelligence
 * Simulates AI conversation and location inference for informal addresses
 */
class LocationAIAssistant {
    constructor() {
        this.confidenceScore = 0;
        this.currentRegion = null;
        this.currentLandmark = null;
        this.extractedDetails = {
            area: null,
            landmarks: [],
            directions: null,
            houseDescription: null
        };
        this.conversationState = 'initial';
        this.conversationFlow = [
            'initial',
            'region_confirmation',
            'landmark_identification',
            'directional_refinement',
            'house_description',
            'confirmation'
        ];
        this.conversationHistory = [];
    }

    /**
     * Process the initial location description and extract entities
     * @param {string} locationText - User's description of their location
     * @returns {object} Response and location data
     */
    processInitialLocation(locationText) {
        // Store the input
        this.conversationHistory.push({
            role: 'user',
            content: locationText
        });

        // Extract entities from text (in a real app, this would use NLP)
        const extractedEntities = this.extractEntitiesFromText(locationText);
        
        // Update our knowledge based on the extraction
        if (extractedEntities.region) {
            this.currentRegion = extractedEntities.region;
            this.extractedDetails.area = extractedEntities.region.name;
            this.confidenceScore += 20;
        }
        
        if (extractedEntities.landmark) {
            this.currentLandmark = extractedEntities.landmark;
            this.extractedDetails.landmarks.push(extractedEntities.landmark.name);
            this.confidenceScore += 20;
        }
        
        if (extractedEntities.direction) {
            this.extractedDetails.directions = extractedEntities.direction;
            this.confidenceScore += 15;
        }

        // Move conversation state forward
        this.advanceConversationState();
        
        // Generate response based on the new state
        const response = this.generateResponse();
        
        // Store the assistant's response
        this.conversationHistory.push({
            role: 'assistant',
            content: response.message
        });
        
        return {
            message: response.message,
            confidence: this.confidenceScore,
            location: this.getMapLocation(),
            extractedDetails: this.extractedDetails,
            nextQuestion: response.nextQuestion
        };
    }

    /**
     * Process user's response to AI questions
     * @param {string} userResponse - User's text response
     * @returns {object} Updated response and location data
     */
    processUserResponse(userResponse) {
        // Store the input
        this.conversationHistory.push({
            role: 'user',
            content: userResponse
        });

        // Extract new information based on current conversation state
        const extractedInfo = this.extractInfoBasedOnState(userResponse);
        
        // Update confidence based on the quality of the answer
        if (extractedInfo.useful) {
            this.confidenceScore += extractedInfo.confidenceBoost;
            
            // Ensure we don't exceed 100%
            if (this.confidenceScore > 100) {
                this.confidenceScore = 100;
            }
        }
        
        // Move conversation state forward if appropriate
        if (extractedInfo.canAdvance) {
            this.advanceConversationState();
        }
        
        // Generate response based on the new state
        const response = this.generateResponse();
        
        // Store the assistant's response
        this.conversationHistory.push({
            role: 'assistant',
            content: response.message
        });
        
        return {
            message: response.message,
            confidence: this.confidenceScore,
            location: this.getMapLocation(),
            extractedDetails: this.extractedDetails,
            nextQuestion: response.nextQuestion
        };
    }

    /**
     * Extract entities from text using improved location matching
     * @param {string} text - User's input text
     * @returns {object} Extracted entities
     */
    extractEntitiesFromText(text) {
        // Normalize text for better matching (lowercase, remove extra spaces)
        const normalizedText = text.toLowerCase().trim().replace(/\s+/g, ' ');
        
        // Initialize extraction results
        const extraction = {
            region: null,
            landmark: null,
            direction: null,
            houseDescription: null,
            confidence: 0
        };
        
        // Check for Gabès-specific spellings and variations
        const gabesVariations = ['gabes', 'gabès', 'gabés', 'قابس', 'gabes ville', 'gabès ville', 'مدينة قابس'];
        let isGabesCity = false;
        
        for (const variation of gabesVariations) {
            if (normalizedText.includes(variation)) {
                isGabesCity = true;
                break;
            }
        }
        
        // Check for common Gabès neighborhoods
        const gabesNeighborhoods = {
            'chenini': 'Chenini Gabès',
            'شنني': 'Chenini Gabès',
            'corniche': 'Corniche Gabès',
            'كورنيش': 'Corniche Gabès',
            'ghannouch': 'Ghannouch',
            'غنوش': 'Ghannouch',
            'jara': 'Jara',
            'جارة': 'Jara',
            'mtorech': 'Mtorech',
            'مطريش': 'Mtorech'
        };
        
        // Extract regions (cities, neighborhoods, etc.)
        if (isGabesCity) {
            // If any variation of Gabès is mentioned, prioritize finding that region
            for (const region of LANDMARKS_DATA.regions) {
                if (region.name.toLowerCase() === 'gabès') {
                    extraction.region = region;
                    break;
                }
            }
        } else {
            // Check for specific Gabès neighborhoods
            let foundNeighborhood = false;
            for (const [key, value] of Object.entries(gabesNeighborhoods)) {
                if (normalizedText.includes(key)) {
                    for (const region of LANDMARKS_DATA.regions) {
                        if (region.name === value) {
                            extraction.region = region;
                            foundNeighborhood = true;
                            break;
                        }
                    }
                    if (foundNeighborhood) break;
                }
            }
            
            // If no Gabès neighborhood was found, check other regions
            if (!foundNeighborhood) {
                for (const region of LANDMARKS_DATA.regions) {
                    const regionName = region.name.toLowerCase();
                    if (normalizedText.includes(regionName)) {
                        extraction.region = region;
                        break;
                    }
                }
            }
        }
        
        // Extract landmarks with improved matching for Gabès landmarks
        const gabesLandmarks = [
            'central market', 'marché central', 'سوق مركزي',
            'university', 'université', 'جامعة',
            'oasis', 'واحة',
            'beach', 'plage', 'شاطئ',
            'hospital', 'hôpital', 'مستشفى',
            'mosque', 'mosquée', 'جامع', 'مسجد',
            'industrial zone', 'zone industrielle', 'منطقة صناعية'
        ];
        
        // First check if any common landmark terms are in the text
        let potentialLandmarkReference = false;
        for (const term of gabesLandmarks) {
            if (normalizedText.includes(term)) {
                potentialLandmarkReference = true;
                break;
            }
        }
        
        // If we found a potential landmark, prioritize Gabès landmarks if the context is about Gabès
        if (potentialLandmarkReference && (isGabesCity || (extraction.region && extraction.region.name.includes('Gabès')))) {
            for (const landmark of LANDMARKS_DATA.landmarks) {
                if (landmark.region && landmark.region.includes('Gabès')) {
                    const landmarkName = landmark.name.toLowerCase();
                    if (normalizedText.includes(landmarkName)) {
                        extraction.landmark = landmark;
                        break;
                    }
                }
            }
        }
        
        // If no Gabès-specific landmark was found, check all landmarks
        if (!extraction.landmark) {
            for (const landmark of LANDMARKS_DATA.landmarks) {
                const landmarkName = landmark.name.toLowerCase();
                if (normalizedText.includes(landmarkName)) {
                    extraction.landmark = landmark;
                    break;
                }
            }
        }
        
        // Extract directional terms with improved support for Tunisian Arabic
        for (const term of LANDMARKS_DATA.directionalTerms) {
            if (normalizedText.includes(term.term.toLowerCase()) || 
                normalizedText.includes(term.english.toLowerCase())) {
                extraction.direction = term.english;
                break;
            }
        }
        
        // Extract potential house descriptions (enhanced version)
        // Look for phrases that might describe a building
        const houseDescriptionPatterns = [
            /(?:house|building|apartment)\s+(?:is|with|has)?\s+(\w+)/i,
            /(\w+)\s+(?:house|building|apartment|home)/i,
            /(?:maison|appartement|immeuble)\s+(?:est|avec|a)?\s+(\w+)/i,
            /(?:دار|منزل|عمارة)\s+(\w+)/i,
            // Common Tunisian building descriptors
            /(?:villa|houch|résidence|شقة|فيلا|حوش)\s+(\w+)/i
        ];
        
        for (const pattern of houseDescriptionPatterns) {
            const match = normalizedText.match(pattern);
            if (match && match[1]) {
                extraction.houseDescription = match[1];
                break;
            }
        }
        
        // Look for color words which often describe buildings
        const colorWords = ['white', 'blue', 'green', 'red', 'yellow', 'orange', 'black', 'purple', 'pink',
                          'blanc', 'bleu', 'vert', 'rouge', 'jaune', 'noir', 'violet', 'rose',
                          'أبيض', 'أزرق', 'أخضر', 'أحمر', 'أصفر', 'أسود'];
        
        for (const color of colorWords) {
            if (normalizedText.includes(color)) {
                extraction.houseDescription = extraction.houseDescription 
                    ? extraction.houseDescription + ' ' + color 
                    : color;
                break;
            }
        }
        
        return extraction;
    }

    /**
     * Extract information based on the current conversation state
     * @param {string} text - User's response text
     * @returns {object} Extracted information and confidence boost
     */
    extractInfoBasedOnState(text) {
        const textLower = text.toLowerCase();
        const result = {
            useful: false,
            confidenceBoost: 0,
            canAdvance: false
        };
        
        switch (this.conversationState) {
            case 'region_confirmation':
                // Look for yes/no/confirmation about the region
                if (textLower.includes('yes') || textLower.includes('correct') || textLower.includes('right')) {
                    result.useful = true;
                    result.confidenceBoost = 10;
                    result.canAdvance = true;
                } else if (textLower.includes('no') || textLower.includes('not')) {
                    // They said it's wrong, so we need to adjust
                    for (const region of LANDMARKS_DATA.regions) {
                        if (textLower.includes(region.name.toLowerCase())) {
                            this.currentRegion = region;
                            this.extractedDetails.area = region.name;
                            result.useful = true;
                            result.confidenceBoost = 15;
                            result.canAdvance = true;
                            break;
                        }
                    }
                }
                break;
                
            case 'landmark_identification':
                // Look for landmark references
                for (const landmark of LANDMARKS_DATA.landmarks) {
                    if (textLower.includes(landmark.name.toLowerCase())) {
                        this.currentLandmark = landmark;
                        
                        // Check if this landmark is already in our list
                        if (!this.extractedDetails.landmarks.includes(landmark.name)) {
                            this.extractedDetails.landmarks.push(landmark.name);
                        }
                        
                        result.useful = true;
                        result.confidenceBoost = 15;
                        result.canAdvance = true;
                        break;
                    }
                }
                break;
                
            case 'directional_refinement':
                // Look for directional information
                for (const term of LANDMARKS_DATA.directionalTerms) {
                    if (textLower.includes(term.term.toLowerCase()) || textLower.includes(term.english.toLowerCase())) {
                        this.extractedDetails.directions = textLower;
                        result.useful = true;
                        result.confidenceBoost = 15;
                        result.canAdvance = true;
                        break;
                    }
                }
                
                // Even if no directional term was found, see if there's useful info
                if (!result.useful && text.length > 10) {
                    this.extractedDetails.directions = text;
                    result.useful = true;
                    result.confidenceBoost = 10;
                    result.canAdvance = true;
                }
                break;
                
            case 'house_description':
                // Any substantial response is useful for house description
                if (text.length > 5) {
                    this.extractedDetails.houseDescription = text;
                    result.useful = true;
                    result.confidenceBoost = 15;
                    result.canAdvance = true;
                }
                break;
                
            case 'confirmation':
                // Look for final confirmation
                if (textLower.includes('yes') || textLower.includes('correct') || textLower.includes('right')) {
                    result.useful = true;
                    result.confidenceBoost = 10;
                    result.canAdvance = true;
                }
                break;
        }
        
        return result;
    }

    /**
     * Advance the conversation to the next state
     */
    advanceConversationState() {
        const currentIndex = this.conversationFlow.indexOf(this.conversationState);
        if (currentIndex < this.conversationFlow.length - 1) {
            this.conversationState = this.conversationFlow[currentIndex + 1];
        }
    }

    /**
     * Generate appropriate response based on the current state
     * @returns {object} Response message and next question
     */
    generateResponse() {
        let message = "";
        let nextQuestion = "";
        
        // Check if we're in Gabès region for specialized responses
        const isGabesRegion = this.currentRegion && (this.currentRegion.name === 'Gabès' || 
                                                 this.currentRegion.name.includes('Gabès') ||
                                                 this.currentRegion.name === 'Ghannouch');
        
        switch (this.conversationState) {
            case 'initial':
                if (this.currentRegion) {
                    if (isGabesRegion) {
                        // Gabès-specific initial response
                        if (this.currentRegion.name === 'Gabès') {
                            message = `I see you're in Gabès. To help pinpoint your location, please tell me:\n1. Which specific neighborhood or area of Gabès are you in? (Chenini, MTorech, Downtown, Jara, etc.)\n2. Are you closer to the coast or inland?\n3. Are you in the old city (المدينة القديمة) or a newer area?\n4. If you're near a major road or avenue, which one?\n5. What is the nearest mosque, school or large landmark to you?`;
                            nextQuestion = `Which neighborhood or area of Gabès are you in?`;
                        } else {
                            // Already has a specific Gabès neighborhood
                            message = `Great! I see you're in ${this.currentRegion.name}. Are there any notable landmarks near you in ${this.currentRegion.name}?`;
                            nextQuestion = `What landmarks are near your location in ${this.currentRegion.name}?`;
                        }
                    } else {
                        // Standard response for other regions
                        message = `I see you're in ${this.currentRegion.name}. Can you tell me more about your specific neighborhood or area in ${this.currentRegion.name}?`;
                        nextQuestion = `Which part of ${this.currentRegion.name} are you in?`;
                    }
                } else {
                    message = "I need to understand your location better. Could you tell me which city or area you're in? For example, are you in Gabès, Tunis, or another area?";
                    nextQuestion = "Which city or area are you located in?";
                }
                break;
                
            case 'region_confirmation':
                if (this.currentRegion) {
                    if (isGabesRegion) {
                        // Gabès-specific region confirmation
                        const gabesLandmarks = [];
                        
                        // Get relevant landmarks for the specific Gabès region
                        if (this.currentRegion.name === 'Chenini Gabès') {
                            message = `Great! You're in Chenini Gabès. Are you near the Chenini Oasis, or another landmark in this historic area?`;
                        } else if (this.currentRegion.name === 'Corniche Gabès') {
                            message = `Great! You're in the Corniche area of Gabès. Are you near the Corniche Beach, or another place along the coastal area?`;
                        } else if (this.currentRegion.name === 'Ghannouch') {
                            message = `Great! You're in Ghannouch. Are you near the Industrial Zone, or another landmark in this area?`;
                        } else {
                            // General Gabès city
                            message = `Great! You're in Gabès. Are you near any notable landmarks like the Central Market, University, Grand Mosque, Hospital, Corniche Beach, or the new commercial center? If you're in a specific neighborhood, please mention it.`;
                        }
                        
                        nextQuestion = "What landmarks are near your location?";
                    } else {
                        // Standard response for other regions
                        message = `Great! You're in ${this.currentRegion.name}. Are there any notable landmarks near you? For example, are you near a mosque, market, or other well-known place?`;
                        nextQuestion = "What landmarks are near your location?";
                    }
                } else {
                    message = "I still need to understand which area you're in. Could you name your city or a major area nearby?";
                    nextQuestion = "Which city or area are you in?";
                }
                break;
                
            case 'landmark_identification':
                if (this.currentLandmark) {
                    message = `I see you're near ${this.currentLandmark.name}. I need more precision to find you:\n1. Are you directly in front of it (قدام), behind it (ورا), to its right (على اليمين), or to its left (على اليسار)?\n2. Approximately how far are you from it? (very close, about a block away, etc.)\n3. Is there anything between you and this landmark? (a street, another building, etc.)\n4. If you're not directly next to it, what would you pass on the way from the landmark to your location?`;
                    nextQuestion = `What is your location relative to ${this.currentLandmark.name}?`;
                } else if (isGabesRegion) {
                    // Gabès-specific landmark prompts
                    if (this.currentRegion.name === 'Chenini Gabès') {
                        message = `I understand you're in Chenini Gabès. Are you near the oasis, any mosque, or another well-known spot in this area?`;
                    } else if (this.currentRegion.name === 'Corniche Gabès') {
                        message = `I understand you're in the Corniche area. Are you near the beach, any restaurants, or another well-known spot along the coast?`;
                    } else if (this.currentRegion.name === 'Ghannouch') {
                        message = `I understand you're in Ghannouch. Are you near the industrial zone, any particular factory, or another location in this area?`;
                    } else {
                        message = `I understand you're in Gabès. Can you be more specific about your location? Are you near:
1. The Central Market (السوق المركزي)
2. University of Gabès (جامعة قابس)
3. Grand Mosque (الجامع الكبير)
4. Gabès Hospital (مستشفى قابس)
5. Corniche Beach (كورنيش قابس)
6. MTorech neighborhood (المطاريش)
7. Jara area (جارة)
8. Any other specific street or landmark?`;
                    }
                    nextQuestion = "Can you name any landmarks or well-known places near you?";
                } else if (this.currentRegion) {
                    message = `I understand you're in ${this.currentRegion.name}. Are there any well-known places near you? Perhaps a mosque, cafe, shop, or school?`;
                    nextQuestion = "Can you name any landmarks or well-known places near you?";
                } else {
                    message = "I'm having trouble understanding your location. Could you mention any landmark or well-known place near you?";
                    nextQuestion = "What landmarks are near your location?";
                }
                break;
                
            case 'directional_refinement':
                if (this.currentLandmark && this.extractedDetails.directions) {
                    message = `I understand you are ${this.extractedDetails.directions} ${this.currentLandmark.name}. To pinpoint your exact location in Gabès:\n1. About how many meters/building blocks away are you?\n2. Is there a specific street or alley name?\n3. Are there any shops, cafes, or other businesses between you and ${this.currentLandmark.name}?\n4. What side of the street are you on if coming from ${this.currentLandmark.name}?\n5. Are you in a residential area, commercial area, or mixed?`;
                    nextQuestion = "How far and what's between you and the landmark?";
                } else if (this.currentLandmark) {
                    message = `I know you're near ${this.currentLandmark.name}. Could you be more specific about where exactly? Are you north, south, in front (قدام), or behind (ورا) this landmark?`;
                    nextQuestion = `Where exactly are you in relation to ${this.currentLandmark.name}?`;
                } else {
                    message = "I need more details about your specific location. Could you describe where you are in relation to any nearby landmarks?";
                    nextQuestion = "Are you north, south, behind, in front of any landmarks you mentioned?";
                }
                break;
                
            case 'house_description':
                if (isGabesRegion) {
                    message = "Now, I need some details about your exact location. Can you tell me:\n1. What type of building are you in? (traditional Gabès house, apartment building, villa, etc.)\n2. What color is your building?\n3. How many floors does it have?\n4. Are there any shops or businesses on the ground floor?\n5. Is there any distinctive feature nearby like a tree, painted wall, or sign?\n6. What is the nearest street name if you know it?";
                } else {
                    message = "Can you describe your house or building? What color is it, are there any distinctive features that would help a delivery person find it?";
                }
                nextQuestion = "What does your house or building look like? Any distinctive features?";
                break;
                
            case 'confirmation':
                let locationDesc = "";
                
                // Build a natural-sounding location description
                if (this.extractedDetails.directions && this.currentLandmark) {
                    locationDesc = `${this.extractedDetails.directions} ${this.currentLandmark.name}`;
                } else if (this.currentLandmark) {
                    locationDesc = `near ${this.currentLandmark.name}`;
                }
                
                if (this.extractedDetails.area) {
                    if (locationDesc) {
                        locationDesc += ` in ${this.extractedDetails.area}`;
                    } else {
                        locationDesc = `in ${this.extractedDetails.area}`;
                    }
                }
                
                const houseDesc = this.extractedDetails.houseDescription || 'not specified';
                
                message = `Based on your description, I believe you're located ${locationDesc}. Your building is described as: ${houseDesc}. Is this correct?`;
                nextQuestion = "Is this location information correct? If not, what needs to be changed?";
                break;
        }
        
        return { message, nextQuestion };
    }

    /**
     * Get the current map location based on gathered information
     * @returns {object} Latitude and longitude
     */
    getMapLocation() {
        let lat = 36.8065; // Default to Tunisia center
        let lng = 10.1815;
        
        // If we have a landmark, use its coordinates
        if (this.currentLandmark) {
            lat = this.currentLandmark.latitude;
            lng = this.currentLandmark.longitude;
            
            // Adjust slightly based on directional information if available
            if (this.extractedDetails.directions) {
                const dir = this.extractedDetails.directions.toLowerCase();
                
                if (dir.includes('behind') || dir.includes('derrière') || dir.includes('ورا')) {
                    lat -= 0.0003;
                } else if (dir.includes('front') || dir.includes('devant') || dir.includes('قدام')) {
                    lat += 0.0003;
                } else if (dir.includes('right') || dir.includes('droite') || dir.includes('يمين')) {
                    lng += 0.0003;
                } else if (dir.includes('left') || dir.includes('gauche') || dir.includes('يسار')) {
                    lng -= 0.0003;
                }
            }
        } 
        // Otherwise if we have a region, use its coordinates
        else if (this.currentRegion) {
            lat = this.currentRegion.latitude;
            lng = this.currentRegion.longitude;
        }
        
        return { lat, lng };
    }

    /**
     * Reset the assistant for a new conversation
     */
    reset() {
        this.confidenceScore = 0;
        this.currentRegion = null;
        this.currentLandmark = null;
        this.extractedDetails = {
            area: null,
            landmarks: [],
            directions: null,
            houseDescription: null
        };
        this.conversationState = 'initial';
        this.conversationHistory = [];
    }
}

// Create global instance
const locationAssistant = new LocationAIAssistant();
