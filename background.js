chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 300,
      'height': 200
    }
  });
  console.log("load");
  chrome.tabs.sendMessage({text: 'report_back'}, doStuffWithDom);
});


// A function to use as callback
function doStuffWithDom(domContent) {
  console.log('I received the following DOM content:\n' + domContent);
}