'use strict';

const EVENT_TOLERANCE_PERIOD = 1000; // ms

var tabs_test = new TestSet()
    .require("[Method Exists] tabs", methodExists(chrome, 'tabs'), { hideOnSuccess: true })

    .require("[Method Exists] getCurrent", methodExists(chrome.tabs, 'getCurrent'), { hideOnSuccess: true })
    .require("[Method Call] getCurrent", methodCall(chrome.tabs, 'getCurrent', () => {}))

    .require("[Method Exists] get", methodExists(chrome.tabs, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", () => new Promise((resolve, reject) => {
        chrome.tabs.getCurrent(tab => {
            let res = methodCall(chrome.tabs, 'get', tab.id, () => {})();
            if (res == '') {
                resolve(res);
            } else {
                reject(res);
            }
        });
    }), { async: true })

    .require("[Method Exists] connect", methodExists(chrome.tabs, 'connect'), { hideOnSuccess: true })
    .require("[Method Call] connect", methodCall(chrome.tabs, 'connect', 1))

    .suggest("[Method Exists] {Deprecated} sendRequest", methodExists(chrome.tabs, 'sendRequest'),
        { hideOnSuccess: true })
    .suggest("[Method Call] {Deprecated} sendRequest", methodCall(chrome.tabs, 'sendRequest', 1, {}, () => {}))

    .require("[Method Exists] sendMessage", methodExists(chrome.tabs, 'sendMessage'), { hideOnSuccess: true })
    .require("[Method Call] sendMessage", methodCall(chrome.tabs, 'sendMessage', 1, {}, () => {}))

    .require("[Method Exists] executeScript", methodExists(chrome.tabs, 'executeScript'))

    .require("[Check sendMessage, executeScript]", () => new Promise((resolve, reject) => {
        let msg = { data: "msg" };
        let res = { data: "response" };

        chrome.tabs.create({
            url: "http://ya.ru/",
            selected: false
        }, tab => {
            chrome.tabs.executeScript(tab.id, {
                file: "./src/tests/tabs_bg.js"
            }, () => {
                chrome.tabs.sendMessage(tab.id, msg, response => {
                    if (response.data === res.data) {
                        resolve('');
                    } else {
                        reject("Sent and received responses are different")
                    }

                    chrome.tabs.remove(tab.id);
                });
            })
        });
    }), { async: true })

    .require("[Method Exists] getSelected", methodExists(chrome.tabs, 'getSelected'), { hideOnSuccess: true })
    .require("[Method Call] getSelected", methodCall(chrome.tabs, 'getSelected', () => {}))

    .require("[Method Exists] getAllInWindow", methodExists(chrome.tabs, 'getAllInWindow'), { hideOnSuccess: true })
    .require("[Method Call] getAllInWindow", methodCall(chrome.tabs, 'getAllInWindow', () => {}))

    .require("[Method Exists] create", methodExists(chrome.tabs, 'create'), { hideOnSuccess: true })
    .require("[Method Call] create", methodCall(chrome.tabs, 'create', {
        url: "http://single_tab_test/",
        active: false
    }))
    .require("[Check Created Tab]", () => new Promise((resolve, reject) => {
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
    }), { async: true })

    .require("[Method Exists] duplicate", methodExists(chrome.tabs, 'duplicate'), { hideOnSuccess: true })

    .require("[Create and Remove Tabs]", () => {
        return new Promise((resolve, reject) => {
            try {
                const TabsNum = 1;
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
    }, { async: true })

    .report_ready(() => {
        chrome.tabs.getCurrent(tab => {
            chrome.tabs.update(tab.id, {active: true});
        });
    })

    .require("[Method Exists] query", methodExists(chrome.tabs, 'query'), { hideOnSuccess: true })
    .require("[Method Call] query", methodCall(chrome.tabs, 'query', {}, () => {}))

    .require("[Method Exists] highlight", methodExists(chrome.tabs, 'highlight'), { hideOnSuccess: true })
    //.require("[Method Call] highlight", methodCall(chrome.tabs, 'highlight', { tabs: [] }, () => {}))
    .suggest("[Method Call] highlight {causes crash on mobile}", () => "Test disabled") // TODO: Return test after fix

    .require("[Method Exists] move", methodExists(chrome.tabs, 'move'), { hideOnSuccess: true })
    .require("[Method Call] move", () => new Promise((resolve, reject) => {
        chrome.tabs.getCurrent(tab => {
            var res = methodCall(chrome.tabs, 'move', tab.id, { index: -1 }, () => {})();

            if (res == '') {
                resolve(res);
            } else {
                reject(res);
            }
        });
    }), { async: true })

    .require("[Method Exists] reload", methodExists(chrome.tabs, 'reload'), { hideOnSuccess: true })
    .require("[Method Call] reload", () => new Promise (resolve => {
        chrome.tabs.create({ url: "http://ya.ru" }, tab => {
            chrome.tabs.reload(tab.id, () => {
                resolve('');
                chrome.tabs.remove(tab.id, () => {});
            });
        });
    }), { async: true })

    .require("[Method Exists] update", methodExists(chrome.tabs, 'update'), { hideOnSuccess: true })
    .require("[Method Call] update", () => new Promise((resolve, reject) => {
        chrome.tabs.getCurrent(tab => {
            let res = methodCall(chrome.tabs, 'update', tab.id, {}, () => {})();
            if (res == '') {
                resolve(res);
            } else {
                reject(res);
            }
        });
    }), { async: true })

    .require("[Method Exists] detectLanguage", methodExists(chrome.tabs, 'detectLanguage'), { hideOnSuccess: true })
    .require("[Method Call] detectLanguage", methodCall(chrome.tabs, 'detectLanguage', () => {}))

    .require("[Method Exists] captureVisibleTab", methodExists(chrome.tabs, 'captureVisibleTab'),
        { hideOnSuccess: true })
    .require("[Method Call] captureVisibleTab", methodCall(chrome.tabs, 'captureVisibleTab', () => {}))

    .require("[Method Exists] insertCSS", methodExists(chrome.tabs, 'insertCSS'), { hideOnSuccess: true })

    .require("[Method Exists] setZoom", methodExists(chrome.tabs, 'setZoom'), { hideOnSuccess: true })
    .require("[Method Exists] getZoom", methodExists(chrome.tabs, 'getZoom'), { hideOnSuccess: true })

    .require("[Set-Get Zoom]", () => new Promise((resolve, reject) => {
        let zoom = 0;
        chrome.tabs.getZoom(zoom_ => {
            zoom = zoom_;
            chrome.tabs.setZoom(2.0, () => {
                setTimeout(() => {
                    chrome.tabs.getZoom(zoom_ => {
                        if (zoom_ == 2.0) {
                            resolve('');
                            chrome.tabs.setZoom(zoom, () => {});
                        } else {
                            reject("Zoom wasn't set correctly");
                        }
                    })
                }, 500);
            })
        });
    }), { async: true })

    .require("[Method Exists] setZoomSettings", methodExists(chrome.tabs, 'setZoomSettings'), { hideOnSuccess: true })
    .require("[Method Call] setZoomSettings", methodCall(chrome.tabs, 'setZoomSettings', {}, () => {}))

    .require("[Method Exists] getZoomSettings", methodExists(chrome.tabs, 'getZoomSettings'), { hideOnSuccess: true })
    .require("[Method Call] getZoomSettings", methodCall(chrome.tabs, 'getZoomSettings', () => {}))

    .require("[Event onCreated]", () => {
        return new Promise((resolve, reject) => {
            let resolved = false;

            let listener = function(tab) {
                if (tab.url == "http://on_created_tab_test/") {
                    chrome.tabs.onCreated.removeListener(listener);
                    resolved = true;
                    chrome.tabs.remove(tab.id);
                    resolve('');
                }
            };

            chrome.tabs.onCreated.addListener(listener);

            chrome.tabs.create({
                url: "http://on_created_tab_test/",
                active: false
            }, () => {
                setTimeout(() => {
                    if (!resolved) {
                        reject("Event onCreated wasn't fired");
                    }
                }, EVENT_TOLERANCE_PERIOD);
            });
        });
    }, { async: true })

    .require("[Event onUpdated]", () => {
        return new Promise((resolve, reject) => {
            let resolved = false;

            let listener = function (id, info, tab) {
                if (tab.url == "http://on_updated_tab_test/#") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolved = true;
                    chrome.tabs.remove(id);
                    resolve('');
                }
            };

            chrome.tabs.onUpdated.addListener(listener);

            chrome.tabs.create({
                url: "http://on_updated_tab_test/",
                active: false
            }, tab => {
                chrome.tabs.update(tab.id, {
                    url: "http://on_updated_tab_test/#"
                }, () => {
                    setTimeout(() => {
                        if (!resolved) {
                            reject("Event onUpdated wasn't fired");
                        }
                    }, EVENT_TOLERANCE_PERIOD);
                });
            });
        });
    }, { async: true })

    .manual('tabs-on-moved-test', "Move current tab within the window")
    .report_ready(() => {
        let listener = function (id, info) {
            chrome.tabs.getCurrent(tab => {
                if (tab.id == id) {
                    chrome.tabs.onMoved.removeListener(listener);
                    doneManualTest('tabs-on-moved-test');
                }
            });
        };

        chrome.tabs.onMoved.addListener(listener);
    })

    .require("[Event onActivated]", () => new Promise((resolve, reject) => {
        let resolved = false;

        chrome.tabs.create({
            url: "http://on_activated_tab_test/",
            active: false
        }, tab => {
            let listener = function (info) {
                if (info.tabId == tab.id) {
                    chrome.tabs.onActivated.removeListener(listener);
                    resolved = true;
                    chrome.tabs.remove(info.tabId);
                    resolve('');
                }
            };

            chrome.tabs.onActivated.addListener(listener);

            chrome.tabs.update(tab.id, { active: true }, () => {
                setTimeout(() => {
                    if (!resolved) {
                        reject("Event onActivated wasn't fired")
                    }
                }, EVENT_TOLERANCE_PERIOD);
            });
        });
    }), { async: true })

    .require("[Event onRemoved]", () => new Promise((resolve, reject) => {
        let resolved = false;

        chrome.tabs.create({
            url: "http://on_removed_tab_test/",
            active: false
        }, tab => {
            let listener = function (id, info) {
                if (id == tab.id) {
                    chrome.tabs.onRemoved.removeListener(listener);
                    resolved = true;
                    resolve('');
                }
            };

            chrome.tabs.onRemoved.addListener(listener);

            chrome.tabs.remove(tab.id, () => {
                setTimeout(() => {
                    if (!resolved) {
                        reject("Event onRemove wasn't fired");
                    }
                }, EVENT_TOLERANCE_PERIOD);
            });
        })

    }), { async: true });
