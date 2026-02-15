// Data extracted from your main.js logic
const inputSources = [
    { name: "Live TV",   url: "tv://",         type: "service/webos-broadcast" },
    { name: "HDMI 1",    url: "ext://hdmi:1",  type: "service/webos-external" },
    { name: "HDMI 2",    url: "ext://hdmi:2",  type: "service/webos-external" },
    { name: "HDMI 3",    url: "ext://hdmi:3",  type: "service/webos-external" },
    { name: "HDMI 4",    url: "ext://hdmi:4",  type: "service/webos-external" },
    { name: "Component", url: "ext://comp:1",  type: "service/webos-external" },
    { name: "AV 1",      url: "ext://av:1",    type: "service/webos-external" },
    { name: "AV 2",      url: "ext://av:2",    type: "service/webos-external" }
];

let currentIndex = 0;
const videoElement = document.getElementById('tv-player');
const nameLabel = document.getElementById('name-display');
const urlLabel = document.getElementById('url-display');

/**
 * Main function to change hardware input
 */
function updateInput(index) {
    const source = inputSources[index];
    
    // Update Text UI
    nameLabel.innerText = source.name;
    urlLabel.innerText = `${source.url} (${source.type})`;

    // Remove old source children
    while (videoElement.firstChild) {
        videoElement.removeChild(videoElement.firstChild);
    }

    // Create new hardware source
    const sourceTag = document.createElement('source');
    sourceTag.setAttribute('src', source.url);
    sourceTag.setAttribute('type', source.type);
    
    videoElement.appendChild(sourceTag);
    
    // Refresh the hardware pipeline
    videoElement.load();
    videoElement.play().catch(e => console.log("Waiting for signal..."));
}

/**
 * Handle Remote Control Page Up / Page Down
 */
document.addEventListener('keydown', function(e) {
    console.log("Key pressed: " + e.keyCode);

    switch(e.keyCode) {
        case 33: // Page Up (Channel Up on LG Remote)
            currentIndex = (currentIndex + 1) % inputSources.length;
            updateInput(currentIndex);
            break;
        
        case 34: // Page Down (Channel Down on LG Remote)
            currentIndex = (currentIndex - 1 + inputSources.length) % inputSources.length;
            updateInput(currentIndex);
            break;

        case 13: // Enter/OK button (Alternative cycle)
            currentIndex = (currentIndex + 1) % inputSources.length;
            updateInput(currentIndex);
            break;
    }
});

// Start the app on Live TV
window.onload = () => updateInput(0);
