'use strict';

var popup_scripts = new TestSet()
    .require('[empty]', () => '', { hideOnSuccess: true })
    .manual('popup-scripts-test', "Click on extension button again")
    .report_ready(() => {
        const TEST_NAME = 'popup-scripts-test';

        let tabsMsgFromPopup = { data: 'tabs_msg_from_popup' }; // Incoming
        let msgToPopup = { data: 'msg_from_tab' }; // Outgoing
        let runtimeMsgFromPopup = { data: 'runtime_msg_from_popup' }; // Incoming
        let runtimeMsgFromBackground = { data: 'runtime_msg_from_background'}; // Incoming

        // Here tab message is chrome.tabs.sendMessage() and
        // runtime message is chrome.tabs.sendMessage() :

        // 1. Activated popup sends initial tab message to tab.
        // 2. Tab receives initial message and sends broadcast runtime message and popup should receive it.
        // 3. Then popup sends broadcast runtime message to tab and awaits for callback.
        // 4. Background also receives broadcast message from popup.
        // 5. Then background sends broadcast runtime message to tab.
        // 6. If tab received msg from background the test is done.

        let listener = function (response, sender, sendResponse) {
            if (response.data == tabsMsgFromPopup.data) {
                sendResponse('Tab');
                chrome.runtime.sendMessage(msgToPopup, response => {
                    if (response != 'Popup') {
                        failManualTest(
                            TEST_NAME,
                            "Message received by the tab from the popup differs from expected"
                        )
                    }
                });
            } else if (response.data == runtimeMsgFromPopup.data) {
                sendResponse('Tab');
            } else if (response.data == runtimeMsgFromBackground.data) {
                sendResponse('Tab');
                doneManualTest('popup-scripts-test');
                chrome.runtime.onMessage.removeListener(listener);
            }
        };

        chrome.runtime.onMessage.addListener(listener);
    });
