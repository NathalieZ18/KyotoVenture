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
  });
  
  // Go to Create Itinerary page function
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#createItineraryButton").addEventListener("click", function () {
        window.location.href = "create-itinerary.html";
    });
});
console.log(document.querySelector("#createItineraryButton"));

//Continue Browsing
document.querySelector(".continueBrowsingButton").addEventListener("click", function () {
  window.location.href = "activities.html"; 
});
//Edit My Itinerary
document.querySelector(".editMyItineraryButton").addEventListener("click", function () {
  window.location.href = "edit-itinerary.html"; 
});