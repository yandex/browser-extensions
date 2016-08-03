'use strict';

var windows_test = new TestSet()
    .require("[Method Exists] windows", methodExists(chrome, 'windows'), { hideOnSuccess: true })

    .require("[Method Exists] getCurrent", methodExists(chrome.windows, 'getCurrent'), { hideOnSuccess: true })
    .require("[Method Call] getCurrent", methodCall(chrome.windows, 'getCurrent', () => {}))

    .require("[Method Exists] get", methodExists(chrome.windows, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", () => new Promise(resolve => {
        chrome.windows.getCurrent(window => {
            chrome.windows.get(window.id, () => {
                resolve('');
            });
        });
    }), { async: true })

    .require("[Method Exists] getLastFocused", methodExists(chrome.windows, 'getLastFocused'), { hideOnSuccess: true })
    .require("[Method Call] getLastFocused", methodCall(chrome.windows, 'getLastFocused', () => {}))

    .require("[Method Exists] getAll", methodExists(chrome.windows, 'getAll'), { hideOnSuccess: true })
    .require("[Method Call] getAll", methodCall(chrome.windows, 'getAll', () => {}))

    .suggest("[Method Exists] create {unavailable for mobile}",
        methodExists(chrome.windows, 'create'), { hideOnSuccess: true })

    .require("[Method Exists] update", methodExists(chrome.windows, 'update'), { hideOnSuccess: true })
    .require("[Method Call] update", () => new Promise(resolve => {
        chrome.windows.getCurrent(window => {
            chrome.windows.update(window.id, {}, () => {
                resolve('');
            });
        });
    }), { async: true })

    .suggest("[Method Exists] remove {unavailable for mobile}",
        methodExists(chrome.windows, 'remove'), { hideOnSuccess: true })

    // .suggest("[Create-Remove]", () => new Promise(resolve => {
    //     let listener = function (window_) {
    //         setTimeout(() => {
    //             chrome.windows.remove(window_.id, () => {
    //                 chrome.windows.onCreated.removeListener(listener);
    //                 resolve('');
    //             });
    //         }, 1000);
    //     };
    //
    //     chrome.windows.onCreated.addListener(listener);
    //
    //     chrome.windows.create(() => {});
    // }), { async: true })
    .suggest("[Create-Remove] {causes crash on mobile}", () => "Test disabled") // TODO: Return test after fix

    .require("[GetCurrent-Get-Update]", () => new Promise((resolve, reject) => {
        chrome.windows.getCurrent(window => {
            chrome.windows.get(window.id, window_ => {
                if (window.id == window_.id) {
                    chrome.windows.update(window.id, { focused: true }, () => {
                        if (chrome.runtime.lastError) {
                            reject(JSON.stringify(chrome.runtime.lastError));
                        }
                        resolve('');
                    });
                } else {
                    reject("Windows IDs are different");
                }
            })
        })
    }), { async: true });
