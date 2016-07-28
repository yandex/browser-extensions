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
        this.fns = [];
    }

    suggest(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.SUGGEST, async);
        return this;
    }

    require(name, fn, async) {
        this.tests[name] = new Test(fn, TestType.REQUIRE, async);
        return this;
    }

    manual(id, html) {
        this.manual_tests[id] = html;
        return this;
    }

    report_ready(fn) {
        this.fns.push(fn);
        return this;
    }

    runAll() {
        let tests = this.tests;
        return {
            auto_tests: [...function* () {
                for (let key in tests) {
                    if (tests.hasOwnProperty(key)){
                        yield key;
                    }
                }
            }()].reduce((prev, curr) => {
                return prev.then(results => new Promise(resolve => {
                    tests[curr].run().then(res => {
                        resolve(results.concat([{
                            name: curr,
                            result: res
                        }]));
                    });
                }))
            }, Promise.resolve([{}])),
            manual_tests: this.manual_tests
        }
    }
}

class APITest {
    constructor() {
        this.sets = [];
        this.res = undefined;
        this.fns = [];
    }

    addTestSet(name, test_set) {
        this.sets[name] = test_set;
        return this;
    }

    runAll() {
        let sets = this.sets;
        let idx = 1, len = Object.keys(sets).length;

        this.res = [...function* () {
            for (let key in sets) {
                if (sets.hasOwnProperty(key)) {
                    yield key
                }
            }
        }()].reduce((prev, curr) => {
            return prev.then(results => new Promise(resolve => {
                this.fns = this.fns.concat(sets[curr].fns);
                let tmp = sets[curr].runAll();
                tmp.auto_tests.then(res => {
                    if (idx == len) {
                        $('#status').detach();
                    } else {
                        $('#status').text(`Running... ${idx}/${len}`);
                        idx++;
                    }

                    resolve(results.concat([{
                        title: curr,
                        auto_tests: res.slice(1),
                        manual_tests: tmp.manual_tests
                    }]));
                });
            }))
        }, Promise.resolve([{}]));

        return this.res;
    }

    htmlReport() {
        let bg_color = ["#dff0d8", "#fcf8e3", "#f2dede"];
        let text_color = ["#3c763d", "#8a6d3b", "#a94442"];
        let title_color = ["#5cb85c", "#f0ad4e", "#d9534f"];
        let test_results = ["[Success]", "[Partially]", "[Failed]"];

        if (this.res) {
            return new Promise(resolve => {
                this.res.then(res => {
                    let $html = $('<div>').addClass('report-container').append([...function* () {
                        for (let test_set of res.slice(1)) {
                            yield $('<div>').addClass('test-set-container').append([...function* () {
                                let test_set_status = [...function* () {
                                    for (let i of test_set.auto_tests) {
                                        yield i.result.status;
                                    }
                                }()].reduce((prev, next) => Math.max(prev, next));

                                yield $('<div>')
                                    .addClass('auto-test-set-title')
                                    .css('background-color', title_color[test_set_status])
                                    .text(`${test_set.title}: ${test_results[test_set_status]}`);

                                let $tests_list = $('<div>').addClass('auto-tests-list');
                                if (test_set_status == TestSetResult.PASS) {
                                    $tests_list.hide();
                                }

                                yield $tests_list.append([...function* () {
                                    for (let test of test_set.auto_tests) {
                                        let status = test.result.status == TestSetResult.PASS ? "OK" : "Fail";
                                        let msg = test.result.msg === '' ? '' : '[' + test.result.msg + ']';

                                        yield $('<div>')
                                            .addClass('auto-test-item')
                                            .css({
                                                'background-color': bg_color[test.result.status],
                                                'color': text_color[test.result.status],
                                            })
                                            .text(`${test.name}: ${status} ${msg}`)

                                        yield $('<div>').addClass('line');
                                    }
                                }()]);

                                if (Object.keys(test_set.manual_tests).length) {
                                    yield $('<div>')
                                        .addClass('manual-test-set-title')
                                        .text("Manual Checklist");

                                    yield $('<div>').addClass('manual-tests-list').append([...function* () {
                                        for (let test in test_set.manual_tests) {
                                            if (test_set.manual_tests.hasOwnProperty(test)) {
                                                yield $('<div>')
                                                    .addClass('manual-test-item')
                                                    .attr('id', test)
                                                    .html(test_set.manual_tests[test] + ": Not done yet");
                                                yield $('<div>').addClass('line');
                                            }
                                        }
                                    }()]);
                                }
                            }()]);
                        }
                    }()]);

                    resolve($html);
                });
            });
        }
    }
}
