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
  