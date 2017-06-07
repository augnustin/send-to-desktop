const folderName = chrome.i18n.getMessage('folderName');

function setupBookmarkFolder(details) {
  chrome.bookmarks.search(folderName, results => {
    if (!results.length) {
      chrome.bookmarks.getTree(tree => {
        chrome.bookmarks.create({
          parentId: tree.shift().children.pop().id,
          title: folderName,
        }, result => {
          console.log(`${folderName} folder successfully created`);
        });
      });
    }
  });
};

function handleBookmark(id, bookmark) {
  chrome.bookmarks.get(bookmark.parentId, bookmarks => {
    if (bookmarks.length === 1 && bookmarks[0].title === folderName) {
      chrome.windows.getAll({
        windowTypes: ['normal']
      }, windows => {
        let minIdWindow = windows.reduce((resultWindow, window) => {
          return (window.id < resultWindow.id) ? window : resultWindow;
        }, windows[0]);
        chrome.tabs.create({
          windowId: minIdWindow.id,
          url: bookmark.url,
          active: false,
        }, tab => {
          chrome.bookmarks.remove(id);
        });
      });
    }
  });
};

chrome.runtime.onInstalled.addListener(setupBookmarkFolder)
chrome.bookmarks.onCreated.addListener(handleBookmark);
chrome.bookmarks.onMoved.addListener(handleBookmark);
