'use strict';

var content_scripts = new TestSet()
    .require("[Content Script] {Internet connection required}", () => new Promise((resolve, reject) => {
        let msg = { data: "msg" };
        let res = { data: "response" };

        chrome.tabs.create({
            url: "https://ya.ru/",
            selected: false
        }, tab => {
            setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, msg, response => {
                    if (response.data === res.data) {
                        resolve('');
                    } else {
                        reject("Sent and received responses are different")
                    }

                    chrome.tabs.remove(tab.id);
                });
            }, 2700);
        })
    }), { async: true });
