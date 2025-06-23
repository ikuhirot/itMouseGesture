let gestureBuffer = [];
const maxBufferSize = 10;   // Maximum number of mouse moves to store in the buffer
let isRightClicking = false;
let lastX = 0;
let lastY = 0;
let suppressContextMenu = false;     // Suppress context menu on right click
const threshold = 30;       // Minimum distance in pixel to detect mouse move

window.overlayLib.initImageCache();
window.gestureRecognizerLib.loadGestureDefinitions(() => {
    console.log("Gesture definitions loaded");
});

// Suppress the context menu
window.addEventListener("contextmenu", (e) => {
    if (suppressContextMenu) {
        e.preventDefault();
        suppressContextMenu = false;    // Reset the flag
    }
});

// Detect right click down, initialize status
window.addEventListener("mousedown", (e) => {
    if (e.button === 2) { // right click
        // console.log("right click down detected");
        isRightClicking = true;
        gestureBuffer = [];
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

// Monitor mouse move while right click down
window.addEventListener("mousemove", (e) => {
    if (!isRightClicking || gestureBuffer.length >= maxBufferSize) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    if (Math.abs(dx) >= threshold || Math.abs(dy) >= threshold) {
        // console.log(`Mouse moved: dx=${dx}, dy=${dy}`);
        let dir;
        if (Math.abs(dx) > Math.abs(dy)) {
            dir = dx > 0 ? window.overlayLib.DIRECTION.RIGHT : window.overlayLib.DIRECTION.LEFT;
        } else {
            dir = dy > 0 ? window.overlayLib.DIRECTION.DOWN : window.overlayLib.DIRECTION.UP;
        }

        if (gestureBuffer.length < maxBufferSize) {
            if (gestureBuffer.length === 0 || gestureBuffer.at(-1) !== dir) {   // Only add if it's a new direction
                gestureBuffer.push(dir);
                window.overlayLib.showOverlay(gestureBuffer);
            }
        }

        lastX = e.clientX;
        lastY = e.clientY;
    }
});

// Detect right click release (up)
window.addEventListener("mouseup", (e) => {
    if (e.button === 2) {
        // console.log("mouse gesture detected");
        const res = window.gestureRecognizerLib.recognizeGesture(gestureBuffer);
        if (res) {
            suppressContextMenu = true;     // Suppress context menu if a gesture is recognized
        }

        // Reset the status
        window.overlayLib.removeOverlay();
        gestureBuffer = [];
        isRightClicking = false;
    }
});
