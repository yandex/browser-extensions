"use strict";

$(function () {
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
        .addTestSet("Top Sites", top_sites_test);

    let test_tab_id;

    new Promise(resolve => {
        chrome.tabs.getCurrent(tab => {
            test_tab_id = tab.id;
            resolve();
        });
    }).then(() => {
        test.runAll();
        test.htmlReport().then(res => $body.append(res)).then(() => {
            let $t = $(".auto-test-set-title, .manual-test-set-title");

            $t.css('cursor', 'pointer').click(function() {
                $(this).next().toggle('hidden');
            });

            /* tabs */

            chrome.tabs.update(test_tab_id, {active: true});

            /* /tabs */

            /* history */

            $(() => {
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

            /* /history */

            /* idle */

            $(() => {
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

            /* /idle */
        });
    });
});