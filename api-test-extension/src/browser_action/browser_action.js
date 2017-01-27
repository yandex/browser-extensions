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
        .addTestSet("Windows", windows_test)
        .addTestSet("Privacy", privacy_test)
        .addTestSet("Alarms", alarms_test)
        .addTestSet("Content Settings", content_settings_test)
        .addTestSet("Content Scripts", content_scripts)
        .addTestSet("Popup Scripts", popup_scripts);

    test.runAll();
    test.htmlReport().then(res => $body.append(res)).then(() => {
        let $t = $(".auto-test-set-title, .manual-test-set-title");

        $t.css('cursor', 'pointer').click(function () {
            $(this).next().toggle('fast');
        });

        test.fns.reduce((prev, curr) => {
            return prev.then(() => new Promise(resolve => {
                resolve(curr());
            }));
        }, Promise.resolve()).then(() => {});

        $('#save-report-button')
            .toggle('fast')
            .click(function () {
                $.ajax({ url: "/css/styles.css" }).done((css) => {
                    let $body = $('html').clone();

                    $body.find('button').detach();
                    $body.find('#save-report-link').detach();
                    $body.find('script').detach();
                    $body.find(".auto-test-set-title, .manual-test-set-title").css('cursor', 'auto');
                    $('<style>').html(css).appendTo($body.find('head'));

                    var blob = new Blob(["<!DOCTYPE html>" + $body.get(0).outerHTML], { type: 'text/html' });
                    let url = URL.createObjectURL(blob);

                    $('#save-report-link')
                        .attr('href', url)
                        .attr('download', `report-${ new Date().toISOString().slice(0, 19).replace(':', '-') }.html`)
                        .get(0).click();
            });
        });
    });
});