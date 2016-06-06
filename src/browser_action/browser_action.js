"use strict";

$(function () {
    let $body = $('body');

    let test = new APITest();

    test.addTestSet("Tabs", tabs_test);
    test.addTestSet("Cookies", cookies_test);
    test.addTestSet("browserAction", browser_action_test);

    test.runAll();
    test.htmlReport().then(res => $body.append(res)).then(() => {
        let $t = $(".test-set");

        $t.css('cursor', 'pointer').click(function() {
            $(this).next().toggle('hidden');
        });

        chrome.windows.getCurrent((window) => {
            chrome.windows.update(window.id, {focused: true})
        });
    });
});