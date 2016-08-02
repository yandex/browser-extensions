'use strict';

var idle_test = new TestSet()
    .require("[Method Exists] idle", methodExists(chrome, 'idle'), { hideOnSuccess: true })

    .require("[Method Exists] queryState", methodExists(chrome.idle, 'queryState'), { hideOnSuccess: true })
    .require("[Method Call] queryState", methodCall(chrome.idle, 'queryState', 60, () => {}))

    .require("[Method Exists] setDetectionInterval", methodExists(chrome.idle, 'setDetectionInterval'),
        { hideOnSuccess: true })
    .require("[Method Call] setDetectionInterval", methodCall(chrome.idle, 'setDetectionInterval', 60))

    .require("[Check active state]", () => {
        return new Promise((resolve, reject) => {
            chrome.idle.queryState(10000, state => {
                if (state == 'active') {
                    resolve('');
                } else {
                    reject("Expected state is active, actual state: " + state);
                }
            })
        })
    }, { async: true })

    .manual('check-idle', "[Check idle state] click on Start button, stay still until end of the test (approx. 15sec)" +
            " <button id='check-idle-button'>Start</button> ")
    .manual('check-lock', "[Check lock state] click on Start button, lock your device, return after 20sec" +
            " <button id='check-lock-button'>Start</button> ")

    .report_ready(() => {
        $('#check-idle-button').click(() => {
            let min_allowed_time_in_seconds = 15;
            setTimeout(() => {
                chrome.idle.queryState(min_allowed_time_in_seconds, state => {
                    if (state == 'idle') {
                        doneManualTest('check-idle');
                    } else {
                        failManualTest('check-idle', "Expected state: idle, actual state: " + state);
                    }
                });
            }, (min_allowed_time_in_seconds + 2) * 1000);
        });

        $('#check-lock-button').click(() => {
            let test_time_in_seconds = 20;
            setTimeout(() => {
                chrome.idle.queryState(10000, state => {
                    if (state == 'locked') {
                        doneManualTest('check-lock');
                    } else {
                        failManualTest('check-lock', "Expected state: locked, actual state: " + state);
                    }
                });
            }, test_time_in_seconds * 1000);
        });
    });