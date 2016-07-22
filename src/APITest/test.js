'use strict';

const TestType = {
    REQUIRE: 0,
    SUGGEST: 1
};

const TestSetResult = {
    PASS: 0,
    PARTIALLY: 1,
    FAIL: 2
};

const TestAsync = true;

class Test {
    constructor(fn, type, async) {
        if (async === undefined) async = false;
        if (async) {
            this.fn = fn;
        } else {
            this.fn = function () {
                return new Promise((resolve, reject) => {
                    let msg = fn();
                    if (msg === '') {
                        resolve(msg);
                    } else {
                        reject(msg);
                    }
                });
            };
        }

        this.type = type;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.fn().then(msg => {
                    resolve({
                        status: TestSetResult.PASS,
                        msg: msg
                    });
                }, msg => {
                    if (this.type == TestType.SUGGEST) {
                        resolve({
                            status: TestSetResult.PARTIALLY,
                            msg: msg
                        });
                    } else {
                        resolve({
                            status: TestSetResult.FAIL,
                            msg: msg
                        });
                    }
                }
            );
        });
    }
}

class TestSet {
    constructor() {
        this.tests = [];
        this.manual_tests = [];
    }

    suggest(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.SUGGEST, async);
        return this;
    }

    require(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.REQUIRE, async);
        return this;
    }

    manual(id, text) {
        this.manual_tests[id] = text;
        return this;
    }

    runAll() {
        return {
            auto_tests: Promise.all([...function* (tests) {
                for (let key in tests) {
                    if (tests.hasOwnProperty(key)){
                        yield new Promise(resolve => {
                            tests[key].run().then(res => {
                                resolve({
                                    name: key,
                                    result: res
                                });
                            });
                        });
                    }
                }
            }(this.tests)]),
            manual_tests: this.manual_tests
        }
    }
}

class APITest {
    constructor() {
        this.sets = [];
        this.res = undefined;
    }

    addTestSet(name, test_set) {
        this.sets[name] = test_set;
        return this;
    }

    runAll() {
        this.res = Promise.all([...function* (sets) {
            for (let key in sets) {
                if (sets.hasOwnProperty(key)) {
                    yield new Promise(resolve => {
                        let tmp = sets[key].runAll();
                        tmp.auto_tests.then(res => {
                            resolve({
                                title: key,
                                auto_tests: res,
                                manual_tests: tmp.manual_tests
                            });
                        });
                    });
                }
            }
        }(this.sets)]);

        return this.res;
    }

    htmlReport() {
        if (this.res) {
            return new Promise(resolve => {
                this.res.then(res => {
                    let html = "";
                    let bg_color = ["#dff0d8", "#fcf8e3", "#f2dede"];
                    let text_color = ["#3c763d", "#8a6d3b", "#a94442"];
                    let title_color = ["#5cb85c", "#f0ad4e", "#d9534f"];
                    let test_results = ["[Success]", "[Partially]", "[Failed]"];

                    html += "<div style='width: 100%;'>";
                    for (let test_set of res) {
                        html += "<div style='padding-left: 10px; margin-bottom: 30px'>";
                        let test_set_status = [...function* () {
                            for (let i of test_set.auto_tests) {
                                yield i.result.status;
                            }
                        }()].reduce((prev, next) => Math.max(prev, next));

                        html += "<div class='test-set' style='min-height: 40px; line-height: 40px; font-size: 14pt; " +
                            "min-width: 240px; padding-left: 10px; " +
                            "border: gray 2px solid; background-color: %s'>%s: %s</div>"
                                .replace('%s', title_color[test_set_status])
                                .replace('%s', test_set.title)
                                .replace('%s', test_results[test_set_status]);

                        html += "<div %s style='border: gray 2px solid; border-bottom-width: 1px; margin-top: -2px'>"
                            .replace('%s', test_set_status == TestSetResult.PASS ? "hidden" : "");
                        for (let test of test_set.auto_tests) {
                            html += "<div style='padding-left: 10px; min-height: 32px; line-height: 32px; font-size: 12pt; " +
                                "background-color: %s; color: %s'>%s: %s %s</div>"
                                    .replace('%s', bg_color[test.result.status])
                                    .replace('%s', text_color[test.result.status])
                                    .replace('%s', test.name)
                                    .replace('%s', test.result.status == TestSetResult.PASS ? "OK" : "Fail")
                                    .replace('%s', test.result.msg === '' ? '' : '[' + test.result.msg + ']');
                            html += "<div style='height: 1px; background-color: gray'></div>";
                        }
                        html += "</div>";

                        if (Object.keys(test_set.manual_tests).length) {
                            html += "<div class='test-set' style='min-height: 40px; line-height: 40px; font-size: 14pt; " +
                                "min-width: 240px; padding-left: 10px; margin-top: -2px; " +
                                "border: gray 2px solid; background-color: #337ab7'>Manual Inspection Checklist</div>"

                            html += "<div style='border: gray 2px solid; border-bottom-width: 1px; margin-top: -2px'>"
                            for (let test in test_set.manual_tests) {
                                if (test_set.manual_tests.hasOwnProperty(test)) {
                                    html += `<div id='${test}' style='padding-left: 10px; min-height: 32px;` +
                                            "line-height: 32px; font-size: 12pt;" +
                                            "background-color: #d9edf7; color: #333'>" +
                                            `${test_set.manual_tests[test] + ": Not done yet"}</div>`
                                    html += "<div style='height: 1px; background-color: gray'></div>";
                                }
                            }
                            html += "</div>";
                        }

                        html += "</div>";
                    }
                    html += "</div>";

                    resolve(html);
                });
            });

        }
    }
}
