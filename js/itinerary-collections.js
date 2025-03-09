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

    // Display the number of days from the database from itineraries table (days_added column)
    const days = itinerary.days_added || 0;
    daysCount.textContent = `Days: ${days}`;

    if (!itineraryForm) {
        console.error("Itinerary form not found.");
        return;
    }

    // Populate form fields with itinerary collection info
    document.getElementById("itineraryName").value = itinerary.itinerary_name || "";
    document.getElementById("destinations").value = itinerary.destinations ? itinerary.destinations.join(", ") : "";
    
    // Date format: "yyyy-MM-dd"
    const startDate = itinerary.start_date ? new Date(itinerary.start_date) : null;
    const endDate = itinerary.end_date ? new Date(itinerary.end_date) : null;

    document.getElementById("startDate").value = startDate && !isNaN(startDate) ? startDate.toISOString().split('T')[0] : "";
    document.getElementById("endDate").value = endDate && !isNaN(endDate) ? endDate.toISOString().split('T')[0] : "";
    
    document.getElementById("budget").value = itinerary.budget || "";

    // Fetch activities after displaying itinerary details
    fetchActivities(itinerary.id, days);  
}


// Fetch activities for the selected itinerary collection
async function fetchActivities(itineraryId, totalDays) {
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
        }

        displayActivities(activitiesData, totalDays);
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
}

function displayActivities(activities, totalDays) {
    const container = document.getElementById("activities-container");
    const daysContainer = document.getElementById("days-container");

    if (!container || !daysContainer) {
        console.error("Activity container or days container not found.");
        return;
    }

    container.innerHTML = "";  
    daysContainer.innerHTML = "";  

    // Loop through the number of days in the itinerary
    for (let i = 1; i <= totalDays; i++) {
        // Day separator for each day in the collection
        const daySeparator = document.createElement("div");
        daySeparator.classList.add("day");

        const dayText = document.createElement("div");
        dayText.classList.add("dayText");
        dayText.textContent = `Day ${i}`;
        daySeparator.appendChild(dayText);

        daysContainer.appendChild(daySeparator);

        // Get activities for this day
        const dayActivities = activities.filter(activity => activity.day === i);

        // If no activities for this day, display a message
        if (dayActivities.length === 0) {
            const noActivitiesMessage = document.createElement("p");
            noActivitiesMessage.textContent = "No activities scheduled for this day";
            daySeparator.appendChild(noActivitiesMessage);
        }

        // Display the activities for this day
        dayActivities.forEach(activity => {
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

    // If the itinerary has no activities, create day separators without activities
    const totalDaySeparators = daysContainer.querySelectorAll(".day").length;
    for (let i = activities.length + 1; i <= totalDays; i++) {
        const daySeparator = document.createElement("div");
        daySeparator.classList.add("day");

        const dayText = document.createElement("div");
        dayText.classList.add("dayText");
        dayText.textContent = `Day ${i}`;
        daySeparator.appendChild(dayText);

        const noActivitiesMessage = document.createElement("p");
        noActivitiesMessage.textContent = "No activities scheduled for this day";
        daySeparator.appendChild(noActivitiesMessage);

        daysContainer.appendChild(daySeparator);
    }
}

// loads itinerary details when page loads
window.onload = () => {
    fetchItineraryDetails();
};
