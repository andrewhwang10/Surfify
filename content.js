var url = location.href;
var title = document.getElementsByTagName("title")[0].innerHTML;

let page = { url: location.href, title: document.getElementsByTagName("title")[0].innerHTML };

chrome.runtime.sendMessage(page);
