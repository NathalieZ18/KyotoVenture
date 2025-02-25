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
        console.log("Fetched itinerary data:", data); 
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
    const itineraryTitle = document.getElementById("collection-title");
    const daysCount = document.getElementById("days-count");
    const itineraryForm = document.getElementById("itineraryForm");

    if (!itineraryTitle || !daysCount) {
        console.error("Itinerary title or days count element not found.");
        return;
    }

    // Update the itinerary title and days count
    itineraryTitle.textContent = itinerary.itinerary_name || "Itinerary Collection Name";
    
    // Calculate the number of days
    const startDate = new Date(itinerary.start_date);
    const endDate = new Date(itinerary.end_date);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 0;
    daysCount.textContent = `Days: ${days}`;

    if (!itineraryForm) {
        console.error("Itinerary form not found.");
        return;
    }

    // Populate form fields with itinerary collection info
    document.getElementById("itineraryName").value = itinerary.itinerary_name || "";

    // Join destinations with a comma and space
    document.getElementById("destinations").value = itinerary.destinations ? itinerary.destinations.join(", ") : "";

    // Formats the start and end date to format: yyyy-MM-dd
    const formattedStartDate = startDate.toISOString().split('T')[0]; 
    const formattedEndDate = endDate.toISOString().split('T')[0]; 
    
    // Set the formatted dates in the input fields
    document.getElementById("startDate").value = formattedStartDate;
    document.getElementById("endDate").value = formattedEndDate;

    document.getElementById("budget").value = itinerary.budget || "";
}



window.onload = () => {
    fetchItineraryDetails();
};