'use strict';

/*
Tests for chrome.extension
https://developer.chrome.com/extensions/extension
* */

const extension_test = new TestSet()
    .require("[Method Exists] extension", methodExists(chrome, 'extension'), { hideOnSuccess: true })

    .suggest("[Method Exists] sendRequest {deprecated}",
        methodExists(chrome.extension, 'sendRequest'), { hideOnSuccess: true })
    .suggest("[Method Call] sendRequest {deprecated}",
        methodCall(chrome.extension, 'sendRequest', {}))

    .require("[Method Exists] getURL", methodExists(chrome.extension, 'getURL'), { hideOnSuccess: true })
    .require("[Method Call] getURL", methodCall(chrome.extension, 'getURL', "/"), { hideOnSuccess: true })
    .require("[Check getURL]",
        () => chrome.extension.getURL("/") == `chrome-extension://${document.location.hostname}/`
            ? ''
            : `Incorrect url: expected ${ 
                `chrome-extension://${document.location.hostname}/` 
            }, got ${ chrome.extension.getURL("/") } instead`
    )

    .require("[Method Exists] getViews", methodExists(chrome.extension, 'getViews'), { hideOnSuccess: true })
    .require("[Method Call] getViews", methodCall(chrome.extension, 'getViews', {}), { hideOnSuccess: true })
    .require("[Check getViews]", () => new Promise((resolve, reject) => {
        let pages = chrome.extension.getViews();

        if (pages.length != 2) {
            return reject("Expected number of pages to be found is 2, found: " + String(pages.length));
        }

        if (!pages[0].document.querySelector(".title .title-container")
            && !pages[1].document.querySelector(".title .title-container")) {
            return reject("Expected element for main page not found in pages");
        }

        if (!pages[0].document.getElementById('bg-div-elem')
            && !pages[1].document.getElementById('bg-div-elem')) {
            return reject("Expected element for background page not found in pages");
        }

        return resolve('');
    }), { async: true })

    .require("[Method Exists] getBackgroundPage",
        methodExists(chrome.extension, 'getBackgroundPage'), { hideOnSuccess: true })
    .require("[Method Call] getBackgroundPage",
        methodCall(chrome.extension, 'getBackgroundPage'), { hideOnSuccess: true })
    .require("[Check getBackgroundPage]", () => new Promise((resolve, reject) => {
        let bgPage = chrome.extension.getBackgroundPage();

        if (bgPage.document.getElementById('bg-div-elem')) {
            return resolve('');
        } else {
            return reject("Expected element not found on background page");
        }
    }), { async: true })

    .suggest("[Method Exists] getExtensionTabs {deprecated}",
        methodExists(chrome.extension, 'getExtensionTabs'), { hideOnSuccess: true })
    .suggest("[Method Call] getExtensionTabs {deprecated}",
        methodExists(chrome.extension, 'getExtensionTabs'))

    .require("[Method Exists] isAllowedIncognitoAccess",
        methodExists(chrome.extension, 'isAllowedIncognitoAccess'), { hideOnSuccess: true })
    .require("[Method Call] isAllowedIncognitoAccess",
        methodCall(chrome.extension, 'isAllowedIncognitoAccess', () => {}), { hideOnSuccess: true })
    .require("[Check isAllowedIncognitoAccess]", () => new Promise((resolve, reject) => {
        chrome.extension.isAllowedIncognitoAccess(isAllowedAccess => {
            if (typeof isAllowedAccess == "boolean") {
                return resolve('');
            } else {
                console.log("[Check isAllowedIncognitoAccess]", isAllowedAccess);
                return reject(`Returned callback value expected to be boolean, got ${
                    typeof isAllowedAccess
                } instead (see the console for value)`);
            }
        });
    }), { async: true })

    .require("[Method Exists] isAllowedFileSchemeAccess",
        methodExists(chrome.extension, 'isAllowedFileSchemeAccess'), { hideOnSuccess: true })
    .require("[Method Call] isAllowedFileSchemeAccess",
        methodCall(chrome.extension, 'isAllowedFileSchemeAccess', () => {}), { hideOnSuccess: true })
    .require("[Check isAllowedFileSchemeAccess]", () => new Promise((resolve, reject) => {
        chrome.extension.isAllowedFileSchemeAccess(isAllowedAccess => {
            if (typeof isAllowedAccess == "boolean") {
                return resolve('');
            } else {
                console.log("[Check isAllowedFileSchemeAccess]", isAllowedAccess);
                return reject(`Returned callback value expected to be boolean, got ${
                    typeof isAllowedAccess
                } instead (see the console for value)`);
            }
        });
    }), { async: true })

    .require("[Method Exists] setUpdateUrlData",
        methodExists(chrome.extension, 'setUpdateUrlData'), { hideOnSuccess: true })
    .require("[Method Call] setUpdateUrlData",
        methodCall(chrome.extension, 'setUpdateUrlData', ""))

    .suggest("[Event Exists] onRequest {deprecated}",
        eventExists(chrome.extension, 'onRequest'), { hideOnSuccess: true })
    .suggest("[Event Use] onRequest {deprecated}", eventUse(chrome.extension, 'onRequest'))

    .suggest("[Event Exists] onRequestExternal {deprecated}",
        eventExists(chrome.extension, 'onRequestExternal'), { hideOnSuccess: true })
    .suggest("[Event Use] onRequestExternal {deprecated}", eventUse(chrome.extension, 'onRequestExternal'))

; // -- extension_test -- //
