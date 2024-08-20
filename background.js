chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ blockingEnabled: true }, () => {
        console.log("Ad blocking is enabled by default.");
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggleBlocking !== undefined) {
        const newState = request.toggleBlocking;
        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: newState ? ["block_ads"] : [],
            disableRulesetIds: newState ? [] : ["block_ads"]
        }, () => {
            chrome.storage.local.set({ blockingEnabled: newState }, () => {
                sendResponse({ success: true });
            });
        });
    }
    return true;  // Indicates we'll respond asynchronously
});
