'use strict';

let windowID = 0;

var windows_test = new TestSet()
    .require("[Method Exists] windows", methodExists(chrome, 'windows'), { hideOnSuccess: true })

    .require("[Method Exists] getCurrent", methodExists(chrome.windows, 'getCurrent'), { hideOnSuccess: true })
    .require("[Method Call] getCurrent", methodCall(chrome.windows, 'getCurrent', window => {
        windowID = window.id;
    }))

    .require("[Method Exists] get", methodExists(chrome.windows, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", methodCall(chrome.windows, 'get', windowID, () => {}))

    .require("[Method Exists] getLastFocused", methodExists(chrome.windows, 'getLastFocused'), { hideOnSuccess: true })
    .require("[Method Call] getLastFocused", methodCall(chrome.windows, 'getLastFocused', () => {}))

    .require("[Method Exists] getAll", methodExists(chrome.windows, 'getAll'), { hideOnSuccess: true })
    .require("[Method Call] getAll", methodCall(chrome.windows, 'getAll', () => {}))

    .suggest("[Method Exists] create {unavailable for mobile}",
        methodExists(chrome.windows, 'create'), { hideOnSuccess: true })

    .require("[Method Exists] update", methodExists(chrome.windows, 'update'), { hideOnSuccess: true })
    .require("[Method Call] update", methodCall(chrome.windows, 'update', windowID, {}, () => {}))

    .suggest("[Method Exists] remove {unavailable for mobile}",
        methodExists(chrome.windows, 'remove'), { hideOnSuccess: true })

    .suggest("[Create-Remove]", () => new Promise(resolve => {
        let listener = function (window_) {
            setTimeout(() => {
                chrome.windows.remove(window_.id, () => {
                    chrome.windows.onCreated.removeListener(listener);
                    resolve('');
                });
            }, 1000);
        };

        chrome.windows.onCreated.addListener(listener);

        chrome.windows.create(() => {});
    }), { async: true })

    .require("[GetCurrent-Get-Update]", () => new Promise((resolve, reject) => {
        chrome.windows.getCurrent(window => {
            chrome.windows.get(window.id, window_ => {
                if (window.id == window_.id) {
                    chrome.windows.update(window.id, { focused: true }, () => {
                        resolve('');
                    });
                } else {
                    reject("Windows IDs are different");
                }
            })
        })
    }), { async: true });
