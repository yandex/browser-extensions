'use strict';

var downloads_test = new TestSet()
    .require("[Method Exists] downloads", methodExists(chrome, 'downloads'), { hideOnSuccess: true })

    .require("[Method Exists] download", methodExists(chrome.downloads, 'download'), { hideOnSuccess: true })
    .require("[Method Call] download", methodCall(chrome.downloads, 'download', {url: ""}, () => {}))

    .require("[Method Exists] search", methodExists(chrome.downloads, 'search'), { hideOnSuccess: true })
    .require("[Method Call] search", methodCall(chrome.downloads, 'search', {}, () => {}))

    .require("[Method Exists] pause", methodExists(chrome.downloads, 'pause'), { hideOnSuccess: true })
    .require("[Method Call] pause", methodCall(chrome.downloads, 'pause', 0, () => {}))

    .require("[Method Exists] resume", methodExists(chrome.downloads, 'resume'), { hideOnSuccess: true })
    .require("[Method Call] resume", methodCall(chrome.downloads, 'resume', 0, () => {}))

    .require("[Method Exists] cancel", methodExists(chrome.downloads, 'cancel'), { hideOnSuccess: true })
    .require("[Method Call] cancel", methodCall(chrome.downloads, 'cancel', 0, () => {}))

    .require("[Method Exists] getFileIcon", methodExists(chrome.downloads, 'getFileIcon'), { hideOnSuccess: true })
    .require("[Method Call] getFileIcon", methodCall(chrome.downloads, 'getFileIcon', 0, {}, () => {}))

    .require("[Method Exists] open", methodExists(chrome.downloads, 'open'), { hideOnSuccess: true })
    .require("[Method Call] open", methodCall(chrome.downloads, 'open', 0))

    .require("[Method Exists] show", methodExists(chrome.downloads, 'show'), { hideOnSuccess: true })
    .require("[Method Call] show", methodCall(chrome.downloads, 'show', 0))

    .require("[Method Exists] showDefaultFolder", methodExists(chrome.downloads, 'showDefaultFolder'),
        { hideOnSuccess: true })
    // .require("[Method Call] showDefaultFolder", methodCall(chrome.downloads, 'showDefaultFolder'))

    .require("[Method Exists] erase", methodExists(chrome.downloads, 'erase'), { hideOnSuccess: true })
    .require("[Method Call] erase", methodCall(chrome.downloads, 'erase', {query: [""], limit: 1}, () => {}))

    .require("[Method Exists] removeFile", methodExists(chrome.downloads, 'removeFile'), { hideOnSuccess: true })
    .require("[Method Call] removeFile", methodCall(chrome.downloads, 'removeFile', 0, () => {}))

    .require("[Method Exists] acceptDanger", methodExists(chrome.downloads, 'acceptDanger'), { hideOnSuccess: true })
    .require("[Method Call] acceptDanger", methodCall(chrome.downloads, 'acceptDanger', 0, () => {}))

    .require("[Method Exists] drag", methodExists(chrome.downloads, 'drag'), { hideOnSuccess: true })
    .require("[Method Call] drag", methodCall(chrome.downloads, 'drag', 0))

    .require("[Method Exists] setShelfEnabled", methodExists(chrome.downloads, 'setShelfEnabled'),
        { hideOnSuccess: true })
    .require("[Method Call] setShelfEnabled", methodCall(chrome.downloads, 'setShelfEnabled', false))

    .require("[Download-Pause-Resume]", () => {
        return new Promise((resolve, reject) => {
            chrome.downloads.download({url: "https://yastatic.net/morda-logo/i/bender/logo.svg"}, id => {
                chrome.downloads.pause(id, () => {
                    chrome.downloads.search({id: id}, arr => {
                        if (arr.length) {
                            if (arr[0].state == "in_progress" && arr[0].paused) {
                                chrome.downloads.resume(id, () => {
                                    chrome.downloads.search({id: id}, arr => {
                                        if (arr[0].state == "in_progress" && !arr[0].paused) {
                                            resolve('');
                                        } else {
                                            reject("Item download wasn't resumed");
                                        }
                                    });
                                });
                            } else {
                                reject("Item expected to be in state in_progress and paused, actual state: " +
                                    arr[0].state + " and " + (arr[0].paused ? "" : "not ") + "paused")
                            }
                        } else {
                            reject("Download item not found.")
                        }
                    });
                });
            });
        });
    }, { async: true });
