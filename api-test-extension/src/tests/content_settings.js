'use strict';

let detailsBlock = {
    primaryPattern: "http://apitest.test/*",
    setting: 'block'
};

let detailsGet = {
    primaryUrl: "http://apitest.test/*",
    secondaryUrl: "http://test.test/"
};

let settingsCheckConvolution = (prev, curr) => {
    let prop = curr;
    return prev.then(result => new Promise(resolve_ => {
        if (result !== "") {
            resolve_(result);
        } else {
            chrome.contentSettings[prop.name].get(detailsGet, details => {
                if (details.setting == prop.expectedStatus) {
                    resolve_("");
                } else {
                    resolve_(`Expected status for ${ prop.name } is '${
                        prop.expectedStatus
                        }', got '${ details.setting }' instead`);
                }
            });
        }
    }));
};

let propertyNames = [
    'cookies', 'javascript', 'location', 'popups', 'notifications',
    'fullscreen', 'microphone', 'camera', 'automaticDownloads'
];

let defaultProperties = [];

var content_settings_test = new TestSet()
    .require("[Method Exists]", methodExists(chrome, 'contentSettings'), { hideOnSuccess: true })

    .require("[Clear Settings to Define Defaults]", () => new Promise(resolve => {
        propertyNames.reduce((prev, curr) => {
            let propName = curr;
            return prev.then(() => new Promise(resolve_ => {
                chrome.contentSettings[propName].clear({}, resolve_);
            }));
        }, Promise.resolve()).then(resolve);
    }), { async: true, hideOnSuccess: true })

    .require("[Get Default Settings]", () => new Promise(resolve => {
        propertyNames.reduce((prev, curr) => {
            let propName = curr;
            return prev.then(() => new Promise(resolve_ => {
                chrome.contentSettings[propName].get(detailsGet, details => {
                    defaultProperties.push({
                        name: propName,
                        expectedStatus: details.setting
                    });
                    resolve_();
                });
            }));
        }, Promise.resolve("")).then(resolve);
    }), { async: true, hideOnSuccess: true })

    .require("[Property Exists] cookies", methodExists(chrome.contentSettings, 'cookies'), { hideOnSuccess: true })
    .require("[Property Set] cookies", methodCall(chrome.contentSettings.cookies, 'set', detailsBlock, () => {}))

    .require("[Property Exists] javascript",
        methodExists(chrome.contentSettings, 'javascript'), { hideOnSuccess: true })
    .require("[Property Set] javascript",
        methodCall(chrome.contentSettings.javascript, 'set', detailsBlock, () => {}))

    .require("[Property Exists] location", methodExists(chrome.contentSettings, 'location'), { hideOnSuccess: true })
    .require("[Property Set] location", methodCall(chrome.contentSettings.location, 'set', detailsBlock, () => {}))

    .require("[Property Exists] popups", methodExists(chrome.contentSettings, 'popups'), { hideOnSuccess: true })
    .require("[Property Set] popups", methodCall(chrome.contentSettings.popups, 'set', detailsBlock, () => {}))

    .require("[Property Exists] notifications",
        methodExists(chrome.contentSettings, 'notifications'), { hideOnSuccess: true })
    .require("[Property Set] notifications",
        methodCall(chrome.contentSettings.notifications, 'set', detailsBlock, () => {}))

    .require("[Property Exists] fullscreen",
        methodExists(chrome.contentSettings, 'fullscreen'), { hideOnSuccess: true })
    .require("[Property Set] fullscreen",
        methodCall(chrome.contentSettings.fullscreen, 'set', {
            primaryPattern: "http://apitest.test/*",
            setting: 'ask'
        }, () => {}))

    .require("[Property Exists] microphone",
        methodExists(chrome.contentSettings, 'microphone'), { hideOnSuccess: true })
    .require("[Property Set] microphone",
        methodCall(chrome.contentSettings.microphone, 'set', detailsBlock, () => {}))

    .require("[Property Exists] camera", methodExists(chrome.contentSettings, 'camera'), { hideOnSuccess: true })
    .require("[Property Set] camera", methodCall(chrome.contentSettings.camera, 'set', detailsBlock, () => {}))

    .require("[Property Exists] automaticDownloads",
        methodExists(chrome.contentSettings, 'automaticDownloads'), { hideOnSuccess: true })
    .require("[Property Set] automaticDownloads",
        methodCall(chrome.contentSettings.automaticDownloads, 'set', detailsBlock, () => {}))

    .require("[Check Settings]", () => new Promise((resolve, reject) => {
        [...function* () {
            for (let prop of propertyNames.filter(val => val != 'fullscreen')) {
                yield { name: prop, expectedStatus: 'block' };
            }
            yield { name: 'fullscreen', expectedStatus: 'ask' };
        }()].reduce(settingsCheckConvolution, Promise.resolve("")).then(result => {
            if (result === "") {
                resolve("");
            } else {
                reject(result);
            }
        });
    }), { async: true })

    .require("[Clear Settings]", () => new Promise(resolve => {
        propertyNames.reduce((prev, curr) => {
            let propName = curr;
            return prev.then(() => new Promise(resolve_ => {
                chrome.contentSettings[propName].clear({}, resolve_);
            }));
        }, Promise.resolve()).then(() => resolve(''));
    }), { async: true })

    .require("[Check Settings After Clear]", () => new Promise((resolve, reject) => {
        defaultProperties.reduce(settingsCheckConvolution, Promise.resolve("")).then(result => {
            if (result === "") {
                resolve("");
            } else {
                reject(result);
            }
        });
    }), { async: true });