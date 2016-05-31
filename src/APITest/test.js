'use strict';

const TestType = {
    REQUIRE: 0,
    SUGGEST: 1
};

const TestSetResult = {
    PASS: 0,
    PARTIALLY: 1,
    FAIL: 2,
};

class Test {
    constructor(promise_fn, type, async) {
        if (async === undefined) async = false;
        if (async) {
            this.fn = promise_fn;
        } else {
            this.fn = function () {
                return new Promise((resolve, reject) => {
                    if (promise_fn()) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            };
        }

        this.type = type;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.fn().then(() => {
                    resolve(TestSetResult.PASS);
                }, () => {
                    if (this.type == TestType.SUGGEST) {
                        resolve(TestSetResult.PARTIALLY);
                    } else {
                        resolve(TestSetResult.FAIL);
                    }
                }
            );
        });
    }
}

class TestSet {
    constructor() {
        this.tests = [];
    }

    suggest(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.SUGGEST, async);
        return this;
    }

    require(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.REQUIRE, async);
        return this;
    }

    runAll() {
        return Promise.all([...function* (tests) {
            for (let key in tests) {
                if (tests.hasOwnProperty(key)){
                    yield new Promise(resolve => {
                        tests[key].run().then(res => {
                            resolve([key, res]);
                        });
                    });
                }
            }
        }(this.tests)]);
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
                        sets[key].runAll().then(res => {
                            resolve([key, res]);
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

                    html += "<div style='width: 100%; max-width: 720px;'>";
                    for (let test_set of res) {
                        html += "<div style='padding-left: 10px; margin-bottom: 30px'>";
                        let test_set_status = Math.max.apply(null,
                            [...function* () { for (let i of test_set[1]) yield i[1] }()]
                        );
                        html += "<div class='test-set' style='min-height: 40px; line-height: 40px; font-size: 14pt; " +
                            "min-width: 240px; padding-left: 10px; " +
                            "border: gray 2px solid; background-color: %s'>%s: %s</div>"
                                .replace('%s', title_color[test_set_status])
                                .replace('%s', test_set[0])
                                .replace('%s', test_results[test_set_status]);

                        html += "<div %s style='border: gray 2px solid; border-bottom-width: 1px; margin-top: -2px'>"
                            .replace('%s', test_set_status == TestSetResult.PASS ? "hidden" : "");
                        for (let test of test_set[1]) {
                            html += "<div style='padding-left: 10px; height: 32px; line-height: 32px; font-size: 12pt; " +
                                "background-color: %s; color: %s'>%s: %s</div>"
                                    .replace('%s', bg_color[test[1]])
                                    .replace('%s', text_color[test[1]])
                                    .replace('%s', test[0])
                                    .replace('%s', test[1] == TestSetResult.PASS ? "OK" : "Fail");
                            html += "<div style='height: 1px; background-color: gray'></div>";
                        }
                        html += "</div></div>";
                    }
                    html += "</div>";

                    resolve(html);
                });
            });

        }
    }
}
