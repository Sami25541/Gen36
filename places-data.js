const tunisianPlaces = {
    "Tunis": {
        name: "Tunis",
        description: "The capital and largest city of Tunisia, known for its medina, modern architecture, and cultural heritage. The city combines ancient history with modern development, featuring the largest medina in North Africa.",
        location: {
            lat: 36.8065,
            lng: 10.1815
        },
        landmarks: [
            "Medina of Tunis (UNESCO World Heritage Site)",
            "Bardo Museum (Largest mosaic collection in the world)",
            "Carthage (Ancient Phoenician city)",
            "Sidi Bou Said (Blue and white village)",
            "Zitouna Mosque (Oldest mosque in Tunisia)",
            "Habib Bourguiba Avenue (Main boulevard)"
        ],
        population: "693,210",
        governorate: "Tunis",
        attractions: [
            "Ancient Medina (8th century)",
            "Modern City Center",
            "Carthage Ruins",
            "Sidi Bou Said Village",
            "Belvedere Park",
            "Tunis Zoo",
            "National Museum of Bardo"
        ],
        history: "Founded in the 9th century BC, Tunis became the capital of Tunisia in 1159. It was a major center of Islamic learning and trade during the Middle Ages.",
        climate: "Mediterranean climate with hot, dry summers and mild, wet winters. Average temperature ranges from 11°C in winter to 33°C in summer.",
        transportation: [
            "Tunis-Carthage International Airport",
            "Tunis Metro (Light rail system)",
            "TGM (Tunis-Goulette-Marsa) railway",
            "Public buses and taxis"
        ]
    },
    "Sousse": {
        name: "Sousse",
        description: "A major city in Tunisia and the capital of the Sousse Governorate. Known for its beautiful beaches, historic medina, and as a major economic hub.",
        location: {
            lat: 35.8245,
            lng: 10.6346
        },
        landmarks: [
            "Medina of Sousse (UNESCO World Heritage Site)",
            "Ribat of Sousse (8th century fortress)",
            "Port El Kantaoui (Modern marina)",
            "Great Mosque of Sousse",
            "Archaeological Museum"
        ],
        population: "271,428",
        governorate: "Sousse",
        attractions: [
            "Beaches",
            "Historic Medina",
            "Port El Kantaoui",
            "Archaeological Museum",
            "Boujaafar Beach",
            "Sousse Aquarium",
            "Sousse International Fair"
        ],
        history: "Founded in the 9th century BC by the Phoenicians, Sousse became an important port city during the Roman and Islamic periods.",
        climate: "Mediterranean climate with hot summers and mild winters. Average temperatures range from 12°C in winter to 35°C in summer.",
        transportation: [
            "Monastir Habib Bourguiba International Airport (30km away)",
            "Sousse Railway Station",
            "Public buses",
            "Taxis and louages (shared taxis)"
        ]
    },
    "Hammamet": {
        name: "Hammamet",
        description: "A popular tourist destination known for its beaches, Mediterranean climate, and historic medina. It's often called the 'Tunisian Saint-Tropez'.",
        location: {
            lat: 36.4000,
            lng: 10.6167
        },
        landmarks: [
            "Medina of Hammamet",
            "Hammamet Beach",
            "Yasmin Hammamet (Modern resort area)",
            "International Cultural Center",
            "Fort of Hammamet"
        ],
        population: "97,579",
        governorate: "Nabeul",
        attractions: [
            "Beaches",
            "Medina",
            "Golf Courses",
            "Water Parks",
            "Spas and Hammams",
            "Yasmin Hammamet Marina",
            "International Festival of Hammamet"
        ],
        history: "Originally a small fishing village, Hammamet became a popular tourist destination in the 20th century, known for its beautiful beaches and mild climate.",
        climate: "Mediterranean climate with hot, dry summers and mild, wet winters. Average temperatures range from 12°C in winter to 32°C in summer.",
        transportation: [
            "Tunis-Carthage International Airport (60km away)",
            "Public buses",
            "Taxis",
            "Louages (shared taxis)"
        ]
    },
    "Djerba": {
        name: "Djerba",
        description: "The largest island of North Africa, known for its beaches, unique culture, and historical significance. The island has a distinct Berber and Jewish heritage.",
        location: {
            lat: 33.8075,
            lng: 10.8456
        },
        landmarks: [
            "Houmt Souk (Main town)",
            "El Ghriba Synagogue (Oldest synagogue in Africa)",
            "Djerba Explore Park",
            "Borj El Kebir (16th century fortress)",
            "Guelala Pottery Village"
        ],
        population: "163,726",
        governorate: "Medenine",
        attractions: [
            "Beaches",
            "Traditional Markets",
            "Jewish Heritage Sites",
            "Lagoon",
            "Crocodile Farm",
            "Traditional Pottery Workshops",
            "Djerba Heritage Museum"
        ],
        history: "Inhabited since ancient times, Djerba has been influenced by various civilizations including Phoenicians, Romans, and Arabs. It's known for its unique blend of cultures.",
        climate: "Mediterranean climate with hot summers and mild winters. Average temperatures range from 14°C in winter to 33°C in summer.",
        transportation: [
            "Djerba-Zarzis International Airport",
            "Ferry from Jorf to Ajim",
            "Public buses",
            "Taxis and louages"
        ]
    },
    "Kairouan": {
        name: "Kairouan",
        description: "A holy city and UNESCO World Heritage site, known for its Islamic architecture and historical significance. It's considered the fourth holiest city in Islam.",
        location: {
            lat: 35.6781,
            lng: 10.0963
        },
        landmarks: [
            "Great Mosque of Kairouan (7th century)",
            "Medina of Kairouan",
            "Aghlabid Basins (9th century water reservoirs)",
            "Sidi Sahbi Mausoleum",
            "Three Gates Mosque"
        ],
        population: "186,653",
        governorate: "Kairouan",
        attractions: [
            "Great Mosque",
            "Medina",
            "Traditional Crafts",
            "Historical Sites",
            "Carpet Weaving Workshops",
            "Traditional Markets",
            "Aghlabid Pools"
        ],
        history: "Founded in 670 AD, Kairouan was the first Islamic capital of North Africa and a major center of Islamic learning and culture.",
        climate: "Semi-arid climate with hot summers and mild winters. Average temperatures range from 10°C in winter to 36°C in summer.",
        transportation: [
            "Kairouan Bus Station",
            "Taxis and louages",
            "Regular bus connections to Tunis and other major cities"
        ]
    }
};

// Function to search places
function searchPlace(placeName) {
    const searchTerm = placeName.toLowerCase();
    const results = [];
    
    for (const [key, place] of Object.entries(tunisianPlaces)) {
        if (key.toLowerCase().includes(searchTerm) || 
            place.description.toLowerCase().includes(searchTerm) ||
            place.governorate.toLowerCase().includes(searchTerm) ||
            place.history.toLowerCase().includes(searchTerm) ||
            place.landmarks.some(landmark => landmark.toLowerCase().includes(searchTerm)) ||
            place.attractions.some(attraction => attraction.toLowerCase().includes(searchTerm))) {
            results.push(place);
        }
    }
    
    return results;
}

// Function to get place details
function getPlaceDetails(placeName) {
    return tunisianPlaces[placeName] || null;
} 