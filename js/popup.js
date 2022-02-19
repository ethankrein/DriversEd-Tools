'use strict';

class Popup {
	constructor() {
		// Checkboxes for feature toggle
		this.changeSlides = document.getElementById('changeSlides');
		this.changeSkip = document.getElementById('changeSkip');
		this.changeVideos = document.getElementById('changeVideos');

		this.initExtension();
		this.watchSettings();
	}

	// On init, sync checkboxes of extension popup with saved settings
	initExtension() {
		chrome.storage.sync.get('clickSlides', function(data) {
			this.changeSlides.checked = data.clickSlides;
		});
		chrome.storage.sync.get('skipSlides', function(data) {
			this.changeSkip.checked = data.skipSlides;
		});
		chrome.storage.sync.get('skipVideos', function(data) {
			this.changeVideos.checked = data.skipVideos;
		});
	}

	// 
	watchSettings() {
		this.changeSlides.onchange = function() {
			const enabled = this.checked;

			// Update stored values
			chrome.storage.sync.set({ 'clickSlides': enabled });

			// Enable or disable script options
			if (enabled) {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'initClick', clickSlides: true });
				});
			}
			else {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'removeClick', clickSlides: false });
				});
			}
		};
		this.changeSkip.onchange = function() {
			const enabled = this.checked;

			// Update stored values
			chrome.storage.sync.set({ 'skipSlides': enabled });

			// Enable or disable script options
			if (enabled) {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'initSkip', skipSlides: true });
				});
			}
			else {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'removeSkip', skipSlides: false });
				});
			}
		};
		this.changeVideos.onchange = function() {
			const enabled = this.checked;

			// Update stored values
			chrome.storage.sync.set({ 'skipVideos': enabled });

			// Enable or disable script options
			if (enabled) {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'initVSkip', skipVideos: true });
				});
			}
			else {
				chrome.tabs.query({ url: '*://*.driversed.com/*' }, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { command: 'removeVSkip', skipVideos: false });
				});
			}
		};
	}
}

new Popup;