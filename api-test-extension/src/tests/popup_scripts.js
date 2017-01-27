'use strict';

var popup_scripts = new TestSet()
    .require('[empty]', () => '', { hideOnSuccess: true })
    .manual('popup-scripts-test', "Click on extension button again")
    .report_ready(() => {
        let msg = { data: "msg_popup" };
        let res = { data: "response_popup" };

        let listener = function (response, sender, sendResponse) {
            console.log(response.data);
            if (response.data === msg.data) {
                doneManualTest('popup-scripts-test');
                sendResponse(res);
                chrome.runtime.onMessage.removeListener(listener);
            } else {
                sendResponse(true);
                failManualTest('popup-scripts-test', "Received message differs from expected");
            }
        };

        chrome.runtime.onMessage.addListener(listener);
    });
