// Define all input sources with their specific webOS URL schemes and MIME types
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
const videoElement = document.querySelector('video'); 

// Function to play a specific source
function playSource(index) {
    if (!videoElement) return;

    const source = inputSources[index];
    console.log(`Switching to: ${source.name} (${source.url})`);

    // Remove existing source tags to ensure clean switching
    while (videoElement.firstChild) {
        videoElement.removeChild(videoElement.firstChild);
    }

    // Create new source element
    const sourceTag = document.createElement('source');
    sourceTag.setAttribute('src', source.url);   // Set the special webOS URL
    sourceTag.setAttribute('type', source.type); // Set the required MIME type
    
    videoElement.appendChild(sourceTag);
    
    // Reload the video element to apply the new source
    videoElement.load();
    videoElement.play().catch(error => {
        console.error(`Error playing ${source.name}:`, error);
    });
}

// Function to cycle to the next input
function playNext() {
    currentIndex = (currentIndex + 1) % inputSources.length;
    playSource(currentIndex);
}

// Start by playing the first source (Live TV)
playSource(0);

// Example: Cycle through inputs every 5 seconds
// setInterval(playNext, 5000);
