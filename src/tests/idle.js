'use strict';

var idle_test = new TestSet()
    .require("[Method Exists] idle", methodExists(chrome, 'idle'))

    .require("[Method Exists] queryState", methodExists(chrome.idle, 'queryState'))
    .require("[Method Call] queryState", methodCall(chrome.idle, 'queryState', 60, () => {}))

    .require("[Method Exists] setDetectionInterval", methodExists(chrome.idle, 'setDetectionInterval'))
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
    }, TestAsync)

    .manual('check-idle', "[Check idle state] click on Start button, stay still until end of the test (aprox. 15sec)" +
            " <button id='check-idle-button'>Start</button> ")
    .manual('check-lock', "[Check lock state] click on Start button, lock your device, return after 20sec" +
            " <button id='check-lock-button'>Start</button> ");