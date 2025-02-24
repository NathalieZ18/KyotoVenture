//////////// Retrieve User Itineraries and Display Username of Logged in User

 // Fetch itineraries from the backend and display them
async function fetchItineraries() {
    try {
        console.log("Fetching itineraries...");

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/itineraries", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch itineraries");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        // Check if user and itineraries exist in response
        if (!data || !data.user || !data.itineraries) {
            throw new Error("Invalid response format");
        }

        // Display username of logged in user
        const usernameElement = document.getElementById("username");
        console.log("Username element found:", usernameElement);

        if (usernameElement) {
            usernameElement.textContent = data.user;
            console.log("Updated username:", data.user);
        } else {
            console.warn("Username element not found in the HTML.");
        }

        // Display itineraries of logged in user
        const itinerariesContainer = document.getElementById("itineraries-container");
        console.log("Itineraries container found:", itinerariesContainer);
        if (!itinerariesContainer) {
            console.warn("Itineraries container not found.");
            return;
        }

        itinerariesContainer.innerHTML = "";

        if (data.itineraries.length === 0) {
            itinerariesContainer.innerHTML = "<p>No itineraries found.</p>";
        } else {
            data.itineraries.forEach((itinerary) => {
                const itineraryElement = document.createElement("div");
                itineraryElement.classList.add("itin-container");

                itineraryElement.innerHTML = `
                    <div class="itin-container">
                        <p class="defitin">
                            <span class="star">&#9733;</span> ${itinerary.itinerary_name}
                        </p>
                        <div class="image-container">
                            <img class="bamb" src="${itinerary.image ? 'assets/images/' + itinerary.image : 'assets/images/bamboogrove.png'}" 
                                alt="${itinerary.itinerary_name}">
                        </div>
                        <button class="foodbutton view-btn" data-id="${itinerary.id}">View</button>
                    </div>
                `;

                itinerariesContainer.appendChild(itineraryElement);
            });

            document.querySelectorAll(".view-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const itineraryId = this.getAttribute("data-id");

                    console.log("View button clicked, itinerary ID:", itineraryId);

                    if (!itineraryId) {
                        console.error("No itinerary ID found.");
                        return;
                    }

                    // Store itinerary ID in localStorage
                    localStorage.setItem("selectedItineraryId", itineraryId);

                    // Redirect to itinerary-collection.html
                    window.location.href = "itinerary-collection.html";
                });
            });

            console.log("Itineraries updated successfully.");
        }
    } catch (error) {
        console.error("Error fetching itineraries:", error);
    }
}

fetchItineraries();
