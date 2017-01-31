'use strict';

var browser_action_test = new TestSet()
    .require("[Method Exists] browserAction", methodExists(chrome, 'browserAction'), { hideOnSuccess: true })

    .require("[Method Exists] setTitle", methodExists(chrome.browserAction, 'setTitle'), { hideOnSuccess: true })
    .require("[Method Call] setTitle", methodCall(chrome.browserAction, 'setTitle', {title: "BrowserActionTest"}))

    .require("[Method Exists] getTitle", methodExists(chrome.browserAction, 'getTitle'), { hideOnSuccess: true })
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
    }, { async: true })

    .require("[Method Exists] setIcon", methodExists(chrome.browserAction, 'setIcon'), { hideOnSuccess: true })
    .require("[Method Call] setIcon", methodCall(chrome.browserAction, 'setIcon', {path: ""}, () => {}))

    .require("[Method Exists] setPopup", methodExists(chrome.browserAction, 'setPopup'), { hideOnSuccess: true })

    .require("[Method Exists] getPopup", methodExists(chrome.browserAction, 'getPopup'), { hideOnSuccess: true })
    .require("[Method Call] getPopup", () => {
        return new Promise((resolve, reject) => {
            chrome.browserAction.getPopup({}, result => {
                if (typeof result === 'string' &&
                    result.indexOf("src/browser_action/bg.html") != -1) {
                    resolve('');
                } else {
                    reject("Popup incorrect");
                }
            })
        });
    }, { async: true });
