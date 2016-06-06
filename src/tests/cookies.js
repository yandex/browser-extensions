'use strict';

var cookies_test = new TestSet()
    .require("[Method Exists] cookies", methodExists(chrome, 'cookies'))

    .require("[Method Exists] cookies.get", methodExists(chrome.cookies, 'get'))
    .require("[Method Call] cookies.get", methodCall(chrome.cookies, 'get', {url: '', name: ''}, () => {}))

    .require("[Method Exists] cookies.getAll", methodExists(chrome.cookies, 'getAll'))
    .require("[Method Call] cookies.getAll", methodCall(chrome.cookies, 'getAll', {url: '', name: ''}, () => {}))

    .require("[Method Exists] cookies.set", methodExists(chrome.cookies, 'set'))
    .require("[Method Call] cookies.set", methodCall(chrome.cookies, 'set', {url: ''}))

    .require("[Method Exists] cookies.remove", methodExists(chrome.cookies, 'remove'))
    .require("[Method Call] cookies.remove", methodCall(chrome.cookies, 'remove', {url: '', name: ''}, () => {}))

    .require("[Method Exists] cookies.getAllCookieStores", methodExists(chrome.cookies, 'getAllCookieStores'))
    .require("[Method Call] cookies.getAllCookieStores", methodCall(chrome.cookies, 'getAllCookieStores', () => {}))

    .require("[Set-Get-Delete Cookies]", () => {
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
                    chrome.cookies.get({url: "http://chrometest/", name: key}, function (cookie) {
                        if (flag) return;

                        if (cookie == null) {
                            reject('Cookie not found');
                            flag = true;
                            return;
                        }

                        if (cookie.value == cookies[key]) {
                            cnt++;
                        } else {
                            reject('Cookie found but value is different');
                            flag = true;
                            return;
                        }

                        if (cnt == CookiesNum) {
                            for (let key in cookies) {
                                if (cookies.hasOwnProperty(key)) {
                                    chrome.cookies.remove({url: "http://chrometest/", name: key});
                                }
                            }

                            cnt = 0;
                            flag = false;
                            for (let key in cookies) {
                                if (cookies.hasOwnProperty(key)) {
                                    chrome.cookies.get({url: "http://chrometest/", name: key}, function (cookie) {
                                        if (flag) return;

                                        if (cookie != null) {
                                            reject('Cookie still exists after delete');
                                            flag = true;
                                        } else {
                                            cnt++;
                                            if (cnt == CookiesNum) {
                                                resolve('');
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
    }, TestAsync);


