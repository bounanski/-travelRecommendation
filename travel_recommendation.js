 function performSearch() {
            const searchTerm = document.getElementById('searchInput').value;
            const errorMsg = document.getElementById('searchError');
            
            if (searchTerm.trim()) {
                errorMsg.style.display = 'none';
                console.log('Searching for: ' + searchTerm);
                alert('Searching for: ' + searchTerm);
            } else {
                errorMsg.style.display = 'block';
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        }

        function clearSearch() {
            document.getElementById('searchInput').value = '';
            document.getElementById('searchError').style.display = 'none';
            console.log('Search cleared');
        }

        document.getElementById('searchInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });


 async function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const errorMsg = document.getElementById('searchError');
    const resultsContainer = document.getElementById('results-container');

    resultsContainer.innerHTML = "";

    if (!searchTerm) {
        errorMsg.innerText = "Please enter a keyword or place name.";
        errorMsg.style.display = "block";
        setTimeout(() => errorMsg.style.display = "none", 3000);
        return;
    }

    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) throw new Error("Network error: " + response.statusText);

        const data = await response.json();
        let matches = [];

        // Search in countries
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(searchTerm)) {
                matches.push(...country.cities);
            } else {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm) || city.description.toLowerCase().includes(searchTerm)) {
                        matches.push(city);
                    }
                });
            }
        });

        // Search in temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchTerm) || temple.description.toLowerCase().includes(searchTerm)) {
                matches.push(temple);
            }
        });

        // Search in beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchTerm) || beach.description.toLowerCase().includes(searchTerm)) {
                matches.push(beach);
            }
        });

        if (matches.length === 0) {
            errorMsg.innerText = "No results found.";
            errorMsg.style.display = "block";
            return;
        }

        matches.slice(0, 5).forEach(place => {
            const card = document.createElement("div");
            card.style.border = "1px solid #ccc";
            card.style.borderRadius = "8px";
            card.style.width = "300px";
            card.style.overflow = "hidden";
            card.style.background = "white";
            card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
            card.style.margin = "10px";

            card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding: 10px;">
                    <h3 style="margin: 0;">${place.name}</h3>
                    <p>${place.description}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
        errorMsg.innerText = "Error: " + error.message;
        errorMsg.style.display = "block";
        setTimeout(() => errorMsg.style.display = "none", 5000);
    }
}