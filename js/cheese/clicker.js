// Init variables
let clickDebounce = true;
let skipSlidesEnabled = false;

window.addEventListener('load', function() {
	chrome.storage.sync.get('clickSlides', function(data) {
		clickDebounce = !data.clickSlides;
	});

	chrome.storage.sync.get('skipSlides', function(data) {
		skipSlidesEnabled = data.skipSlides;
	});

	clicker();
});

// Function to start tasks for features
function clicker() {
	// Test to see if on lesson page by looking for button
	try {
		const target = document.body.getElementsByClassName('button_next')[0];
		
		// If skipSlides is already enabled on pageload then skip the first slide without waiting for a click
		if (skipSlidesEnabled) {
			skipper(target, 2500);
		}

		// Start the auto click functionality
		clickNext(target);
	}
	catch (error) {
		console.log('Not on a lesson page.');
		return;
	}
}

// Disables (skips) the timer on current slide
async function skipper(target, time) {
	setTimeout(function() {
		if (!clickDebounce && skipSlidesEnabled) {
			if (target.classList.contains('btn-basic', 'btn-inverse')) {
				target.classList.remove('btn-basic', 'btn-inverse');
				target.classList.add('btn-advance');
			}
		}
	}, time);
}

// Automates clicking the "next" button when it becomes available
function clickNext(target) {
	// Add check here for if its enabled. If not, return
	let observer = new MutationObserver(function(mutations) {
		mutations.forEach(async () => {
			if (target.classList.contains('btn-advance') && !clickDebounce) {
				await new Promise(resolve => setTimeout(resolve, 2500));

				target.click();

				skipper(target, 2500);
			}
		});
	});

	const config = {
		attributes: true,
		attributeFilter: [ 'class' ],
	};

	observer.observe(target, config);
}

// Extension popup interacts with this to set settings for features
chrome.runtime.onMessage.addListener(function(request) {
	switch(request.command) {
		case "initClick":
			clickDebounce = false;
			clicker();
			break;
		case "removeClick":
			clickDebounce = true;
			break;
		case "initSkip":
			skipSlidesEnabled = true;
			if (!clickDebounce) {
				clicker();
			}
			break;
		case "removeSkip":
			skipSlidesEnabled = false;
			break;
	}
});