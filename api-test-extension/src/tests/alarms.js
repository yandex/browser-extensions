'use strict';

var alarms_test = new TestSet()
    .require("[Method Exists]", methodExists(chrome, "alarms"), { hideOnSuccess: true })

    .require("[Method Exists] create", methodExists(chrome.alarms, 'create'), { hideOnSuccess: true })
    .require("[Method Call] create", methodCall(chrome.alarms, 'create', "", {}))

    .require("[Method Exists] get", methodExists(chrome.alarms, 'get'), { hideOnSuccess: true })
    .require("[Method Call] get", methodCall(chrome.alarms, 'get', "", () => {}))

    .require("[Method Exists] getAll", methodExists(chrome.alarms, 'getAll'), { hideOnSuccess: true })
    .require("[Method Call] getAll", methodCall(chrome.alarms, 'getAll', () => {}))

    .require("[Method Exists] clear", methodExists(chrome.alarms, 'clear'), { hideOnSuccess: true })
    .require("[Method Call] clear", methodCall(chrome.alarms, 'clear'))

    .require("[Method Exists] clearAll", methodExists(chrome.alarms, 'clearAll'), { hideOnSuccess: true })
    .require("[Method Call] clearAll", methodCall(chrome.alarms, 'clearAll'))

    .manual('check-alarm-delay', "[Create Alarm and Delayed Fire] click on Start button to create alarm," +
        " test usually passes during 1 minute (but can be delayed)" +
        " <button id='check-alarm-button' class='button-blue'>Start</button> ")

    .manual('check-alarm-period', "[Periodic Fire] usually passes " +
        "during 1 minute after Delayed Fire test is done")

    .report_ready(() => {
        $('#check-alarm-button').click(() => {
            chrome.alarms.create("APITestAlarm", {
                delayInMinutes: 1,
                periodInMinutes: 1
            });

            let listener = function (alarm) {
                if (alarm.name == "APITestAlarm") {
                    if ($('#check-alarm-delay').data('status') != "done") {
                        doneManualTest('check-alarm-delay');
                    } else {
                        doneManualTest('check-alarm-period');
                        chrome.alarms.onAlarm.removeListener(listener);
                        chrome.alarms.clear("APITestAlarm")
                    }
                }
            };

            chrome.alarms.onAlarm.addListener(listener);
        })
    });
