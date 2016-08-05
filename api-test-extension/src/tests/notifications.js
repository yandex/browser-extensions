'use strict';

var notifications_test = new TestSet()
    .require("[Method Exists] notifications", methodExists(chrome, 'notifications'), { hideOnSuccess: true })

    .require("[Method Exists] create", methodExists(chrome.notifications, 'create'), { hideOnSuccess: true })
    .require("[Method Call] create", methodCall(chrome.notifications, 'create', {
        type: 'basic',
        title: "",
        iconUrl: "",
        message: ""
    }, () => {}))

    .require("[Method Exists] update", methodExists(chrome.notifications, 'update'), { hideOnSuccess: true })
    .require("[Method Call] update", methodCall(chrome.notifications, 'update', "", {}, () => {}))

    .require("[Method Exists] clear", methodExists(chrome.notifications, 'clear'), { hideOnSuccess: true })
    .require("[Method Call] clear", methodCall(chrome.notifications, 'clear', "", () => {}))

    .require("[Method Exists] ", methodExists(chrome.notifications, 'getAll'), { hideOnSuccess: true })
    .require("[Method Call] ", methodCall(chrome.notifications, 'getAll', () => {}))

    .require("[Method Exists] ", methodExists(chrome.notifications, 'getPermissionLevel'), { hideOnSuccess: true })
    .require("[Method Call] ", methodCall(chrome.notifications, 'getPermissionLevel', () => {}))

    .manual('notification-test', "[Test Notification] Press Start and then click on appeared notification" +
                                 " <button id='notification-test-button' class='button-blue'>Start</button>")
    .report_ready(() => {
        $('#notification-test-button').click(() => {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: "/icons/icon80.png",
                title: "Test",
                message: "Test"
            }, id => {
                let listener = function (id_) {
                    if (id == id_) {
                        doneManualTest('notification-test');
                        chrome.notifications.onClicked.removeListener(listener);
                    }
                };

                chrome.notifications.onClicked.addListener(listener);
            });
        })
    });
