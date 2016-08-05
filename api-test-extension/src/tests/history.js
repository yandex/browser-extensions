'use strict';

var history_test = new TestSet()
    .require("[Method Exists] history", methodExists(chrome, 'history'), { hideOnSuccess: true })

    .require("[Method Exists] search", methodExists(chrome.history, 'search'), { hideOnSuccess: true })
    .require("[Method Call] search", methodCall(chrome.history, 'search', {text: ""}, () => {}))

    .require("[Method Exists] getVisits", methodExists(chrome.history, 'getVisits'), { hideOnSuccess: true })
    .require("[Method Call] getVisits", methodCall(chrome.history, 'getVisits', {url: "ya.ru"}, () => {}))

    .require("[Method Exists] addUrl", methodExists(chrome.history, 'addUrl'), { hideOnSuccess: true })
    .require("[Method Call] addUrl", methodCall(chrome.history, 'addUrl', {url: "ya.ru"}, () => {}))

    .require("[Method Exists] deleteUrl", methodExists(chrome.history, 'deleteUrl'), { hideOnSuccess: true })
    .require("[Method Call] deleteUrl", methodCall(chrome.history, 'deleteUrl', {url: ""}, () => {}))

    .require("[Method Exists] deleteRange", methodExists(chrome.history, 'deleteRange'), { hideOnSuccess: true })
    .require("[Method Call] deleteRange", methodCall(chrome.history, 'deleteRange', {
        startTime: (new Date()).getTime() - 1,
        endTime: (new Date()).getTime()
    }, () => {}))

    .require("[Method Exists] deleteAll", methodExists(chrome.history, 'deleteAll'), { hideOnSuccess: true })
    .manual("history-delete-all", "Delete all the history (careful!) " +
            "<button id='history-delete-all-button'>Delete</button>")

    .require("[Add-Search-Delete]", () => {
        return new Promise((resolve, reject) => {
            let url = "http://chrome_history_test";
            chrome.history.addUrl({url: url}, () => {
                chrome.history.search({text: url}, arr => {
                    if (arr.length != 0) {
                        chrome.history.deleteUrl({url: url}, () => {
                            chrome.history.search({text: url}, arr => {
                                if (arr.length == 0) {
                                    resolve('');
                                } else {
                                    reject('History item was added but not deleted');
                                }
                            })
                        })
                    } else {
                        reject("History item wasn't added");
                    }
                });
            })
        });
    }, { async: true })

    .report_ready(() => {
        $('#history-delete-all_button').click(() => {
            chrome.history.deleteAll(() => {
                chrome.history.search({text: ''}, arr => {
                    if (arr.length == 0) {
                        doneManualTest('history-delete-all');
                    } else {
                        failManualTest('history-delete-all');
                    }
                })
            });
        });
    });
