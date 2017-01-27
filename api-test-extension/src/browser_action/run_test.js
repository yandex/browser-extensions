'use strict';

chrome.tabs.getSelected(tab => {
    if (tab.url.indexOf("chrome-extension://") == -1) {
        let newURL = chrome.extension.getURL('src/browser_action/browser_action.html');
        chrome.tabs.update({ url: newURL });
    } else {
        let $tmp = $('h3');
        $tmp.text("Sending message to tab...");

        let msg = { data: "msg_popup" };
        let res = { data: "response_popup" };

        chrome.tabs.getSelected(tab => {
            chrome.tabs.sendMessage(tab.id, msg, response => {
                if (response.data === res.data) {
                    $tmp.css({ color: 'green' })
                        .text("Manual test for Popup Scripts should pass");
                } else {
                    $tmp.css({ color: 'red' })
                        .text(
                            "Received response is different from expected, " +
                            "hence manual test for Popup Scripts actually failed"
                        );
                }
            });
        });
    }
});
