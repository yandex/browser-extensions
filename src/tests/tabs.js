'use strict';

var tabs_test = new TestSet()
    .require("[Method Exists] tabs", methodExists(chrome, 'tabs'))

    .require("[Method Exists] tabs.get()", methodExists(chrome.tabs, 'get'))
    .require("[Method Call] tabs.get()", methodCall(chrome.tabs, 'get', 1, () => {}))

    .require("[Method Exists] tabs.getCurrent()", methodExists(chrome.tabs, 'getCurrent'))
    .require("[Method Call] tabs.getCurrent()", methodCall(chrome.tabs, 'getCurrent', () => {}))

    .require("[Method Exists] tabs.connect()", methodExists(chrome.tabs, 'connect'))
    .require("[Method Call] tabs.connect()", methodCall(chrome.tabs, 'connect', 1))

    .suggest("[Method Exists] {Deprecated} tabs.sendRequest()", methodExists(chrome.tabs, 'sendRequest'))
    .suggest("[Method Call] {Deprecated} tabs.sendRequest()", methodCall(chrome.tabs, 'sendRequest', 1, {}, () => {}))

    .require("[Method Exists] tabs.sendMessage()", methodExists(chrome.tabs, 'sendMessage'))
    .require("[Method Call] tabs.sendMessage()", methodCall(chrome.tabs, 'sendMessage', 1, {}, () => {}))

    .require("[Method Exists] tabs.getSelected()", methodExists(chrome.tabs, 'getSelected'))
    .require("[Method Call] tabs.getSelected()", methodCall(chrome.tabs, 'getSelected', () => {}))

    .require("[Method Exists] tabs.getAllInWindow()", methodExists(chrome.tabs, 'getAllInWindow'))
    .require("[Method Call] tabs.getAllInWindow()", methodCall(chrome.tabs, 'getAllInWindow', () => {}))

    .require("[Method Exists] tabs.create()", methodExists(chrome.tabs, 'create'))
    .require("[Method Call] tabs.create()", methodCall(chrome.tabs, 'create', {
        url: "http://single_tab_test/",
        active: false
    }))
    .require("[Check Created Tab]", () => {
        return new Promise((resolve, reject) => {
            try {
                let resolved = false;
                chrome.windows.getAll({populate: true}, windows => {
                    windows.reduce((chain_0, window_) => {
                        return chain_0.then(() => new Promise(resolve_0 => {
                            window_.tabs.reduce((chain_1, tab) => {
                                return chain_1.then(() => new Promise(resolve_1 => {
                                    if (tab.url == "http://single_tab_test/") {
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
                        if (!resolved) reject("Created tab not found.");
                    });
                });
            } catch(e) {
                reject("Exception: " + e);
            }
        })
    }, TestAsync)

    .require("[Method Exists] tabs.duplicate()", methodExists(chrome.tabs, 'duplicate'))

    .require("[Create and Remove Tabs]", () => {
        return new Promise((resolve, reject) => {
            try {
                const TabsNum = 7;
                let cnt = TabsNum;

                new Promise(resolve_2 => {
                    for (cnt = TabsNum; cnt != 0; --cnt) {
                        chrome.tabs.create({url: "http://chrome_tabs_test/", selected: false});
                    }
                    setTimeout(() => {
                        resolve_2();
                    }, 100);
                }).then(() => {
                    chrome.windows.getAll({populate: true}, windows => {
                        windows.reduce((chain_0, window_) => {
                            return chain_0.then(() => new Promise(resolve_0 => {
                                console.log(window_.tabs);
                                window_.tabs.reduce((chain_1, tab) => {
                                    return chain_1.then(() => new Promise(resolve_1 => {
                                        if (tab.url == "http://chrome_tabs_test/") {
                                            cnt++;
                                            chrome.tabs.remove(tab.id);
                                        }
                                        resolve_1();
                                    }));
                                }, Promise.resolve()).then(() => {
                                    resolve_0()
                                });
                            }));
                        }, Promise.resolve()).then(() => {
                            if (cnt != TabsNum) {
                                reject("Expected number of tabs: " + TabsNum + ", found: " + cnt);
                                return;
                            }

                            cnt = 0;
                            chrome.windows.getAll({populate: true}, windows => {
                                windows.reduce((chain_0, window_) => {
                                    return chain_0.then(() => new Promise(resolve_0 => {
                                        window_.tabs.reduce((chain_1, tab) => {
                                            return chain_1.then(() => new Promise(resolve_1 => {
                                                if (tab.url == "http://chrome_tabs_test/") {
                                                    cnt++;
                                                }
                                                resolve_1();
                                            }));
                                        }, Promise.resolve()).then(() => {
                                            resolve_0();
                                        });
                                    }));
                                }, Promise.resolve()).then(() => {
                                    if (cnt == 0) {
                                        resolve('');
                                    } else {
                                        reject('There is still tabs left after remove: ' + cnt + " tabs.");
                                    }
                                });
                            });
                        });
                    });
                });
            } catch(e) {
                reject("Exception: " + e);
            }
        });
    }, TestAsync);