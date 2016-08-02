let msg = { data: "msg" };
let res = { data: "response" };

let listener = function (response, sender, sendResponse) {
    if (response.data === msg.data) {
        sendResponse(res);
        chrome.runtime.onMessage.removeListener(listener);
    } else {
        sendResponse(true);
    }
};

chrome.runtime.onMessage.addListener(listener);