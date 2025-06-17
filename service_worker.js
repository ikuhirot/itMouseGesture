chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "closeTab" && sender.tab?.id) {
        chrome.tabs.remove(sender.tab.id, () => {
            if (chrome.runtime.lastError) {
                console.error("Error occurred when closing a tab.", chrome.runtime.lastError);
            }
        });
    }
});
