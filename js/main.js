// Function to check if the user is logged in
function checkLoginStatus() {
    console.log('checkLoginStatus loaded');
    const token = localStorage.getItem('authToken'); // Get token from localStorage
    const loggedInMenu = document.getElementById('logged-in');
    const loggedOutMenu = document.getElementById('logged-out');
  

    console.log("Checking login status...");
    console.log("Token:", token); // Log the token

    if (token) {
      // Token exists, user is logged in
      loggedInMenu.style.display = 'block';
      loggedOutMenu.style.display = 'none';
    } else {
      // No token, user is logged out
      loggedInMenu.style.display = 'none';
      loggedOutMenu.style.display = 'block';
    }
  }
  
  // Function to log out the user
  function logout() {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
  
    // Toggle menu visibility
    checkLoginStatus();
  
    // Redirects to login page
    window.location.href = 'login.html'; 
  }
  
  // Calls the checkLoginStatus function on page load to update the nav state
  document.addEventListener('DOMContentLoaded', checkLoginStatus);
  