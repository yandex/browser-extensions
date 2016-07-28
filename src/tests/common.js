'use strict';

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

function doneManualTest(id) {
    let $t = $('#' + id);
    $t.html($t.html()
        .replace("Not done yet", "OK")
        .replace(new RegExp("Failed.*"), "OK"));
    $t.css('background-color', "#dff0d8");
}

function failManualTest(id, reason) {
    let $t = $('#' + id);
    reason = (reason ? ` (${reason})` : "");

    $t.html($t.html()
        .replace("Not done yet", "Failed" + reason)
        .replace("OK", "Failed" + reason));
    $t.css('background-color', "#f2dede");
}