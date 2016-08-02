'use strict';

let root = {
    onBeforeRequest: {
        onBeforeSendHeaders: {
            onSendHeaders: {
                onHeadersReceived: {
                    onAuthRequired: {
                        onBeforeSendHeaders: null
                    },
                    onBeforeRedirect: null,
                    onResponseStarted: {
                        onCompleted: { term: true },
                        onErrorOccurred: { term: true }
                    },
                    onErrorOccurred: { term: true }
                },
                onErrorOccurred: { term: true }
            },
            onErrorOccurred: { term: true }
        },
        onBeforeRedirect: null,
        onResponseStarted: null,
        onErrorOccurred: { term: true }
    }
};

root.onBeforeRequest.onBeforeSendHeaders.onSendHeaders.onHeadersReceived.onAuthRequired.onBeforeSendHeaders =
    root.onBeforeRequest.onBeforeSendHeaders;

root.onBeforeRequest.onBeforeSendHeaders.onSendHeaders.onHeadersReceived.onBeforeRedirect =
    root;

root.onBeforeRequest.onBeforeRedirect =
    root.onBeforeRequest.onBeforeSendHeaders.onSendHeaders.onHeadersReceived.onBeforeRedirect;

root.onBeforeRequest.onResponseStarted =
    root.onBeforeRequest.onBeforeSendHeaders.onSendHeaders.onHeadersReceived.onResponseStarted;

var web_request_test = new TestSet()
    .require("[webRequest life cycle check]", () => new Promise((resolve, reject) => {
        let node = root;
        let query = Date.now();
        let requestId = undefined;
        let curName = 'root';
        let tabID = undefined;

        let get_listener = (name) => {
            return function (details) {
                if (node[name] !== undefined) {
                    if (node[name].term === true) {
                        resolve('');
                        if (tabID) {
                            chrome.tabs.remove(tabID);
                        }
                    }

                    if (requestId === undefined) {
                        if (details.url.indexOf(query) != -1) {
                            requestId = details.requestId;
                        }
                    }

                    if (requestId == details.requestId) {
                        node = node[name];
                        curName = name;
                    }
                } else {
                    if (requestId == details.requestId && requestId !== undefined) {
                        reject(`Request with ID:${requestId} has violated request life cycle, ` +
                               `unexpected transition from ${curName} to ${name} occurred`);
                    }

                    if (tabID) {
                        chrome.tabs.remove(tabID);
                    }
                }
            };
        };

        for (let name of ['onBeforeRequest', 'onBeforeSendHeaders', 'onSendHeaders', 'onHeadersReceived',
                          'onAuthRequired', 'onBeforeRedirect', 'onResponseStarted', 'onCompleted']) {
            chrome.webRequest[name].addListener(get_listener(name), { urls: ["http://ya.ru/*"] });
        }

        chrome.tabs.create({ url: "http://ya.ru/search/?text=" + query }, tab => {
            tabID = tab.id;
        });
    }), { async: true });
