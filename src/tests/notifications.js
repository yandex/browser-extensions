'use strict';

var notifications_test = new TestSet()
    .require("[Method Exists] notifications", methodExists(chrome, 'notifications'))

    .require("[Method Exists] create", methodExists(chrome.notifications, 'create'))
    .require("[Method Call] create", methodCall(chrome.notifications, 'create', {
        type: 'basic',
        title: "",
        iconUrl: "",
        message: ""
    }, () => {}))

    .require("[Method Exists] update", methodExists(chrome.notifications, 'update'))
    .require("[Method Call] update", methodCall(chrome.notifications, 'update', "", {}, () => {}))

    .require("[Method Exists] clear", methodExists(chrome.notifications, 'clear'))
    .require("[Method Call] clear", methodCall(chrome.notifications, 'clear', "", () => {}))

    .require("[Method Exists] ", methodExists(chrome.notifications, 'getAll'))
    .require("[Method Call] ", methodCall(chrome.notifications, 'getAll', () => {}))

    .require("[Method Exists] ", methodExists(chrome.notifications, 'getPermissionLevel'))
    .require("[Method Call] ", methodCall(chrome.notifications, 'getPermissionLevel', () => {}))

    // Doesn't work in BB on OSX
    .suggest("[Test Notification]", methodCall(chrome.notifications, 'create', {
        type: 'basic',
        /* Generates: Unchecked runtime.lastError while running
           notifications.create: Unable to successfully use the provided image. */
        iconUrl: "/icons/icon80.png",
        title: "Test",
        message: "Test"
    }, () => {}));