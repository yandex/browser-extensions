'use strict';

const ITEM_COLOR_SUCCESS = "#dff0d8";
const ITEM_COLOR_FAIL = "#f2dede";
const TITLE_COLOR_SUCCESS = "#5cb85c";
const TITLE_COLOR_FAIL = "#d9534f";

function methodExists(obj, method) {
    return () => {
        if (obj.hasOwnProperty(method)) {
            return '';
        } else {
            return "Method not found.";
        }
    };
}

function methodCall(obj, method, ...args) {
    return () => {
        try {
            obj[method](...args);
            return '';
        } catch(e) {
            return "Exception during call with args " + String(args) + " : " + e;
        }
    };
}

function eventExists(obj, method) {
    return () => {
        if (!obj.hasOwnProperty(method)) {
            return "Event not found.";
        }

        if (!obj[method].hasOwnProperty('addListener')
            && !(typeof obj[method].addListener == 'function')) {
            return "Event found but addListener doesn't exists.";
        }

        if (!obj[method].hasOwnProperty('removeListener')
            && !(typeof obj[method].removeListener == 'function')) {
            return "Event found but removeListener doesn't exists.";
        }

        return '';
    }
}

function eventUse(obj, method) {
    return () => {
        let listener = function () {};

        try {
            obj[method].addListener(listener);
        } catch(e) {
            return "Exception occurred during attempt to add a listener";
        }

        try {
            obj[method].removeListener(listener);
        } catch(e) {
            return "Exception occurred during attempt to remove a listener";
        }

        return '';
    };
}

function doneManualTest(id) {
    let $t = $('#' + id);
    $t.html($t.html()
        .replace("Not done yet", "OK")
        .replace(new RegExp("Failed.*"), "OK"));
    $t.css('background-color', ITEM_COLOR_SUCCESS).attr('data-status', "done");

    let list_done = Array.from(
        $t.parent().children().filter('.manual-test-item')
    ).every(elem => {
        return $(elem).attr('data-status') == "done";
    });

    if (list_done) {
        $t.parent().hide('fast')
            .prev().css('background-color', TITLE_COLOR_SUCCESS);

    }
}

function failManualTest(id, reason) {
    let $t = $('#' + id);
    reason = (reason ? ` (${reason})` : "");

    $t.html($t.html()
        .replace("Not done yet", "Failed" + reason)
        .replace("OK", "Failed" + reason));
    $t.css('background-color', ITEM_COLOR_FAIL).attr('data-status', "fail");

    $t.parent().show('fast')
        .prev().css('background-color', TITLE_COLOR_FAIL);
}