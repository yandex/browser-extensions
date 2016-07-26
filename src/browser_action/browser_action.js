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
        .addTestSet("Browsing Data", browsing_data_test);

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

            /* tabs */

            chrome.tabs.update(test_tab_id, {active: true})

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
        });
    });
});