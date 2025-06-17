let gestureState = 0;
let startX = 0;
let startY = 0;
const minDistance = 30;     // Minimum distance in pixel to detect mouse move

// Load CSS if not
// function insertOverlayCSS() {
//     if (!document.getElementById('overlay-css')) {
//         const link = document.createElement('link');
//         link.id = 'overlay-css';
//         link.rel = 'stylesheet';
//         link.href = chrome.runtime.getURL('css/content_script.css');
//         document.head.appendChild(link);
//     }
// }

// Function to display overlay image
function showOverlay(imgUrl) {
    // If any image is displayed, remove first to replace it
    removeOverlay();
    // insertOverlayCSS();

    const overlay = document.createElement('div');
    overlay.id = 'gesture-overlay';

    const img = document.createElement('img');
    img.src = imgUrl;

    overlay.appendChild(img);
    document.body.appendChild(overlay);
}

// Function to remove overlay image
function removeOverlay() {
    const existingOverlay = document.getElementById('gesture-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
}

// Detect right click down, initialize status
window.addEventListener('mousedown', (e) => {
    if (e.button === 2) { // right click
        // console.log("right click down detected");
        gestureState = 1;
        startX = e.clientX;
        startY = e.clientY;
    }
});

// Monitor mouse move while right click down
window.addEventListener('mousemove', (e) => {
    if (gestureState === 1) {
        if (e.clientY - startY >= minDistance) { // move down
            gestureState = 2;
            // console.log("move down detected");
            const imgUrl = chrome.runtime.getURL("icons/arrow-down.png");
            showOverlay(imgUrl);
            startX = e.clientX;
            startY = e.clientY;
        }
    } else if (gestureState === 2) {
        if (e.clientX - startX >= minDistance) { // move right
            gestureState = 3;
            // console.log("move right detected");
            const imgUrl = chrome.runtime.getURL("icons/arrow-right.png");
            showOverlay(imgUrl);
        }
    }
});

// Detect right click release (up)
window.addEventListener('mouseup', (e) => {
    if (gestureState === 3 && e.button === 2) {
        // console.log("mouse gesture detected");
        chrome.runtime.sendMessage({ type: "closeTab" });
    }
    // Reset the state
    removeOverlay();
    gestureState = 0;
});
