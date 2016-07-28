chrome.browserAction.onClicked.addListener(function(activeTab) {
    var newURL = chrome.extension.getURL('src/browser_action/browser_action.html');
    chrome.tabs.create({ url: newURL });
});