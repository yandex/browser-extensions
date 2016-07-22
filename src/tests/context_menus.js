'use strict';

var context_menus_test = new TestSet()
    .require("[Method Exists] contextMenus", methodExists(chrome, 'contextMenus'))

    .require("[Method Exists] create", methodExists(chrome.contextMenus, 'create'))
    .require("[Method Call] create", () => {
        return new Promise((resolve, reject) => {
            chrome.contextMenus.create ({title: "Context Menu Test"}, () => {
               if (chrome.runtime.lastError) {
                   reject(chrome.runtime.lastError);
               } else {
                   resolve('');
               }
            });
        })
    }, TestAsync)

    .require("[Method Exists] update", methodExists(chrome.contextMenus, 'update'))
    .require("[Method Call] update", methodCall(chrome.contextMenus, 'update', 1, {}, () => {}))

    .require("[Method Exists] remove", methodExists(chrome.contextMenus, 'remove'))
    .require("[Method Call] remove", methodCall(chrome.contextMenus, 'remove', 1, () => {}))

    .require("[Method Exists] removeAll", methodExists(chrome.contextMenus, 'removeAll'))
    .require("[Method Call] removeAll", methodCall(chrome.contextMenus, 'removeAll', () => {}))

    .require("[Create-Update-Remove]", () => {
        return new Promise(resolve => {
            let ids = ['test_1', 'test_2', 'test_3'];

            Promise.all([...function* () {
                for (let id of ids) {
                    yield new Promise(resolve_1 => {
                        chrome.contextMenus.create({
                            id: id,
                            title: "Context Menu Test"
                        }, resolve_1);
                    });
                }
            }()]).then(() => Promise.all([...function* () {
                for (let id of ids) {
                    yield new Promise(resolve_1 => {
                        chrome.contextMenus.update(id, {
                            title: "Context Menu Test (Updated)"
                        }, resolve_1);
                    })
                }
            }()])).then(() => new Promise(resolve_1 => {
                chrome.contextMenus.remove('test_1', resolve_1);
            })).then(() => new Promise(resolve_1 => {
                chrome.contextMenus.removeAll(resolve_1);
            })).then(() => new Promise(resolve_1 => {
                chrome.contextMenus.create({
                    id: 'context_test',
                    title: "[Click Me]",
                    contexts: ['selection', 'link'],
                    onclick: info => {
                        if (info.linkUrl.indexOf("context_test") != -1) {
                            doneManualTest('context_menu_click');
                        }
                    }
                }, resolve_1);
            })).then(() => {
                resolve('');
            });
        });
    }, TestAsync)

    .manual('context_menu_click', "Long tap on <a href='#context_test'>[this link]</a> and click on extension in context menu");
