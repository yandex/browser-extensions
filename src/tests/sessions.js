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
                        new Promise(next => {
                            chrome.tabs.remove(tab.id, next)
                        }).then(() => new Promise(next => {
                            chrome.sessions.getRecentlyClosed(next);
                        })).then(sessions => new Promise(next => {
                            let last = sessions.find(elem => elem.tab.url == test_url);
                            if (last) {
                                next(last);
                            } else {
                                reject('Just closed tab not found in the recent closed')
                            }
                        })).then(last => new Promise(next => {
                            chrome.sessions.restore(last.tab.sessionId, next);
                        })).then(() => new Promise(next => {
                            chrome.windows.getAll({populate: true}, next);
                        })).then(windows => new Promise(next => {
                            let resolved = false;
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
                                next(resolved);
                            });
                        })).then(resolved => {
                            if (!resolved) {
                                reject("Restored tab not found");
                            }
                        });
                    }
                });
            })
        });
    }, { async: true });
