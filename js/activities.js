// Search Feature
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".activities-search-box input");
  const searchButton = document.querySelector(".activities-search-button");
  const cards = document.querySelectorAll(".card");

  // Function to filter activities based on search input
  function filterActivities() {
    const searchText = searchInput.value.toLowerCase();

    cards.forEach((card) => {
      const title = card.querySelector(".cardTitle").textContent.toLowerCase();
      card.style.display = title.includes(searchText) ? "block" : "none";
    });
  }

  // Event listeners for search functionality
  searchButton.addEventListener("click", filterActivities);
  searchInput.addEventListener("keyup", filterActivities);

  // Card Click Feature (to go to the activity details page of the card)
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function (event) {
      console.log("Card clicked");

      // Prevent navigation when clicking the "Add to Itinerary" button (clicking anywhere else on the card takes you to activity details page)
      if (event.target.closest(".addItineraryButton")) {
        event.stopPropagation();
        return;
      }
      // Get the URL of the activity details page from data-url and navigate to that specific page
      const pageUrl = this.getAttribute("data-url");
      // debug log for URL to show that your navigating to the activity details page based on the activity cards clicked
      console.log("Navigating to:", pageUrl);

      if (pageUrl) {
        window.location.href = pageUrl;
      } else {
        console.error("No URL found for this card!");
      }
    });
  });

  // Function to filter activities based on selected tags, areas, and interests
  function filterCards() {
    const selectedTags = [
      ...document.querySelectorAll(".selected-checkbox-tags .tag"),
    ].map((tag) => tag.getAttribute("data-value"));

    const selectedAreas = [
      ...document.querySelectorAll(
        '.area-checkbox-group input[type="checkbox"]:checked'
      ),
    ].map((checkbox) => checkbox.value);

    const selectedInterests = [
      ...document.querySelectorAll(
        '.interests-checkbox-group input[type="checkbox"]:checked'
      ),
    ].map((checkbox) => checkbox.value);

    cards.forEach((card) => {
      const cardArea = card.getAttribute("data-area");
      const cardInterests = card.getAttribute("data-interests").split(", ");

      const matchesArea =
        selectedAreas.length === 0 || selectedAreas.includes(cardArea);
      const matchesInterest =
        selectedInterests.length === 0 ||
        cardInterests.some((interest) => selectedInterests.includes(interest));
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.every(
          (tag) => cardInterests.includes(tag) || cardArea === tag
        );

      card.style.display =
        matchesArea && matchesInterest && matchesTag ? "block" : "none";
    });
  }

  // Event listeners for checkbox filtering
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const value = event.target.value;
      const tagContainer = document.querySelector(".selected-checkbox-tags");

      if (event.target.checked) {
        // Create a tag element for selected checkbox
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.setAttribute("data-value", value);
        tag.innerHTML = `${value} <button aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>`;

        tagContainer.appendChild(tag);

        // Remove tag when clicked
        tag.querySelector("button").addEventListener("click", () => {
          event.target.checked = false;
          tag.remove();
          filterCards();
        });
      } else {
        // Remove tag when checkbox is unchecked
        const tagToRemove = tagContainer.querySelector(
          `.tag[data-value="${value}"]`
        );
        if (tagToRemove) tagToRemove.remove();
        filterCards();
      }
    });
  });

  // Clear all selected filters
  document.querySelector(".clear-all").addEventListener("click", () => {
    document.querySelector(".selected-checkbox-tags").innerHTML = "";
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));
    showAllCards();
    filterCards();
  });

  // Function to show all cards
  function showAllCards() {
    cards.forEach((card) => (card.style.display = "block"));
  }

  // Event listeners for area and interest checkboxes
  document
    .querySelectorAll(
      '.area-checkbox-group input[type="checkbox"], .interests-checkbox-group input[type="checkbox"]'
    )
    .forEach((checkbox) => {
      checkbox.addEventListener("change", filterCards);
    });

  // Function to add an activity to the default itinerary
  async function addActivityToDefaultItinerary(activityId) {
    try {
      const token = localStorage.getItem("token");
      const defaultItineraryId = localStorage.getItem("defaultItineraryId");

      if (!defaultItineraryId) {
        alert("You need to set a default itinerary first.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/activities/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId }),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Failed to add activity.");

      alert("Activity added to your default itinerary!");
      fetchActivitiesForItinerary(defaultItineraryId);
    } catch (error) {
      console.error("Error adding activity to itinerary:", error);
    }
  }

  // Event listeners for "Add to Itinerary" buttons
  document.querySelectorAll(".addItineraryButton").forEach((button) => {
    button.addEventListener("click", (event) => {
      const activityId = event.target.dataset.activityId;
      addActivityToDefaultItinerary(activityId);
    });
  });

  // Event listener for "Go to My Itinerary" button at the top right (that page shows the users default itinerary)
  document
    .querySelector(".goToMyItineraryButton")
    .addEventListener("click", function () {
      window.location.href = "my-itinerary.html";
    });
});
