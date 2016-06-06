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