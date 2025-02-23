// Gets the "Add Day" option/button (not actually a button but a span), the container for days, and the Save Itinerary button
const addDayText = document.getElementById('add-day');
const daysContainer = document.getElementById('days-container');
const saveItineraryButton = document.getElementById('save-itinerary-btn');

// Function to create a new day section
function addNewDay() {
  const dayCount = daysContainer.querySelectorAll('.day').length; // Count only elements with the "day" class

  if (dayCount < 7) { // Set max day limit to 7 (switched from 14 to simplify)
    // Create a new container div for the day
    const dayContainer = document.createElement('div');
    dayContainer.classList.add('day');

    // Create the text for the new day
    const dayText = document.createElement('span');
    dayText.classList.add('dayText');
    dayText.textContent = `Day ${dayCount + 1}`; // Label the day

    // Append the day text to the day container
    dayContainer.appendChild(dayText);

    // Append the new day container to the days container
    daysContainer.appendChild(dayContainer);
  } else {
    alert("You can't add more than 7 days!");
  }
}

// Event listener for the "Add Day" option
addDayText.addEventListener('click', function() {
  addNewDay();
});

// Function to save the itinerary and form data
function saveItinerary() {
  // Get the number of days added
  const daysAdded = daysContainer.querySelectorAll('.day').length;

  // Get form data values
  const itineraryName = document.getElementById('itineraryName').value;
  const destinations = document.getElementById('destinations').value;
  const budget = document.getElementById('budget').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Log both the form data and the number of days in console
  console.log("Itinerary Name:", itineraryName);
  console.log("Destinations:", destinations);
  console.log("Budget ($):", budget);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Number of Days Added:", daysAdded);

  //  request body to send to the backend (information/data that gets passed into the backend)
  const itineraryData = {
    itinerary_name: itineraryName,
    destinations: destinations.split(',').map(destination => destination.trim()), 
    budget: budget,
    start_date: startDate,
    end_date: endDate,
    days_added: daysAdded 
  };

  // Send data to the backend
  fetch('http://localhost:5000/api/itineraries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // token for authentication
    },
    body: JSON.stringify(itineraryData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Itinerary saved successfully:", data.itinerary);
        alert('Itinerary saved successfully!');
      } else {
        console.error('Error saving itinerary:', data.message);
        alert('Error saving itinerary. Please try again.');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error saving itinerary. Please try again.');
    });
}

// Event listener for the "Save Itinerary" button
saveItineraryButton.addEventListener('click', saveItinerary);
