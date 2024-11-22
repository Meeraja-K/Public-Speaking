// Event listener that runs when the entire DOM content is fully loaded and parsed
document.addEventListener("DOMContentLoaded", function () {
  
    // Get the container element where participants' avatars and names will be displayed
    const participantsList = document.getElementById("participants-list");

    // Retrieve the spectator's name and avatar URL from sessionStorage
    const name = sessionStorage.getItem("spectatorName");
    const avatar = sessionStorage.getItem("spectatorAvatar");

    // Log the retrieved name and avatar to the console for debugging purposes
    console.log("Spectator Name:", name);
    console.log("Spectator Avatar:", avatar);

    // Check if both name and avatar exist in sessionStorage
    if (name && avatar) {
      
        // Create a div to display the participant's name and avatar
        const participantDiv = document.createElement("div");
        
        // Style the div: make it a flex container, align items center, and give it margin at the bottom
        participantDiv.style.display = "flex";
        participantDiv.style.alignItems = "center";
        participantDiv.style.marginBottom = "10px";

        // Create an img element to display the participant's avatar
        const img = document.createElement("img");
        
        // Set the source of the image to the avatar URL retrieved from sessionStorage
        img.src = avatar;
        
        // Set the alt attribute of the image to the spectator's name
        img.alt = name;
        
        // Apply CSS class and inline styles to the image to make it circular and appropriately sized
        img.className = "participant-icon";
        img.style.width = "50px";
        img.style.height = "50px";
        img.style.borderRadius = "50%";
        img.style.marginRight = "10px"; // Add space between avatar and name

        // Create a span element to display the participant's name
        const span = document.createElement("span");
        
        // Set the text content of the span to the spectator's name
        span.textContent = name;
        
        // Style the name text with a white color
        span.style.color = "#fff";

        // Append the image and span (name) to the participant div
        participantDiv.appendChild(img);
        participantDiv.appendChild(span);

        // Append the participant div to the participants list container
        participantsList.appendChild(participantDiv);

        // Check if the global `window.participants` array exists; if not, create it
        if (!window.participants) {
            window.participants = [];
        }

        // Add the new participant's data (name, image element, and avatar URL) to the global participants array
        window.participants.push({ name: name, avatar: img, avatar3D: avatar });
      
    } else {
        // If no name or avatar were found, display a message indicating no participants
        participantsList.innerHTML = `<p style="color: #fff;">No participants available</p>`;
        
        // Log a warning to the console indicating no spectator data was found in sessionStorage
        console.warn("No spectator data found in sessionStorage.");
    }
});
