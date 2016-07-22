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
    let $t = document.querySelector('#' + id);
    $t.innerHTML = $t.innerHTML.replace("Not done yet", "OK");
    $t.style.backgroundColor = "#dff0d8";
}