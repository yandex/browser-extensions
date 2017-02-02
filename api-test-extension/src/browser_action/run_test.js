'use strict';

chrome.tabs.getSelected(tab => {
    if (tab.url.indexOf("chrome-extension://") == -1) {
        let newURL = chrome.extension.getURL('src/browser_action/browser_action.html');
        chrome.tabs.update({ url: newURL });
    } else {
        let $tmp = $('h3');
        $tmp.text("Sending message to tab...");

        const TEST_NAME = 'popup-scripts-test';

        let tabsMsgToPopup = { data: 'tabs_msg_from_popup' }; // Outgoing
        let msgFromTab = { data: 'msg_from_tab' }; // Incoming
        let runtimeMsgToTab = { data: 'runtime_msg_from_popup' }; // Outgoing

        chrome.tabs.getSelected(tab => {
            chrome.tabs.sendMessage(tab.id, tabsMsgToPopup, response => {
                if (response != 'Tab') {
                    failManualTest(
                        TEST_NAME,
                        "Message received by popup from tab differs from expected"
                    );
                }
            });
        });

        let responses = new Set(['Tab', 'Background']);

        let listener = function (response, sender, sendResponse) {
            if (response.data == msgFromTab.data) {
                sendResponse('Popup');
                chrome.runtime.sendMessage(runtimeMsgToTab, response => {
                    if (response in responses) {
                        responses.delete(response.data);

                         if (!responses.size) {
                             chrome.runtime.onMessage.removeListener(listener);
                         }
                    } else {
                        failManualTest(
                            TEST_NAME,
                            "Message received by the popup from the tab differs from expected"
                        )
                    }
                });
            }
        };

        chrome.runtime.onMessage.addListener(listener);
    }
});
