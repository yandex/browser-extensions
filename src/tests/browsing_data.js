'use strict';

var browsing_data_test = new TestSet()
    .require("[Method Exists] browsingData", methodExists(chrome, 'browsingData'))

    .require("[Method Exists] settings", methodExists(chrome.browsingData, 'settings'))
    .require("[Method Call] settings", methodCall(chrome.browsingData, 'settings', () => {}))

    .require("[Method Exists] remove", methodExists(chrome.browsingData, 'remove'))
    .require("[Method Call] remove", methodCall(chrome.browsingData, 'remove', {
        since: (new Date()).getTime()
    }, {
        "appcache": false,
        "cache": false,
        "cookies": false,
        "downloads": false,
        "fileSystems": false,
        "formData": false,
        "history": false,
        "indexedDB": false,
        "localStorage": false,
        "serverBoundCertificates": false,
        "pluginData": false,
        "passwords": false,
        "webSQL": false
    }, () => {}));

for (let suf of ("Appcache Cache Cookies Downloads FileSystems FormData History " +
"IndexedDB LocalStorage PluginData Passwords WebSQL").split(" ")) {
    let method = 'remove' + suf;
    browsing_data_test.require("[Method Exists] " + method, methodExists(chrome.browsingData, method));
    browsing_data_test.require("[Method Call] " + method, () => new Promise(resolve => {
        chrome.browsingData[method]({
            since: (new Date()).getTime()
        }, () => {
            resolve('');
        });
    }), { async: true });
}

browsing_data_test.require("[Check remove history] {this test assumes that chrome.history works correctly}",
    () => new Promise((resolve, reject) => {
            let since = (new Date()).getTime();
            chrome.tabs.create({
                url: "http://ya.ru",
                selected: false
            }, tab => {
                chrome.tabs.onUpdated.addListener((tabID, info) => {
                    if (tab.id == tabID && info.status == "complete") {
                        chrome.tabs.remove(tab.id, () => {
                            chrome.browsingData.removeHistory({
                                since: since
                            }, () => {
                                chrome.history.search({
                                    text: "http://ya.ru",
                                    startTime: since
                                }, arr => {
                                    if (arr.length == 0) {
                                        resolve('');
                                    } else {
                                        reject("Record wasn't deleted from history");
                                    }
                                });
                            });
                        });
                    }
                });
            });
        }
    ), { async: true });
