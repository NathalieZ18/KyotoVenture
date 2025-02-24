document.addEventListener("DOMContentLoaded", function () {
  // Select all delete buttons
  const deleteButtons = document.querySelectorAll(".deleteButton");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Find the closest itinerary container and remove it
      const itineraryContainer = this.closest(".itinerary-container");
      if (itineraryContainer) {
        itineraryContainer.remove();
      }
    });
  });

  // Go to Create Itinerary page function
  document.querySelector("#createItineraryButton").addEventListener("click", function () {
    window.location.href = "create-itinerary.html";
  });
  console.log(document.querySelector("#createItineraryButton"));

  // Continue Browsing button function
  document.querySelector(".continueBrowsingButton").addEventListener("click", function () {
    window.location.href = "activities.html"; 
  });

  // Edit My Itinerary button function
  document.querySelector(".editMyItineraryButton").addEventListener("click", function () {
    window.location.href = "edit-itinerary.html"; 
  });

  // Sign In button from empty my itinerary page
  document.querySelector(".signInButton").addEventListener("click", function () {
    window.location.href = "signup.html"; 
  });

  // Empty Itinerary Cards navigate to their activity details page
  document.querySelectorAll('.card-emptyItinerary').forEach(card => {
    card.addEventListener('click', function() {
      const pageUrl = this.getAttribute('data-url');  
      if (pageUrl) {
        window.location.href = pageUrl;  
      }
    });
  });
});
