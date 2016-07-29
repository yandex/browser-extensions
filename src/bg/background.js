chrome.browserAction.onClicked.addListener(() => {
    var newURL = chrome.extension.getURL('src/browser_action/browser_action.html');
    chrome.tabs.create({ url: newURL });
});