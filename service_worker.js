chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab?.id;
    if (!tabId) {
        console.warn("Received message without a valid tab ID.");
        return;
    }
    switch (message.type) {
        case "closeTab":
            // console.log("Closing tab with ID:", tabId);
            chrome.tabs.remove(tabId, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error occurred when closing a tab.", chrome.runtime.lastError);
                }
            });
            break;
        case "newTab":
            // console.log("Creating a new tab.");
            chrome.tabs.create({});
            break;
        default:
            console.warn("Received unknown message type:", message.type);
            break;
    }
});
