let videoDisabled = true;

window.addEventListener('load', function() {
	chrome.storage.sync.get('skipVideos', function(data) {
		videoDisabled = !data.skipVideos;

		video();
	});
});

// Skips videos
async function video() {
	// Test to see if on video page by looking for video element
	try {
		if (!videoDisabled) {
			document.getElementsByTagName('video')[0].play();
			document.getElementsByTagName('video')[0].playbackRate = 16.0;
			document.getElementsByTagName('video')[0].currentTime = 1000;
		}
	}
	catch (error) {
		console.log('Not on a video page.');
		return;
	}
}

// Extension popup interacts with this to set settings for features
chrome.runtime.onMessage.addListener(function(request) {
	if(request.command === 'initVSkip') {
		videoDisabled = false;
		video();
	}
	else if(request.command === 'removeVSkip') {
		videoDisabled = true;
	}
});