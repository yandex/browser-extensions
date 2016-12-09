'use strict';

var top_sites_test = new TestSet()
    .require("[Method Exists] topSites", methodExists(chrome, 'topSites'), { hideOnSuccess: true })

    .require("[Method Exists] get", methodExists(chrome.topSites, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", methodCall(chrome.topSites, 'get', () => {}))

    .suggest("[Check Top Sites] find substring \"yandex\" in the top sites list " +
             "(keep in mind that tableau and top sites aren't the same things)", () => {
        return new Promise((resolve, reject) => {
            chrome.topSites.get(arr => {
                for (let site of arr) {
                    if (site.url.indexOf('yandex') != -1) {
                        resolve('');
                        return;
                    }
                }
                reject("*yandex* not found in the top sites list")
            })
        });
    }, { async: true });
