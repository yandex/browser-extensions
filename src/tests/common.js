'use strict';

function methodExists(obj, method) {
    if (obj.hasOwnProperty(method)) {
        return () => '';
    } else {
        return () => "Method not found.";
    }
}

function methodCall(obj, method, ...args) {
    try {
        obj[method](...args);
        return () => '';
    } catch(e) {
        return () => "Exception during call with args " + String(args) + " : " + e;
    }
}

function doneManualTest(id) {
    let $t = $('#' + id);
    $t.html($t.html().replace("Not done yet", "OK").replace("Failed", "OK"));
    $t.css('background-color', "#dff0d8");
}

function failManualTest(id) {
    let $t = $('#' + id);
    $t.html($t.html().replace("Not done yet", "Failed").replace("OK", "Failed"));
    $t.css('background-color', "#f2dede");
}