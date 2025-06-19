window.gestureRecognizerLib = (function () {
    let gestureDefinitions = new Map();

    function loadGestureDefinitions(callback) {
        fetch(chrome.runtime.getURL("config/gestures.json"))
            .then(res => res.json())
            .then(json => {
                gestureDefinitions = new Map();
                for (const length in json) {
                    const gestures = json[length];
                    if (Array.isArray(gestures)) {
                        gestureDefinitions.set(Number(length), gestures);
                    }
                }
                if (callback) callback();
            });
    }

    function recognizeGesture(buffer) {
        const gestures = gestureDefinitions.get(buffer.length);
        if (!gestures) {
            return null
        }
        for (const gesture of gestures) {
            if (arraysMatch(buffer, gesture.pattern)) {
                executeAction(gesture.action);
                return gesture.name;
            }
        }

        return null;
    }

    function arraysMatch(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    function executeAction(actionName) {
        switch (actionName) {
            case "goBack":
                // console.log("goBack detected");
                history.back();
                break;
            case "goForward":
                // console.log("goForward detected");
                history.forward();
                break;
            case "newTab":
                // console.log("newTab detected");
                chrome.runtime.sendMessage({ type: "newTab" });
                break;
            case "closeTab":
                // console.log("closeTab detected");
                chrome.runtime.sendMessage({ type: "closeTab" });
                break;
            case "reloadTab":
                // console.log("reloadTab detected");
                location.reload();
                break;
            default:
                console.warn(`Unknown gesture action: ${actionName}`);
        }
    }

    return {
        loadGestureDefinitions,
        recognizeGesture
    };
})();
