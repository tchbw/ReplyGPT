chrome.runtime.onMessage.addListener((request) => {
  // Content scripts can't open options page, so it needs to send a message to the service worker script here to do it
  if (request === "showOptions") {
    chrome.runtime.openOptionsPage();
  }
});
