'use strict';

$(() => {
    let $body = $('body');

    let test = new APITest();

    test.addTestSet("Tabs", tabs_test)
        .addTestSet("Cookies", cookies_test)
        .addTestSet("Browser Action", browser_action_test)
        .addTestSet("Context Menus", context_menus_test)
        .addTestSet("Bookmarks", bookmarks_test)
        .addTestSet("History", history_test)
        .addTestSet("Browsing Data", browsing_data_test)
        .addTestSet("Downloads", downloads_test)
        .addTestSet("Idle", idle_test)
        .addTestSet("Notifications", notifications_test)
        .addTestSet("Top Sites", top_sites_test)
        .addTestSet("Sessions", sessions_test)
        .addTestSet("Web Navigation", web_navigation_test)
        .addTestSet("Storage", storage_test)
        .addTestSet("Web Request", web_request_test)
        .addTestSet("Windows", windows_test);

    test.runAll();
    test.htmlReport().then(res => $body.append(res)).then(() => {
        let $t = $(".auto-test-set-title, .manual-test-set-title");

        $t.css('cursor', 'pointer').click(function() {
            $(this).next().toggle('fast');
        });

        test.fns.reduce((prev, curr) => {
            return prev.then(() => new Promise(resolve => {
                resolve(curr());
            }));
        }, Promise.resolve()).then(() => {});
    });
});