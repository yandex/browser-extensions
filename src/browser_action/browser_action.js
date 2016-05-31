"use strict";


$(function () {
    let $body = $('body');

    let test = new APITest();

    test.addTestSet("Tabs", new TestSet().require("[Method Exists] tabs", () => {
            return chrome.hasOwnProperty('tabs');
        }).require("[Method Exists] tabs.get()", () => {
            return chrome.tabs.hasOwnProperty('get');
        }).require("[Method Exists] tabs.getCurrent()", () => {
            return chrome.tabs.hasOwnProperty('getCurrent');
        }).require("[Method Exists] tabs.connect()", () => {
            return chrome.tabs.hasOwnProperty('connect');
        }).require("[Method Exists] tabs.sendRequest()", () => {
            return chrome.tabs.hasOwnProperty('sendRequest');
        }).require("[Method Exists] tabs.sendMessage()", () => {
            return chrome.tabs.hasOwnProperty('sendMessage');
        }).require("[Method Exists] tabs.getSelected()", () => {
            return chrome.tabs.hasOwnProperty('getSelected');
        }).require("[Method Exists] tabs.getAllInWindow()", () => {
            return chrome.tabs.hasOwnProperty('getAllInWindow');
        }).require("[Method Exists] tabs.create()", () => {
            return chrome.tabs.hasOwnProperty('create');
        }).require("[Method Exists] tabs.duplicate()", () => {
            return chrome.tabs.hasOwnProperty('duplicate');
        }).require("[Method Exists] tabs.query()", () => {
            return chrome.tabs.hasOwnProperty('query');
        }).require("[Method Exists] tabs.highlight()", () => {
            return chrome.tabs.hasOwnProperty('highlight');
        }).require("[Method Exists] tabs.update()", () => {
            return chrome.tabs.hasOwnProperty('update');
        }).require("[Method Exists] tabs.move()", () => {
            return chrome.tabs.hasOwnProperty('move');
        }).require("[Method Exists] tabs.reload()", () => {
            return chrome.tabs.hasOwnProperty('reload');
        }).require("[Method Exists] tabs.remove()", () => {
            return chrome.tabs.hasOwnProperty('remove');
        }).require("[Method Exists] tabs.detectLanguage()", () => {
            return chrome.tabs.hasOwnProperty('detectLanguage');
        }).require("[Method Exists] tabs.captureVisibleTab()", () => {
            return chrome.tabs.hasOwnProperty('captureVisibleTab');
        }).require("[Method Exists] tabs.executeScript()", () => {
            return chrome.tabs.hasOwnProperty('executeScript');
        }).require("[Method Exists] tabs.insertCSS()", () => {
            return chrome.tabs.hasOwnProperty('insertCSS');
        }).require("[Method Exists] tabs.setZoom()", () => {
            return chrome.tabs.hasOwnProperty('setZoom');
        }).require("[Method Exists] tabs.getZoom()", () => {
            return chrome.tabs.hasOwnProperty('getZoom');
        }).require("[Method Exists] tabs.setZoomSettings()", () => {
            return chrome.tabs.hasOwnProperty('setZoomSettings');
        }).require("[Method Exists] tabs.getZoomSettings()", () => {
            return chrome.tabs.hasOwnProperty('getZoomSettings');
        }).require("[Create and Remove Tabs]", () => {
            return new Promise((resolve, reject) => {
                const TabsNum = 7;
                let cnt = TabsNum;
                for (cnt = TabsNum; cnt != 0; --cnt) {
                    chrome.tabs.create({"url": "http://chrometest/", "selected": false});
                }

                chrome.windows.getAll({populate:true}, function(windows) {
                    windows.forEach(function(window) {
                        window.tabs.forEach(function(tab) {
                            if (tab.url == "http://chrometest/") {
                                cnt++;
                                chrome.tabs.remove(tab.id);
                            }
                        });
                    });

                    if (cnt != TabsNum) {
                        reject();
                        if (cnt != TabsNum) {
                            reject();
                            return;
                        }
                    }

                    cnt = 0;
                    chrome.windows.getAll({populate:true}, function(windows) {
                        windows.forEach(function(window) {
                            window.tabs.forEach(function(tab) {
                                if (tab.url == "http://chrometest/") {
                                    cnt++;
                                }
                            });
                        });

                        if (cnt == 0) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            });
        }, true)
    );

    test.addTestSet("Browser Action", new TestSet().require("[Method Exists] browserAction", () => {
            return chrome.hasOwnProperty('browserAction');
        }).require("[Method Exists] browserAction.setTitle()", () => {
            return chrome.browserAction.hasOwnProperty('setTitle');
        }).require("[Method Exists] browserAction.getTitle()", () => {
            return chrome.browserAction.hasOwnProperty('getTitle');
        }).require("[Method Exists] browserAction.setIcon()", () => {
            return chrome.browserAction.hasOwnProperty('setIcon');
        }).require("[Method Exists] browserAction.setPopup()", () => {
            return chrome.browserAction.hasOwnProperty('setPopup');
        }).require("[Method Exists] browserAction.getPopup()", () => {
            return chrome.browserAction.hasOwnProperty('getPopup');
        }).require("[Method Exists] browserAction.setBadgeText()", () => {
            return chrome.browserAction.hasOwnProperty('setBadgeText');
        }).require("[Method Exists] browserAction.getBadgeText()", () => {
            return chrome.browserAction.hasOwnProperty('getBadgeText');
        }).require("[Method Exists] browserAction.setBadgeBackgroundColor()", () => {
            return chrome.browserAction.hasOwnProperty('setBadgeBackgroundColor');
        }).require("[Method Exists] browserAction.getBadgeBackgroundColor()", () => {
            return chrome.browserAction.hasOwnProperty('getBadgeBackgroundColor');
        }).require("[Method Exists] browserAction.enable()", () => {
            return chrome.browserAction.hasOwnProperty('enable');
        }).require("[Method Exists] browserAction.disable()", () => {
            return chrome.browserAction.hasOwnProperty('disable');
        })
    );

    test.addTestSet("Context Menus", new TestSet().require("[Method Exists] contextMenus", () => {
            return chrome.hasOwnProperty('contextMenus');
        }).require("[Method Exists] contextMenus.create()", () => {
            return chrome.contextMenus.hasOwnProperty('create');
        }).require("[Method Exists] contextMenus.update()", () => {
            return chrome.contextMenus.hasOwnProperty('update');
        }).require("[Method Exists] contextMenus.remove()", () => {
            return chrome.contextMenus.hasOwnProperty('remove');
        }).require("[Method Exists] contextMenus.removeAll()", () => {
            return chrome.contextMenus.hasOwnProperty('removeAll');
        })
    );

    test.addTestSet("Cookies", new TestSet().require("[Method Exists] cookies", () => {
            return chrome.hasOwnProperty('cookies');
        }).require("[Method Exists] cookies.get", () => {
            return chrome.cookies.hasOwnProperty('get');
        }).require("[Method Exists] cookies.getAll", () => {
            return chrome.cookies.hasOwnProperty('getAll');
        }).require("[Method Exists] cookies.set", () => {
            return chrome.cookies.hasOwnProperty('set');
        }).require("[Method Exists] cookies.remove", () => {
            return chrome.cookies.hasOwnProperty('remove');
        }).require("[Method Exists] cookies.getAllCookieStores", () => {
            return chrome.cookies.hasOwnProperty('getAllCookieStores');
        }).require("[Set-Get-Delete Cookies]", () => {
            let CookiesNum = 100;
            let cookies = [];

            for (let i = 0; i != CookiesNum; ++i) {
                cookies["%test" + String(i)] = String(Math.random());
            }

            for (let key in cookies) {
                if (cookies.hasOwnProperty(key)) {
                    chrome.cookies.set({url: "http://chrometest/", name: key, value: cookies[key]});
                }
            }

            return new Promise((resolve, reject) => {
                let cnt = 0, flag = false;
                for (let key in cookies) {
                    if (cookies.hasOwnProperty(key)) {
                        chrome.cookies.get({url: "http://chrometest/", name: key}, function(cookie) {
                            if (flag) return;

                            if (cookie == null) {
                                reject();
                                flag = true;
                                return;
                            }

                            if (cookie.value == cookies[key]) {
                                cnt++;
                            } else {
                                reject();
                                flag = true;
                                return;
                            }

                            if (cnt == CookiesNum) {
                                for (let key in cookies) {
                                    if (cookies.hasOwnProperty(key)) {
                                        chrome.cookies.remove({url: "http://chrometest/", name: key});
                                    }
                                }

                                cnt = 0; flag = false;
                                for (let key in cookies) {
                                    if (cookies.hasOwnProperty(key)) {
                                        chrome.cookies.get({url: "http://chrometest/", name: key}, function(cookie) {
                                            if (flag) return;

                                            if (cookie != null) {
                                                console.log("Check");
                                                reject();
                                                flag = true;
                                            } else {
                                                cnt++;
                                                if (cnt == CookiesNum) {
                                                    resolve();
                                                    flag = true;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }, true)
    );

    test.runAll();
    test.htmlReport().then(res => $body.append(res)).then(() => {
        let $t = $(".test-set");

        $t.css('cursor', 'pointer').click(function() {
            $(this).next().toggle('hidden');
        });
    });
});