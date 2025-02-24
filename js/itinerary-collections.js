async function fetchItineraryDetails() {
    try {
        const itineraryId = localStorage.getItem("selectedItineraryId");
        if (!itineraryId) {
            console.error("No itinerary ID found in localStorage");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/api/itineraries/${itineraryId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch itinerary details");
        }

        const data = await response.json();
        console.log("Fetched itinerary data:", data); // Debugging
        if (!data.itinerary) {
            console.error("Itinerary data not found");
            return;
        }

        displayItineraryDetails(data.itinerary);

    } catch (error) {
        console.error("Error fetching itinerary details:", error);
    }
}

function displayItineraryDetails(itinerary) {
    const itineraryDetailsContainer = document.getElementById("itinerary-details-container");
    if (!itineraryDetailsContainer) {
        console.error("Itinerary details container not found.");
        return;
    }

    // Display fetched itinerary information
    itineraryDetailsContainer.innerHTML = `
        <div class="itinerary-image-container">
            <img class="bamb" src="${itinerary.image ? 'assets/images/' + itinerary.image : 'assets/images/bamboogrove.png'}" alt="Itinerary Image" />
        </div>
        <div class="itineraryDetails">
            <p><strong>Name:</strong> ${itinerary.itinerary_name}</p>
            <p><strong>Destination:</strong> ${itinerary.destination}</p>
            <p><strong>Budget:</strong> ${itinerary.budget}</p>
            <p><strong>Start Date:</strong> ${itinerary.start_date}</p>
            <p><strong>End Date:</strong> ${itinerary.end_date}</p>
        </div>
    `;
}

window.onload = () => {
    fetchItineraryDetails();
};
