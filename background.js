'use strict';

// On extension install create data vars for feature options
chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({ clickSlides: false, skipSlides: false, skipVideos: false });
});

// Registers rules for use between browser restarts
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	chrome.declarativeContent.onPageChanged.addRules([{
		conditions: [new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { hostEquals: 'driversed.com' },
		}),
		],
		actions: [new chrome.declarativeContent.ShowPageAction()],
	}]);
});