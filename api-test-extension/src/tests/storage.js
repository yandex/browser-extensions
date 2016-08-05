'use strict';

var storage_test = new TestSet()
    .require("[Method Exists] storage", methodExists(chrome, 'storage'), { hideOnSuccess: true })

    .require("[Method Exists] local", methodExists(chrome.storage, 'local'), { hideOnSuccess: true })

    .require("[Method Exists] set", methodExists(chrome.storage.local, 'set'), { hideOnSuccess: true })
    .require("[Method Call] set", methodCall(chrome.storage.local, 'set', {}, () => {}))

    .require("[Method Exists] get", methodExists(chrome.storage.local, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", methodCall(chrome.storage.local, 'get', '', () => {}))

    .require("[Method Exists] remove", methodExists(chrome.storage.local, 'remove'), { hideOnSuccess: true })
    .require("[Method Call] remove", methodCall(chrome.storage.local, 'remove', '', () => {}))

    .require("[Set-Get-Remove]", () => new Promise((resolve, reject) => {
        let key = 'storage_local_test';
        chrome.storage.local.set({
            storage_local_test: "test"
        }, () => {
            chrome.storage.local.get(key, items => {
                if (items[key] == "test") {
                    chrome.storage.local.remove(key, () => {
                        chrome.storage.local.get(key, items => {
                            if (items[key] === undefined) {
                                resolve('');
                            } else {
                                reject("Item wasn't removed")
                            }
                        });
                    });
                } else {
                    reject("Item set but not found")
                }
            });
        });
    }), { async: true });