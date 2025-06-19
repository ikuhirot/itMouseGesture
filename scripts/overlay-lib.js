window.overlayLib = (function () {
    const DIRECTION = {
        UP: 1,
        DOWN: 2,
        RIGHT: 3,
        LEFT: 4
    };
    const directionImageCache = new Map();

    function initImageCache() {
        const directions = {
            [DIRECTION.UP]: "arrow-up.png",
            [DIRECTION.DOWN]: "arrow-down.png",
            [DIRECTION.RIGHT]: "arrow-right.png",
            [DIRECTION.LEFT]: "arrow-left.png"
        };

        for (const [code, file] of Object.entries(directions)) {
            const img = new Image();
            img.src = chrome.runtime.getURL(`icons/${file}`);
            directionImageCache.set(Number(code), img);
        }
    }

    // Function to display overlay image
    function showOverlay(buffer) {
        // If any image is displayed, remove first to replace it
        removeOverlay();

        const overlay = document.createElement("div");
        overlay.id = "gesture-overlay";

        for (const code of buffer) {
            const cachedImage = directionImageCache.get(code);
            if (cachedImage) {
                const clone = cachedImage.cloneNode();
                clone.classList.add("gesture-icon");
                overlay.appendChild(clone);
            }
        }

        document.body.appendChild(overlay);
    }

    // Function to remove overlay image
    function removeOverlay() {
        const existingOverlay = document.getElementById("gesture-overlay");
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }

    return {
        DIRECTION,
        initImageCache,
        showOverlay,
        removeOverlay
    };
})();
