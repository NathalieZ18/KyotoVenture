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
    document.getElementById("startDate").value = startDate ? startDate.toISOString().split('T')[0] : "";
    document.getElementById("endDate").value = endDate ? endDate.toISOString().split('T')[0] : "";
    document.getElementById("budget").value = itinerary.budget || "";

    // Fetch activities after displaying itinerary details
    fetchActivities(itinerary.id);
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
            `http://localhost:5000/api/itinerary/${itineraryId}/activities`, 
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

        const activitiesData = await response.json();
        console.log("Fetched activities:", activitiesData);

        // Check if activities exist in response
        if (!activitiesData || !Array.isArray(activitiesData) || activitiesData.length === 0) {
            console.warn("No activities found for this itinerary.");
            return;
        }

        displayActivities(activitiesData);
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
}

function displayActivities(activities) {
    const container = document.getElementById("activities-container");

    if (!container) {
        console.error("Activity container not found.");
        return;
    }

    container.innerHTML = ""; 

    activities.forEach(activity => {
        // activity container
        const activityContainer = document.createElement("div");
        activityContainer.classList.add("itinerary-container");

        // activity image
        const img = document.createElement("img");
        img.src = activity.image_url ? activity.image_url : "assets/images/thetemplekyoto.png"; 
        img.alt = `Itinerary Activity: ${activity.title}`;
        img.classList.add("container-image"); 

        // text
        const textContainer = document.createElement("div");
        textContainer.classList.add("container-text");

        const title = document.createElement("h3");
        title.classList.add("less-bold", "headerSize");
        title.textContent = activity.title;

        const tag = document.createElement("p");
        tag.classList.add("container-tag");
        tag.innerHTML = `${activity.area} <span class="ellipses"></span> ${activity.interest}`;

        const tagTwo = document.createElement("p");
        tagTwo.classList.add("container-tag-two");
        tagTwo.textContent = activity.day ? `Day ${activity.day}` : "Unscheduled";

        // buttons
        const buttonSet = document.createElement("div");
        buttonSet.classList.add("myItineraryButtonSet");

        const editButton = document.createElement("button");
        editButton.classList.add("editTimeButton");
        editButton.innerHTML = `<i class="fa-solid fa-pen editTimePen"></i> Edit Time`;
        editButton.onclick = () => editActivityTime(activity.activity_id);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton");
        deleteButton.innerHTML = `<i class="fa-regular fa-trash-can deleteIcon"></i> Delete`;
        deleteButton.onclick = () => deleteActivity(activity.activity_id);

        
        textContainer.appendChild(title);
        textContainer.appendChild(tag);
        textContainer.appendChild(tagTwo);

        buttonSet.appendChild(editButton);
        buttonSet.appendChild(deleteButton);

        activityContainer.appendChild(img); 
        activityContainer.appendChild(textContainer);
        activityContainer.appendChild(buttonSet);

        container.appendChild(activityContainer); 
    });
}



// loads itinerary details when page loads
window.onload = () => {
    fetchItineraryDetails();
};
