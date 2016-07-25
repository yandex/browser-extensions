"use strict";

$(function () {
    let $body = $('body');

    let test = new APITest();

    test.addTestSet("Tabs", tabs_test)
        .addTestSet("Cookies", cookies_test)
        .addTestSet("browserAction", browser_action_test)
        .addTestSet("contextMenus", context_menus_test)
        .addTestSet("bookmarks", bookmarks_test);

    let test_tab_id;

    new Promise(resolve => {
        chrome.tabs.getCurrent(tab => {
            test_tab_id = tab.id;
            resolve();
        });
    }).then(() => {
        test.runAll();
        test.htmlReport().then(res => $body.append(res)).then(() => {
            let $t = $(".test-set");

            $t.css('cursor', 'pointer').click(function() {
                $(this).next().toggle('hidden');
            });

            chrome.tabs.update(test_tab_id, {active: true})
        });
    });
});