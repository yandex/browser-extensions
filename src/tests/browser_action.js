'use strict';

var browser_action_test = new TestSet()
    .require("[Method Exists] browserAction", methodExists(chrome, 'browserAction'))

    .require("[Method Exists] setTitle", methodExists(chrome.browserAction, 'setTitle'))
    .require("[Method Call] setTitle", methodCall(chrome.browserAction, 'setTitle', {title: "BrowserActionTest"}))

    .require("[Method Exists] getTitle", methodExists(chrome.browserAction, 'getTitle'))
    .require("[Method Call] getTitle", methodCall(chrome.browserAction, 'getTitle', {}, () => {}))

    .require("[Set-Get Title]", () => {
        return new Promise((resolve, reject) => {
            chrome.browserAction.getTitle({}, title => {
                if (title == "BrowserActionTest") {
                    resolve('');
                } else {
                    reject("Title incorrect");
                }
            })
        });
    }, TestAsync)

    .require("[Method Exists] setIcon", methodExists(chrome.browserAction, 'setIcon'))
    .require("[Method Call] setIcon", methodCall(chrome.browserAction, 'setIcon', {path: ""}, () => {}))

    .require("[Method Exists] setPopup", methodExists(chrome.browserAction, 'setPopup'))

    .require("[Method Exists] getPopup", methodExists(chrome.browserAction, 'getPopup'))
    .require("[Method Call] getPopup", () => {
        return new Promise((resolve, reject) => {
            chrome.browserAction.getPopup({}, result => {
                if (result == "") {
                    resolve('');
                } else {
                    reject("Popup incorrect");
                }
            })
        });
    }, TestAsync);
