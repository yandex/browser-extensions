'use strict';

var sessions_test = new TestSet()
    .require("[Method Exists]", methodExists(chrome, 'sessions'))

    .require("[Method Exists] getRecentlyClosed", methodExists(chrome.sessions, 'getRecentlyClosed'))
    .require("[Method Call] getRecentlyClosed", methodCall(chrome.sessions, 'getRecentlyClosed', () => {}))

    .require("[Method Exists] getDevices", methodExists(chrome.sessions, 'getDevices'))
    .require("[Method Call] getDevices", methodCall(chrome.sessions, 'getDevices', () => {}))

    .require("[Method Exists] restore", methodExists(chrome.sessions, 'restore'))
    .require("[Method Call] restore", methodCall(chrome.sessions, 'restore', '', () => {}))

    .require("[Create-Close-GetRecent-Restore]", () => {
        let test_url = "http://get_recent_test/";
        return new Promise((resolve, reject) => {
            chrome.tabs.create({
                url: test_url,
                active: false
            }, tab => {
                chrome.tabs.onUpdated.addListener((tabID, info) => {
                    if (tab.id == tabID && info.status == 'complete') {
                        chrome.tabs.remove(tab.id, () => {
                            chrome.sessions.getRecentlyClosed(sessions => {
                                let last = sessions.find(elem => elem.tab.url == test_url);
                                if (last) {
                                    chrome.sessions.restore(last.tab.sessionId, () => {
                                        let resolved = false;
                                        chrome.windows.getAll({populate: true}, windows => {
                                            windows.reduce((chain_0, window_) => {
                                                return chain_0.then(() => new Promise(resolve_0 => {
                                                    window_.tabs.reduce((chain_1, tab) => {
                                                        return chain_1.then(() => new Promise(resolve_1 => {
                                                            if (tab.url == test_url) {
                                                                chrome.tabs.remove(tab.id);
                                                                resolve('');
                                                                resolved = true;
                                                            }
                                                            resolve_1();
                                                        }));
                                                    }, Promise.resolve()).then(() => {
                                                        resolve_0();
                                                    });
                                                }));
                                            }, Promise.resolve()).then(() => {
                                                if (!resolved) {
                                                    reject("Restored tab not found");
                                                }
                                            });
                                        });
                                    })
                                } else {
                                    reject('Just closed tab not found in the recent closed')
                                }
                            })
                        });
                    }
                });
            })
        });
    }, TestAsync);
