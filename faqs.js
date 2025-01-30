document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".putLeft");

    questions.forEach((question) => {
        question.addEventListener("click", function () {
            const answer = this.parentElement.nextElementSibling; 
            const arrow = this.querySelector(".down-arrow");

            //checks if answer is open
            const isCurrentlyOpen = answer.style.display === "block"; 

            // hide answers
            document.querySelectorAll(".faq div[class^='answer'], .venturefaq div[class^='ventureanswer']")
                .forEach(ans => ans.style.display = "none");

            // reset arrows
            document.querySelectorAll(".down-arrow").forEach(arr => {
                arr.textContent = "▼";
            });

            // Toggle only if it was closed before
            if (!isCurrentlyOpen) {
                answer.style.display = "block"; // Show clicked answer
                arrow.textContent = "▲"; // Change arrow to up arrow
            }
        });
    });

    // Hide faq answers
    document.querySelectorAll(".faq div[class^='answer'], .venturefaq div[class^='ventureanswer']")
        .forEach(answer => answer.style.display = "none");
});