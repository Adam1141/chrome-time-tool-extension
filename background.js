chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'sampleContextMenu',
		title: 'Sample Context Menu',
		contexts: ['selection'],
	});
});

// This will run when a bookmark is created.
chrome.bookmarks.onCreated.addListener(() => {
	// do something
});

chrome.browser.addListener('click', () => {
	console.log('click');
});

ch