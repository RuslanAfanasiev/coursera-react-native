// Time zones for countries
const timeZones = {
    "Australia": "Australia/Sydney",
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",
    "Cambodia": "Asia/Phnom_Penh",
    "India": "Asia/Kolkata",
    "French Polynesia": "Pacific/Tahiti"
};

// Get local time for a place
function getLocalTime(placeName) {
    for (const [country, timezone] of Object.entries(timeZones)) {
        if (placeName.includes(country)) {
            const options = {
                timeZone: timezone,
                hour12: true,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            };
            return new Date().toLocaleTimeString('en-US', options);
        }
    }
    return null;
}

// Search recommendations
function searchRecommendations() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!searchInput) {
        alert('Please enter a valid search query.');
        return;
    }

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '';

            let results = [];

            // Check for beach/beaches keyword
            if (searchInput === 'beach' || searchInput === 'beaches') {
                results = data.beaches;
            }
            // Check for temple/temples keyword
            else if (searchInput === 'temple' || searchInput === 'temples') {
                results = data.temples;
            }
            // Check for country/countries keyword
            else if (searchInput === 'country' || searchInput === 'countries') {
                data.countries.forEach(country => {
                    country.cities.forEach(city => {
                        results.push(city);
                    });
                });
            }
            // Search by specific country name
            else {
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(searchInput)) {
                        country.cities.forEach(city => {
                            results.push(city);
                        });
                    }
                });

                // Also search in beaches and temples by name
                data.beaches.forEach(beach => {
                    if (beach.name.toLowerCase().includes(searchInput)) {
                        results.push(beach);
                    }
                });

                data.temples.forEach(temple => {
                    if (temple.name.toLowerCase().includes(searchInput)) {
                        results.push(temple);
                    }
                });
            }

            // Display results
            if (results.length > 0) {
                // Show home section if not visible
                showHome();

                results.forEach(place => {
                    const card = document.createElement('div');
                    card.classList.add('result-card');

                    const localTime = getLocalTime(place.name);
                    const timeHTML = localTime ? `<p class="time-info">Local time: ${localTime}</p>` : '';

                    card.innerHTML = `
                        <img src="${place.imageUrl}" alt="${place.name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'">
                        <div class="result-card-content">
                            <h3>${place.name}</h3>
                            <p>${place.description}</p>
                            ${timeHTML}
                            <a href="#" class="btn-visit">Visit</a>
                        </div>
                    `;

                    resultsDiv.appendChild(card);
                });
            } else {
                resultsDiv.innerHTML = '<div class="result-card"><div class="result-card-content"><p>No results found. Try searching for "beach", "temple", or "country".</p></div></div>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Clear results
function clearResults() {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchInput').value = '';
}

// Navigation functions
function showHome() {
    document.getElementById('home').style.display = 'flex';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    updateActiveLink('Home');
}

function showAbout() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'block';
    document.getElementById('contact').style.display = 'none';
    updateActiveLink('About Us');
}

function showContact() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('about').style.display = 'none';
    document.getElementById('contact').style.display = 'flex';
    updateActiveLink('Contact Us');
}

function updateActiveLink(linkText) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.textContent === linkText) {
            link.classList.add('active');
        }
    });
}

// Submit contact form
function submitContact() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    if (name && email && message) {
        alert('Thank you for your message, ' + name + '! We will get back to you soon.');
        document.getElementById('contactName').value = '';
        document.getElementById('contactEmail').value = '';
        document.getElementById('contactMessage').value = '';
    } else {
        alert('Please fill in all fields.');
    }
}

// Allow Enter key to search
document.getElementById('searchInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchRecommendations();
    }
});

// Home link click
document.querySelector('a[href="#home"]').addEventListener('click', function(e) {
    e.preventDefault();
    showHome();
});