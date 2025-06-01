/**
 * Sample landmark data for Tunisia
 * This would ideally be expanded with real data from OpenStreetMap or a custom database
 */
const LANDMARKS_DATA = {
    // Major regions, cities and villages in Tunisia
    regions: [
        // Major cities
        {
            name: "Tunis",
            latitude: 36.8065,
            longitude: 10.1815,
            type: "city",
            confidence: 0.98,
            description: "Capital city of Tunisia"
        },
        {
            name: "Sfax",
            latitude: 34.7406,
            longitude: 10.7603,
            type: "city",
            confidence: 0.96,
            description: "Major industrial city in Tunisia"
        },
        {
            name: "Sousse",
            latitude: 35.8245,
            longitude: 10.6346,
            type: "city",
            confidence: 0.96,
            description: "Coastal city and tourist destination"
        },
        {
            name: "Kairouan",
            latitude: 35.6784,
            longitude: 10.0957,
            type: "city",
            confidence: 0.95,
            description: "Historic city with religious significance"
        },
        {
            name: "Bizerte",
            latitude: 37.2744,
            longitude: 9.8739,
            type: "city",
            confidence: 0.95,
            description: "Port city in northern Tunisia"
        },
        {
            name: "Gabès",
            latitude: 33.8815,
            longitude: 10.0982,
            type: "city",
            confidence: 0.98,
            description: "Coastal city in southeastern Tunisia"
        },
        {
            name: "Chenini Gabès",
            latitude: 33.8678,
            longitude: 10.0972,
            type: "neighborhood",
            confidence: 0.95,
            description: "Historic oasis area in Gabès"
        },
        {
            name: "Ghannouch",
            latitude: 33.9443,
            longitude: 10.0732,
            type: "town",
            confidence: 0.95,
            description: "Town near Gabès known for industrial activity"
        },
        {
            name: "Corniche Gabès",
            latitude: 33.8842,
            longitude: 10.1154,
            type: "area",
            confidence: 0.96,
            description: "Coastal area of Gabès along the Mediterranean"
        },
        {
            name: "Jara",
            latitude: 33.8740,
            longitude: 10.0852,
            type: "neighborhood",
            confidence: 0.93,
            description: "Residential area in Gabès"
        },
        {
            name: "Mtorech",
            latitude: 33.8934,
            longitude: 10.0825,
            type: "neighborhood",
            confidence: 0.92,
            description: "Northern residential neighborhood in Gabès"
        },
        {
            name: "Ariana",
            latitude: 36.8665,
            longitude: 10.1964,
            type: "city",
            confidence: 0.94,
            description: "Northern suburb of Tunis"
        },
        {
            name: "Gafsa",
            latitude: 34.4311,
            longitude: 8.7756,
            type: "city",
            confidence: 0.94,
            description: "City in southwestern Tunisia"
        },
        {
            name: "Monastir",
            latitude: 35.7775,
            longitude: 10.8262,
            type: "city",
            confidence: 0.93,
            description: "Coastal city with historic medina"
        },
        {
            name: "Tataouine",
            latitude: 32.9211,
            longitude: 10.4509,
            type: "city",
            confidence: 0.92,
            description: "Southern desert city"
        },
        {
            name: "Medenine",
            latitude: 33.3399,
            longitude: 10.4917,
            type: "city",
            confidence: 0.92,
            description: "City in southern Tunisia"
        },
        {
            name: "Nabeul",
            latitude: 36.4513,
            longitude: 10.7357,
            type: "city",
            confidence: 0.92,
            description: "Coastal city on Cap Bon peninsula"
        },
        {
            name: "Hammamet",
            latitude: 36.4054,
            longitude: 10.6071,
            type: "city",
            confidence: 0.92,
            description: "Beach resort town"
        },
        {
            name: "Beja",
            latitude: 36.7256,
            longitude: 9.1817,
            type: "city",
            confidence: 0.90,
            description: "Northwestern agricultural city"
        },
        {
            name: "Jendouba",
            latitude: 36.5014,
            longitude: 8.7784,
            type: "city",
            confidence: 0.90,
            description: "Northwestern city near Algerian border"
        },
        {
            name: "Siliana",
            latitude: 36.0840,
            longitude: 9.3744,
            type: "city",
            confidence: 0.90,
            description: "City in northwestern Tunisia"
        },
        {
            name: "Mahdia",
            latitude: 35.5047,
            longitude: 11.0622,
            type: "city",
            confidence: 0.91,
            description: "Coastal city with historic medina"
        },
        {
            name: "Kebili",
            latitude: 33.7050,
            longitude: 8.9650,
            type: "city",
            confidence: 0.89,
            description: "Oasis city in southern Tunisia"
        },
        {
            name: "Tozeur",
            latitude: 33.9200,
            longitude: 8.1200,
            type: "city",
            confidence: 0.89,
            description: "Oasis city known for date palms"
        },
        {
            name: "Midoun",
            latitude: 33.8080,
            longitude: 10.9898,
            type: "city",
            confidence: 0.88,
            description: "City on Djerba island"
        },
        
        // Rural areas and villages
        {
            name: "Douar El Haddad",
            latitude: 36.7272,
            longitude: 10.2856,
            type: "village",
            confidence: 0.85,
            description: "Small village in northern Tunisia"
        },
        {
            name: "Douar Snoussi",
            latitude: 36.4511,
            longitude: 10.1456,
            type: "village",
            confidence: 0.80,
            description: "Rural area with scattered houses"
        },
        {
            name: "Douar Bou Salha",
            latitude: 36.3978,
            longitude: 10.1534,
            type: "village",
            confidence: 0.80,
            description: "Small farming community"
        }
    ],
    
    // Sample landmarks
    landmarks: [
        // Gabès specific landmarks
        {
            name: "Gabès Central Market",
            region: "Gabès",
            latitude: 33.8811,
            longitude: 10.0984,
            type: "market",
            confidence: 0.95,
            description: "Main market in downtown Gabès"
        },
        {
            name: "Gabès University",
            region: "Gabès",
            latitude: 33.8783,
            longitude: 10.0981,
            type: "education",
            confidence: 0.97,
            description: "University of Gabès main campus"
        },
        {
            name: "Chenini Oasis",
            region: "Chenini Gabès",
            latitude: 33.8680,
            longitude: 10.0975,
            type: "landmark",
            confidence: 0.96,
            description: "Historic oasis with traditional architecture"
        },
        {
            name: "Corniche Beach",
            region: "Corniche Gabès",
            latitude: 33.8845,
            longitude: 10.1160,
            type: "beach",
            confidence: 0.95,
            description: "Popular beach area along the Corniche"
        },
        {
            name: "Hospital of Gabès",
            region: "Gabès",
            latitude: 33.8805,
            longitude: 10.0910,
            type: "hospital",
            confidence: 0.98,
            description: "Main regional hospital"
        },
        {
            name: "Grand Mosque of Gabès",
            region: "Gabès",
            latitude: 33.8817,
            longitude: 10.0955,
            type: "mosque",
            confidence: 0.97,
            description: "Main mosque in downtown Gabès"
        },
        {
            name: "Gabès Industrial Zone",
            region: "Ghannouch",
            latitude: 33.9410,
            longitude: 10.0750,
            type: "industrial",
            confidence: 0.94,
            description: "Major industrial area north of Gabès"
        },
        {
            name: "White Mosque",
            region: "Douar El Haddad",
            latitude: 36.7275,
            longitude: 10.2860,
            type: "mosque",
            confidence: 0.9,
            description: "Mosque with two minarets, painted white"
        },
        {
            name: "Ben Youssef School",
            region: "Siliana",
            latitude: 36.0838,
            longitude: 9.3740,
            type: "school",
            confidence: 0.85,
            description: "Elementary school with blue gate"
        },
        {
            name: "Café El Fellah",
            region: "Gafsa",
            latitude: 34.4309,
            longitude: 8.7759,
            type: "cafe",
            confidence: 0.8,
            description: "Popular cafe with outdoor seating"
        },
        {
            name: "Old Well",
            region: "Douar Snoussi",
            latitude: 36.4513,
            longitude: 10.1458,
            type: "landmark",
            confidence: 0.7,
            description: "Historic stone well in the center of the village"
        },
        {
            name: "Olive Factory",
            region: "Douar Bou Salha",
            latitude: 36.3980,
            longitude: 10.1539,
            type: "factory",
            confidence: 0.85,
            description: "Small olive oil processing facility"
        },
        {
            name: "Green Minaret Mosque",
            region: "Douar Bou Salha",
            latitude: 36.3975,
            longitude: 10.1530,
            type: "mosque",
            confidence: 0.9,
            description: "Mosque with distinctive green minaret"
        },
        {
            name: "Post Office",
            region: "Siliana",
            latitude: 36.0845,
            longitude: 9.3750,
            type: "government",
            confidence: 0.95,
            description: "Main post office building"
        }
    ],
    
    // Common place descriptors in Tunisian Arabic/French and their English equivalents
    placeDescriptors: [
        { term: "جامع", english: "mosque", confidence: 0.95 },
        { term: "مسجد", english: "mosque", confidence: 0.95 },
        { term: "مدرسة", english: "school", confidence: 0.9 },
        { term: "قهوة", english: "cafe", confidence: 0.9 },
        { term: "café", english: "cafe", confidence: 0.9 },
        { term: "سوق", english: "market", confidence: 0.85 },
        { term: "marché", english: "market", confidence: 0.85 },
        { term: "حانوت", english: "shop", confidence: 0.8 },
        { term: "boutique", english: "shop", confidence: 0.8 },
        { term: "محطة", english: "station", confidence: 0.85 },
        { term: "بئر", english: "well", confidence: 0.7 },
        { term: "دار", english: "house", confidence: 0.8 },
        { term: "maison", english: "house", confidence: 0.8 },
        { term: "زيتون", english: "olive trees", confidence: 0.75 }
    ],
    
    // Directional terms in Tunisian Arabic/French and their English equivalents
    directionalTerms: [
        { term: "قدام", english: "in front of", confidence: 0.9 },
        { term: "devant", english: "in front of", confidence: 0.9 },
        { term: "ورا", english: "behind", confidence: 0.9 },
        { term: "derrière", english: "behind", confidence: 0.9 },
        { term: "يمين", english: "right of", confidence: 0.85 },
        { term: "à droite", english: "right of", confidence: 0.85 },
        { term: "يسار", english: "left of", confidence: 0.85 },
        { term: "à gauche", english: "left of", confidence: 0.85 },
        { term: "بجنب", english: "next to", confidence: 0.8 },
        { term: "à côté", english: "next to", confidence: 0.8 },
        { term: "قريب", english: "near", confidence: 0.7 },
        { term: "près de", english: "near", confidence: 0.7 }
    ]
};

// Export the data if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LANDMARKS_DATA;
}
