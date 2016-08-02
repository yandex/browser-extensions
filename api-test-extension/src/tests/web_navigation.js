'use strict';

var web_navigation_test = new TestSet()
    .require("[Method Exists] webNavigation", methodExists(chrome, 'webNavigation'), { hideOnSuccess: true })

    .require("[Method Exists] getFrame", methodExists(chrome.webNavigation, 'getFrame'), { hideOnSuccess: true })
    .require("[Method Call] getFrame", methodCall(chrome.webNavigation, 'getFrame', {
        tabId: 0,
        processId: 0,
        frameId: 0
    }, () => {}))

    .require("[Method Exists] getAllFrames", methodExists(chrome.webNavigation, 'getAllFrames'),
        { hideOnSuccess: true })
    .require("[Method Call] getAllFrames", methodCall(chrome.webNavigation, 'getAllFrames', {tabId: 0}, () => {}));
