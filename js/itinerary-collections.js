// Page for http://localhost:8080/itinerary-collections.html to display the details of the user's itinerary collection

async function fetchItineraryDetails() {
    try {
        const itineraryId = localStorage.getItem("selectedItineraryId");
        if (!itineraryId) {
            console.error("No itinerary ID found in localStorage");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found.");
            return;
        }

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
        fetchActivities(itineraryId);  // Fetch activities for the selected itinerary

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

    // Update the itinerary title
    itineraryTitle.textContent = itinerary.itinerary_name || "Itinerary Collection Name";

    // Handle missing or empty dates
    let startDate = itinerary.start_date ? new Date(itinerary.start_date) : null;
    let endDate = itinerary.end_date ? new Date(itinerary.end_date) : null;
    let days = 0;

    if (startDate && endDate) {
        days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }

    daysCount.textContent = `Days: ${days}`;

    if (!itineraryForm) {
        console.error("Itinerary form not found.");
        return;
    }

    // Populate form fields with itinerary collection info
    document.getElementById("itineraryName").value = itinerary.itinerary_name || "";
    document.getElementById("destinations").value = itinerary.destinations ? itinerary.destinations.join(", ") : "";

    // Set formatted dates if available
    document.getElementById("startDate").value = startDate ? startDate.toISOString().split('T')[0] : "";
    document.getElementById("endDate").value = endDate ? endDate.toISOString().split('T')[0] : "";

    document.getElementById("budget").value = itinerary.budget || "";
}

// Fetch activities for the selected itinerary
async function fetchActivities(itineraryId) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found.");
            return;
        }

        const response = await fetch(
            `http://localhost:5000/api/itineraries/${itineraryId}/activities`, 
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch activities.");
        }

        const activities = await response.json();

        // Display activities on the frontend
        const activitiesContainer = document.getElementById("activities-container");
        activitiesContainer.innerHTML = ""; 

        if (!activities || activities.length === 0) {
            activitiesContainer.innerHTML = "<p>No activities added to this itinerary yet.</p>";
        } else {
            activities.forEach(activity => {
                const activityCard = document.createElement("div");
                activityCard.classList.add("activity-card");
                activityCard.innerHTML = `
                    <h4>${activity.title}</h4>
                    <p>Area: ${activity.area}</p>
                    <p>Interest: ${activity.interest}</p>
                    <p>Day: ${activity.day || "Unassigned"}</p>
                `;
                activitiesContainer.appendChild(activityCard);
            });
        }

    } catch (error) {
        console.error("Error fetching activities:", error);
    }
}

window.onload = () => {
    fetchItineraryDetails();
};
