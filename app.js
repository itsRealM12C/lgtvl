const ALL_INPUTS = [
    { name: "LIVE TV", url: "tv://", type: "service/webos-broadcast" },
    { name: "HDMI 1", url: "ext://hdmi:1", type: "service/webos-external" },
    { name: "HDMI 2", url: "ext://hdmi:2", type: "service/webos-external" },
    { name: "HDMI 3", url: "ext://hdmi:3", type: "service/webos-external" },
    { name: "HDMI 4", url: "ext://hdmi:4", type: "service/webos-external" },
    { name: "COMPONENT", url: "ext://comp:1", type: "service/webos-external" },
    { name: "AV 1", url: "ext://av:1", type: "service/webos-external" },
    { name: "AV 2", url: "ext://av:2", type: "service/webos-external" }
];

let currentIndex = 0;
let mediaRecorder;
let recordedChunks = [];
const mainVideo = document.getElementById('tv-player');

function setInput(index) {
    const input = ALL_INPUTS[index];
    
    // UI Updates
    document.getElementById('name-display').innerText = input.name;
    document.getElementById('url-display').innerText = input.url;
    document.getElementById('status-text').innerText = "Signal: Synchronizing...";
    
    // Hardware Source Switching
    while (mainVideo.firstChild) mainVideo.removeChild(mainVideo.firstChild);
    
    const source = document.createElement('source');
    source.src = input.url;
    source.type = input.type;
    mainVideo.appendChild(source);
    
    mainVideo.load();
    mainVideo.play();
}

// Auto-recording logic triggered by the 'playing' event
mainVideo.onplaying = () => {
    document.getElementById('status-text').innerText = "Signal: Locked";
    triggerAutoRecord();
};

function triggerAutoRecord() {
    // Reset recorder
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    recordedChunks = [];

    const stream = mainVideo.captureStream ? mainVideo.captureStream() : mainVideo.mozCaptureStream();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = (e) => recordedChunks.push(e.data);
    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const previewPlayer = document.getElementById('export-player');
        previewPlayer.src = URL.createObjectURL(blob);
        document.getElementById('preview-box').style.display = 'block';
        document.getElementById('rec-dot').style.display = 'none';
    };

    mediaRecorder.start();
    document.getElementById('rec-dot').style.display = 'block';
    
    // Stop exactly after 10 seconds
    setTimeout(() => {
        if (mediaRecorder.state === "recording") mediaRecorder.stop();
    }, 10000);
}

// Key handling for Page Up/Down (Ch+/Ch-)
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 33) { // Page Up
        currentIndex = (currentIndex + 1) % ALL_INPUTS.length;
        setInput(currentIndex);
    } else if (e.keyCode === 34) { // Page Down
        currentIndex = (currentIndex - 1 + ALL_INPUTS.length) % ALL_INPUTS.length;
        setInput(currentIndex);
    }
});

window.onload = () => setInput(0);
