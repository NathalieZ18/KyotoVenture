// Tag Functionality //
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const value = event.target.value;
      // Select div from html. Tags will be displayed in the div
      const tagContainer = document.querySelector('.selected-checkbox-tags');
  
      if (event.target.checked) {
        // Create a new tag
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.setAttribute('data-value', value);
        tag.innerHTML = `${value} <button aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>`;
  
        // Append the tag to the tag container
        tagContainer.appendChild(tag);
  
        // Add event listener to the remove button
        tag.querySelector('button').addEventListener('click', () => {
          // Uncheck related checkbox
          event.target.checked = false; 
          // Remove tag
          tag.remove(); 
        });
      } else {
        // Remove tag if the checkbox is unchecked
        const tagToRemove = tagContainer.querySelector(`.tag[data-value="${value}"]`);
        if (tagToRemove) tagToRemove.remove();
      }
    });
  });
  // Clears all tags and checkboxes once Clear All is clicked // 
  document.querySelector('.clear-all').addEventListener('click', () => {
    // Clear all the tags
    const tagContainer = document.querySelector('.selected-checkbox-tags');
    tagContainer.innerHTML = '';
  
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });