"use strict";

let runtimeMsgFromPopup = { data: 'runtime_msg_from_popup' }; // Incoming
let runtimeMsgToTab = { data: 'runtime_msg_from_background'}; // Outgoing

let listener = function (response, sender, sendResponse) {
    if (response.data == runtimeMsgFromPopup.data) {
        sendResponse('Background');
        chrome.runtime.sendMessage(runtimeMsgToTab, response => {
            if (response != 'Tab') {
                failManualTest(
                    'popup-scripts-test',
                    "Message received by the background from the tab differs from expected"
                )
            } else {
                chrome.runtime.onMessage.removeListener(listener);
            }
        });
    }
};

chrome.runtime.onMessage.addListener(listener);