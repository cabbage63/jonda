// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
console.log("checkForValidUrl");
  if (tab.url.indexOf("http://qiita.com") > -1) {
    // ... show the page action.
    console.log("pageAction!");
    chrome.pageAction.show(tabId);
  }
};
 
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
